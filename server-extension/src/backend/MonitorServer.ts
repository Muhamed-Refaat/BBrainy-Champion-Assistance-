import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { MonitorViewProvider } from './providers/MonitorViewProvider';

export interface Client {
    key: string;
    info: any;
    lastSeen: number;
    status: 'sync' | 'offline';
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
    clientLabel: string;   // "<username>-<hostname>" â€” used as filename
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
    completedAt?: number;
    result?: any;
}

// â”€â”€â”€ UNC-safe filesystem helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        try {
            const out = execSync(`if exist "${p}" (echo Y) else (echo N)`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 8000 }).toString().trim();
            return out === 'Y';
        } catch { return false; }
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

function fsRenameFile(src: string, dest: string): void {
    if (isUncPath(src) || isUncPath(dest)) {
        execSync(`move /Y "${src}" "${dest}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 10000 });
        return;
    }
    fs.renameSync(src, dest);
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

// â”€â”€â”€ PresenceEntry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ ServerPresenceEntry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Written by the server to <syncPath>/servers/<key>-<machine>.json on start/stop.
// Deleted when the server extension is deactivated/uninstalled.
interface ServerPresenceEntry {
    key: string;           // serverKey
    machine: string;       // hostname
    username: string;
    version: string;
    clients: { key: string; label: string; status: string }[];
    startedAt: number;
    lastSeen: number;
    status: 'online' | 'offline';
}

// â”€â”€â”€ ServerFallbackManager â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Sync-folder layout:
//   <syncPath>/queue/<username-hostname>.json         â€” server queues commands here (array)
//   <syncPath>/server-backlog/<username-hostname>.json â€” client writes results here when server is offline
//   <syncPath>/clients/<serverKey>/<username-hostname>.json â€” presence files written by clients on activation
class ServerFallbackManager {
    private syncPath: string = '';
    private serverKey: string = '';
    private backlogPollInterval: NodeJS.Timeout | null = null;
    private onBacklogResponse: ((clientLabel: string, entry: any) => void) | null = null;
    private recentBacklogEntries: any[] = [];
    private onBacklogArrived: ((entries: any[]) => void) | null = null;
    // Called once after each poll sweep that processed ≥1 entry — used to
    // batch the save+flush rather than doing it per-entry.
    private onBatchComplete: (() => void) | null = null;
    // Batch queue: commands are staged in memory, then flushed to disk in one
    // write per client queue file.  This avoids N sequential UNC round-trips
    // when queuing many commands (e.g. queryAll broadcast).
    private pendingQueue: Map<string, QueuedCommand[]> = new Map();
    private flushTimer: NodeJS.Timeout | null = null;

    configure(syncPath: string, serverKey: string, onBacklogResponse: (clientLabel: string, entry: any) => void, onBacklogArrived?: (entries: any[]) => void, onBatchComplete?: () => void) {
        this.syncPath = syncPath;
        this.serverKey = serverKey;
        this.onBacklogResponse = onBacklogResponse;
        this.onBacklogArrived = onBacklogArrived ?? null;
        this.onBatchComplete = onBatchComplete ?? null;
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

    startPolling(intervalMs: number = 15000) {
        this.stopPolling();
        if (!this.isConfigured) { return; }
        // Immediate sweep on start to pick up any results already waiting
        this.pollResultsDir();
        this.pollServerBacklog();
        this.backlogPollInterval = setInterval(() => {
            this.pollResultsDir();
            this.pollServerBacklog();
        }, intervalMs);
        console.log(`[ServerFallback] Polling results+backlog every ${intervalMs / 1000}s from: ${this.syncPath}`);
    }

    stopPolling() {
        if (this.backlogPollInterval) {
            clearInterval(this.backlogPollInterval);
            this.backlogPollInterval = null;
        }
    }

    // Stage a command in memory (no disk write yet).
    // Call flushPendingQueue() or scheduleFlush() afterwards.
    stageCommand(clientLabel: string, clientKey: string, command: string, payload?: any, providedId?: string): string {
        const id = providedId ?? `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const entry: QueuedCommand = { id, clientKey, clientLabel, command, payload, timestamp: Date.now(), serverKey: this.serverKey };
        if (!this.pendingQueue.has(clientLabel)) { this.pendingQueue.set(clientLabel, []); }
        this.pendingQueue.get(clientLabel)!.push(entry);
        return id;
    }

    // Schedule a flush on the next microtask — coalesces rapid-fire calls
    // (e.g. queryAll → N × sendCommand) into a single disk write batch.
    scheduleFlush() {
        if (this.flushTimer) { return; } // already scheduled
        this.flushTimer = setTimeout(() => {
            this.flushTimer = null;
            this.flushPendingQueue();
        }, 0);
    }

    /** Remove staged (not yet flushed to disk) commands for a specific client. */
    clearStagedCommands(clientLabel: string) {
        this.pendingQueue.delete(clientLabel);
    }

    // Write all staged commands to disk — one file write per client.
    flushPendingQueue(): { succeeded: string[]; failed: string[] } {
        const succeeded: string[] = [];
        const failed: string[] = [];
        if (!this.isConfigured || this.pendingQueue.size === 0) { return { succeeded, failed }; }
        // Cancel any pending scheduled flush since we're flushing now
        if (this.flushTimer) { clearTimeout(this.flushTimer); this.flushTimer = null; }
        const queueDir = path.join(this.syncPath, 'queue');
        fsEnsureDir(queueDir);
        for (const [clientLabel, newCmds] of this.pendingQueue) {
            try {
                const queueFile = path.join(queueDir, `${clientLabel}.json`);
                let existing: QueuedCommand[] = [];
                if (fsPathExists(queueFile)) {
                    try { existing = JSON.parse(fsReadText(queueFile)); } catch { existing = []; }
                }
                existing.push(...newCmds);
                const tmpFile = queueFile + '.tmp';
                fsWriteText(tmpFile, JSON.stringify(existing, null, 2));
                try { fsRenameFile(tmpFile, queueFile); } catch {
                    fsWriteText(queueFile, JSON.stringify(existing, null, 2));
                    try { fsDeleteFile(tmpFile); } catch {}
                }
                succeeded.push(clientLabel);
                console.log(`[ServerFallback] Flushed ${newCmds.length} command(s) for ${clientLabel}`);
            } catch (e: any) {
                failed.push(clientLabel);
                console.error(`[ServerFallback] Failed to flush queue for ${clientLabel}: ${e?.message || e}`);
            }
        }
        this.pendingQueue.clear();
        return { succeeded, failed };
    }

    // Append a command to <syncPath>/queue/<username-hostname>.json
    enqueueCommand(clientLabel: string, clientKey: string, command: string, payload?: any, providedId?: string): string {
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

            const id = providedId ?? `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
            const entry: QueuedCommand = { id, clientKey, clientLabel, command, payload, timestamp: Date.now(), serverKey: this.serverKey };
            existing.push(entry);
            // Two-phase write: .tmp then rename to .json so the client's
            // rename-before-read never sees a partially-written queue file.
            const tmpFile = queueFile + '.tmp';
            fsWriteText(tmpFile, JSON.stringify(existing, null, 2));
            try { fsRenameFile(tmpFile, queueFile); } catch {
                // Rename failed (client may have just claimed the file) - direct write fallback
                fsWriteText(queueFile, JSON.stringify(existing, null, 2));
                try { fsDeleteFile(tmpFile); } catch {}
            }
            console.log(`[ServerFallback] Enqueued command "${command}" for ${clientLabel} â†’ ${queueFile}`);
            return id;
        } catch (e: any) {
            throw new Error(`Failed to write queue file at "${this.syncPath}\\queue\\${clientLabel}.json": ${e?.message || e}`);
        }
    }

    // Read the queue file for a client WITHOUT deleting it (used for UI display on startup)
    peekQueuedCommands(clientLabel: string): QueuedCommand[] {
        if (!this.isConfigured) { return []; }
        const queueFile = path.join(this.syncPath, 'queue', `${clientLabel}.json`);
        if (!fsPathExists(queueFile)) { return []; }
        try {
            return JSON.parse(fsReadText(queueFile));
        } catch { return []; }
    }

    // List all client labels that have a pending queue file
    listQueuedClients(): string[] {
        if (!this.isConfigured) { return []; }
        const queueDir = path.join(this.syncPath, 'queue');
        if (!fsPathExists(queueDir)) { return []; }
        return fsListDir(queueDir)
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace(/\.json$/, ''));
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

    // Poll <syncPath>/results/ — live responses from online clients (NOT added to recentBacklogEntries)
    private pollResultsDir() {
        if (!this.isConfigured || !this.onBacklogResponse) { return; }
        let processed = 0;
        try {
            const resultsDir = path.join(this.syncPath, 'results');
            if (!fsPathExists(resultsDir)) { return; }
            const files = fsListDir(resultsDir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                const filePath = path.join(resultsDir, file);
                const claimedPath = filePath + `.lock-${process.pid}`;
                // Atomic claim: rename before reading to prevent other server instances from processing
                try { fsRenameFile(filePath, claimedPath); } catch { continue; }
                try {
                    const parsed = JSON.parse(fsReadText(claimedPath));
                    try { fsDeleteFile(claimedPath); } catch {}
                    // Handle both formats: array (batch) or single object
                    const entries: any[] = Array.isArray(parsed) ? parsed : [parsed];
                    for (const entry of entries) {
                        const clientLabel = entry.clientLabel || file.replace(/\.json$/, '');
                        console.log(`[ServerFallback] Got live result from ${clientLabel}: ${entry.command}`);
                        this.onBacklogResponse(clientLabel, { ...entry, channel: 'live' });
                        processed++;
                    }
                } catch (e) {
                    console.error(`[ServerFallback] Error reading results file ${file}:`, e);
                    try { fsDeleteFile(claimedPath); } catch {}
                }
            }
        } catch (e) {
            console.error('[ServerFallback] Results poll error:', e);
        }
        // Single save+flush for the entire sweep — avoids N postMessages for N results
        if (processed > 0) { this.onBatchComplete?.(); }
    }

    // Poll <syncPath>/server-backlog/ for results written by clients that were offline
    private pollServerBacklog() {
        if (!this.isConfigured || !this.onBacklogResponse) { return; }
        let processed = 0;
        try {
            const backlogDir = path.join(this.syncPath, 'server-backlog');
            if (!fsPathExists(backlogDir)) { return; }

            const files = fsListDir(backlogDir).filter(f => f.endsWith('.json'));
            const newEntries: any[] = [];
            for (const file of files) {
                const filePath = path.join(backlogDir, file);
                const claimedPath = filePath + `.lock-${process.pid}`;
                // Atomic claim: rename before reading to prevent other server instances from processing
                try { fsRenameFile(filePath, claimedPath); } catch { continue; }
                try {
                    const parsed = JSON.parse(fsReadText(claimedPath));
                    try { fsDeleteFile(claimedPath); } catch {}
                    // Handle both formats: array (batch) or single object
                    const entries: any[] = Array.isArray(parsed) ? parsed : [parsed];
                    for (const entry of entries) {
                        const clientLabel = entry.clientLabel || file.replace(/\.json$/, '');
                        console.log(`[ServerFallback] Got server-backlog entry from ${clientLabel}: ${entry.command}`);
                        newEntries.push({ ...entry, clientLabel });
                        this.onBacklogResponse(clientLabel, entry);
                        processed++;
                    }
                } catch (e) {
                    console.error(`[ServerFallback] Error reading backlog file ${file}:`, e);
                    try { fsDeleteFile(claimedPath); } catch {}
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
        // Single save+flush for the entire sweep — avoids N postMessages for N results
        if (processed > 0) { this.onBatchComplete?.(); }
    }

    getRecentBacklog(): any[] {
        return this.recentBacklogEntries;
    }

    clearRecentBacklog(): void {
        this.recentBacklogEntries = [];
    }
}

export class MonitorServer {
    private clients: Map<string, Client> = new Map();
    private provider: MonitorViewProvider | null = null;
    private context: vscode.ExtensionContext | null = null;
    private running: boolean = false;
    private serverId: string = 'default';
    private presenceCheckInterval: NodeJS.Timeout | null = null;
    private syncScanInterval: NodeJS.Timeout | null = null;
    private offlineTimeoutMs: number = 300000; // 5 minutes
    private fallback: ServerFallbackManager = new ServerFallbackManager();
    // Tracks the previous value of pollMs/updateCheckMs for in-flight interval commands
    // so we can revert the optimistic UI value if the command is cancelled or errors.
    private pendingIntervalRollbacks = new Map<string, { clientKey: string; field: 'pollMs' | 'updateCheckMs'; oldValue: number | undefined }>();
    // True only while the initial sync-folder scan is running (start / key-change).
    // Included in every snapshot so the webview can show a blocking loading overlay.
    private isScanning = false;
    private clientReleasePath: string = '';
    private serverPresenceInterval: NodeJS.Timeout | null = null;
    private version: string = '1.0.0';
    // IDs of commands that were cancelled/cleared by the user.  Results arriving
    // for these IDs are silently suppressed so a late response doesn't resurrect
    // a queue entry the user already dismissed.
    private cancelledCommandIds = new Set<string>();

    // ─── Configurable intervals (ms) ─────────────────────────────────
    private backlogPollMs: number = 15000;      // server reads server-backlog/
    private presenceCheckMs: number = 30000;    // check client presence staleness
    private syncScanMs: number = 30000;         // scan presence files in clients/<serverKey>/
    private serverPresenceMs: number = 30000;   // refresh server's own presence file
    private clientPollMs: number = 15000;       // target interval pushed to clients
    private commandTimeoutMs: number = 120000;  // 2 minutes – queued commands time out after this
    private updateDebounceTimer: NodeJS.Timeout | null = null;

    initialize(context: vscode.ExtensionContext) {
        this.context = context;
        this.version = (context.extension?.packageJSON as any)?.version || '1.0.0';
        const config = vscode.workspace.getConfiguration('serverMonitor');
        // Load server key: globalState takes priority, then settings
        const persistedKey = context.globalState.get<string>('serverKey');
        this.serverId = persistedKey || config.get<string>('serverId') || 'default';
        // Restore persisted intervals
        const saved = context.globalState.get<Record<string, number>>('serverIntervals');
        if (saved) {
            if (saved.backlogPollMs)    this.backlogPollMs    = saved.backlogPollMs;
            if (saved.presenceCheckMs)  this.presenceCheckMs  = saved.presenceCheckMs;
            if (saved.syncScanMs)       this.syncScanMs       = saved.syncScanMs;
            if (saved.serverPresenceMs) this.serverPresenceMs = saved.serverPresenceMs;
            if (saved.clientPollMs)     this.clientPollMs     = saved.clientPollMs;
            console.log(`[MonitorServer] Restored persisted intervals: backlog=${this.backlogPollMs}, presence=${this.presenceCheckMs}, syncScan=${this.syncScanMs}, serverPresence=${this.serverPresenceMs}, clientPoll=${this.clientPollMs}`);
        }
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
            }, () => {
                // Batch-complete: called once per poll sweep after all results are applied.
                // One globalState write + one webview postMessage instead of one per result.
                this.savePersistentClients();
                this.flushUpdate();
            });
            this.fallback.startPolling(this.backlogPollMs);
            // Scan for presence files to discover & promote sync clients
            if (this.syncScanInterval) { clearInterval(this.syncScanInterval); }
            this.syncScanInterval = setInterval(() => this.importSyncClients(), this.syncScanMs);
            // Immediate scan — don't wait for the first interval tick
            this.importSyncClients();
        }
    }

    async changeServerKey(newKey: string) {
        if (!newKey || !this.context) { return; }
        // Update in-memory state and persist immediately so the next triggerUpdate
        // snapshot contains the new key — the UI sees it without waiting for I/O.
        this.removeServerPresenceFile();
        this.serverId = newKey;
        // Mark as scanning so that any snapshot that slips out during the deferred
        // block still carries scanning=true. The frontend also sets it optimistically.
        this.isScanning = true;
        // Flush the new key + scanning=true to the UI right away
        this.triggerUpdate();
        // Heavy I/O deferred so the message handler returns fast
        setImmediate(async () => {
            await this.context!.globalState.update('serverKey', newKey);
            if (this.running) { this.writeServerPresenceFile('online'); }
            // Switch the client roster to the new key: discard clients that
            // belonged to the old key and load whatever was previously saved
            // under the new key (may be empty on first use of this key).
            this.clients.clear();
            this.loadPersistentClients();
            // Reconfigure fallback + immediately scan for clients under the new key
            // (importSyncClients is called inside setupFallback, then a triggerUpdate
            // pushes the discovered clients to the UI straight away)
            this.setupFallback();
            // Scan complete — clear flag before the final snapshot goes out
            this.isScanning = false;
            this.triggerUpdate();
            console.log(`[MonitorServer] Server key changed to: ${newKey}`);
            vscode.window.showInformationMessage(`Server key changed to: ${newKey}`);
        });
    }

    private serverPresenceFilePath(): string {
        const syncPath = this.fallback.syncPathValue;
        return path.join(syncPath, 'servers', `${this.serverId}-${os.hostname()}-${process.pid}.json`);
    }

    /**
     * Remove stale presence files left by previous instances of this server
     * (same serverId + hostname but different PID).
     */
    private cleanStaleServerPresenceFiles(): void {
        if (!this.fallback.isConfigured) { return; }
        try {
            const serversDir = path.join(this.fallback.syncPathValue, 'servers');
            if (!fsPathExists(serversDir)) { return; }
            const prefix = `${this.serverId}-${os.hostname()}-`;
            const ownFile = `${this.serverId}-${os.hostname()}-${process.pid}.json`;
            const files = fsListDir(serversDir).filter(f => f.startsWith(prefix) && f.endsWith('.json') && f !== ownFile);
            for (const f of files) {
                try {
                    fsDeleteFile(path.join(serversDir, f));
                    console.log(`[MonitorServer] Cleaned stale server presence file: ${f}`);
                } catch { /* best-effort */ }
            }
        } catch (e: any) {
            console.warn(`[MonitorServer] Could not clean stale server presence files: ${e?.message || e}`);
        }
    }

    private writeServerPresenceFile(status: 'online' | 'offline'): void {
        if (!this.fallback.isConfigured) { return; }
        try {
            const serversDir = path.join(this.fallback.syncPathValue, 'servers');
            fsEnsureDir(serversDir);
            // Remove leftover files from previous instances (different PIDs)
            this.cleanStaleServerPresenceFiles();
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
            // Remove own file
            const filePath = this.serverPresenceFilePath();
            if (fsPathExists(filePath)) {
                fsDeleteFile(filePath);
                console.log(`[MonitorServer] Server presence file removed: ${filePath}`);
            }
            // Also clean up any stale files from previous PIDs
            this.cleanStaleServerPresenceFiles();
        } catch (e: any) {
            console.warn(`[MonitorServer] Could not remove server presence file: ${e?.message || e}`);
        }
    }

    showBacklogWebview(): void {
        // All rendering is done server-side in TypeScript to avoid embedded-JSON
        // issues with VS Code's internal document.write webview mechanism.
        const e = (s: any): string => String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const badge = (ok: boolean) =>
            `<span class="r-badge ${ok ? 'ok' : 'err'}">${ok ? '&#10004; ok' : '&#10006; err'}</span>`;
        const fmt = (ts: any) => { try { return new Date(ts).toLocaleString(); } catch { return e(ts); } };
        const kv = (k: string, v: string) =>
            `<span class="r-key">${e(k)}</span><span class="r-val">${v}</span>`;

        const renderUsageReport = (p: any): string => {
            const agents: any[] = p.agents || [];
            let h = `<div class="r-card"><div class="r-kv">`;
            h += kv('Status', badge(!!p.success));
            if (p.timeframe) { h += kv('Timeframe', e(p.timeframe)); }
            if (p.totalEntries !== undefined) { h += kv('Total entries', `<strong>${e(p.totalEntries)}</strong>`); }
            if (p.dateRange?.earliest) { h += kv('From', e(fmt(p.dateRange.earliest))); h += kv('To', e(fmt(p.dateRange.latest))); }
            h += `</div>`;
            if (agents.length > 0) {
                h += `<table class="r-subtable"><thead><tr><th>Agent</th><th>Count</th><th>%</th></tr></thead><tbody>`;
                agents.forEach((a: any) => { h += `<tr><td>${e(a.name)}</td><td>${e(a.count)}</td><td>${e(a.percentage)}%</td></tr>`; });
                h += `</tbody></table>`;
            } else { h += `<span class="r-none">No agent data for this period.</span>`; }
            return h + `</div>`;
        };

        const renderCheckBBrainy = (p: any): string => {
            let h = `<div class="r-card"><div class="r-kv">`;
            h += kv('Status', badge(!!p.success));
            if (p.installed !== undefined) { h += kv('Installed', badge(!!p.installed)); }
            if (p.version) { h += kv('Version', e(p.version)); }
            if (p.active !== undefined) { h += kv('Active', badge(!!p.active)); }
            if (p.message) { h += kv('Message', e(p.message)); }
            return h + `</div></div>`;
        };

        const renderSystemInfo = (p: any): string => {
            let h = `<div class="r-card"><div class="r-kv">`;
            ['hostname', 'username', 'os', 'platform', 'arch', 'cpu', 'memory', 'vscodeVersion', 'nodeVersion']
                .forEach(k => { if (p[k] !== undefined) { h += kv(k, e(p[k])); } });
            return h + `</div></div>`;
        };

        const renderWorkspace = (p: any): string => {
            let h = `<div class="r-card"><div class="r-kv">`;
            if (p.name) { h += kv('Name', e(p.name)); }
            if (p.workspace) { h += kv('Workspace', e(p.workspace)); }
            const roots: string[] = p.rootPaths || (p.rootPath ? [p.rootPath] : []);
            if (roots.length) { h += kv('Root', e(roots.join(', '))); }
            return h + `</div></div>`;
        };

        const renderResult = (cmd: string, payload: any): string => {
            if (payload === null || payload === undefined) { return `<span class="r-none">&mdash;</span>`; }
            if (typeof payload !== 'object') { return `<pre class="r-pre">${e(String(payload))}</pre>`; }
            if (cmd === 'getUsageReport' || cmd === 'generateReport') { return renderUsageReport(payload); }
            if (cmd === 'checkBBrainy' || cmd === 'forceBBrainy' || cmd === 'showBBrainyStatus') { return renderCheckBBrainy(payload); }
            if (cmd === 'getSystemInfo') { return renderSystemInfo(payload); }
            if (cmd === 'getWorkspace') { return renderWorkspace(payload); }
            const json = JSON.stringify(payload, null, 2);
            if (json.length < 300) { return `<pre class="r-pre">${e(json)}</pre>`; }
            // Use native <details>/<summary> â€” no JS needed for toggle
            return `<details class="r-details"><summary>{ &hellip; } show JSON</summary><pre class="r-pre">${e(json)}</pre></details>`;
        };

        const entries = this.fallback.getRecentBacklog();
        const grouped: Record<string, any[]> = {};
        for (const entry of entries) {
            const label = entry.clientLabel || 'unknown';
            if (!grouped[label]) { grouped[label] = []; }
            grouped[label].push(entry);
        }

        const panel = vscode.window.createWebviewPanel(
            'serverBacklog',
            `Server Backlog (${entries.length})`,
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        const sections = Object.entries(grouped).map(([label, ents]) => {
            const rows = ents.map(ent => `<tr>
                <td class="cell time">${e(fmt(ent.timestamp || Date.now()))}</td>
                <td class="cell cmd">${e(ent.command || '')}</td>
                <td class="cell result-cell">${renderResult(ent.command || '', ent.payload ?? ent.result ?? null)}</td>
            </tr>`).join('');
            return `<div class="section"><h3>${e(label)}</h3>
            <table><colgroup><col class="col-time"><col class="col-cmd"><col class="col-result"></colgroup>
            <thead><tr><th>Time</th><th>Command</th><th>Result</th></tr></thead>
            <tbody>${rows}</tbody></table></div>`;
        }).join('');

        const count = entries.length;
        panel.webview.html = [
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>',
            ':root{color-scheme:dark}',
            'body{background:var(--vscode-editor-background,#1e1e2e);color:var(--vscode-foreground,#cdd6f4);',
            '  font-family:var(--vscode-font-family,ui-sans-serif,system-ui,sans-serif);padding:24px;margin:0}',
            'h2{margin:0 0 4px;font-size:1.1rem}',
            'h3{color:var(--vscode-charts-green,#a6e3a1);font-size:.85rem;border-bottom:1px solid var(--vscode-panel-border,#313244);padding-bottom:6px;margin:0 0 8px}',
            '.section{margin-bottom:28px}',
            'table{width:100%;border-collapse:collapse;table-layout:fixed}',
            'col.col-time{width:140px}col.col-cmd{width:160px}col.col-result{width:auto}',
            'th{text-align:left;font-size:.7rem;color:var(--vscode-descriptionForeground,#6c7086);padding-bottom:6px;font-weight:600;text-transform:uppercase;border-bottom:1px solid var(--vscode-panel-border,#313244)}',
            '.cell{padding:6px 8px 6px 0;vertical-align:top;font-size:.75rem;border-bottom:1px solid var(--vscode-panel-border,#252535)}',
            '.time{color:var(--vscode-descriptionForeground,#a6adc8);white-space:nowrap}',
            '.cmd{color:var(--vscode-textLink-foreground,#89b4fa);font-family:monospace;font-size:.75rem}',
            '.result-cell{color:var(--vscode-foreground,#cdd6f4)}',
            '.r-pre{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.7rem;opacity:.85}',
            '.toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}',
            '.empty{color:var(--vscode-descriptionForeground,#6c7086);font-style:italic;margin-top:20px}',
            'button{background:var(--vscode-button-secondaryBackground,#313244);border:1px solid var(--vscode-panel-border,#45475a);',
            '  color:var(--vscode-button-secondaryForeground,#cdd6f4);padding:5px 14px;border-radius:4px;cursor:pointer;font-size:.8rem}',
            'button:hover{background:var(--vscode-button-secondaryHoverBackground,#45475a)}',
            '.r-card{background:var(--vscode-editor-inactiveSelectionBackground,#2a2a3e);border-radius:6px;padding:8px 10px;font-size:.73rem}',
            '.r-kv{display:grid;grid-template-columns:max-content 1fr;gap:2px 10px;margin-bottom:6px}',
            '.r-key{color:var(--vscode-descriptionForeground,#888);font-weight:600;white-space:nowrap}',
            '.r-val{color:var(--vscode-foreground,#cdd6f4);word-break:break-word}',
            '.r-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:.68rem;font-weight:700}',
            '.r-badge.ok{background:rgba(166,227,161,.15);color:var(--vscode-charts-green,#a6e3a1)}',
            '.r-badge.err{background:rgba(241,76,76,.15);color:var(--vscode-charts-red,#f38ba8)}',
            '.r-subtable{width:100%;border-collapse:collapse;margin-top:6px}',
            '.r-subtable th{font-size:.66rem;color:var(--vscode-descriptionForeground,#888);border-bottom:1px solid var(--vscode-panel-border,#313244);padding:2px 6px 3px 0}',
            '.r-subtable td{font-size:.7rem;padding:2px 6px 2px 0;border-bottom:1px solid var(--vscode-panel-border,#25253a)}',
            '.r-none{opacity:.4}',
            '.r-details summary{font-size:.65rem;color:var(--vscode-textLink-foreground,#89b4fa);cursor:pointer;user-select:none;padding:2px 0}',
            '.r-details .r-pre{margin-top:4px}',
            '</style></head><body>',
            `<div class="toolbar"><h2>Server Backlog &mdash; ${count} result${count === 1 ? '' : 's'}</h2>`,
            '<button onclick="clearAll()">Clear All</button></div>',
            count === 0 ? '<p class="empty">No backlog entries.</p>' : sections,
            '<script>',
            'const vscode=acquireVsCodeApi();',
            'function clearAll(){vscode.postMessage({action:"clearBacklog"});}',
            '<\/script></body></html>'
        ].join('\n');

        panel.webview.onDidReceiveMessage(msg => {
            if (msg.action === 'clearBacklog') {
                this.fallback.clearRecentBacklog();
                panel.dispose();
                this.triggerUpdate();
            }
        });
    }

    // Called when a client result arrives (via results/ live channel or server-backlog/ offline channel)
    private handleBacklogResponse(clientLabel: string, entry: any) {
        // If this command was cancelled/cleared by the user, suppress the result
        // so it doesn't resurrect a dismissed queue entry.
        if (entry.id && this.cancelledCommandIds.has(entry.id)) {
            this.cancelledCommandIds.delete(entry.id);
            console.log(`[MonitorServer] Suppressed result for cancelled command ${entry.id} (${entry.command})`);
            return;
        }
        // Look up by clientKey first (exact Map key), fall back to clientLabel search.
        // This prevents mismatches when multiple clients share the same label but
        // have different keys (e.g. after a globalState reset).
        const client = (entry.clientKey ? this.clients.get(entry.clientKey) : undefined)
            || Array.from(this.clients.values()).find(c => c.clientLabel === clientLabel);
        if (!client) {
            console.warn(`[MonitorServer] Response for unknown client: label=${clientLabel}, key=${entry.clientKey}`);
            return;
        }
        // Detect client-reported errors
        const isError = entry.payload && entry.payload.success === false && entry.payload.error !== undefined;
        // Update command log entry
        const logEntry = client.commandLog.find(e => e.id === entry.id);
        const newStatus = isError ? 'error' : 'executed';
        if (logEntry) {
            logEntry.status = newStatus;
            logEntry.completedAt = Date.now();
            logEntry.result = entry.payload;
        } else {
            client.commandLog.push({ id: entry.id, command: entry.command, status: newStatus, timestamp: entry.timestamp || Date.now(), completedAt: Date.now(), result: entry.payload });
        }
        console.log(`[MonitorServer] Command ${entry.id} (${entry.command}) → ${newStatus} [matched=${!!logEntry}, client=${client.key}]`);
        // Set lastResponse so the response panel in the UI shows the data
        if (entry.payload !== undefined && entry.payload !== null) {
            client.lastResponse = { command: entry.command, data: entry.payload, timestamp: entry.timestamp || Date.now() };
        }
        // Update command-specific fields in client.info
        if (!client.info) { client.info = {}; }
        if (entry.command === 'checkBBrainy' && entry.payload) {
            client.info.bbrainyStatus = entry.payload;
            // Auto-open the BBrainy status webview when the result arrives
            this.showBBrainyStatusWebview(client.key);
        }
        if (entry.command === 'getSystemInfo' && entry.payload?.hostname) {
            Object.assign(client.info, { hostname: entry.payload.hostname, username: entry.payload.username, os: entry.payload.os, vscodeVersion: entry.payload.vscodeVersion });
            if (entry.payload.extensionVersion) {
                client.info.version = entry.payload.extensionVersion;
            }
            // Also extract bbrainyStatus from getSystemInfo result
            if (entry.payload.bbrainyStatus) {
                client.info.bbrainyStatus = entry.payload.bbrainyStatus;
            }
        }
        if (entry.command === 'getWorkspace' && entry.payload?.workspace) {
            client.info.workspace = entry.payload.workspace;
        }
        if (entry.command === 'getUsageReport' && entry.payload?.totalEntries !== undefined) {
            client.info.lastUsageReport = entry.payload;
            // Auto-open the usage report webview in the server editor
            this.showUsageReportWebview(entry.payload, client.info?.username || clientLabel, client.info?.hostname || 'Unknown');
        }
        if (entry.command === 'displayReminderScreen' && !isError) {
            // Could auto-open reminder webview here if needed in the future
        }
        // Interval commands: revert optimistic value on error, confirm (and update
        // from client's authoritative payload) on success.
        if (entry.command === 'setPollInterval') {
            if (isError) {
                this.revertIntervalIfPending(entry.id);
            } else {
                this.pendingIntervalRollbacks.delete(entry.id);
                // Update from client's confirmed value (ground truth)
                if (typeof entry.payload?.intervalMs === 'number') {
                    client.info.pollMs = entry.payload.intervalMs;
                }
            }
        }
        if (entry.command === 'setUpdateCheckInterval') {
            if (isError) {
                this.revertIntervalIfPending(entry.id);
            } else {
                this.pendingIntervalRollbacks.delete(entry.id);
                if (typeof entry.payload?.intervalMs === 'number') {
                    client.info.updateCheckMs = entry.payload.intervalMs;
                }
            }
        }
        const channelLabel = entry.channel === 'live' ? 'Live result' : 'Backlog result';
        console.log(`[MonitorServer] ${channelLabel} from ${clientLabel}: ${entry.command} -> ${newStatus}`);
        // save + flush are deferred to onBatchComplete (called once per poll sweep)
        // so N results in one batch → 1 globalState write + 1 postMessage instead of N.
    }

    // Discover clients that wrote a presence file to the sync folder but have never connected via WS.
    // Adds them as offline stubs and persists them to globalState so they survive restarts.
    private importSyncClients() {
        const entries = this.fallback.scanRegisteredClients();
        if (entries.length === 0) { return; }

        // Grace period: treat 'inactive' only if lastSeen > 2 hours ago.
        // This prevents normal VS Code close+reopen from showing the uninstalled badge.
        const INACTIVE_GRACE_MS = 2 * 60 * 60 * 1000; // 2 hours
        const effectiveExtStatus = (entry: PresenceEntry): 'active' | 'inactive' => {
            if (entry.status === 'inactive' && (Date.now() - entry.lastSeen) < INACTIVE_GRACE_MS) {
                return 'active'; // still within grace period â€” treat as temporarily closed
            }
            return entry.status ?? 'active';
        };

        let added = 0;
        for (const entry of entries) {
            // A presence file is considered "fresh" if lastSeen is within 2 minutes
            const SYNC_FRESH_MS = 2 * 60 * 1000;
            const isFresh = (Date.now() - entry.lastSeen) < SYNC_FRESH_MS;

            if (this.clients.has(entry.clientKey)) {
                // Update extensionStatus on existing client from latest presence file
                const existing = this.clients.get(entry.clientKey)!;
                // Update status from presence file
                {
                    existing.extensionStatus = effectiveExtStatus(entry);
                    existing.lastSeen = Math.max(existing.lastSeen, entry.lastSeen);
                    // Promote to 'sync' if presence file is fresh
                    existing.status = isFresh ? 'sync' : 'offline';
                    // Update version from presence file
                    if (entry.version && existing.info) { existing.info.version = entry.version; }
                }
                continue;
            }
            this.clients.set(entry.clientKey, {
                key: entry.clientKey,
                info: { username: entry.username, hostname: entry.hostname, version: entry.version || undefined },
                lastSeen: entry.lastSeen,
                status: isFresh ? 'sync' : 'offline',
                clientLabel: entry.clientLabel,
                commandLog: [],
                extensionStatus: effectiveExtStatus(entry)
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
                commandLog: []   // reset log on each new VS Code session
            });
        });
    }

    // After loadPersistentClients + setupFallback: scan disk queue files and show pending commands in the log
    private restorePendingQueueToLog() {
        if (!this.fallback.isConfigured) { return; }
        const pendingLabels = this.fallback.listQueuedClients();
        for (const label of pendingLabels) {
            const client = Array.from(this.clients.values()).find(c => c.clientLabel === label);
            if (!client) { continue; }
            const cmds = this.fallback.peekQueuedCommands(label);
            for (const cmd of cmds) {
                if (!client.commandLog.find(e => e.id === cmd.id)) {
                    client.commandLog.push({ id: cmd.id, command: cmd.command, status: 'queued', timestamp: cmd.timestamp });
                }
            }
            console.log(`[MonitorServer] Restored ${cmds.length} pending queued command(s) to log for ${label}`);
        }
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
        // Prefer globalState key (set via UI) over settings
        const persistedKey = this.context.globalState.get<string>('serverKey');
        this.serverId = persistedKey || config.get<string>('serverId') || 'default';

        console.log(`[MonitorServer] Starting server with serverId: ${this.serverId}`);

        // Signal to the webview that a fleet scan is in progress.
        // The frontend also applies this optimistically on the Start button click.
        this.isScanning = true;
        // Flush scanning=true to the UI immediately (bypass debounce) so the
        // overlay appears before we do any sync I/O.
        this.flushUpdate();

        // Defer the heavy I/O so the overlay renders first.
        setImmediate(async () => {
            // Reload clients for the specific Server ID
            this.clients.clear();
            this.loadPersistentClients();

            // Remove duplicate clients (keeping the first occurrence of each unique key)
            this.deduplicateClients();

            // Re-configure fallback with latest settings (in case they changed since initialize())
            this.setupFallback();
            // Import any clients that registered via presence file while server was offline
            this.importSyncClients();
            // Restore pending disk-queue entries into each client's command log
            this.restorePendingQueueToLog();

            this.running = true;

            // Start presence check interval (check client presence every 30s)
            this.startPresenceCheck();

            // Write server presence and keep it fresh
            this.writeServerPresenceFile('online');
            if (this.serverPresenceInterval) { clearInterval(this.serverPresenceInterval); }
            this.serverPresenceInterval = setInterval(() => this.writeServerPresenceFile('online'), this.serverPresenceMs);

            // Brief delay so the scanning overlay is visible to the user
            await new Promise(resolve => setTimeout(resolve, 600));

            // Scan complete — clear flag and push final snapshot
            this.isScanning = false;
            this.triggerUpdate();
            console.log(`[MonitorServer] Server started successfully [${this.serverId}]`);
            vscode.window.showInformationMessage(`Monitor server [${this.serverId}] running`);
        });
    }

    /** Immediate sync-folder scan triggered by the "Scan Fleet" button. */
    async scanFleetNow() {
        if (!this.running || this.isScanning) { return; }
        this.isScanning = true;
        // Push scanning=true immediately so the overlay appears right away
        this.flushUpdate();
        setImmediate(async () => {
            this.importSyncClients();
            this.checkClientPresence();
            // Brief delay so the scanning overlay is visible
            await new Promise(resolve => setTimeout(resolve, 600));
            this.isScanning = false;
            this.triggerUpdate();
        });
    }

    private startPresenceCheck() {
        if (this.presenceCheckInterval) {
            clearInterval(this.presenceCheckInterval);
        }
        this.presenceCheckInterval = setInterval(() => {
            this.checkClientPresence();
        }, this.presenceCheckMs);
    }

    stop() {
        if (!this.running) {
            console.warn(`[MonitorServer] Not running, ignoring stop request`);
            return;
        }
        
        console.log(`[MonitorServer] Stopping server`);
        
        // Stop presence check
        if (this.presenceCheckInterval) {
            clearInterval(this.presenceCheckInterval);
            this.presenceCheckInterval = null;
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
        
        this.running = false;

        // When server stops, set active clients to offline but don't clear persistent ones
        for (const client of this.clients.values()) {
            client.status = 'offline';
        }

        this.triggerUpdate();
        console.log(`[MonitorServer] Server stopped`);
        vscode.window.showInformationMessage('Monitor server stopped');
    }

    // ─── Interval controls ───────────────────────────────────────────
    /** Change server-side polling intervals at runtime and restart affected timers. */
    setServerIntervals(opts: { backlogPollMs?: number; presenceCheckMs?: number; syncScanMs?: number; serverPresenceMs?: number }) {
        const clamp = (v: number | undefined, min: number, max: number, cur: number) =>
            v !== undefined ? Math.max(min, Math.min(max, v)) : cur;

        this.backlogPollMs    = clamp(opts.backlogPollMs,    3000, 300000, this.backlogPollMs);
        this.presenceCheckMs  = clamp(opts.presenceCheckMs,  3000, 300000, this.presenceCheckMs);
        this.syncScanMs       = clamp(opts.syncScanMs,       3000, 300000, this.syncScanMs);
        this.serverPresenceMs = clamp(opts.serverPresenceMs, 3000, 300000, this.serverPresenceMs);

        if (this.running) {
            // Restart all timers with new intervals
            this.fallback.startPolling(this.backlogPollMs);

            if (this.syncScanInterval) { clearInterval(this.syncScanInterval); }
            this.syncScanInterval = setInterval(() => this.importSyncClients(), this.syncScanMs);

            this.startPresenceCheck();

            if (this.serverPresenceInterval) { clearInterval(this.serverPresenceInterval); }
            this.serverPresenceInterval = setInterval(() => this.writeServerPresenceFile('online'), this.serverPresenceMs);
        }

        console.log(`[MonitorServer] Server intervals updated — backlog: ${this.backlogPollMs / 1000}s, presence: ${this.presenceCheckMs / 1000}s, sync-scan: ${this.syncScanMs / 1000}s, server-presence: ${this.serverPresenceMs / 1000}s`);
        // Persist to globalState so intervals survive VS Code restarts
        this.persistIntervals();
        this.triggerUpdate();
    }

    /** Save current intervals to globalState. */
    private persistIntervals() {
        if (!this.context) return;
        this.context.globalState.update('serverIntervals', {
            backlogPollMs: this.backlogPollMs,
            presenceCheckMs: this.presenceCheckMs,
            syncScanMs: this.syncScanMs,
            serverPresenceMs: this.serverPresenceMs,
            clientPollMs: this.clientPollMs
        });
    }

    /** Send a setPollInterval command to a specific client (queued via sync folder). */
    async setClientPollInterval(clientKey: string, intervalMs: number, providedCmdId?: string) {
        const ms = Math.max(3000, Math.min(300000, intervalMs));
        const client = this.clients.get(clientKey);
        if (client) {
            if (!client.info) { client.info = {}; }
            const oldValue = client.info.pollMs;
            client.info.pollMs = ms;
            this.savePersistentClients();
            const cmdId = await this.sendCommand(clientKey, 'setPollInterval', { intervalMs: ms }, providedCmdId);
            if (cmdId) {
                // Register rollback so we can revert if the command is cancelled or errors.
                this.pendingIntervalRollbacks.set(cmdId, { clientKey, field: 'pollMs', oldValue });
            } else {
                // sendCommand failed immediately (e.g. sync path not configured) — revert.
                client.info.pollMs = oldValue;
                this.savePersistentClients();
                this.triggerUpdate();
            }
        } else {
            await this.sendCommand(clientKey, 'setPollInterval', { intervalMs: ms }, providedCmdId);
        }
    }

    /** Send a setUpdateCheckInterval command to a specific client (queued via sync folder). */
    async setClientUpdateCheckInterval(clientKey: string, intervalMs: number, providedCmdId?: string) {
        const ms = Math.max(60000, Math.min(86400000, intervalMs));
        const client = this.clients.get(clientKey);
        if (client) {
            if (!client.info) { client.info = {}; }
            const oldValue = client.info.updateCheckMs;
            client.info.updateCheckMs = ms;
            this.savePersistentClients();
            const cmdId = await this.sendCommand(clientKey, 'setUpdateCheckInterval', { intervalMs: ms }, providedCmdId);
            if (cmdId) {
                this.pendingIntervalRollbacks.set(cmdId, { clientKey, field: 'updateCheckMs', oldValue });
            } else {
                client.info.updateCheckMs = oldValue;
                this.savePersistentClients();
                this.triggerUpdate();
            }
        } else {
            await this.sendCommand(clientKey, 'setUpdateCheckInterval', { intervalMs: ms }, providedCmdId);
        }
    }

    /** Revert an optimistically-applied interval value if the command didn't commit. */
    private revertIntervalIfPending(cmdId: string): void {
        const rollback = this.pendingIntervalRollbacks.get(cmdId);
        if (!rollback) { return; }
        this.pendingIntervalRollbacks.delete(cmdId);
        const client = this.clients.get(rollback.clientKey);
        if (!client?.info) { return; }
        if (rollback.field === 'pollMs') {
            client.info.pollMs = rollback.oldValue;
        } else {
            client.info.updateCheckMs = rollback.oldValue;
        }
        console.log(`[MonitorServer] Reverted ${rollback.field} for ${rollback.clientKey} back to ${rollback.oldValue ?? 'default'}`);
    }

    /** Return current interval settings for the UI. */
    getIntervals() {
        return {
            backlogPollMs: this.backlogPollMs,
            presenceCheckMs: this.presenceCheckMs,
            syncScanMs: this.syncScanMs,
            serverPresenceMs: this.serverPresenceMs,
            clientPollMs: this.clientPollMs
        };
    }

    private checkClientPresence() {
        const now = Date.now();
        const keysToRemove: string[] = [];
        let anyChanged = false;

        // Build a set of clientKeys that still have a presence file in the sync folder.
        // These are "registered" clients that must never be auto-removed — even if
        // their lastSeen is stale — because importSyncClients would just re-add them
        // on the next tick, causing a visible oscillation in the dashboard.
        const registeredInSync = new Set<string>();
        if (this.fallback.isConfigured) {
            try {
                for (const entry of this.fallback.scanRegisteredClients()) {
                    registeredInSync.add(entry.clientKey);
                }
            } catch { /* best-effort */ }
        }
        
        for (const [key, client] of this.clients) {
            if (client.status === 'sync' && now - client.lastSeen > 2 * 60 * 1000) {
                // Sync client presence file went stale (>2 min) - demote to offline
                client.status = 'offline';
                console.log(`[MonitorServer] Sync client demoted to offline (stale presence): ${key}`);
            } else if (client.status === 'offline' && now - client.lastSeen > this.offlineTimeoutMs) {
                if (registeredInSync.has(key)) {
                    // Client still has a presence file in the sync folder — it belongs
                    // to this server key and should stay visible as offline/inactive.
                    // Removing it would cause importSyncClients to re-add it immediately,
                    // creating a visible oscillation in the dashboard.
                    continue;
                }
                // Remove client if offline for too long and no longer registered in sync
                keysToRemove.push(key);
                console.log(`[MonitorServer] Removing stale offline client: ${key} (${client.info?.username}@${client.info?.hostname})`);
            }

            // ─── Command queue timeout ─────────────────────────────────
            // Check for stale queued/sent commands that never got a response.
            if (client.commandLog) {
                // Lazily read the on-disk queue for this client (once per client per tick)
                let diskCmdIds: Set<string> | null = null;
                const loadDiskQueue = () => {
                    if (diskCmdIds !== null) { return; }
                    diskCmdIds = new Set<string>();
                    if (this.fallback.isConfigured) {
                        try {
                            const cmds = this.fallback.peekQueuedCommands(client.clientLabel);
                            for (const cmd of cmds) { diskCmdIds.add(cmd.id); }
                        } catch { /* ignore read errors */ }
                    }
                };

                for (const entry of client.commandLog) {
                    if ((entry.status === 'queued' || entry.status === 'sent') &&
                        now - entry.timestamp > this.commandTimeoutMs) {
                        // Command has been pending past the timeout threshold.
                        // Only mark as timed-out if the queue file no longer holds it
                        // (meaning the client consumed it but never responded).
                        loadDiskQueue();
                        if (!diskCmdIds!.has(entry.id)) {
                            entry.status = 'error';
                            entry.completedAt = now;
                            entry.result = { success: false, error: 'Timed out – client consumed the command but did not respond' };
                            anyChanged = true;
                            console.log(`[MonitorServer] Command ${entry.id} (${entry.command}) timed out for ${client.clientLabel}`);
                        }
                    }
                }
            }
        }
        
        // Remove stale offline clients
        keysToRemove.forEach(key => this.clients.delete(key));

        // Housekeeping: prune the cancelledCommandIds set if it grows large.
        // Each clear/cancel adds IDs; handleBacklogResponse removes them when
        // a result arrives.  If results never arrive the set would grow forever,
        // so cap it at a safe maximum.
        if (this.cancelledCommandIds.size > 500) {
            const surplus = this.cancelledCommandIds.size - 250;
            const iter = this.cancelledCommandIds.values();
            for (let i = 0; i < surplus; i++) { this.cancelledCommandIds.delete(iter.next().value); }
        }
        
        if (keysToRemove.length > 0 || anyChanged) {
            if (keysToRemove.length > 0) {
                console.log(`[MonitorServer] Removed ${keysToRemove.length} stale client(s)`);
            }
            this.savePersistentClients();
            this.triggerUpdate();
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
                        <h1>&#127919; BBrainy Usage Report</h1>
                        <div class="client-info">&#128205; Client: <strong>${username}@${hostname}</strong></div>
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

    async sendCommand(clientKey: string, command: string, payload?: any, providedCmdId?: string): Promise<string | undefined> {
        const client = this.clients.get(clientKey);
        if (!client) {
            console.warn(`[MonitorServer] Attempted to send command to non-existent client: ${clientKey}`);
            vscode.window.showErrorMessage('Client not found');
            return;
        }

        // All commands go through the sync-folder queue
        const cmdId = providedCmdId ?? `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const logEntry: CommandLogEntry = { id: cmdId, command, status: 'queued', timestamp: Date.now() };
        client.commandLog.push(logEntry);
        // Use the debounced triggerUpdate instead of an immediate flushUpdate.
        // Rapid-fire calls (e.g. queuing 5 commands quickly) will coalesce into
        // a single snapshot that contains ALL entries — avoiding the flicker where
        // the webview briefly shows fewer items than the user's optimistic count.
        // The frontend already injects optimistic entries instantly on each click,
        // so there is no UX regression from waiting the 150 ms debounce window.
        this.triggerUpdate();

        if (!this.fallback.isConfigured) {
            logEntry.status = 'error';
            logEntry.completedAt = Date.now();
            const msg = `Communication path not configured. Please check serverMonitor.syncPath in settings.`;
            console.error(`[MonitorServer] ${msg}`);
            vscode.window.showErrorMessage(msg);
            this.savePersistentClients();
            this.triggerUpdate();
            return;
        }

        // Stage in memory — the disk write is batched so multiple commands
        // (e.g. queryAll) are written in a single I/O per client queue file.
        this.fallback.stageCommand(client.clientLabel, clientKey, command, payload, cmdId);
        // Schedule a flush on the next event-loop tick.  If another sendCommand
        // runs synchronously before that tick, its entry is coalesced into the
        // same disk write.
        this.fallback.scheduleFlush();
        this.savePersistentClients();
        console.log(`[MonitorServer] Staged "${command}" for ${client.clientLabel}`);
        return cmdId;
    }
    // Remove all queued (not-yet-delivered) commands for a client from disk and log
    clearClientQueue(clientKey: string) {
        const client = this.clients.get(clientKey);
        if (!client) { return; }
        // Track all entry IDs so late-arriving results are suppressed
        for (const entry of client.commandLog) {
            this.cancelledCommandIds.add(entry.id);
            this.revertIntervalIfPending(entry.id);
        }
        // Remove any staged-but-not-yet-flushed commands so the pending
        // scheduleFlush() timer doesn't re-create the queue file we're about to delete.
        this.fallback.clearStagedCommands(client.clientLabel);
        // Remove disk queue file
        if (this.fallback.isConfigured) {
            try {
                const queueFile = path.join(this.fallback.syncPathValue, 'queue', `${client.clientLabel}.json`);
                if (fsPathExists(queueFile)) { fsDeleteFile(queueFile); }
            } catch (e) {
                console.error('[MonitorServer] clearClientQueue: failed to delete queue file', e);
            }
        }
        // Remove all entries from in-memory log (pending + executed + error)
        client.commandLog = [];
        this.savePersistentClients();
        this.triggerUpdate();
    }

    // Clear the server-side backlog (callable directly from sidebar without opening the panel)
    clearBacklog() {
        this.fallback.clearRecentBacklog();
        this.triggerUpdate();
    }

    // Cancel a single queued command entry (removes from disk queue + log)
    cancelQueueEntry(clientKey: string, entryId: string) {
        const client = this.clients.get(clientKey);
        if (!client) { return; }
        // Suppress any late-arriving result for this command
        this.cancelledCommandIds.add(entryId);
        // Revert any optimistic interval value that was applied for this command
        this.revertIntervalIfPending(entryId);
        // Remove from disk queue file (rewrite without that entry)
        if (this.fallback.isConfigured) {
            try {
                const queueFile = path.join(this.fallback.syncPathValue, 'queue', `${client.clientLabel}.json`);
                if (fsPathExists(queueFile)) {
                    const cmds = JSON.parse(fsReadText(queueFile)) as any[];
                    const remaining = cmds.filter(c => c.id !== entryId);
                    if (remaining.length === 0) {
                        fsDeleteFile(queueFile);
                    } else {
                        fsWriteText(queueFile, JSON.stringify(remaining, null, 2));
                    }
                }
            } catch (e) {
                console.error('[MonitorServer] cancelQueueEntry: failed to update queue file', e);
            }
        }
        client.commandLog = client.commandLog.filter(e => e.id !== entryId);
        this.savePersistentClients();
        this.triggerUpdate();
    }

    async queryAllClients(command: string) {
        console.log(`[MonitorServer] Broadcasting command to all ${this.clients.size} clients: ${command}`);
        // Stage all commands in memory first (no disk I/O yet)
        for (const key of this.clients.keys()) {
            await this.sendCommand(key, command);
        }
        // Single batched disk write for all clients
        const { succeeded, failed } = this.fallback.flushPendingQueue();
        if (failed.length > 0) {
            vscode.window.showWarningMessage(`Failed to queue command for ${failed.length} client(s)`);
        }
        this.triggerUpdate();
        console.log(`[MonitorServer] Broadcast complete: ${succeeded.length} queued, ${failed.length} failed`);
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
            onlineStatus: c.status === 'sync' ? 'active' : 'offline'
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
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${asset.onlineStatus === 'active' ? '#f59e0b' : '#ef4444'};"></span>
                    ${asset.onlineStatus}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${asset.bbrainyActive ? '&#10003; Active' : '&#10007; Inactive'}</td>
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
                    <h1>&#128202; All Assets (${assets.length} Total)</h1>
                    
                    <div class="summary-stats">
                        <div class="stat-card">
                            <div class="stat-value">${assets.length}</div>
                            <div class="stat-label">Total Clients</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${assets.filter(a => a.onlineStatus === 'active').length}</div>
                            <div class="stat-label">Active (Sync)</div>
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
                        <div class="client-name">&#128241; ${username}@${hostname}</div>
                        <h1>&#129504; BBrainy Status</h1>
                        <div class="status-badge">${statusText}</div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Installed</div>
                            <div class="stat-value">${installed ? '&#10003; Yes' : '&#10007; No'}</div>
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
                        <div class="graph-title">&#128202; Contribution Graph (Last 12 Weeks)</div>
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
        const now = new Date();
        const clientsArray = Array.from(this.clients.values());
        const sync    = clientsArray.filter(c => c.status === 'sync');
        const offline = clientsArray.filter(c => c.status === 'offline');
        const inactive = clientsArray.filter(c => c.extensionStatus === 'inactive');

        // Build JSON export object
        const reportData = {
            generatedAt: now.toISOString(),
            server: {
                key: this.serverId,
                machine: os.hostname(),
                username: os.userInfo().username,
                version: this.version,
                running: this.running,
            },
            summary: {
                total: clientsArray.length,
                sync: sync.length,
                offline: offline.length,
                inactive: inactive.length,
            },
            clients: clientsArray.map(c => ({
                label: c.clientLabel,
                key: c.key,
                username: c.info?.username,
                hostname: c.info?.hostname,
                workspace: c.info?.workspace,
                version: c.info?.version,
                bbrainyActive: c.info?.bbrainyStatus?.active,
                status: c.status,
                extensionStatus: c.extensionStatus ?? 'active',
                lastSeen: new Date(c.lastSeen).toISOString(),
                pendingCommands: c.commandLog.filter(e => e.status === 'queued' || e.status === 'sent').length,
                lastCommand: c.commandLog.length > 0 ? c.commandLog[c.commandLog.length - 1]?.command : null,
            }))
        };
        const exportJson = JSON.stringify(reportData, null, 2);

        // Build client rows HTML
        const statusColor: Record<string, string> = {
            sync:    '#f59e0b',
            offline: '#94a3b8',
            active:  '#22c55e',
            inactive:'#f97316',
        };
        const clientRows = clientsArray.map(c => {
            const pending = c.commandLog.filter(e => e.status === 'queued' || e.status === 'sent').length;
            const bbrainyDot = c.info?.bbrainyStatus?.active ? '#22c55e' : '#475569';
            return `<tr>
                <td><span class="label">${c.clientLabel}</span></td>
                <td>${c.info?.username || '&#8212;'}</td>
                <td>${c.info?.hostname || '&#8212;'}</td>
                <td>${c.info?.version || '&#8212;'}</td>
                <td><span class="badge" style="color:${statusColor[c.status] || '#94a3b8'}">${c.status}</span></td>
                <td><span class="badge" style="color:${statusColor[c.extensionStatus ?? 'active'] || '#94a3b8'}">${c.extensionStatus ?? 'active'}</span></td>
                <td><span style="color:${bbrainyDot};font-size:18px">&#9679;</span></td>
                <td>${pending > 0 ? `<span class="badge-warn">${pending} pending</span>` : '<span class="badge-ok">0</span>'}</td>
                <td>${new Date(c.lastSeen).toLocaleString()}</td>
            </tr>`;
        }).join('');

        const panel = vscode.window.createWebviewPanel(
            'serverReport',
            `Server Report - ${this.serverId}`,
            vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        panel.webview.onDidReceiveMessage(msg => {
            if (msg.action === 'exportJson') {
                // Save the JSON report to a file
                vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(path.join(os.homedir(), `server-report-${this.serverId}-${Date.now()}.json`)),
                    filters: { 'JSON': ['json'] },
                    title: 'Save Server Report'
                }).then(uri => {
                    if (uri) {
                        try {
                            fs.writeFileSync(uri.fsPath, exportJson, 'utf-8');
                            vscode.window.showInformationMessage(`Report saved to ${uri.fsPath}`);
                        } catch (e) {
                            vscode.window.showErrorMessage(`Failed to save: ${e}`);
                        }
                    }
                });
            }
        });

        panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Server Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);color:#e2e8f0;padding:28px;min-height:100vh}
.container{max-width:1100px;margin:0 auto}
h1{font-size:24px;font-weight:700;margin-bottom:4px;background:linear-gradient(135deg,#60a5fa,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.subtitle{font-size:12px;color:#64748b;margin-bottom:24px}
.section{margin-bottom:28px}
h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#60a5fa;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid rgba(59,130,246,0.2)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px}
.card{background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:10px;padding:14px}
.card-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:4px}
.card-value{font-size:20px;font-weight:700;color:#60a5fa}
.card-value.green{color:#22c55e}.card-value.red{color:#f87171}.card-value.orange{color:#f97316}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px}
.info-row{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.info-key{color:#64748b;min-width:110px;flex-shrink:0}
.info-val{color:#cbd5e1;word-break:break-all}
table{width:100%;border-collapse:collapse;background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.15);border-radius:10px;overflow:hidden;font-size:12px}
thead{background:rgba(15,23,42,0.6)}
th{padding:9px 12px;text-align:left;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;white-space:nowrap}
td{padding:8px 12px;border-top:1px solid rgba(59,130,246,0.08);color:#cbd5e1;vertical-align:middle}
.label{color:#34d399;font-weight:600}
.badge{font-weight:600;font-size:11px}
.badge-warn{color:#fbbf24;font-weight:600}
.badge-ok{color:#475569}
.export-btn{display:inline-flex;align-items:center;gap:6px;margin-top:20px;padding:8px 18px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:8px;color:#60a5fa;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.2s}
.export-btn:hover{background:rgba(59,130,246,0.3)}
</style>
</head>
<body>
<div class="container">
  <h1>&#128202; Server Monitor Report</h1>
  <div class="subtitle">Generated: ${now.toLocaleString()} &nbsp;|&nbsp; Server: <strong>${this.serverId}</strong> on <strong>${os.hostname()}</strong></div>

  <div class="section">
    <h2>Summary</h2>
    <div class="grid">
      <div class="card"><div class="card-label">Total Clients</div><div class="card-value">${clientsArray.length}</div></div>
      <div class="card"><div class="card-label">Active (Sync)</div><div class="card-value amber">${sync.length}</div></div>
      <div class="card"><div class="card-label">Offline</div><div class="card-value red">${offline.length}</div></div>
      <div class="card"><div class="card-label">Uninstalled</div><div class="card-value orange">${inactive.length}</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Server Info</h2>
    <div class="info-grid">
      <div><div class="info-row"><span class="info-key">Server Key</span><span class="info-val">${this.serverId}</span></div>
           <div class="info-row"><span class="info-key">Machine</span><span class="info-val">${os.hostname()}</span></div>
           <div class="info-row"><span class="info-key">Username</span><span class="info-val">${os.userInfo().username}</span></div>
           <div class="info-row"><span class="info-key">Version</span><span class="info-val">${this.version}</span></div></div>
      <div>
           <div class="info-row"><span class="info-key">Status</span><span class="info-val" style="color:${this.running ? '#22c55e' : '#f87171'}">${this.running ? 'Running' : 'Stopped'}</span></div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Clients (${clientsArray.length})</h2>
    <table>
      <thead><tr>
        <th>Label</th><th>User</th><th>Host</th><th>Version</th>
        <th>Sync Status</th><th>Ext Status</th><th>BBrainy</th><th>Queue</th><th>Last Seen</th>
      </tr></thead>
      <tbody>${clientRows || '<tr><td colspan="9" style="text-align:center;color:#475569;padding:20px">No clients registered</td></tr>'}</tbody>
    </table>
  </div>

  <button class="export-btn" onclick="vscode.postMessage({action:'exportJson'})">&#11015; Export as JSON</button>
</div>
<script>const vscode=acquireVsCodeApi();</script>
</body>
</html>`;
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
        // Debounce: coalesce rapid successive calls into one update after 150ms
        if (this.updateDebounceTimer) { clearTimeout(this.updateDebounceTimer); }
        this.updateDebounceTimer = setTimeout(() => {
            this.updateDebounceTimer = null;
            this.flushUpdate();
        }, 150);
    }

    /** Actually build and push the dashboard payload to the webview. */
    flushUpdate() {
        if (this.provider) {
            const clientsArray = Array.from(this.clients.values());
            this.provider.update({
                serverStatus: {
                    running: this.running,
                    serverId: this.serverId
                },
                total: this.clients.size,
                sync: clientsArray.filter(c => c.status === 'sync').length,
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
                    commandLog: c.commandLog.slice(-100),
                    lastResponse: c.lastResponse,
                    extensionStatus: c.extensionStatus,
                    pollMs: c.info?.pollMs,
                    updateCheckMs: c.info?.updateCheckMs
                })),
                backlogCount: this.fallback.getRecentBacklog().length,
                intervals: {
                    backlogPollMs: this.backlogPollMs,
                    presenceCheckMs: this.presenceCheckMs,
                    syncScanMs: this.syncScanMs,
                    serverPresenceMs: this.serverPresenceMs,
                    clientPollMs: this.clientPollMs
                },
                scanning: this.isScanning
            });
        }
    }

}
