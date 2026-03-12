import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { execSync, exec } from 'child_process';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_SERVER_KEY = 'default';
const FALLBACK_POLL_INTERVAL_MS = 15000;
const UPDATE_CHECK_INTERVAL_MS = 3600000; // 1 hour
const EXTENSION_ID = 'client-monitor';

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface FallbackCommand {
    id: string;
    command: string;
    payload?: any;
    timestamp: number;
    serverKey: string;
    clientKey?: string;
    clientLabel?: string;
}

// ─── UNC-safe filesystem helpers ─────────────────────────────────────────────────────────────
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
        // Do NOT swallow errors — callers rely on a throw to know deletion failed.
        execSync(`del /F /Q "${filePath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 5000 });
        return;
    }
    fs.unlinkSync(filePath);
}

function fsListDir(dirPath: string): string[] {
    if (isUncPath(dirPath)) {
        try {
            const out = execSync(`dir /b "${dirPath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 10000 }).toString();
            return out.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        } catch { return []; }
    }
    try { return fs.readdirSync(dirPath); } catch { return []; }
}

function fsCopyFile(src: string, dest: string): void {
    if (isUncPath(src) || isUncPath(dest)) {
        execSync(`copy /Y "${src}" "${dest}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 30000 });
        return;
    }
    fs.copyFileSync(src, dest);
}

// ─── PresenceEntry ─────────────────────────────────────────────────────────────
// Written to <syncPath>/clients/<serverKey>/<username-hostname>.json on activation.
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

// ─── GitFallbackManager ──────────────────────────────────────────────────────
// File-based fallback using a shared folder.
// Sync-folder layout:
//   <syncPath>/queue/<username-hostname>.json          — server enqueues commands here
//   <syncPath>/server-backlog/<username-hostname>.json — client writes results here when server is offline
//   <syncPath>/clients/<serverKey>/<username-hostname>.json — presence file written on activation
class GitFallbackManager {
    private pollInterval: NodeJS.Timeout | null = null;
    private fallbackPath: string = '';
    private clientKey: string = '';
    private clientLabel: string = '';
    private serverKey: string = '';
    private version: string = '1.0.0';
    private onCommand: ((cmd: FallbackCommand) => Promise<any>) | null = null;
    private pollIntervalMs: number = FALLBACK_POLL_INTERVAL_MS;
    private executedIds: Set<string> = new Set();

    configure(
        fallbackPath: string,
        clientKey: string,
        clientLabel: string,
        serverKey: string,
        version: string,
        onCommand: (cmd: FallbackCommand) => Promise<any>
    ) {
        this.fallbackPath = fallbackPath;
        this.clientKey = clientKey;
        this.clientLabel = clientLabel;
        this.serverKey = serverKey;
        this.version = version;
        this.onCommand = onCommand;
        // Write presence file immediately — this is the "installation hook"
        this.writePresenceFile();
    }

    // Write/update the presence file so the server can discover this client via sync folder
    private writePresenceFile() {
        if (!this.fallbackPath || !this.clientKey) { return; }
        try {
            const dir = path.join(this.fallbackPath, 'clients', this.serverKey);
            fsEnsureDir(dir);
            const filePath = path.join(dir, `${this.clientLabel}.json`);
            let registeredAt = Date.now();
            if (fsPathExists(filePath)) {
                try {
                    const existing: PresenceEntry = JSON.parse(fsReadText(filePath));
                    registeredAt = existing.registeredAt ?? registeredAt;
                } catch { /* keep current timestamp */ }
            }
            const entry: PresenceEntry = {
                clientLabel: this.clientLabel,
                clientKey: this.clientKey,
                serverKey: this.serverKey,
                username: os.userInfo().username,
                hostname: os.hostname(),
                version: this.version,
                registeredAt,
                lastSeen: Date.now(),
                status: 'active'
            };
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
            console.log(`[Fallback] Presence file written: ${filePath}`);
        } catch (e: any) {
            console.warn(`[Fallback] Could not write presence file: ${e?.message || e}`);
        }
    }

    // Update only lastSeen in the presence file (called on each poll cycle)
    private updatePresenceLastSeen() {
        if (!this.fallbackPath || !this.clientKey || !this.serverKey) { return; }
        try {
            const filePath = path.join(this.fallbackPath, 'clients', this.serverKey, `${this.clientLabel}.json`);
            if (!fsPathExists(filePath)) {
                // File missing — re-write the full presence entry
                this.writePresenceFile();
                return;
            }
            let entry: PresenceEntry;
            try {
                entry = JSON.parse(fsReadText(filePath));
            } catch {
                this.writePresenceFile();
                return;
            }
            entry.lastSeen = Date.now();
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
        } catch { /* silent — presence updates are best-effort */ }
    }

    // Remove the presence file from the OLD server key folder (call before reconfiguring)
    removeOldPresenceFile(oldServerKey: string) {
        if (!this.fallbackPath || !this.clientLabel || !oldServerKey) { return; }
        try {
            const oldFile = path.join(this.fallbackPath, 'clients', oldServerKey, `${this.clientLabel}.json`);
            if (fsPathExists(oldFile)) {
                fsDeleteFile(oldFile);
                console.log(`[Fallback] Removed stale presence file: ${oldFile}`);
            }
        } catch (e: any) {
            console.warn(`[Fallback] Could not remove old presence file: ${e?.message || e}`);
        }
    }

    // Mark this client as inactive in the presence file (called on extension deactivation)
    markInactive(): void {
        if (!this.fallbackPath || !this.clientKey || !this.serverKey) { return; }
        try {
            const filePath = path.join(this.fallbackPath, 'clients', this.serverKey, `${this.clientLabel}.json`);
            if (!fsPathExists(filePath)) { return; }
            let entry: PresenceEntry;
            try {
                entry = JSON.parse(fsReadText(filePath));
            } catch { return; }
            entry.status = 'inactive';
            entry.lastSeen = Date.now();
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
            console.log(`[Fallback] Marked client as inactive: ${filePath}`);
        } catch (e: any) {
            console.warn(`[Fallback] Could not mark client inactive: ${e?.message || e}`);
        }
    }

    get isConfigured(): boolean {
        return !!this.fallbackPath && !!this.clientKey;
    }

    get basePath(): string {
        return this.fallbackPath;
    }

    startPolling(intervalMs?: number) {
        this.stopPolling();
        if (!this.isConfigured) { return; }
        if (intervalMs !== undefined && intervalMs >= 3000) { this.pollIntervalMs = intervalMs; }
        // Do an immediate check, then poll
        this.checkBacklog();
        this.pollInterval = setInterval(() => this.checkBacklog(), this.pollIntervalMs);
        console.log(`[Fallback] Polling started (${this.pollIntervalMs / 1000}s): ${this.fallbackPath}`);
    }

    /** Change the poll interval at runtime (called when server sends setPollInterval command) */
    setPollInterval(ms: number) {
        if (ms < 3000) { ms = 3000; }      // floor at 3 s
        if (ms > 300000) { ms = 300000; }  // cap at 5 min
        this.pollIntervalMs = ms;
        if (this.pollInterval) { this.startPolling(); }  // restart with new interval
        console.log(`[Fallback] Poll interval changed to ${ms / 1000}s`);
    }

    get currentPollIntervalMs(): number { return this.pollIntervalMs; }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    private async checkBacklog() {
        if (!this.isConfigured || !this.onCommand) { return; }
        // Keep presence file fresh so server always sees an up-to-date lastSeen
        this.updatePresenceLastSeen();


        try {
            // Read queue file: <syncPath>/queue/<username-hostname>.json
            const queueFile = path.join(this.fallbackPath, 'queue', `${this.clientLabel}.json`);
            if (!fsPathExists(queueFile)) { return; }

            let cmds: FallbackCommand[] = [];
            try {
                cmds = JSON.parse(fsReadText(queueFile));
            } catch { return; }

            if (cmds.length === 0) { return; }

            // Filter to only commands addressed to this server — ignore stale entries from other servers.
            cmds = cmds.filter(c => !c.serverKey || c.serverKey === this.serverKey);
            if (cmds.length === 0) { return; }

            console.log(`[Fallback] Found ${cmds.length} queued command(s) for ${this.clientLabel}`);

            // Delete the queue file BEFORE executing. If deletion fails (UNC permission/network
            // error) bail out entirely — better to miss one cycle than to execute commands
            // repeatedly on every poll tick.
            try {
                fsDeleteFile(queueFile);
            } catch (delErr) {
                console.error(`[Fallback] Could not delete queue file — skipping to prevent double-execution:`, delErr);
                return;
            }
            // Extra safety: verify the file is actually gone (UNC del can succeed in the shell
            // but leave the file if a network hiccup occurs between the delete and the stat).
            if (fsPathExists(queueFile)) {
                console.warn(`[Fallback] Queue file still present after delete attempt — skipping to prevent double-execution`);
                return;
            }

            for (const cmd of cmds) {
                // Dedup: skip commands we already executed (race-condition safety)
                if (this.executedIds.has(cmd.id)) {
                    console.log(`[Fallback] Skipping duplicate command: ${cmd.command} (${cmd.id})`);
                    continue;
                }
                try {
                    console.log(`[Fallback] Executing queued command: ${cmd.command} (${cmd.id})`);
                    const result = await this.onCommand(cmd);
                    this.executedIds.add(cmd.id);
                    // Trim dedup set to last 500 entries
                    if (this.executedIds.size > 500) {
                        const first = this.executedIds.values().next().value;
                        if (first !== undefined) { this.executedIds.delete(first); }
                    }

                    this.writeServerBacklog(cmd.id, cmd.command, result);
                    console.log(`[Fallback] Wrote server-backlog entry for "${cmd.command}" (${cmd.id})`);
                } catch (e: any) {
                    // Write error response so the server knows the command failed
                    const errPayload = { success: false, error: e?.message || String(e) };
                    this.writeServerBacklog(cmd.id, cmd.command, errPayload);
                    console.error(`[Fallback] Error executing queued command ${cmd.command}:`, e);
                }
            }
        } catch (e) {
            console.error('[Fallback] Backlog check error:', e);
        }
    }

    private writeServerBacklog(commandId: string, command: string, payload: any) {
        if (!this.isConfigured) { return; }
        // Route to results/ (server online = live channel) or server-backlog/ (server offline = offline accumulation)
        const targetDir = this.isServerOnline()
            ? path.join(this.fallbackPath, 'results')
            : path.join(this.fallbackPath, 'server-backlog');
        fsEnsureDir(targetDir);
        const file = path.join(targetDir, `${this.clientLabel}.json`);
        let existing: any[] = [];
        if (fsPathExists(file)) {
            try { existing = JSON.parse(fsReadText(file)); } catch { existing = []; }
        }
        existing.push({ id: commandId, command, clientKey: this.clientKey, clientLabel: this.clientLabel, timestamp: Date.now(), payload });
        fsWriteText(file, JSON.stringify(existing, null, 2));
    }

    // Check whether the server is currently online by reading its presence file.
    // Server is considered online if its presence file has lastSeen within 90 seconds.
    private isServerOnline(): boolean {
        if (!this.fallbackPath || !this.serverKey) { return false; }
        try {
            const serversDir = path.join(this.fallbackPath, 'servers');
            if (!fsPathExists(serversDir)) { return false; }
            const files = fsListDir(serversDir).filter(f => f.endsWith('.json') && f.startsWith(this.serverKey));
            for (const file of files) {
                try {
                    const entry = JSON.parse(fsReadText(path.join(serversDir, file)));
                    if (entry.status === 'online' && (Date.now() - entry.lastSeen) < 90000) { return true; }
                } catch { }
            }
        } catch { }
        return false;
    }


}

// ─── AutoUpdateManager ───────────────────────────────────────────────────────
// Checks a shared path (same fallback folder) for newer VSIX files and installs silently.
class AutoUpdateManager {
    private checkInterval: NodeJS.Timeout | null = null;
    private currentVersion: string;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.currentVersion = context.extension?.packageJSON?.version || '1.0.0';
    }

    startChecking(fallbackPath: string) {
        this.stopChecking();
        if (!fallbackPath) { return; }
        // Check immediately, then periodically
        this.checkForUpdates(fallbackPath);
        this.checkInterval = setInterval(() => this.checkForUpdates(fallbackPath), UPDATE_CHECK_INTERVAL_MS);
        console.log(`[AutoUpdate] Checking for updates in: ${fallbackPath}`);
    }

    stopChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    private async checkForUpdates(fallbackPath: string) {
        try {
            const updatesDir = path.join(fallbackPath, 'updates');
            if (!fsPathExists(updatesDir)) { return; }

            const vsixFiles = fsListDir(updatesDir)
                .filter(f => f.endsWith('.vsix') && f.startsWith(EXTENSION_ID))
                .sort();

            if (vsixFiles.length === 0) { return; }

            // Get the latest VSIX filename, expected pattern: client-monitor-<version>.vsix
            const latest = vsixFiles[vsixFiles.length - 1];
            const versionMatch = latest.match(/(\d+\.\d+\.\d+)/);
            if (!versionMatch) { return; }

            const availableVersion = versionMatch[1];
            if (!this.isNewer(availableVersion, this.currentVersion)) { return; }

            console.log(`[AutoUpdate] New version available: ${availableVersion} (current: ${this.currentVersion})`);
            const remoteVsix = path.join(updatesDir, latest);

            // Copy VSIX locally first (UNC paths may not be accepted by VS Code install API)
            const localTmp = path.join(os.tmpdir(), latest);
            try { fsCopyFile(remoteVsix, localTmp); } catch (copyErr) {
                console.error('[AutoUpdate] Failed to copy VSIX locally:', copyErr);
                return;
            }

            try {
                await vscode.commands.executeCommand('workbench.extensions.installExtension', vscode.Uri.file(localTmp));
                console.log(`[AutoUpdate] Successfully installed ${latest}`);
                try { fs.unlinkSync(localTmp); } catch {}
                vscode.window.showInformationMessage(
                    `Client Monitor updated to v${availableVersion}. Reload to activate.`,
                    'Reload'
                ).then(choice => {
                    if (choice === 'Reload') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            } catch (installErr) {
                console.error('[AutoUpdate] Install failed:', installErr);
                try { fs.unlinkSync(localTmp); } catch {}
            }
        } catch (e) {
            console.error('[AutoUpdate] Check failed:', e);
        }
    }

    private isNewer(available: string, current: string): boolean {
        const a = available.split('.').map(Number);
        const c = current.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
            if ((a[i] || 0) > (c[i] || 0)) { return true; }
            if ((a[i] || 0) < (c[i] || 0)) { return false; }
        }
        return false;
    }
}

// ─── ClientMonitor ───────────────────────────────────────────────────────────
// Main class: manages a single server connection, git fallback, and auto-update.
class ClientMonitor {
    private clientKey: string = '';
    private serverKey: string = DEFAULT_SERVER_KEY;
    private context: vscode.ExtensionContext;
    private fallback: GitFallbackManager;
    private autoUpdater: AutoUpdateManager;
    private notifierIntervals: Map<string, NodeJS.Timeout> = new Map();
    private reminderPanels: Map<string, vscode.WebviewPanel> = new Map();
    private notifierRunningInstances: Set<string> = new Set();
    private usageLogPath: string;
    private statusBarItem: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.usageLogPath = path.join(os.homedir(), 'AppData', 'Local', 'AI4ALL_log', 'AI4ALL_log.log');
        this.fallback = new GitFallbackManager();
        this.autoUpdater = new AutoUpdateManager(context);
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'clientMonitor.statusBarMenu';
        context.subscriptions.push(this.statusBarItem);
        this.updateStatusBar('inactive');
    }

    private updateStatusBar(state: 'active' | 'inactive') {
        if (state === 'active') {
            this.statusBarItem.text = '$(cloud-download) Monitor: Active';
            this.statusBarItem.tooltip = `Sync-folder mode — server key: "${this.serverKey}"`;
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = '$(debug-disconnect) Monitor: Inactive';
            this.statusBarItem.tooltip = 'No sync path configured';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
        this.statusBarItem.show();
    }


    async initialize() {
        this.clientKey = this.getOrCreateClientKey();
        this.loadConfig();
        this.setupFallback();
        this.setupAutoUpdate();
    }

    private loadConfig() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        this.serverKey = config.get<string>('serverKey') || DEFAULT_SERVER_KEY;
    }

    private setupFallback() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const syncPath = config.get<string>('syncPath') || '';
        if (syncPath) {
            const clientLabel = `${os.userInfo().username}-${os.hostname()}`;
            const version = this.context.extension?.packageJSON?.version || '1.0.0';
            this.fallback.configure(
                syncPath,
                this.clientKey,
                clientLabel,
                this.serverKey,
                version,
                (cmd) => this.executeFallbackCommand(cmd)
            );
            this.fallback.startPolling();
            this.updateStatusBar('active');
        }
    }

    private setupAutoUpdate() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const clientReleasePath = config.get<string>('clientReleasePath') || '';
        if (clientReleasePath) {
            this.autoUpdater.startChecking(clientReleasePath);
        }
    }



    async setServerKey(newKey: string) {
        const oldKey = this.serverKey;
        this.serverKey = newKey;
        const config = vscode.workspace.getConfiguration('clientMonitor');
        await config.update('serverKey', newKey, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Server key set to: ${newKey}`);
        // Re-configure fallback: writes new presence file under clients/<newKey>/
        // and starts polling the correct queue folder
        this.setupFallback();
        // Clean up the stale presence file from the old server key folder
        if (oldKey && oldKey !== newKey) {
            this.fallback.removeOldPresenceFile(oldKey);
        }
    }



    private async executeFallbackCommand(cmd: FallbackCommand): Promise<any> {
        // Execute a command received via sync-folder and return the result directly
        return this.executeCommand(cmd.command, cmd.payload);
    }

    private async executeCommand(command: string, payload?: any): Promise<any> {
        switch (command) {
            case 'getSystemInfo':
                return await this.collectSystemInfo();
            case 'checkBBrainy':
                return this.checkBBrainyStatus();
            case 'forceBBrainy':
                return await this.activateBBrainyDirect();
            case 'setAlarm':
                this.setupAlarmDirect(payload);
                return { success: true };
            case 'getWorkspace':
                return {
                    workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                    openFiles: vscode.workspace.textDocuments.map(d => d.fileName)
                };
            case 'getUsageReport':
                return await this.getUsageReport(payload?.hours);
            case 'setNotifier':
                return this.setNotifierDirect(payload?.intervalMs);
            case 'closeNotifier':
                return this.closeNotifierDirect();
            case 'displayReminderScreen':
                this.displayReminderScreenDirect(payload);
                return { success: true, message: 'Reminder displayed' };
            case 'setPollInterval': {
                const ms = payload?.intervalMs;
                if (typeof ms === 'number' && ms >= 3000) {
                    this.fallback.setPollInterval(ms);
                    return { success: true, intervalMs: this.fallback.currentPollIntervalMs };
                }
                return { success: false, error: 'intervalMs must be >= 3000' };
            }
            case 'getAssets':
                return { acknowledged: true };
            default:
                return { error: 'Unknown command', command };
        }
    }

    private async collectSystemInfo() {
        return {
            hostname: os.hostname(),
            username: os.userInfo().username,
            platform: process.platform,
            vscodeVersion: vscode.version,
            workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
            extensions: vscode.extensions.all
                .filter(ext => !ext.packageJSON.isBuiltin)
                .map(ext => ({ id: ext.id, isActive: ext.isActive })),
            bbrainyStatus: this.checkBBrainyStatus()
        };
    }

    private checkBBrainyStatus() {
        const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
        let lastUsedTime = 'Unknown';
        let usageCount = 0;

        try {
            if (fs.existsSync(this.usageLogPath)) {
                const logContent = fs.readFileSync(this.usageLogPath, 'utf-8');
                const lines = logContent.split('\n').filter((l: string) => l.trim());
                if (lines.length > 0) {
                    const lastLine = lines[lines.length - 1];
                    const match = lastLine.match(/'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'/);
                    if (match) { lastUsedTime = match[1]; }
                    usageCount = lines.length;
                }
            }
        } catch { /* ignore */ }

        return {
            installed: !!bbrainy,
            active: bbrainy?.isActive || false,
            version: bbrainy?.packageJSON.version || 'Unknown',
            lastUsedTime,
            totalUsage: usageCount
        };
    }



    // ─── Direct command implementations (no conn dependency) ──────────────
    private async activateBBrainyDirect(): Promise<any> {
        const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
        if (bbrainy && !bbrainy.isActive) {
            await bbrainy.activate();
            vscode.window.showInformationMessage('BBrainy has been activated');
        }
        return { success: true, active: bbrainy?.isActive };
    }

    private setupAlarmDirect(config: any) {
        setInterval(() => {
            const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
            if (!bbrainy?.isActive) {
                vscode.window.showWarningMessage('Please activate BBrainy extension', 'Activate')
                    .then(choice => {
                        if (choice === 'Activate') { this.activateBBrainyDirect(); }
                    });
            }
        }, config?.intervalMs || 3600000);
    }

    // ── Local BBrainy Usage Report (same as BBrainyUsageAssistant) ──────────────
    async showUsageReportInteractive(): Promise<void> {
        const options = [
            { label: 'Last 24 hours', hours: 24 },
            { label: 'Last 7 days', hours: 168 },
            { label: 'All time', hours: undefined },
            { label: 'Custom...', hours: -1 }
        ];
        const picked = await vscode.window.showQuickPick(options.map(o => o.label), {
            placeHolder: 'Select time period'
        });
        if (!picked) { return; }

        let hours: number | undefined;
        let label = picked;
        if (picked === 'Custom...') {
            const input = await vscode.window.showInputBox({
                prompt: 'Enter number of hours (1-23)',
                validateInput: v => {
                    const n = parseInt(v, 10);
                    return (isNaN(n) || n < 1 || n > 23) ? 'Enter a number between 1 and 23' : null;
                }
            });
            if (!input) { return; }
            hours = parseInt(input, 10);
            label = `Last ${hours} hours`;
        } else {
            hours = options.find(o => o.label === picked)?.hours;
        }

        const data = await this.getUsageReport(hours);
        if (!data.success) {
            vscode.window.showErrorMessage(`Cannot load usage report: ${data.error}`);
            return;
        }
        this.openUsageReportWebview(data, label);
    }

    private openUsageReportWebview(usageData: any, timeframeLabel: string): void {
        const username = os.userInfo().username;
        const hostname = os.hostname();
        const panel = vscode.window.createWebviewPanel(
            'bbrainyUsageReport',
            `BBrainy Usage: ${timeframeLabel}`,
            vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        const agents: any[] = usageData.agents || [];
        const total: number = usageData.totalEntries || 0;
        const mostUsed: string = agents[0]?.name || '—';

        const agentRows = agents.map((a: any) =>
            `<tr><td><span class="agent-name">${a.name}</span></td>` +
            `<td class="count">${a.count}</td>` +
            `<td class="percentage">${a.percentage}%</td></tr>`
        ).join('');

        const chartLabels = JSON.stringify(agents.map((a: any) => a.name));
        const chartData   = JSON.stringify(agents.map((a: any) => a.count));
        const bgColors = JSON.stringify([
            'rgba(59,130,246,0.2)', 'rgba(16,185,129,0.2)', 'rgba(168,85,247,0.2)',
            'rgba(251,146,60,0.2)', 'rgba(244,63,94,0.2)',  'rgba(236,72,153,0.2)'
        ]);
        const borderColors = JSON.stringify([
            'rgba(59,130,246,1)', 'rgba(16,185,129,1)', 'rgba(168,85,247,1)',
            'rgba(251,146,60,1)', 'rgba(244,63,94,1)',  'rgba(236,72,153,1)'
        ]);
        const generatedAt = new Date().toLocaleString();

        panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>BBrainy Usage Report</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);color:#e2e8f0;padding:32px;min-height:100vh}
.container{max-width:1200px;margin:0 auto}
.header{margin-bottom:32px;border-bottom:2px solid rgba(59,130,246,0.3);padding-bottom:20px}
h1{font-size:28px;font-weight:700;margin-bottom:6px;background:linear-gradient(135deg,#60a5fa 0%,#34d399 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.client-info{font-size:13px;color:#94a3b8;margin-bottom:4px}
.timeframe{font-size:16px;color:#cbd5e1;font-weight:600;margin-bottom:4px}
.generated{font-size:11px;color:#475569}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:28px}
.stat-card{background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:18px}
.stat-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:6px}
.stat-value{font-size:26px;font-weight:700;color:#60a5fa}
.stat-value.green{color:#34d399;font-size:15px;margin-top:4px}
table{width:100%;border-collapse:collapse;background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:12px;overflow:hidden;margin-bottom:28px}
thead{background:rgba(15,23,42,0.6)}
th{padding:12px 16px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px}
th.right,td.count,td.percentage{text-align:right}
td{padding:10px 16px;border-top:1px solid rgba(59,130,246,0.1);font-size:13px}
td.count{color:#60a5fa;font-weight:700}
td.percentage{color:#64748b}
.agent-name{color:#34d399;font-weight:500}
.chart-section{background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:24px}
h2{font-size:16px;font-weight:600;color:#60a5fa;margin-bottom:16px}
#usageChart{max-height:300px}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>&#127919; BBrainy Usage Report</h1>
    <div class="client-info">&#128205; Client: <strong>${username}@${hostname}</strong></div>
    <div class="timeframe">${timeframeLabel}</div>
    <div class="generated">Generated: ${generatedAt}</div>
  </div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-label">Total Usages</div><div class="stat-value">${total}</div></div>
    <div class="stat-card"><div class="stat-label">Unique Agents</div><div class="stat-value">${agents.length}</div></div>
    <div class="stat-card"><div class="stat-label">Most Used</div><div class="stat-value green">${mostUsed}</div></div>
  </div>
  <table>
    <thead><tr><th>Agent Name</th><th class="right">Count</th><th class="right">Usage %</th></tr></thead>
    <tbody>${agentRows || '<tr><td colspan="3" style="text-align:center;color:#475569;padding:24px">No data for this period</td></tr>'}</tbody>
  </table>
  <div class="chart-section">
    <h2>Usage Distribution</h2>
    <canvas id="usageChart"></canvas>
  </div>
</div>
<script>
const ctx = document.getElementById('usageChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ${chartLabels},
    datasets: [{ label: 'Usage Count', data: ${chartData},
      backgroundColor: ${bgColors}, borderColor: ${borderColors}, borderWidth: 2 }]
  },
  options: {
    indexAxis: 'y', responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(59,130,246,0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(59,130,246,0.1)' } }
    }
  }
});
</script>
</body>
</html>`;
    }

    private async getUsageReport(hours?: number): Promise<any> {
        try {
            if (!fs.existsSync(this.usageLogPath)) {
                return { success: false, error: 'Usage log file not found', logPath: this.usageLogPath };
            }

            const logContent = fs.readFileSync(this.usageLogPath, 'utf-8');
            const lines = logContent.split('\n').filter((l: string) => l.trim());

            const now = Date.now();
            const timeFilter = hours ? hours * 3600 * 1000 : undefined;
            const usageMap = new Map<string, number>();
            let totalEntries = 0;
            let earliestEntry: number | null = null;
            let latestEntry: number | null = null;

            const logRegex = /'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', '.*?', '(.*?)', '.*?'/;

            for (const line of lines) {
                try {
                    const match = line.match(logRegex);
                    if (match && match[1] && match[2]) {
                        const entryTime = new Date(match[1]).getTime();
                        if (timeFilter && now - entryTime > timeFilter) { continue; }
                        totalEntries++;
                        usageMap.set(match[2], (usageMap.get(match[2]) || 0) + 1);
                        if (earliestEntry === null || entryTime < earliestEntry) { earliestEntry = entryTime; }
                        if (latestEntry === null || entryTime > latestEntry) { latestEntry = entryTime; }
                    } else {
                        const entry = JSON.parse(line);
                        const entryTime = new Date(entry.timestamp || entry.time).getTime();
                        if (timeFilter && now - entryTime > timeFilter) { continue; }
                        totalEntries++;
                        const agent = entry.agent || entry.name || 'Unknown';
                        usageMap.set(agent, (usageMap.get(agent) || 0) + 1);
                        if (earliestEntry === null || entryTime < earliestEntry) { earliestEntry = entryTime; }
                        if (latestEntry === null || entryTime > latestEntry) { latestEntry = entryTime; }
                    }
                } catch { continue; }
            }

            let timeframeLabel = 'All time';
            if (hours) {
                timeframeLabel = hours === 24 ? 'Last 24 hours' : hours === 168 ? 'Last 7 days' : `Last ${hours} hours`;
            }

            return {
                success: true,
                timestamp: new Date().toISOString(),
                timeframe: timeframeLabel,
                timeframeHours: hours,
                dateRange: {
                    earliest: earliestEntry ? new Date(earliestEntry).toISOString() : null,
                    latest: latestEntry ? new Date(latestEntry).toISOString() : null
                },
                totalEntries,
                agents: Array.from(usageMap.entries()).map(([agent, count]) => ({
                    name: agent, count,
                    percentage: totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(2) : '0.00'
                })).sort((a, b) => b.count - a.count)
            };
        } catch (error) {
            return { success: false, error: String(error), logPath: this.usageLogPath };
        }
    }

    private setNotifierDirect(intervalMs?: number): any {
        let interval = intervalMs || 3600000;
        const minInterval = 60000;
        const maxInterval = 120 * 60000;

        if (interval < minInterval) {
            return { success: false, message: 'Interval must be at least 1 minute', intervalMs: minInterval };
        }
        if (interval > maxInterval) {
            return { success: false, message: 'Interval cannot exceed 120 minutes', intervalMs: maxInterval };
        }

        if (this.notifierRunningInstances.has(this.serverKey)) {
            return { success: true, message: 'Notifier already active', intervalMs: interval };
        }

        this.closeNotifierDirect();
        this.notifierRunningInstances.add(this.serverKey);

        const notifierInterval = setInterval(() => {
            if (os.platform() === 'win32') {
                exec('powershell.exe -c "[console]::beep(500, 300); Start-Sleep -m 100; [console]::beep(500, 300)"');
            }
            vscode.window.showInformationMessage("Don't forget to use BBrainy for assistance!", 'OK', 'Dismiss');
        }, interval);

        this.notifierIntervals.set(this.serverKey, notifierInterval);
        return { success: true, message: 'Notifier set', intervalMs: interval };
    }

    private closeNotifierDirect(): any {
        const interval = this.notifierIntervals.get(this.serverKey);
        if (interval) {
            clearInterval(interval);
            this.notifierIntervals.delete(this.serverKey);
            this.notifierRunningInstances.delete(this.serverKey);
        }
        return { success: true, message: 'Notifier closed' };
    }

    private displayReminderScreenDirect(payload: any): void {
        const title = payload?.title || 'Reminder';
        const body = payload?.body || 'No message provided';

        const existingPanel = this.reminderPanels.get(this.serverKey);
        if (existingPanel) { existingPanel.dispose(); }

        const panel = vscode.window.createWebviewPanel(
            'reminderScreen', 'Reminder from Monitor', vscode.ViewColumn.One, { enableScripts: true }
        );

        panel.webview.html = this.getReminderScreenHtml(title, body);
        panel.onDidDispose(() => { this.reminderPanels.delete(this.serverKey); });
        this.reminderPanels.set(this.serverKey, panel);
    }

    private getReminderScreenHtml(title: string, body: string): string {
        // Sanitize inputs to prevent XSS
        const safeTitle = title.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c));
        const safeBody = body.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c));
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reminder</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            min-height: 100vh; display: flex; flex-direction: column; padding: 40px;
        }
        .header { display: flex; align-items: center; gap: 25px; margin-bottom: 50px; }
        .icon { font-size: 56px; animation: pulse 1s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        h1 { font-size: 40px; font-weight: 700; background: linear-gradient(135deg, #60a5fa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .body-area { background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8)); border: 2px solid rgba(96,165,250,0.2); border-radius: 20px; padding: 50px 45px; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 350px; backdrop-filter: blur(8px); }
        .body-text { color: #e2e8f0; font-size: 20px; line-height: 1.9; text-align: center; white-space: pre-wrap; word-wrap: break-word; }
        .info { color: #64748b; font-size: 13px; text-align: center; margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header"><div class="icon">🔔</div><h1>${safeTitle}</h1></div>
    <div class="body-area"><div class="body-text">${safeBody}</div></div>
    <div class="info">Close this window to dismiss</div>
</body>
</html>`;
    }

    private getOrCreateClientKey(): string {
        let key = this.context.globalState.get<string>('clientKey');
        if (!key) {
            key = this.generateKey();
            this.context.globalState.update('clientKey', key);
        }
        return key;
    }

    private generateKey(): string {
        const machineId = os.hostname();
        const userId = os.userInfo().username;
        return crypto.createHash('sha256').update(`${machineId}-${userId}`).digest('hex');
    }

    getInfo() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        return {
            clientKey: this.clientKey,
            serverKey: this.serverKey,
            fallbackConfigured: this.fallback.isConfigured,
            syncPath: config.get<string>('syncPath') || '',
            clientReleasePath: config.get<string>('clientReleasePath') || '',
            pollIntervalMs: this.fallback.currentPollIntervalMs
        };
    }

    cleanup(): void {
        this.fallback.markInactive();
        for (const interval of this.notifierIntervals.values()) { clearInterval(interval); }
        this.notifierIntervals.clear();
        this.fallback.stopPolling();
        this.autoUpdater.stopChecking();
        this.statusBarItem.dispose();
    }
}

// ─── Extension activation ─────────────────────────────────────────────────────
let monitor: ClientMonitor | null = null;

export function activate(context: vscode.ExtensionContext) {
    monitor = new ClientMonitor(context);
    monitor.initialize();

    // React to config changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('clientMonitor.serverKey') ||
                e.affectsConfiguration('clientMonitor.syncPath') ||
                e.affectsConfiguration('clientMonitor.clientReleasePath')) {
                monitor?.cleanup();
                monitor = new ClientMonitor(context);
                monitor.initialize();
            }
        })
    );

    // Command: Set Server Key (interactive prompt)
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.setServerKey', async () => {
            const current = vscode.workspace.getConfiguration('clientMonitor').get<string>('serverKey') || DEFAULT_SERVER_KEY;
            const key = await vscode.window.showInputBox({
                prompt: 'Enter the server key to connect to',
                value: current,
                placeHolder: 'e.g., uwb-01 or default'
            });
            if (key !== undefined && key.trim()) {
                await monitor?.setServerKey(key.trim());
            }
        })
    );

    // Command: Set Sync Path
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.setSyncPath', async () => {
            const folders = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                title: 'Select sync folder (shared/git-synced) for offline command queuing'
            });
            if (folders && folders[0]) {
                const config = vscode.workspace.getConfiguration('clientMonitor');
                await config.update('syncPath', folders[0].fsPath, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Sync path set to: ${folders[0].fsPath}`);
            }
        })
    );

    // Command: Set Client Release Path
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.setClientReleasePath', async () => {
            const folders = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                title: 'Select client-release folder for auto-updates'
            });
            if (folders && folders[0]) {
                const config = vscode.workspace.getConfiguration('clientMonitor');
                await config.update('clientReleasePath', folders[0].fsPath, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Client release path set to: ${folders[0].fsPath}`);
            }
        })
    );

    // Command: Show Status
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.showStatus', () => {
            const info = monitor?.getInfo();
            if (info) {
                vscode.window.showInformationMessage(
                    `Client Key: ${info.clientKey.substring(0, 12)}...\n` +
                    `Server Key: ${info.serverKey}\n` +
                    `Sync: ${info.syncPath || 'Not set'}\n` +
                    `Sync: ${info.syncPath || 'Not set'}\n` +
                    `Releases: ${info.clientReleasePath || 'Not set'}`
                );
            }
        })
    );

    // Status bar menu — click the status bar item
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.statusBarMenu', async () => {
            const info = monitor?.getInfo();
            const notifierActive = info ? (monitor as any)?.notifierRunningInstances?.has((monitor as any)?.serverKey) : false;

            type MenuItem = { label: string; description?: string; action: () => void | Promise<void> | Thenable<void> };
            const items: MenuItem[] = [
                {
                    label: '$(graph) Show BBrainy Usage Report',
                    description: 'View your local BBrainy usage statistics',
                    action: () => monitor?.showUsageReportInteractive()
                },
                notifierActive
                    ? {
                        label: '$(bell-slash) Close BBrainy Notifier',
                        description: 'Stop the periodic BBrainy reminder',
                        action: () => {
                            (monitor as any)?.closeNotifierDirect();
                            vscode.window.showInformationMessage('BBrainy notifier closed');
                        }
                    }
                    : {
                        label: '$(bell) Set BBrainy Notifier',
                        description: 'Set a periodic reminder to use BBrainy',
                        action: async () => {
                            const presets = [
                                { label: 'Every 30 minutes', ms: 30 * 60000 },
                                { label: 'Every 1 hour',     ms: 60 * 60000 },
                                { label: 'Every 2 hours',    ms: 120 * 60000 }
                            ];
                            const picked = await vscode.window.showQuickPick(presets.map(p => p.label), { placeHolder: 'Select reminder interval' });
                            if (!picked) { return; }
                            const ms = presets.find(p => p.label === picked)!.ms;
                            const result = (monitor as any)?.setNotifierDirect(ms);
                            vscode.window.showInformationMessage(result?.message || 'Notifier set');
                        }
                    },
                { label: '$(info) Connection Status', description: info ? `${info.serverKey} — Sync-folder mode` : 'Not initialized',
                    action: () => vscode.commands.executeCommand('clientMonitor.showStatus') },
                { label: '$(key) Change Server Key',       action: () => vscode.commands.executeCommand('clientMonitor.setServerKey') },
            ];

            const picked = await vscode.window.showQuickPick(
                items.map(i => ({ label: i.label, description: i.description, _action: i.action })),
                { placeHolder: 'BBrainy Champion — choose an action' }
            );
            if (picked) { await (picked as any)._action(); }
        })
    );

    // Command: Reset to Default Server
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.resetToDefault', async () => {
            await monitor?.setServerKey(DEFAULT_SERVER_KEY);
            vscode.window.showInformationMessage('Reset to default server key');
        })
    );

    // Command: Show BBrainy Usage Report
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.showUsageReport', async () => {
            if (!monitor) { vscode.window.showWarningMessage('Client Monitor not initialized'); return; }
            await monitor.showUsageReportInteractive();
        })
    );

    // Command: Set BBrainy Notifier
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.setNotifier', async () => {
            if (!monitor) { vscode.window.showWarningMessage('Client Monitor not initialized'); return; }
            const presets = [
                { label: 'Every 30 minutes', ms: 30 * 60000 },
                { label: 'Every 1 hour',     ms: 60 * 60000 },
                { label: 'Every 2 hours',    ms: 120 * 60000 }
            ];
            const picked = await vscode.window.showQuickPick(presets.map(p => p.label), {
                placeHolder: 'Select reminder interval'
            });
            if (!picked) { return; }
            const ms = presets.find(p => p.label === picked)!.ms;
            const result = (monitor as any).setNotifierDirect(ms);
            vscode.window.showInformationMessage(result.message || 'Notifier set');
        })
    );

    // Command: Close BBrainy Notifier
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.closeNotifier', () => {
            if (!monitor) { vscode.window.showWarningMessage('Client Monitor not initialized'); return; }
            const result = (monitor as any).closeNotifierDirect();
            vscode.window.showInformationMessage(result.message || 'Notifier closed');
        })
    );
}

export function deactivate() {
    monitor?.cleanup();
    monitor = null;
}
