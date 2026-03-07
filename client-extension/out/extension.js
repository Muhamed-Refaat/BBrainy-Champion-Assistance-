"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ws_1 = __importDefault(require("ws"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const crypto = __importStar(require("crypto"));
const child_process_1 = require("child_process");
// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_SERVER_KEY = 'default';
const HEARTBEAT_INTERVAL_MS = 30000;
const RECONNECT_INTERVAL_MS = 5000;
const FALLBACK_POLL_INTERVAL_MS = 15000;
const UPDATE_CHECK_INTERVAL_MS = 3600000; // 1 hour
const EXTENSION_ID = 'client-monitor';
// ─── UNC-safe filesystem helpers ─────────────────────────────────────────────────────────────
// VS Code's Node.js runtime (Node.js 20+) blocks fs access to UNC paths
// (\\server\share) via an internal validatePath check.  These helpers fall back
// to cmd.exe which has its own UNC network stack, bypassing the restriction.
function isUncPath(p) {
    return process.platform === 'win32' && p.startsWith('\\\\');
}
function fsEnsureDir(dirPath) {
    if (isUncPath(dirPath)) {
        try {
            (0, child_process_1.execSync)(`mkdir "${dirPath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 10000 });
        }
        catch { /* already exists */ }
        return;
    }
    fs.mkdirSync(dirPath, { recursive: true });
}
function fsPathExists(p) {
    if (isUncPath(p)) {
        try {
            (0, child_process_1.execSync)(`dir /b "${p}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 5000 });
            return true;
        }
        catch {
            return false;
        }
    }
    return fs.existsSync(p);
}
function fsReadText(filePath) {
    if (isUncPath(filePath)) {
        const tmp = path.join(os.tmpdir(), `bba-rd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
        try {
            (0, child_process_1.execSync)(`copy /Y "${filePath}" "${tmp}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 15000 });
            const data = fs.readFileSync(tmp, 'utf-8');
            try {
                fs.unlinkSync(tmp);
            }
            catch { }
            return data;
        }
        catch (e) {
            try {
                fs.unlinkSync(tmp);
            }
            catch { }
            throw e;
        }
    }
    return fs.readFileSync(filePath, 'utf-8');
}
function fsWriteText(filePath, content) {
    if (isUncPath(filePath)) {
        const tmp = path.join(os.tmpdir(), `bba-wr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
        try {
            fs.writeFileSync(tmp, content, 'utf-8');
            (0, child_process_1.execSync)(`copy /Y "${tmp}" "${filePath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 15000 });
            try {
                fs.unlinkSync(tmp);
            }
            catch { }
        }
        catch (e) {
            try {
                fs.unlinkSync(tmp);
            }
            catch { }
            throw e;
        }
        return;
    }
    fs.writeFileSync(filePath, content);
}
function fsDeleteFile(filePath) {
    if (isUncPath(filePath)) {
        try {
            (0, child_process_1.execSync)(`del /F /Q "${filePath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 5000 });
        }
        catch { }
        return;
    }
    fs.unlinkSync(filePath);
}
// ─── GitFallbackManager ──────────────────────────────────────────────────────
// File-based fallback using a shared folder.
// Sync-folder layout:
//   <syncPath>/queue/<username-hostname>.json          — server enqueues commands here
//   <syncPath>/server-backlog/<username-hostname>.json — client writes results here when server is offline
//   <syncPath>/clients/<serverKey>/<username-hostname>.json — presence file written on activation
class GitFallbackManager {
    pollInterval = null;
    fallbackPath = '';
    clientKey = '';
    clientLabel = '';
    serverKey = '';
    version = '1.0.0';
    onCommand = null;
    getIsConnected = null;
    sendResponse = null;
    configure(fallbackPath, clientKey, clientLabel, serverKey, version, onCommand, getIsConnected, sendResponse) {
        this.fallbackPath = fallbackPath;
        this.clientKey = clientKey;
        this.clientLabel = clientLabel;
        this.serverKey = serverKey;
        this.version = version;
        this.onCommand = onCommand;
        this.getIsConnected = getIsConnected;
        this.sendResponse = sendResponse;
        // Write presence file immediately — this is the "installation hook"
        this.writePresenceFile();
    }
    // Write/update the presence file so the server can discover this client via sync folder
    writePresenceFile() {
        if (!this.fallbackPath || !this.clientKey) {
            return;
        }
        try {
            const dir = path.join(this.fallbackPath, 'clients', this.serverKey);
            fsEnsureDir(dir);
            const filePath = path.join(dir, `${this.clientLabel}.json`);
            let registeredAt = Date.now();
            if (fsPathExists(filePath)) {
                try {
                    const existing = JSON.parse(fsReadText(filePath));
                    registeredAt = existing.registeredAt ?? registeredAt;
                }
                catch { /* keep current timestamp */ }
            }
            const entry = {
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
        }
        catch (e) {
            console.warn(`[Fallback] Could not write presence file: ${e?.message || e}`);
        }
    }
    // Update only lastSeen in the presence file (called on each poll cycle)
    updatePresenceLastSeen() {
        if (!this.fallbackPath || !this.clientKey || !this.serverKey) {
            return;
        }
        try {
            const filePath = path.join(this.fallbackPath, 'clients', this.serverKey, `${this.clientLabel}.json`);
            if (!fsPathExists(filePath)) {
                // File missing — re-write the full presence entry
                this.writePresenceFile();
                return;
            }
            let entry;
            try {
                entry = JSON.parse(fsReadText(filePath));
            }
            catch {
                this.writePresenceFile();
                return;
            }
            entry.lastSeen = Date.now();
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
        }
        catch { /* silent — presence updates are best-effort */ }
    }
    // Remove the presence file from the OLD server key folder (call before reconfiguring)
    removeOldPresenceFile(oldServerKey) {
        if (!this.fallbackPath || !this.clientLabel || !oldServerKey) {
            return;
        }
        try {
            const oldFile = path.join(this.fallbackPath, 'clients', oldServerKey, `${this.clientLabel}.json`);
            if (fsPathExists(oldFile)) {
                fsDeleteFile(oldFile);
                console.log(`[Fallback] Removed stale presence file: ${oldFile}`);
            }
        }
        catch (e) {
            console.warn(`[Fallback] Could not remove old presence file: ${e?.message || e}`);
        }
    }
    // Mark this client as inactive in the presence file (called on extension deactivation)
    markInactive() {
        if (!this.fallbackPath || !this.clientKey || !this.serverKey) {
            return;
        }
        try {
            const filePath = path.join(this.fallbackPath, 'clients', this.serverKey, `${this.clientLabel}.json`);
            if (!fsPathExists(filePath)) {
                return;
            }
            let entry;
            try {
                entry = JSON.parse(fsReadText(filePath));
            }
            catch {
                return;
            }
            entry.status = 'inactive';
            entry.lastSeen = Date.now();
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
            console.log(`[Fallback] Marked client as inactive: ${filePath}`);
        }
        catch (e) {
            console.warn(`[Fallback] Could not mark client inactive: ${e?.message || e}`);
        }
    }
    get isConfigured() {
        return !!this.fallbackPath && !!this.clientKey;
    }
    get basePath() {
        return this.fallbackPath;
    }
    startPolling() {
        this.stopPolling();
        if (!this.isConfigured) {
            return;
        }
        // Do an immediate check, then poll
        this.checkBacklog();
        this.pollInterval = setInterval(() => this.checkBacklog(), FALLBACK_POLL_INTERVAL_MS);
        console.log(`[Fallback] Polling started: ${this.fallbackPath}`);
    }
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }
    async checkBacklog() {
        if (!this.isConfigured || !this.onCommand) {
            return;
        }
        // Keep presence file fresh so server always sees an up-to-date lastSeen
        this.updatePresenceLastSeen();
        // When the WebSocket is live, the server owns the queue: it calls dequeueAndSend()
        // on registration and sends commands directly via WS.  If checkBacklog() also reads
        // the queue file it creates a race — one deletes it before the other can read it.
        // Skip queue processing here when connected; only use file-fallback when offline.
        if (this.getIsConnected && this.getIsConnected()) {
            return;
        }
        try {
            // Read queue file: <syncPath>/queue/<username-hostname>.json
            const queueFile = path.join(this.fallbackPath, 'queue', `${this.clientLabel}.json`);
            if (!fsPathExists(queueFile)) {
                return;
            }
            let cmds = [];
            try {
                cmds = JSON.parse(fsReadText(queueFile));
            }
            catch {
                return;
            }
            if (cmds.length === 0) {
                return;
            }
            console.log(`[Fallback] Found ${cmds.length} queued command(s) for ${this.clientLabel}`);
            // Clear the queue file immediately to avoid double-processing
            fsDeleteFile(queueFile);
            for (const cmd of cmds) {
                try {
                    console.log(`[Fallback] Executing queued command: ${cmd.command} (${cmd.id})`);
                    const result = await this.onCommand(cmd);
                    if (this.getIsConnected && this.getIsConnected() && this.sendResponse) {
                        // WS is live — send result directly
                        this.sendResponse(result, cmd.id, cmd.command);
                        console.log(`[Fallback] Sent result for "${cmd.command}" (${cmd.id}) via WebSocket`);
                    }
                    else {
                        // Server offline — write to server-backlog
                        this.writeServerBacklog(cmd.id, cmd.command, result);
                        console.log(`[Fallback] Wrote server-backlog entry for "${cmd.command}" (${cmd.id})`);
                    }
                }
                catch (e) {
                    console.error(`[Fallback] Error executing queued command ${cmd.command}:`, e);
                }
            }
        }
        catch (e) {
            console.error('[Fallback] Backlog check error:', e);
        }
    }
    writeServerBacklog(commandId, command, payload) {
        if (!this.isConfigured) {
            return;
        }
        const backlogDir = path.join(this.fallbackPath, 'server-backlog');
        fsEnsureDir(backlogDir);
        const backlogFile = path.join(backlogDir, `${this.clientLabel}.json`);
        let existing = [];
        if (fsPathExists(backlogFile)) {
            try {
                existing = JSON.parse(fsReadText(backlogFile));
            }
            catch {
                existing = [];
            }
        }
        existing.push({ id: commandId, command, clientKey: this.clientKey, clientLabel: this.clientLabel, timestamp: Date.now(), payload });
        fsWriteText(backlogFile, JSON.stringify(existing, null, 2));
    }
    gitPull() {
        if (!this.isGitRepo()) {
            return;
        }
        try {
            (0, child_process_1.execSync)('git pull --rebase --quiet', { cwd: this.fallbackPath, stdio: 'ignore', timeout: 30000 });
        }
        catch { /* non-git or no remote — ignore */ }
    }
    gitCommitAndPush(message) {
        if (!this.isGitRepo()) {
            return;
        }
        try {
            (0, child_process_1.execSync)('git add -A', { cwd: this.fallbackPath, stdio: 'ignore', timeout: 10000 });
            (0, child_process_1.execSync)(`git commit -m "${message}" --allow-empty --quiet`, { cwd: this.fallbackPath, stdio: 'ignore', timeout: 10000 });
            (0, child_process_1.execSync)('git push --quiet', { cwd: this.fallbackPath, stdio: 'ignore', timeout: 30000 });
        }
        catch { /* ignore */ }
    }
    isGitRepo() {
        return fs.existsSync(path.join(this.fallbackPath, '.git'));
    }
}
// ─── AutoUpdateManager ───────────────────────────────────────────────────────
// Checks a shared path (same fallback folder) for newer VSIX files and installs silently.
class AutoUpdateManager {
    checkInterval = null;
    currentVersion;
    context;
    constructor(context) {
        this.context = context;
        this.currentVersion = context.extension?.packageJSON?.version || '1.0.0';
    }
    startChecking(fallbackPath) {
        this.stopChecking();
        if (!fallbackPath) {
            return;
        }
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
    async checkForUpdates(fallbackPath) {
        try {
            const updatesDir = path.join(fallbackPath, 'updates');
            if (!fs.existsSync(updatesDir)) {
                return;
            }
            const vsixFiles = fs.readdirSync(updatesDir)
                .filter(f => f.endsWith('.vsix') && f.startsWith(EXTENSION_ID))
                .sort();
            if (vsixFiles.length === 0) {
                return;
            }
            // Get the latest VSIX filename, expected pattern: client-monitor-<version>.vsix
            const latest = vsixFiles[vsixFiles.length - 1];
            const versionMatch = latest.match(/(\d+\.\d+\.\d+)/);
            if (!versionMatch) {
                return;
            }
            const availableVersion = versionMatch[1];
            if (!this.isNewer(availableVersion, this.currentVersion)) {
                return;
            }
            console.log(`[AutoUpdate] New version available: ${availableVersion} (current: ${this.currentVersion})`);
            const vsixPath = path.join(updatesDir, latest);
            // Install silently using VS Code CLI
            try {
                const codePath = process.execPath; // VS Code electron path
                // Use the VS Code extension install API
                await vscode.commands.executeCommand('workbench.extensions.installExtension', vscode.Uri.file(vsixPath));
                console.log(`[AutoUpdate] Successfully installed ${latest}`);
                vscode.window.showInformationMessage(`Client Monitor updated to v${availableVersion}. Reload to activate.`, 'Reload').then(choice => {
                    if (choice === 'Reload') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            }
            catch (installErr) {
                console.error('[AutoUpdate] Install failed:', installErr);
            }
        }
        catch (e) {
            console.error('[AutoUpdate] Check failed:', e);
        }
    }
    isNewer(available, current) {
        const a = available.split('.').map(Number);
        const c = current.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
            if ((a[i] || 0) > (c[i] || 0)) {
                return true;
            }
            if ((a[i] || 0) < (c[i] || 0)) {
                return false;
            }
        }
        return false;
    }
}
// ─── MonitorConnection ───────────────────────────────────────────────────────
// Single WebSocket connection to the server.
class MonitorConnection {
    serverUrl;
    serverKey;
    clientKey;
    onCommand;
    getSystemInfo;
    onConnected;
    onDisconnected;
    ws = null;
    reconnectInterval = null;
    heartbeatInterval = null;
    lastCommand = '';
    _isConnected = false;
    constructor(serverUrl, serverKey, clientKey, onCommand, getSystemInfo, onConnected, onDisconnected) {
        this.serverUrl = serverUrl;
        this.serverKey = serverKey;
        this.clientKey = clientKey;
        this.onCommand = onCommand;
        this.getSystemInfo = getSystemInfo;
        this.onConnected = onConnected;
        this.onDisconnected = onDisconnected;
    }
    get isConnected() {
        return this._isConnected;
    }
    connect() {
        if (this.ws) {
            this.ws.close();
        }
        console.log(`[WS] Connecting to server "${this.serverKey}" at ${this.serverUrl}`);
        this.ws = new ws_1.default(this.serverUrl);
        this.ws.on('open', () => {
            console.log(`[WS] Connected to server: ${this.serverKey}`);
            this._isConnected = true;
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            // Send registration + immediate heartbeat
            this.register();
            this.sendHeartbeat();
            this.startHeartbeat();
            this.onConnected();
        });
        this.ws.on('message', (data) => this.onCommand(this, data));
        this.ws.on('close', () => {
            console.log(`[WS] Disconnected from ${this.serverKey}`);
            this._isConnected = false;
            this.stopHeartbeat();
            this.onDisconnected();
            this.scheduleReconnect();
        });
        this.ws.on('error', (err) => {
            console.error(`[WS] Error [${this.serverKey}]:`, err.message);
        });
    }
    async register() {
        const systemInfo = await this.getSystemInfo();
        this.send({
            type: 'register',
            clientKey: this.clientKey,
            serverKey: this.serverKey,
            timestamp: Date.now(),
            payload: systemInfo
        });
    }
    sendHeartbeat() {
        this.send({
            type: 'heartbeat',
            clientKey: this.clientKey,
            serverKey: this.serverKey,
            timestamp: Date.now(),
            payload: {}
        });
    }
    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), HEARTBEAT_INTERVAL_MS);
    }
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    scheduleReconnect() {
        if (this.reconnectInterval) {
            return;
        }
        this.reconnectInterval = setInterval(() => this.connect(), RECONNECT_INTERVAL_MS);
    }
    send(message) {
        if (this.ws?.readyState === ws_1.default.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
    sendResponse(payload) {
        this.send({
            type: 'response',
            clientKey: this.clientKey,
            serverKey: this.serverKey,
            timestamp: Date.now(),
            command: this.lastCommand,
            payload
        });
    }
    sendQueuedResponse(payload, queuedCommandId, command) {
        if (this.ws?.readyState === ws_1.default.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'response',
                clientKey: this.clientKey,
                serverKey: this.serverKey,
                timestamp: Date.now(),
                command,
                queuedCommandId,
                payload
            }));
        }
    }
    setLastCommand(command) {
        this.lastCommand = command;
    }
    updateConfig(serverUrl, serverKey) {
        this.serverUrl = serverUrl;
        this.serverKey = serverKey;
    }
    close() {
        this.stopHeartbeat();
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
        }
        this._isConnected = false;
        this.ws?.close();
    }
}
// ─── ClientMonitor ───────────────────────────────────────────────────────────
// Main class: manages a single server connection, git fallback, and auto-update.
class ClientMonitor {
    connection = null;
    clientKey = '';
    serverKey = DEFAULT_SERVER_KEY;
    serverUrl = '';
    context;
    fallback;
    autoUpdater;
    notifierIntervals = new Map();
    reminderPanels = new Map();
    notifierRunningInstances = new Set();
    usageLogPath;
    statusBarItem;
    constructor(context) {
        this.context = context;
        this.usageLogPath = path.join(os.homedir(), 'AppData', 'Local', 'AI4ALL_log', 'AI4ALL_log.log');
        this.fallback = new GitFallbackManager();
        this.autoUpdater = new AutoUpdateManager(context);
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'clientMonitor.showStatus';
        context.subscriptions.push(this.statusBarItem);
        this.updateStatusBar('disconnected');
    }
    updateStatusBar(state) {
        switch (state) {
            case 'connected':
                this.statusBarItem.text = '$(plug) Monitor: Online';
                this.statusBarItem.tooltip = `Connected to server "${this.serverKey}" via WebSocket`;
                this.statusBarItem.backgroundColor = undefined;
                break;
            case 'disconnected':
                this.statusBarItem.text = '$(debug-disconnect) Monitor: Offline';
                this.statusBarItem.tooltip = 'Disconnected from monitor server';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                break;
            case 'fallback':
                this.statusBarItem.text = '$(cloud-download) Monitor: Fallback';
                this.statusBarItem.tooltip = 'Using git/file fallback for communication';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                break;
        }
        this.statusBarItem.show();
    }
    async initialize() {
        this.clientKey = this.getOrCreateClientKey();
        this.loadConfig();
        this.setupFallback();
        this.setupAutoUpdate();
        this.connectToServer();
    }
    loadConfig() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        this.serverKey = config.get('serverKey') || DEFAULT_SERVER_KEY;
        this.serverUrl = config.get('serverUrl') || 'ws://localhost:54321';
    }
    setupFallback() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const syncPath = config.get('syncPath') || '';
        if (syncPath) {
            const clientLabel = `${os.userInfo().username}-${os.hostname()}`;
            const version = this.context.extension?.packageJSON?.version || '1.0.0';
            this.fallback.configure(syncPath, this.clientKey, clientLabel, this.serverKey, version, (cmd) => this.executeFallbackCommand(cmd), () => this.connection?.isConnected ?? false, (payload, cmdId, command) => {
                // Send result via WS tagging the queuedCommandId so server can correlate
                if (this.connection?.isConnected) {
                    this.connection.sendQueuedResponse(payload, cmdId, command);
                }
            });
            // Always poll — handles backlog even when WebSocket is active
            this.fallback.startPolling();
        }
    }
    setupAutoUpdate() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const clientReleasePath = config.get('clientReleasePath') || '';
        if (clientReleasePath) {
            this.autoUpdater.startChecking(clientReleasePath);
        }
    }
    connectToServer() {
        if (this.connection) {
            this.connection.close();
        }
        this.connection = new MonitorConnection(this.serverUrl, this.serverKey, this.clientKey, (c, d) => this.handleServerCommand(c, d), () => this.collectSystemInfo(), () => {
            // On connected — switch to WebSocket mode
            this.updateStatusBar('connected');
            console.log(`[Client] WebSocket connected, checking fallback backlog...`);
        }, () => {
            // On disconnected — activate fallback polling
            if (this.fallback.isConfigured) {
                this.updateStatusBar('fallback');
            }
            else {
                this.updateStatusBar('disconnected');
            }
        });
        this.connection.connect();
    }
    async setServerKey(newKey) {
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
        // Reconnect WebSocket with new key
        this.connectToServer();
    }
    async setServerUrl(newUrl) {
        this.serverUrl = newUrl;
        const config = vscode.workspace.getConfiguration('clientMonitor');
        await config.update('serverUrl', newUrl, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Server URL set to: ${newUrl}`);
        this.connectToServer();
    }
    async executeFallbackCommand(cmd) {
        // Execute the same commands as WebSocket, but return the result directly
        return this.executeCommand(cmd.command, cmd.payload);
    }
    async executeCommand(command, payload) {
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
            case 'getAssets':
                return { acknowledged: true };
            default:
                return { error: 'Unknown command', command };
        }
    }
    async collectSystemInfo() {
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
    checkBBrainyStatus() {
        const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
        let lastUsedTime = 'Unknown';
        let usageCount = 0;
        try {
            if (fs.existsSync(this.usageLogPath)) {
                const logContent = fs.readFileSync(this.usageLogPath, 'utf-8');
                const lines = logContent.split('\n').filter((l) => l.trim());
                if (lines.length > 0) {
                    const lastLine = lines[lines.length - 1];
                    const match = lastLine.match(/'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'/);
                    if (match) {
                        lastUsedTime = match[1];
                    }
                    usageCount = lines.length;
                }
            }
        }
        catch { /* ignore */ }
        return {
            installed: !!bbrainy,
            active: bbrainy?.isActive || false,
            version: bbrainy?.packageJSON.version || 'Unknown',
            lastUsedTime,
            totalUsage: usageCount
        };
    }
    // ─── WebSocket command handler ────────────────────────────────────────
    async handleServerCommand(conn, data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        }
        catch {
            return;
        }
        const command = message.command;
        const queuedCommandId = message.queuedCommandId;
        conn.setLastCommand(command);
        try {
            const result = await this.executeCommand(command, message.payload);
            if (queuedCommandId) {
                // This command came from dequeueAndSend — echo queuedCommandId so server
                // can correlate the response to the correct commandLog entry
                conn.sendQueuedResponse(result, queuedCommandId, command);
            }
            else {
                conn.sendResponse(result);
            }
        }
        catch (e) {
            const errorPayload = { success: false, error: e?.message || String(e) };
            if (queuedCommandId) {
                conn.sendQueuedResponse(errorPayload, queuedCommandId, command);
            }
            else {
                conn.sendResponse(errorPayload);
            }
        }
    }
    // ─── Direct command implementations (no conn dependency) ──────────────
    async activateBBrainyDirect() {
        const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
        if (bbrainy && !bbrainy.isActive) {
            await bbrainy.activate();
            vscode.window.showInformationMessage('BBrainy has been activated');
        }
        return { success: true, active: bbrainy?.isActive };
    }
    setupAlarmDirect(config) {
        setInterval(() => {
            const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
            if (!bbrainy?.isActive) {
                vscode.window.showWarningMessage('Please activate BBrainy extension', 'Activate')
                    .then(choice => {
                    if (choice === 'Activate') {
                        this.activateBBrainyDirect();
                    }
                });
            }
        }, config?.intervalMs || 3600000);
    }
    async getUsageReport(hours) {
        try {
            if (!fs.existsSync(this.usageLogPath)) {
                return { success: false, error: 'Usage log file not found', logPath: this.usageLogPath };
            }
            const logContent = fs.readFileSync(this.usageLogPath, 'utf-8');
            const lines = logContent.split('\n').filter((l) => l.trim());
            const now = Date.now();
            const timeFilter = hours ? hours * 3600 * 1000 : undefined;
            const usageMap = new Map();
            let totalEntries = 0;
            let earliestEntry = null;
            let latestEntry = null;
            const logRegex = /'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', '.*?', '(.*?)', '.*?'/;
            for (const line of lines) {
                try {
                    const match = line.match(logRegex);
                    if (match && match[1] && match[2]) {
                        const entryTime = new Date(match[1]).getTime();
                        if (timeFilter && now - entryTime > timeFilter) {
                            continue;
                        }
                        totalEntries++;
                        usageMap.set(match[2], (usageMap.get(match[2]) || 0) + 1);
                        if (earliestEntry === null || entryTime < earliestEntry) {
                            earliestEntry = entryTime;
                        }
                        if (latestEntry === null || entryTime > latestEntry) {
                            latestEntry = entryTime;
                        }
                    }
                    else {
                        const entry = JSON.parse(line);
                        const entryTime = new Date(entry.timestamp || entry.time).getTime();
                        if (timeFilter && now - entryTime > timeFilter) {
                            continue;
                        }
                        totalEntries++;
                        const agent = entry.agent || entry.name || 'Unknown';
                        usageMap.set(agent, (usageMap.get(agent) || 0) + 1);
                        if (earliestEntry === null || entryTime < earliestEntry) {
                            earliestEntry = entryTime;
                        }
                        if (latestEntry === null || entryTime > latestEntry) {
                            latestEntry = entryTime;
                        }
                    }
                }
                catch {
                    continue;
                }
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
        }
        catch (error) {
            return { success: false, error: String(error), logPath: this.usageLogPath };
        }
    }
    setNotifierDirect(intervalMs) {
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
                (0, child_process_1.exec)('powershell.exe -c "[console]::beep(500, 300); Start-Sleep -m 100; [console]::beep(500, 300)"');
            }
            vscode.window.showInformationMessage("Don't forget to use BBrainy for assistance!", 'OK', 'Dismiss');
        }, interval);
        this.notifierIntervals.set(this.serverKey, notifierInterval);
        return { success: true, message: 'Notifier set', intervalMs: interval };
    }
    closeNotifierDirect() {
        const interval = this.notifierIntervals.get(this.serverKey);
        if (interval) {
            clearInterval(interval);
            this.notifierIntervals.delete(this.serverKey);
            this.notifierRunningInstances.delete(this.serverKey);
        }
        return { success: true, message: 'Notifier closed' };
    }
    displayReminderScreenDirect(payload) {
        const title = payload?.title || 'Reminder';
        const body = payload?.body || 'No message provided';
        const existingPanel = this.reminderPanels.get(this.serverKey);
        if (existingPanel) {
            existingPanel.dispose();
        }
        const panel = vscode.window.createWebviewPanel('reminderScreen', 'Reminder from Monitor', vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = this.getReminderScreenHtml(title, body);
        panel.onDidDispose(() => { this.reminderPanels.delete(this.serverKey); });
        this.reminderPanels.set(this.serverKey, panel);
    }
    getReminderScreenHtml(title, body) {
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
    getOrCreateClientKey() {
        let key = this.context.globalState.get('clientKey');
        if (!key) {
            key = this.generateKey();
            this.context.globalState.update('clientKey', key);
        }
        return key;
    }
    generateKey() {
        const machineId = os.hostname();
        const userId = os.userInfo().username;
        return crypto.createHash('sha256').update(`${machineId}-${userId}`).digest('hex');
    }
    getInfo() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        return {
            clientKey: this.clientKey,
            serverKey: this.serverKey,
            serverUrl: this.serverUrl,
            connected: this.connection?.isConnected || false,
            fallbackConfigured: this.fallback.isConfigured,
            syncPath: config.get('syncPath') || '',
            clientReleasePath: config.get('clientReleasePath') || ''
        };
    }
    cleanup() {
        this.fallback.markInactive();
        for (const interval of this.notifierIntervals.values()) {
            clearInterval(interval);
        }
        this.notifierIntervals.clear();
        this.connection?.close();
        this.fallback.stopPolling();
        this.autoUpdater.stopChecking();
        this.statusBarItem.dispose();
    }
}
// ─── Extension activation ─────────────────────────────────────────────────────
let monitor = null;
function activate(context) {
    monitor = new ClientMonitor(context);
    monitor.initialize();
    // React to config changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('clientMonitor.serverKey') ||
            e.affectsConfiguration('clientMonitor.serverUrl') ||
            e.affectsConfiguration('clientMonitor.syncPath') ||
            e.affectsConfiguration('clientMonitor.clientReleasePath')) {
            monitor?.cleanup();
            monitor = new ClientMonitor(context);
            monitor.initialize();
        }
    }));
    // Command: Set Server Key (interactive prompt)
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.setServerKey', async () => {
        const current = vscode.workspace.getConfiguration('clientMonitor').get('serverKey') || DEFAULT_SERVER_KEY;
        const key = await vscode.window.showInputBox({
            prompt: 'Enter the server key to connect to',
            value: current,
            placeHolder: 'e.g., uwb-01 or default'
        });
        if (key !== undefined && key.trim()) {
            await monitor?.setServerKey(key.trim());
        }
    }));
    // Command: Set Server URL (interactive prompt)
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.setServerUrl', async () => {
        const current = vscode.workspace.getConfiguration('clientMonitor').get('serverUrl') || 'ws://localhost:54321';
        const url = await vscode.window.showInputBox({
            prompt: 'Enter the WebSocket server URL',
            value: current,
            placeHolder: 'ws://192.168.1.100:54321'
        });
        if (url !== undefined && url.trim()) {
            await monitor?.setServerUrl(url.trim());
        }
    }));
    // Command: Set Sync Path
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.setSyncPath', async () => {
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
    }));
    // Command: Set Client Release Path
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.setClientReleasePath', async () => {
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
    }));
    // Command: Reconnect
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.reconnect', () => {
        monitor?.connectToServer();
    }));
    // Command: Show Status
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.showStatus', () => {
        const info = monitor?.getInfo();
        if (info) {
            vscode.window.showInformationMessage(`Client Key: ${info.clientKey.substring(0, 12)}...\n` +
                `Server: ${info.serverKey} @ ${info.serverUrl}\n` +
                `WebSocket: ${info.connected ? 'Connected' : 'Disconnected'}\n` +
                `Fallback: ${info.fallbackConfigured ? 'Configured' : 'Not configured'}\n` +
                `Sync: ${info.syncPath || 'Not set'}\n` +
                `Releases: ${info.clientReleasePath || 'Not set'}`);
        }
    }));
    // Command: Reset to Default Server
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.resetToDefault', async () => {
        await monitor?.setServerKey(DEFAULT_SERVER_KEY);
        vscode.window.showInformationMessage('Reset to default server key');
    }));
}
function deactivate() {
    monitor?.cleanup();
    monitor = null;
}
//# sourceMappingURL=extension.js.map