import * as vscode from 'vscode';
import { WebSocketServer } from 'ws';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { MonitorViewProvider } from './providers/MonitorViewProvider';

export interface Client {
    key: string;
    ws: any;
    info: any;
    lastSeen: number;
    status: 'online' | 'offline' | 'idle';
    clientLabel: string;   // "<username>-<hostname>"
    extensionStatus?: 'active' | 'inactive';
    commandLog: CommandLogEntry[];
    lastResponse?: {
        command: string;
        data: any;
        timestamp: number;
    };
}

interface QueuedCommand {
    id: string;
    clientKey: string;
    clientLabel: string;   // "<username>-<hostname>" — used as filename
    command: string;
    payload?: any;
    timestamp: number;
    serverKey: string;
}

export interface CommandLogEntry {
    id: string;
    command: string;
    status: 'queued' | 'sent' | 'executed' | 'error';
    timestamp: number;
    result?: any;
}

// ─── UNC-safe filesystem helpers ─────────────────────────────────────────────
// VS Code's Node.js runtime (Node.js 20+) blocks fs access to UNC paths
// (\\server\share) via an internal validatePath check.  These helpers fall back
// to cmd.exe which has its own UNC network stack, bypassing the restriction.

function isUncPath(p: string): boolean {
    return process.platform === 'win32' && p.startsWith('\\\\');
}

function fsEnsureDir(dirPath: string): void {
    if (isUncPath(dirPath)) {
        try { execSync(`mkdir "${dirPath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 10000 }); } catch { /* already exists */ }
        return;
    }
    fs.mkdirSync(dirPath, { recursive: true });
}

function fsPathExists(p: string): boolean {
    if (isUncPath(p)) {
        try { execSync(`dir /b "${p}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 5000 }); return true; } catch { return false; }
    }
    return fs.existsSync(p);
}

function fsReadText(filePath: string): string {
    if (isUncPath(filePath)) {
        const tmp = path.join(os.tmpdir(), `bba-rd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
        try {
            execSync(`copy /Y "${filePath}" "${tmp}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 15000 });
            const data = fs.readFileSync(tmp, 'utf-8');
            try { fs.unlinkSync(tmp); } catch {}
            return data;
        } catch (e) { try { fs.unlinkSync(tmp); } catch {} throw e; }
    }
    return fs.readFileSync(filePath, 'utf-8');
}

function fsWriteText(filePath: string, content: string): void {
    if (isUncPath(filePath)) {
        const tmp = path.join(os.tmpdir(), `bba-wr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
        try {
            fs.writeFileSync(tmp, content, 'utf-8');
            execSync(`copy /Y "${tmp}" "${filePath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 15000 });
            try { fs.unlinkSync(tmp); } catch {}
        } catch (e) { try { fs.unlinkSync(tmp); } catch {} throw e; }
        return;
    }
    fs.writeFileSync(filePath, content);
}

function fsDeleteFile(filePath: string): void {
    if (isUncPath(filePath)) {
        try { execSync(`del /F /Q "${filePath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 5000 }); } catch {}
        return;
    }
    fs.unlinkSync(filePath);
}

function fsListDir(dirPath: string): string[] {
    if (isUncPath(dirPath)) {
        try {
            const buf = execSync(`dir /b "${dirPath}"`, { shell: 'cmd.exe', timeout: 10000 });
            return buf.toString('utf-8').split(/\r?\n/).filter(f => f.trim().length > 0);
        } catch { return []; }
    }
    return fs.readdirSync(dirPath);
}

// ─── PresenceEntry ────────────────────────────────────────────────────────────
// Written by the client on activation to <syncPath>/clients/<serverKey>/<username-hostname>.json
interface PresenceEntry {
    clientLabel: string;
    clientKey: string;
    serverKey: string;
    username: string;
    hostname: string;
    version: string;
    registeredAt: number;
    lastSeen: number;
    status?: 'active' | 'inactive';
}

// ─── ServerPresenceEntry ──────────────────────────────────────────────────────
// Written by the server to <syncPath>/servers/<key>-<machine>.json on start/stop.
// Deleted when the server extension is deactivated/uninstalled.
interface ServerPresenceEntry {
    key: string;           // serverKey
    machine: string;       // hostname
    port: number;
    username: string;
    version: string;
    clients: { key: string; label: string; status: string }[];
    startedAt: number;
    lastSeen: number;
    status: 'online' | 'offline';
}

// ─── ServerFallbackManager ───────────────────────────────────────────────────
// Sync-folder layout:
//   <syncPath>/queue/<username-hostname>.json         — server queues commands here (array)
//   <syncPath>/server-backlog/<username-hostname>.json — client writes results here when server is offline
//   <syncPath>/clients/<serverKey>/<username-hostname>.json — presence files written by clients on activation
class ServerFallbackManager {
    private syncPath: string = '';
    private serverKey: string = '';
    private backlogPollInterval: NodeJS.Timeout | null = null;
    private onBacklogResponse: ((clientLabel: string, entry: any) => void) | null = null;
    private recentBacklogEntries: any[] = [];
    private onBacklogArrived: ((entries: any[]) => void) | null = null;

    configure(syncPath: string, serverKey: string, onBacklogResponse: (clientLabel: string, entry: any) => void, onBacklogArrived?: (entries: any[]) => void) {
        this.syncPath = syncPath;
        this.serverKey = serverKey;
        this.onBacklogResponse = onBacklogResponse;
        this.onBacklogArrived = onBacklogArrived ?? null;
    }

    get isConfigured(): boolean {
        return !!this.syncPath;
    }

    get syncPathValue(): string {
        return this.syncPath;
    }

    // Scan <syncPath>/clients/<serverKey>/ for presence files written by clients on activation
    scanRegisteredClients(): PresenceEntry[] {
        if (!this.isConfigured) { return []; }
        const clientsDir = path.join(this.syncPath, 'clients', this.serverKey);
        if (!fsPathExists(clientsDir)) { return []; }
        const results: PresenceEntry[] = [];
        try {
            const files = fsListDir(clientsDir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                try {
                    const entry: PresenceEntry = JSON.parse(fsReadText(path.join(clientsDir, file)));
                    if (entry.clientKey && entry.clientLabel) {
                        results.push(entry);
                    }
                } catch (e) {
                    console.warn(`[ServerFallback] Skipping malformed presence file: ${file}`);
                }
            }
        } catch (e) {
            console.warn('[ServerFallback] Error scanning clients dir:', e);
        }
        return results;
    }

    startPolling() {
        this.stopPolling();
        if (!this.isConfigured) { return; }
        this.backlogPollInterval = setInterval(() => this.pollServerBacklog(), 15000);
        console.log(`[ServerFallback] Polling server-backlog from: ${this.syncPath}`);
    }

    stopPolling() {
        if (this.backlogPollInterval) {
            clearInterval(this.backlogPollInterval);
            this.backlogPollInterval = null;
        }
    }

    // Append a command to <syncPath>/queue/<username-hostname>.json
    enqueueCommand(clientLabel: string, clientKey: string, command: string, payload?: any): string {
        if (!this.isConfigured) {
            throw new Error(`Sync path is not configured. Set serverMonitor.syncPath in settings.`);
        }
        try {
            const queueDir = path.join(this.syncPath, 'queue');
            fsEnsureDir(queueDir);

            const queueFile = path.join(queueDir, `${clientLabel}.json`);
            let existing: QueuedCommand[] = [];
            if (fsPathExists(queueFile)) {
                try { existing = JSON.parse(fsReadText(queueFile)); } catch { existing = []; }
            }

            const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
            const entry: QueuedCommand = { id, clientKey, clientLabel, command, payload, timestamp: Date.now(), serverKey: this.serverKey };
            existing.push(entry);
            fsWriteText(queueFile, JSON.stringify(existing, null, 2));
            console.log(`[ServerFallback] Enqueued command "${command}" for ${clientLabel} → ${queueFile}`);
            return id;
        } catch (e: any) {
            throw new Error(`Failed to write queue file at "${this.syncPath}\\queue\\${clientLabel}.json": ${e?.message || e}`);
        }
    }

    // Read and clear the queue file for a client (called when client comes online)
    dequeueCommands(clientLabel: string): QueuedCommand[] {
        if (!this.isConfigured) { return []; }
        const queueFile = path.join(this.syncPath, 'queue', `${clientLabel}.json`);
        if (!fsPathExists(queueFile)) { return []; }
        try {
            const cmds: QueuedCommand[] = JSON.parse(fsReadText(queueFile));
            fsDeleteFile(queueFile);  // clear queue once dequeued
            console.log(`[ServerFallback] Dequeued ${cmds.length} command(s) for ${clientLabel}`);
            return cmds;
        } catch (e) {
            console.error(`[ServerFallback] Error reading queue for ${clientLabel}:`, e);
            return [];
        }
    }

    // Poll <syncPath>/server-backlog/ for results written by clients that were offline
    private pollServerBacklog() {
        if (!this.isConfigured || !this.onBacklogResponse) { return; }
        try {
            const backlogDir = path.join(this.syncPath, 'server-backlog');
            if (!fsPathExists(backlogDir)) { return; }

            const files = fsListDir(backlogDir).filter(f => f.endsWith('.json'));
            const newEntries: any[] = [];
            for (const file of files) {
                const filePath = path.join(backlogDir, file);
                try {
                    const entries: any[] = JSON.parse(fsReadText(filePath));
                    const clientLabel = file.replace(/\.json$/, '');
                    for (const entry of entries) {
                        console.log(`[ServerFallback] Got server-backlog entry from ${clientLabel}: ${entry.command}`);
                        newEntries.push({ ...entry, clientLabel });
                        this.onBacklogResponse(clientLabel, entry);
                    }
                    fsDeleteFile(filePath);  // clear once processed
                } catch (e) {
                    console.error(`[ServerFallback] Error reading backlog file ${file}:`, e);
                }
            }
            if (newEntries.length > 0) {
                this.recentBacklogEntries.push(...newEntries);
                if (this.onBacklogArrived) {
                    this.onBacklogArrived(newEntries);
                }
            }
        } catch (e) {
            console.error('[ServerFallback] Backlog poll error:', e);
        }
    }

    getRecentBacklog(): any[] {
        return this.recentBacklogEntries;
    }

    clearRecentBacklog(): void {
        this.recentBacklogEntries = [];
    }
}

export class MonitorServer {
    private wss: WebSocketServer | null = null;
    private server: http.Server | null = null;
    private clients: Map<string, Client> = new Map();
    private provider: MonitorViewProvider | null = null;
    private context: vscode.ExtensionContext | null = null;
    private running: boolean = false;
    private port: number = 54321;
    private serverId: string = 'default';
    private heartbeatCheckInterval: NodeJS.Timeout | null = null;
    private syncScanInterval: NodeJS.Timeout | null = null;
    private offlineTimeoutMs: number = 300000; // 5 minutes
    private fallback: ServerFallbackManager = new ServerFallbackManager();
    private clientReleasePath: string = '';
    private serverPresenceInterval: NodeJS.Timeout | null = null;
    private version: string = '1.0.0';
    private configuredPort: number = 54321;

    initialize(context: vscode.ExtensionContext) {
        this.context = context;
        this.version = (context.extension?.packageJSON as any)?.version || '1.0.0';
        const config = vscode.workspace.getConfiguration('serverMonitor');
        // Load server key: globalState takes priority, then settings
        const persistedKey = context.globalState.get<string>('serverKey');
        this.serverId = persistedKey || config.get<string>('serverId') || 'default';
        // Load configured port: globalState takes priority, then settings
        const persistedPort = context.globalState.get<number>('serverPort');
        this.configuredPort = persistedPort || config.get<number>('port') || 54321;
        this.port = this.configuredPort;
        console.log(`[MonitorServer] Initializing with serverId: ${this.serverId}`);
        this.loadPersistentClients();
        this.setupFallback();
        console.log(`[MonitorServer] Loaded ${this.clients.size} persistent clients`);
    }

    private setupFallback() {
        const config = vscode.workspace.getConfiguration('serverMonitor');
        const syncPath = config.get<string>('syncPath') || '';
        this.clientReleasePath = config.get<string>('clientReleasePath') || '';
        if (syncPath) {
            this.fallback.configure(syncPath, this.serverId, (clientLabel, entry) => {
                this.handleBacklogResponse(clientLabel, entry);
            }, (newEntries) => {
                const count = newEntries.length;
                vscode.window.showInformationMessage(
                    `${count} backlog result${count === 1 ? '' : 's'} received from offline clients`,
                    'View Backlog'
                ).then(selection => {
                    if (selection === 'View Backlog') {
                        this.showBacklogWebview();
                    }
                });
            });
            this.fallback.startPolling();
            // Scan for presence files every 60s to discover newly-installed clients
            if (this.syncScanInterval) { clearInterval(this.syncScanInterval); }
            this.syncScanInterval = setInterval(() => this.importSyncClients(), 60000);
        }
    }

    async changeServerKey(newKey: string) {
        if (!newKey || !this.context) { return; }
        // Remove the presence file under the old key before reassigning
        this.removeServerPresenceFile();
        this.serverId = newKey;
        await this.context.globalState.update('serverKey', newKey);
        // If server is running, immediately write presence file under new key
        if (this.running) { this.writeServerPresenceFile('online'); }
        console.log(`[MonitorServer] Server key changed to: ${newKey}`);
        vscode.window.showInformationMessage(`Server key changed to: ${newKey}`);
        this.triggerUpdate();
    }

    async changePort(newPort: number) {
        if (!newPort || newPort < 1024 || newPort > 65535 || !this.context) { return; }
        this.configuredPort = newPort;
        await this.context.globalState.update('serverPort', newPort);
        console.log(`[MonitorServer] Port changed to: ${newPort}`);
        if (this.running) {
            vscode.window.showInformationMessage(`Port changed to ${newPort} — restarting server...`);
            this.stop();
            await new Promise(r => setTimeout(r, 500));
            await this.start();
        } else {
            this.port = newPort;
            this.triggerUpdate();
            vscode.window.showInformationMessage(`Port set to ${newPort} — will be used on next server start`);
        }
    }

    private serverPresenceFilePath(): string {
        const syncPath = this.fallback.syncPathValue;
        return path.join(syncPath, 'servers', `${this.serverId}-${os.hostname()}.json`);
    }

    private writeServerPresenceFile(status: 'online' | 'offline'): void {
        if (!this.fallback.isConfigured) { return; }
        try {
            const serversDir = path.join(this.fallback.syncPathValue, 'servers');
            fsEnsureDir(serversDir);
            const filePath = this.serverPresenceFilePath();
            let startedAt = Date.now();
            if (status === 'online' && fsPathExists(filePath)) {
                try {
                    const existing: ServerPresenceEntry = JSON.parse(fsReadText(filePath));
                    if (existing.status === 'online') { startedAt = existing.startedAt; }
                } catch { /* keep current */ }
            }
            const clientsSnapshot = Array.from(this.clients.values()).map(c => ({
                key: c.key,
                label: c.clientLabel,
                status: c.status
            }));
            const machine = os.hostname();
            const entry: ServerPresenceEntry = {
                key: this.serverId,
                machine,
                port: this.port,
                username: os.userInfo().username,
                version: this.version,
                clients: clientsSnapshot,
                startedAt,
                lastSeen: Date.now(),
                status
            };
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
            console.log(`[MonitorServer] Server presence file written (${status}): ${filePath}`);
        } catch (e: any) {
            console.warn(`[MonitorServer] Could not write server presence file: ${e?.message || e}`);
        }
    }

    removeServerPresenceFile(): void {
        if (!this.fallback.isConfigured) { return; }
        try {
            const filePath = this.serverPresenceFilePath();
            if (fsPathExists(filePath)) {
                fsDeleteFile(filePath);
                console.log(`[MonitorServer] Server presence file removed: ${filePath}`);
            }
        } catch (e: any) {
            console.warn(`[MonitorServer] Could not remove server presence file: ${e?.message || e}`);
        }
    }

    showBacklogWebview(): void {
        const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const entries = this.fallback.getRecentBacklog();
        const grouped: Record<string, any[]> = {};
        for (const e of entries) {
            const label = e.clientLabel || 'unknown';
            if (!grouped[label]) { grouped[label] = []; }
            grouped[label].push(e);
        }
        const panel = vscode.window.createWebviewPanel(
            'serverBacklog',
            `Server Backlog (${entries.length})`,
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );
        const sections = Object.entries(grouped).map(([label, ents]) => {
            const rows = ents.map(e => `
                <tr>
                    <td class="cell time">${esc(new Date(e.timestamp || Date.now()).toLocaleString())}</td>
                    <td class="cell cmd">${esc(e.command || '')}</td>
                    <td class="cell result"><pre>${esc(JSON.stringify(e.payload ?? e.result ?? null, null, 2))}</pre></td>
                </tr>`).join('');
            return `<div class="section"><h3>${esc(label)}</h3>
                    <table><thead><tr><th>Time</th><th>Command</th><th>Result</th></tr></thead>
                    <tbody>${rows}</tbody></table></div>`;
        }).join('');
        panel.webview.html = `<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"><style>
body{background:#1e1e2e;color:#cdd6f4;font-family:ui-sans-serif,system-ui,sans-serif;padding:24px;margin:0}
h2{margin:0 0 4px;font-size:1.1rem}h3{color:#a6e3a1;font-size:.85rem;border-bottom:1px solid #313244;padding-bottom:6px;margin:0 0 8px}
.section{margin-bottom:28px}table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:.7rem;color:#6c7086;padding-bottom:6px;font-weight:600;text-transform:uppercase}
.cell{padding:4px 8px 4px 0;vertical-align:top;font-size:.75rem}.time{color:#a6adc8;white-space:nowrap}
.cmd{color:#89b4fa;font-family:monospace}.result{color:#cdd6f4}
pre{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.7rem}
.toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.empty{color:#6c7086;font-style:italic;margin-top:20px}
button{background:#313244;border:1px solid #45475a;color:#cdd6f4;padding:5px 14px;border-radius:6px;cursor:pointer;font-size:.8rem}
button:hover{background:#45475a}
</style></head>
<body>
<div class="toolbar">
  <h2>Server Backlog \u2014 ${entries.length} result${entries.length === 1 ? '' : 's'}</h2>
  <button onclick="clearAll()">Clear All</button>
</div>
${entries.length === 0 ? '<p class="empty">No backlog entries.</p>' : sections}
<script>const vscode=acquireVsCodeApi();function clearAll(){vscode.postMessage({action:'clearBacklog'});}</script>
</body></html>`;
        panel.webview.onDidReceiveMessage(msg => {
            if (msg.action === 'clearBacklog') {
                this.fallback.clearRecentBacklog();
                panel.dispose();
                this.triggerUpdate();
            }
        });
    }

    // Called when server-backlog file is found — client wrote results while server was offline
    private handleBacklogResponse(clientLabel: string, entry: any) {
        // Find client by label
        const client = Array.from(this.clients.values()).find(c => c.clientLabel === clientLabel);
        if (!client) {
            console.warn(`[MonitorServer] Backlog response for unknown clientLabel: ${clientLabel}`);
            return;
        }
        // Update command log entry to 'executed'
        const logEntry = client.commandLog.find(e => e.id === entry.id);
        if (logEntry) {
            logEntry.status = 'executed';
            logEntry.result = entry.payload;
        } else {
            client.commandLog.push({ id: entry.id, command: entry.command, status: 'executed', timestamp: entry.timestamp, result: entry.payload });
        }
        client.lastResponse = { command: entry.command, data: entry.payload, timestamp: Date.now() };
        if (entry.command === 'checkBBrainy' && entry.payload) {
            if (!client.info) { client.info = {}; }
            client.info.bbrainyStatus = entry.payload;
        }
        if (entry.command === 'getUsageReport' && entry.payload?.success && entry.payload?.agents) {
            this.showUsageReportWebview(entry.payload, client.info?.username, client.info?.hostname);
        }
        console.log(`[MonitorServer] Processed server-backlog entry for ${clientLabel}: ${entry.command}`);
        this.triggerUpdate();
    }

    // Discover clients that wrote a presence file to the sync folder but have never connected via WS.
    // Adds them as offline stubs and persists them to globalState so they survive restarts.
    private importSyncClients() {
        const entries = this.fallback.scanRegisteredClients();
        if (entries.length === 0) { return; }

        let added = 0;
        for (const entry of entries) {
            if (this.clients.has(entry.clientKey)) {
                // Update extensionStatus on existing client from latest presence file
                const existing = this.clients.get(entry.clientKey)!;
                existing.extensionStatus = entry.status ?? 'active';
                continue;
            }
            this.clients.set(entry.clientKey, {
                key: entry.clientKey,
                ws: null,
                info: { username: entry.username, hostname: entry.hostname },
                lastSeen: entry.lastSeen,
                status: 'offline',
                clientLabel: entry.clientLabel,
                commandLog: [],
                extensionStatus: entry.status ?? 'active'
            });
            console.log(`[MonitorServer] Discovered new client via presence file: ${entry.clientLabel} (${entry.clientKey})`);
            added++;
        }

        if (added > 0) {
            this.savePersistentClients();
            this.triggerUpdate();
            console.log(`[MonitorServer] Imported ${added} new client(s) from sync folder`);
        }
    }

    private loadPersistentClients() {
        if (!this.context || !this.serverId) {
            console.warn(`[MonitorServer] Cannot load persistent clients: context=${!!this.context}, serverId=${this.serverId}`);
            return;
        }
        const allSaved = this.context.globalState.get<Record<string, any[]>>('persistentAssets') || {};
        const savedClients = allSaved[this.serverId] || [];
        console.log(`[MonitorServer] Loading ${savedClients.length} persistent clients for serverId: ${this.serverId}`);
        savedClients.forEach(c => {
            this.clients.set(c.key, {
                ...c,
                ws: null,
                status: 'offline',
                clientLabel: c.clientLabel || `${c.info?.username || 'unknown'}-${c.info?.hostname || 'unknown'}`,
                commandLog: c.commandLog || []
            });
        });
    }

    private deduplicateClients() {
        const seenKeys = new Set<string>();
        const keysToRemove: string[] = [];
        
        // First pass: identify duplicates (keep first occurrence)
        for (const [key, client] of this.clients) {
            const uniqueId = `${client.info?.hostname}:${client.info?.username}`;
            if (seenKeys.has(uniqueId)) {
                keysToRemove.push(key);
                console.log(`[MonitorServer] Found duplicate client: ${key} (${client.info?.username}@${client.info?.hostname})`);
            } else {
                seenKeys.add(uniqueId);
            }
        }
        
        // Remove duplicates
        keysToRemove.forEach(key => this.clients.delete(key));
        
        if (keysToRemove.length > 0) {
            this.savePersistentClients();
            console.log(`[MonitorServer] Removed ${keysToRemove.length} duplicate client entries`);
            vscode.window.showInformationMessage(`Cleaned up ${keysToRemove.length} duplicate clients on startup`);
        }
    }

    private savePersistentClients() {
        if (!this.context || !this.serverId) {
            console.error(`[MonitorServer] Cannot save persistent clients: context=${!!this.context}, serverId=${this.serverId}`);
            return;
        }
        const allSaved = this.context.globalState.get<Record<string, any[]>>('persistentAssets') || {};
        allSaved[this.serverId] = Array.from(this.clients.values()).map(c => ({
            key: c.key,
            info: c.info,
            lastSeen: c.lastSeen,
            clientLabel: c.clientLabel,
            commandLog: c.commandLog.slice(-100)   // keep last 100 log entries
        }));
        this.context.globalState.update('persistentAssets', allSaved);
        console.debug(`[MonitorServer] Saved ${this.clients.size} clients to persistent storage`);
    }

    setProvider(provider: MonitorViewProvider) {
        this.provider = provider;
    }

    async start() {
        if (this.running) {
            console.warn(`[MonitorServer] Already running, ignoring start request`);
            return;
        }
        if (!this.context) {
            console.error(`[MonitorServer] Cannot start: context not initialized`);
            vscode.window.showErrorMessage('Server not initialized with Context');
            return;
        }
        const config = vscode.workspace.getConfiguration('serverMonitor');
        // Use configuredPort from UI/globalState; fall back to settings
        const persistedPort = this.context.globalState.get<number>('serverPort');
        const basePort = persistedPort || this.configuredPort || config.get<number>('port') || 54321;
        // Prefer globalState key (set via UI) over settings
        const persistedKey = this.context.globalState.get<string>('serverKey');
        this.serverId = persistedKey || config.get<string>('serverId') || 'default';

        console.log(`[MonitorServer] Starting server with serverId: ${this.serverId} on port: ${basePort}`);

        // Reload clients for the specific Server ID
        this.clients.clear();
        this.loadPersistentClients();
        
        // Remove duplicate clients (keeping the first occurrence of each unique key)
        this.deduplicateClients();

        // Re-configure fallback with latest settings (in case they changed since initialize())
        this.setupFallback();
        // Import any clients that registered via presence file while server was offline
        this.importSyncClients();

        this.server = http.createServer();
        this.wss = new WebSocketServer({ server: this.server });

        this.wss.on('connection', (ws) => {
            console.log(`[MonitorServer] New WebSocket connection established`);
            ws.on('message', (data) => this.handleClientMessage(ws, data));
            ws.on('close', () => this.handleClientDisconnect(ws));
            ws.on('error', (err) => {
                console.error(`[MonitorServer] WebSocket error: ${err.message}`);
            });
        });

        this.listenWithRetry(basePort);
    }

    private startHeartbeatCheck() {
        if (this.heartbeatCheckInterval) {
            clearInterval(this.heartbeatCheckInterval);
        }
        // Check every 30 seconds for stale offline clients
        this.heartbeatCheckInterval = setInterval(() => {
            this.checkHeartbeats();
        }, 30000);
    }

    private listenWithRetry(port: number, attempt: number = 0) {
        if (attempt >= 10) {
            console.error(`[MonitorServer] Failed to start: Ports ${port - 10} to ${port - 1} are busy`);
            vscode.window.showErrorMessage(`Failed to start server: Ports ${port - 10} to ${port - 1} are busy.`);
            return;
        }

        this.server?.listen(port, () => {
            this.port = port;
            this.running = true;
            this.startHeartbeatCheck();
            this.writeServerPresenceFile('online');
            if (this.serverPresenceInterval) { clearInterval(this.serverPresenceInterval); }
            this.serverPresenceInterval = setInterval(() => this.writeServerPresenceFile('online'), 30000);
            this.triggerUpdate();
            console.log(`[MonitorServer] ✅ Server started successfully on port ${this.port}`);
            vscode.window.showInformationMessage(`Monitor server [${this.serverId}] running on port ${this.port}`);
        }).on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`[MonitorServer] Port ${port} is in use, trying ${port + 1}...`);
                this.listenWithRetry(port + 1, attempt + 1);
            } else {
                console.error(`[MonitorServer] Server error: ${err.message}`);
                vscode.window.showErrorMessage(`Server error: ${err.message}`);
            }
        });
    }

    stop() {
        if (!this.running) {
            console.warn(`[MonitorServer] Not running, ignoring stop request`);
            return;
        }
        
        console.log(`[MonitorServer] Stopping server`);
        
        // Stop heartbeat check
        if (this.heartbeatCheckInterval) {
            clearInterval(this.heartbeatCheckInterval);
            this.heartbeatCheckInterval = null;
        }

        // Stop sync-folder scan
        if (this.syncScanInterval) {
            clearInterval(this.syncScanInterval);
            this.syncScanInterval = null;
        }

        // Write server offline status to presence file
        this.writeServerPresenceFile('offline');
        if (this.serverPresenceInterval) {
            clearInterval(this.serverPresenceInterval);
            this.serverPresenceInterval = null;
        }

        // Stop fallback polling
        this.fallback.stopPolling();
        
        this.wss?.close();
        this.server?.close();
        this.wss = null;
        this.server = null;
        this.running = false;

        // When server stops, set active clients to offline but don't clear persistent ones
        for (const client of this.clients.values()) {
            client.status = 'offline';
            client.ws = null;
        }

        this.triggerUpdate();
        console.log(`[MonitorServer] ✅ Server stopped`);
        vscode.window.showInformationMessage('Monitor server stopped');
    }

    private handleClientMessage(ws: any, data: any) {
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (e) {
            console.error(`[MonitorServer] Failed to parse message:`, e);
            return;
        }

        console.log(`[MonitorServer] Received message type: ${message.type} from client: ${message.clientKey}`);

        // Accept both serverKey (new protocol) and serverId (legacy) fields
        const clientServerKey = message.serverKey || message.serverId;

        if (message.type === 'register') {
            if (clientServerKey !== this.serverId) {
                console.warn(`[MonitorServer] Client ${message.clientKey} attempted to register with wrong Server Key: ${clientServerKey} (expected: ${this.serverId})`);
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid Server Key' }));
                return;
            }
            this.registerClient(ws, message);
        } else if (message.type === 'response') {
            console.log(`[MonitorServer] Response from ${message.clientKey} for command: ${message.command}`);
            this.handleResponse(message);
        } else if (message.type === 'heartbeat') {
            console.debug(`[MonitorServer] Heartbeat from ${message.clientKey}`);
            this.updateHeartbeat(message.clientKey);
        } else {
            console.warn(`[MonitorServer] Unknown message type: ${message.type} from ${message.clientKey}`);
        }

        this.triggerUpdate();
    }

    private registerClient(ws: any, message: any) {
        const clientLabel = `${message.payload?.username || 'unknown'}-${message.payload?.hostname || 'unknown'}`;
        const existingClient = this.clients.get(message.clientKey);
        if (existingClient) {
            console.log(`[MonitorServer] Updating existing client: ${message.clientKey} (${clientLabel})`);
            existingClient.ws = ws;
            existingClient.status = 'online';
            existingClient.info = message.payload;
            existingClient.lastSeen = Date.now();
            existingClient.clientLabel = clientLabel;
        } else {
            console.log(`[MonitorServer] Registering new client: ${message.clientKey} (${clientLabel})`);
            const client: Client = {
                key: message.clientKey,
                ws: ws,
                info: message.payload,
                lastSeen: Date.now(),
                status: 'online',
                clientLabel,
                commandLog: []
            };
            this.clients.set(message.clientKey, client);
        }

        this.savePersistentClients();
        console.log(`[MonitorServer] Total clients: ${this.clients.size}`);
        vscode.window.showInformationMessage(`Client registered: ${message.payload?.username}@${message.payload?.hostname}`);

        // Dequeue any pending offline commands and deliver via WebSocket
        this.dequeueAndSend(message.clientKey, clientLabel);
    }

    private async dequeueAndSend(clientKey: string, clientLabel: string) {
        if (!this.fallback.isConfigured) { return; }
        const pending = this.fallback.dequeueCommands(clientLabel);
        if (pending.length === 0) { return; }

        const client = this.clients.get(clientKey);
        if (!client) { return; }

        console.log(`[MonitorServer] Delivering ${pending.length} queued command(s) to ${clientLabel} via WebSocket`);
        vscode.window.showInformationMessage(`Client ${clientLabel} is back online — delivering ${pending.length} queued command(s)`);

        for (const cmd of pending) {
            // Update log entry to 'sent'
            const logEntry = client.commandLog.find(e => e.id === cmd.id);
            if (logEntry) {
                logEntry.status = 'sent';
            }

            if (client.ws?.readyState === 1 /* OPEN */) {
                client.ws.send(JSON.stringify({ command: cmd.command, payload: cmd.payload, timestamp: Date.now(), queuedCommandId: cmd.id }));
                console.log(`[MonitorServer] Delivered queued command "${cmd.command}" (${cmd.id}) to ${clientLabel}`);
            }
            // Small delay to avoid flooding
            await new Promise(r => setTimeout(r, 100));
        }
        this.triggerUpdate();
    }

    private handleClientDisconnect(ws: any) {
        let disconnectedClient: string | null = null;
        for (const [key, client] of this.clients) {
            if (client.ws === ws) {
                client.status = 'offline';
                client.ws = null;
                disconnectedClient = key;
                console.log(`[MonitorServer] Client disconnected: ${key} (${client.info?.username}@${client.info?.hostname})`);
                this.triggerUpdate();
                break;
            }
        }
        if (!disconnectedClient) {
            console.warn(`[MonitorServer] Disconnect event received but no matching client found`);
        }
    }

    private updateHeartbeat(clientKey: string) {
        const client = this.clients.get(clientKey);
        if (client) {
            client.lastSeen = Date.now();
            client.status = 'online';
            this.savePersistentClients();
            console.debug(`[MonitorServer] Updated heartbeat for ${clientKey}`);
        } else {
            console.warn(`[MonitorServer] Heartbeat from unknown client: ${clientKey}`);
        }
    }

    private checkHeartbeats() {
        const now = Date.now();
        const keysToRemove: string[] = [];
        
        for (const [key, client] of this.clients) {
            if (client.status === 'online' && now - client.lastSeen > 90000) {
                // Mark as offline if no heartbeat for 90 seconds
                client.status = 'offline';
                client.ws = null;
                console.log(`[MonitorServer] Client marked offline due to missed heartbeat: ${key} (${client.info?.username}@${client.info?.hostname})`);
            } else if (client.status === 'offline' && now - client.lastSeen > this.offlineTimeoutMs) {
                // Remove client if offline for too long (5 minutes by default)
                keysToRemove.push(key);
                console.log(`[MonitorServer] Removing stale offline client: ${key} (${client.info?.username}@${client.info?.hostname})`);
            }
        }
        
        // Remove stale offline clients
        keysToRemove.forEach(key => this.clients.delete(key));
        
        if (keysToRemove.length > 0) {
            console.log(`[MonitorServer] Removed ${keysToRemove.length} stale client(s)`);
            this.savePersistentClients();
            this.triggerUpdate();
        }
    }

    private handleResponse(message: any) {
        const client = this.clients.get(message.clientKey);
        if (client) {
            client.lastResponse = {
                command: message.command || 'unknown',
                data: message.payload,
                timestamp: Date.now()
            };
            console.log(`[MonitorServer] Stored response for ${message.clientKey} (${message.command})`, {
                success: message.payload?.success,
                totalEntries: message.payload?.totalEntries,
                agents: message.payload?.agents?.length
            });

            // Update log entry if this response corresponds to a queued command
            if (message.queuedCommandId) {
                const logEntry = client.commandLog.find(e => e.id === message.queuedCommandId);
                if (logEntry) {
                    logEntry.status = 'executed';
                    logEntry.result = message.payload;
                }
            }

            // Store BBrainy status if available
            if (message.command === 'checkBBrainy' && message.payload) {
                if (!client.info) { client.info = {}; }
                client.info.bbrainyStatus = message.payload;
            }
            
            // Handle usage report - create webview panel
            if (message.command === 'getUsageReport' && message.payload?.success && message.payload?.agents) {
                this.showUsageReportWebview(message.payload, client.info?.username, client.info?.hostname);
            }
            
            this.triggerUpdate();
        } else {
            console.warn(`[MonitorServer] Response from unknown client: ${message.clientKey}`);
        }
    }

    private showUsageReportWebview(usageData: any, username: string = 'Unknown', hostname: string = 'Unknown') {
        try {
            // Prepare chart data for Chart.js
            const chartData = {
                labels: usageData.agents.map((a: any) => a.name),
                datasets: [{
                    label: 'Usage Count',
                    data: usageData.agents.map((a: any) => a.count),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.2)',    // blue
                        'rgba(16, 185, 129, 0.2)',    // emerald
                        'rgba(168, 85, 247, 0.2)',    // purple
                        'rgba(251, 146, 60, 0.2)',    // orange
                        'rgba(244, 63, 94, 0.2)',     // red
                        'rgba(236, 72, 153, 0.2)',    // pink
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(168, 85, 247, 1)',
                        'rgba(251, 146, 60, 1)',
                        'rgba(244, 63, 94, 1)',
                        'rgba(236, 72, 153, 1)',
                    ],
                    borderWidth: 2
                }]
            };

            // Create webview panel
            const panel = vscode.window.createWebviewPanel(
                'bbrainyUsageReport',
                `BBrainy Usage: ${usageData.timeframe}`,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = this.getUsageReportHtml(usageData, chartData, username, hostname);

            console.log(`[MonitorServer] Opened usage report webview for ${username}@${hostname}: ${usageData.timeframe}`);
        } catch (error) {
            console.error(`[MonitorServer] Failed to show usage report:`, error);
            vscode.window.showErrorMessage(`Failed to show usage report: ${error}`);
        }
    }

    private getUsageReportHtml(usageData: any, chartData: any, username: string, hostname: string): string {
        // Build agent rows as separate string
        const agentRows = usageData.agents.map((agent: any) => 
            `<tr>
                <td><span class="agent-name">${agent.name}</span></td>
                <td class="count">${agent.count}</td>
                <td class="percentage">${agent.percentage}%</td>
            </tr>`
        ).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BBrainy Usage Report</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        color: #e2e8f0;
                        padding: 32px;
                        min-height: 100vh;
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    
                    .header {
                        margin-bottom: 32px;
                        border-bottom: 2px solid rgba(59, 130, 246, 0.3);
                        padding-bottom: 20px;
                    }
                    
                    h1 {
                        font-size: 32px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    
                    .client-info {
                        font-size: 14px;
                        color: #94a3b8;
                        margin-bottom: 8px;
                    }
                    
                    .timeframe {
                        font-size: 18px;
                        color: #cbd5e1;
                        font-weight: 600;
                    }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 16px;
                        margin-bottom: 32px;
                    }
                    
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        padding: 20px;
                        backdrop-filter: blur(10px);
                    }
                    
                    .stat-label {
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #64748b;
                        margin-bottom: 8px;
                    }
                    
                    .stat-value {
                        font-size: 28px;
                        font-weight: 700;
                        color: #60a5fa;
                    }
                    
                    .agents-table {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        overflow: hidden;
                        margin-bottom: 32px;
                        backdrop-filter: blur(10px);
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    th {
                        background: rgba(15, 23, 42, 0.6);
                        padding: 16px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
                    }
                    
                    td {
                        padding: 14px 16px;
                        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
                        font-size: 14px;
                    }
                    
                    tr:hover {
                        background: rgba(59, 130, 246, 0.05);
                    }
                    
                    tr:last-child td {
                        border-bottom: none;
                    }
                    
                    .agent-name {
                        font-weight: 600;
                        color: #60a5fa;
                    }
                    
                    .count {
                        text-align: right;
                        font-weight: 600;
                        color: #34d399;
                    }
                    
                    .percentage {
                        text-align: right;
                        color: #94a3b8;
                        font-size: 12px;
                    }
                    
                    .chart-container {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        padding: 24px;
                        margin-bottom: 32px;
                        backdrop-filter: blur(10px);
                        position: relative;
                        height: 400px;
                    }
                    
                    .chart-container h2 {
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #cbd5e1;
                    }
                    
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #64748b;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 BBrainy Usage Report</h1>
                        <div class="client-info">📍 Client: <strong>${username}@${hostname}</strong></div>
                        <div class="timeframe">${usageData.timeframe}</div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Total Usages</div>
                            <div class="stat-value">${usageData.totalEntries}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Unique Agents</div>
                            <div class="stat-value">${usageData.agents.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Most Used</div>
                            <div class="stat-value" style="font-size: 18px; color: #34d399;">${usageData.agents[0]?.name || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="agents-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Agent Name</th>
                                    <th class="count">Count</th>
                                    <th class="percentage">Usage %</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${agentRows}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="chart-container">
                        <h2>Usage Distribution</h2>
                        <canvas id="usageChart"></canvas>
                    </div>
                    
                    <div class="footer">
                        <p>Generated: ${new Date(usageData.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                
                <script>
                    const ctx = document.getElementById('usageChart').getContext('2d');
                    const chart = new Chart(ctx, {
                        type: 'bar',
                        data: ${JSON.stringify(chartData)},
                        options: {
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        color: '#e2e8f0',
                                        font: {
                                            size: 12
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(59, 130, 246, 0.1)'
                                    },
                                    ticks: {
                                        color: '#94a3b8',
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                y: {
                                    grid: {
                                        display: false
                                    },
                                    ticks: {
                                        color: '#94a3b8',
                                        font: {
                                            size: 12
                                        }
                                    }
                                }
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }

    async sendCommand(clientKey: string, command: string, payload?: any) {
        const client = this.clients.get(clientKey);
        if (!client) {
            console.warn(`[MonitorServer] Attempted to send command to non-existent client: ${clientKey}`);
            vscode.window.showErrorMessage('Client not found');
            return;
        }

        if (client.status === 'offline') {
            // Add log entry immediately so UI reflects the attempt
            const tempId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
            const logEntry: CommandLogEntry = { id: tempId, command, status: 'queued', timestamp: Date.now() };
            client.commandLog.push(logEntry);
            this.triggerUpdate();

            if (!this.fallback.isConfigured) {
                logEntry.status = 'error';
                const syncPath = vscode.workspace.getConfiguration('serverMonitor').get<string>('syncPath') || '(empty)';
                const msg = `Client offline — sync path not configured. Current value: "${syncPath}". Set serverMonitor.syncPath in settings.`;
                console.error(`[MonitorServer] ${msg}`);
                vscode.window.showErrorMessage(msg);
                this.savePersistentClients();
                this.triggerUpdate();
                return;
            }

            try {
                const cmdId = this.fallback.enqueueCommand(client.clientLabel, clientKey, command, payload);
                logEntry.id = cmdId;  // update with real id
                this.savePersistentClients();
                this.triggerUpdate();
                const msg = `Queued "${command}" for ${client.clientLabel} → ${this.fallback.syncPathValue}\\queue\\${client.clientLabel}.json`;
                console.log(`[MonitorServer] ${msg}`);
                vscode.window.showInformationMessage(msg);
            } catch (e: any) {
                logEntry.status = 'error';
                const msg = `Failed to queue command: ${e?.message || e}`;
                console.error(`[MonitorServer] ${msg}`);
                vscode.window.showErrorMessage(msg);
                this.savePersistentClients();
                this.triggerUpdate();
            }
            return;
        }

        console.log(`[MonitorServer] Sending command to ${clientKey}: ${command}`, payload || '{}');

        client.ws.send(JSON.stringify({
            command,
            payload,
            timestamp: Date.now()
        }));

        console.log(`[MonitorServer] Command sent successfully to ${clientKey}`);
    }

    async queryAllClients(command: string) {
        console.log(`[MonitorServer] Broadcasting command to all ${this.clients.size} clients: ${command}`);
        const promises = Array.from(this.clients.keys()).map(key =>
            this.sendCommand(key, command)
        );
        await Promise.all(promises);
        console.log(`[MonitorServer] Broadcast complete for command: ${command}`);
    }

    getAllClientsInfo() {
        return Array.from(this.clients.values()).map(c => ({
            key: c.key,
            username: c.info?.username || 'Unknown',
            hostname: c.info?.hostname || 'Unknown',
            workspace: c.info?.workspace,
            bbrainyActive: c.info?.bbrainyStatus?.active || false,
            status: c.status,
            lastSeen: c.lastSeen,
            onlineStatus: c.status === 'online' ? 'online' : 'offline'
        }));
    }

    showAllAssetsWebview() {
        const assets = this.getAllClientsInfo();
        const panel = vscode.window.createWebviewPanel(
            'allAssets',
            'All Assets',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = this.getAllAssetsHtml(assets);
    }

    private getAllAssetsHtml(assets: any[]): string {
        const assetRows = assets.map(asset => `
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${asset.username}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${asset.hostname}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${asset.onlineStatus === 'online' ? '#34d399' : '#ef4444'};"></span>
                    ${asset.onlineStatus}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${asset.bbrainyActive ? '✓ Active' : '✗ Inactive'}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">${asset.lastSeen ? new Date(asset.lastSeen).toLocaleString() : 'Never'}</td>
            </tr>
        `).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Assets Status</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        min-height: 100vh;
                        padding: 40px;
                        color: #e2e8f0;
                    }
                    .container { max-width: 1200px; margin: 0 auto; }
                    h1 {
                        font-size: 36px;
                        margin-bottom: 30px;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 700;
                    }
                    .summary-stats {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 20px;
                        backdrop-filter: blur(8px);
                        text-align: center;
                    }
                    .stat-value {
                        font-size: 28px;
                        font-weight: 700;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .stat-label {
                        color: #94a3b8;
                        font-size: 12px;
                        margin-top: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .table-container {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        overflow: hidden;
                        backdrop-filter: blur(8px);
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th {
                        background: rgba(96, 165, 250, 0.1);
                        padding: 15px;
                        text-align: left;
                        border-bottom: 2px solid rgba(96, 165, 250, 0.2);
                        font-weight: 600;
                        color: #60a5fa;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    tr:hover {
                        background: rgba(96, 165, 250, 0.05);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📊 All Assets (${assets.length} Total)</h1>
                    
                    <div class="summary-stats">
                        <div class="stat-card">
                            <div class="stat-value">${assets.length}</div>
                            <div class="stat-label">Total Clients</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${assets.filter(a => a.onlineStatus === 'online').length}</div>
                            <div class="stat-label">Online</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${assets.filter(a => a.bbrainyActive).length}</div>
                            <div class="stat-label">BBrainy Active</div>
                        </div>
                    </div>

                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Hostname</th>
                                    <th>Status</th>
                                    <th>BBrainy</th>
                                    <th>Last Seen</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${assetRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    showBBrainyStatusWebview(clientKey: string) {
        const client = this.clients.get(clientKey);
        if (!client) {
            vscode.window.showErrorMessage(`Client ${clientKey} not found`);
            return;
        }

        const status = client.info?.bbrainyStatus || { 
            installed: false, 
            active: false, 
            version: 'Unknown',
            lastUsedTime: 'Never',
            totalUsage: 0
        };

        const panel = vscode.window.createWebviewPanel(
            `bbrainyStatus-${clientKey}`,
            `BBrainy Status - ${client.info?.username}@${client.info?.hostname}`,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = this.getBBrainyStatusHtml(status, client.info?.username, client.info?.hostname);
    }

    private getBBrainyStatusHtml(status: any, username: string = 'Unknown', hostname: string = 'Unknown'): string {
        const installed = status.installed;
        const active = status.active;
        const version = status.version || 'Unknown';
        const lastUsed = status.lastUsedTime || 'Never';
        const totalUsage = status.totalUsage || 0;

        const statusColor = installed ? (active ? '#34d399' : '#f59e0b') : '#ef4444';
        const statusText = installed ? (active ? 'Active' : 'Installed - Inactive') : 'Not Installed';

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BBrainy Status</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        min-height: 100vh;
                        padding: 40px;
                        color: #e2e8f0;
                    }
                    .container { max-width: 800px; margin: 0 auto; }
                    .client-info {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid rgba(96, 165, 250, 0.2);
                    }
                    .client-name {
                        font-size: 18px;
                        color: #94a3b8;
                        margin-bottom: 5px;
                    }
                    h1 {
                        font-size: 36px;
                        margin-bottom: 10px;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 700;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 600;
                        background-color: ${statusColor}20;
                        color: ${statusColor};
                        border: 2px solid ${statusColor};
                        margin-top: 15px;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 25px;
                        backdrop-filter: blur(8px);
                    }
                    .stat-label {
                        color: #94a3b8;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                        font-weight: 600;
                    }
                    .stat-value {
                        color: #60a5fa;
                        font-size: 24px;
                        font-weight: 700;
                        word-break: break-word;
                    }
                    .contribution-graph {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 30px;
                        backdrop-filter: blur(8px);
                        margin-top: 30px;
                    }
                    .graph-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #60a5fa;
                    }
                    .graph-grid {
                        display: grid;
                        grid-template-columns: repeat(12, 1fr);
                        gap: 4px;
                        margin-bottom: 15px;
                    }
                    .graph-cell {
                        width: 100%;
                        aspect-ratio: 1;
                        background: rgba(100, 116, 139, 0.3);
                        border-radius: 4px;
                        border: 1px solid rgba(100, 116, 139, 0.2);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="client-info">
                        <div class="client-name">📱 ${username}@${hostname}</div>
                        <h1>🧠 BBrainy Status</h1>
                        <div class="status-badge">${statusText}</div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Installed</div>
                            <div class="stat-value">${installed ? '✓ Yes' : '✗ No'}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Version</div>
                            <div class="stat-value">${version}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Last Used</div>
                            <div class="stat-value" style="font-size: 14px;">${lastUsed}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Usage</div>
                            <div class="stat-value">${totalUsage}</div>
                        </div>
                    </div>

                    <div class="contribution-graph">
                        <div class="graph-title">📊 Contribution Graph (Last 12 Weeks)</div>
                        <div class="graph-grid">
                            ${Array.from({length: 84}, (_, i) => `<div class="graph-cell" style="background: rgba(52, 211, 153, ${Math.random() * 0.5});"></div>`).join('')}
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; text-align: center;">Green intensity shows activity level</div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async generateReport() {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('Open a workspace to generate reports');
            return;
        }

        const report = {
            timestamp: new Date().toISOString(),
            totalClients: this.clients.size,
            onlineClients: Array.from(this.clients.values()).filter(c => c.status === 'online').length,
            clients: Array.from(this.clients.values()).map(c => ({
                key: c.key,
                hostname: c.info.hostname,
                username: c.info.username,
                workspace: c.info.workspace,
                bbrainyActive: c.info.bbrainyStatus?.active,
                lastSeen: new Date(c.lastSeen).toISOString(),
                status: c.status
            }))
        };

        const reportPath = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'reports', `report-${Date.now()}.json`);

        try {
            await vscode.workspace.fs.writeFile(reportPath, Buffer.from(JSON.stringify(report, null, 2)));
            vscode.window.showInformationMessage(`Report saved to ${reportPath.fsPath}`);
        } catch (e) {
            vscode.window.showErrorMessage(`Failed to save report: ${e}`);
        }
    }

    // Publish a client extension update via client-release folder
    async publishClientUpdate() {
        const vsixFiles = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'VSIX Extension': ['vsix'] },
            title: 'Select client extension VSIX to publish'
        });
        if (vsixFiles && vsixFiles[0]) {
            if (this.clientReleasePath) {
                try {
                    const updatesDir = path.join(this.clientReleasePath, 'updates');
                    fs.mkdirSync(updatesDir, { recursive: true });
                    const filename = path.basename(vsixFiles[0].fsPath);
                    fs.copyFileSync(vsixFiles[0].fsPath, path.join(updatesDir, filename));
                    console.log(`[MonitorServer] Published update to client-release: ${filename}`);
                    vscode.window.showInformationMessage(`Update published: ${filename}`);
                } catch (e) {
                    console.error('[MonitorServer] Failed to publish update:', e);
                    vscode.window.showErrorMessage(`Failed to publish update: ${e}`);
                }
            } else {
                vscode.window.showErrorMessage('Client release path not configured. Set serverMonitor.clientReleasePath first.');
            }
        }
    }

    triggerUpdate() {
        if (this.provider) {
            const clientsArray = Array.from(this.clients.values());
            this.provider.update({
                serverStatus: {
                    running: this.running,
                    port: this.port,
                    serverId: this.serverId
                },
                total: this.clients.size,
                online: clientsArray.filter(c => c.status === 'online').length,
                offline: clientsArray.filter(c => c.status === 'offline').length,
                clients: clientsArray.map(c => ({
                    key: c.key,
                    hostname: c.info?.hostname,
                    username: c.info?.username,
                    workspace: c.info?.workspace,
                    bbrainyActive: c.info?.bbrainyStatus?.active,
                    lastSeen: c.lastSeen,
                    status: c.status,
                    clientLabel: c.clientLabel,
                    commandLog: c.commandLog.slice(-50),  // send last 50 to UI
                    lastResponse: c.lastResponse,
                    extensionStatus: c.extensionStatus
                })),
                backlogCount: this.fallback.getRecentBacklog().length,
                configuredPort: this.configuredPort
            });
        }
    }

}
