import * as vscode from 'vscode';
import WebSocket from 'ws';

interface ClientMessage {
    type: 'register' | 'heartbeat' | 'response' | 'event';
    clientKey: string;
    serverId: string;
    timestamp: number;
    payload: any;
    command?: string;
}

interface ServerConfig {
    url: string;
    serverId: string;
}

class MonitorConnection {
    private ws: WebSocket | null = null;
    private reconnectInterval: NodeJS.Timeout | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private lastCommand: string = '';

    constructor(
        private config: ServerConfig,
        private clientKey: string,
        private onCommand: (conn: MonitorConnection, data: WebSocket.Data) => void,
        private getSystemInfo: () => Promise<any>
    ) { }

    connect() {
        if (this.ws) {
            this.ws.close();
        }

        console.log(`Connecting to ${this.config.serverId} at ${this.config.url}`);
        this.ws = new WebSocket(this.config.url);

        this.ws.on('open', () => {
            console.log(`Connected to server: ${this.config.serverId}`);
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            this.register();
            this.startHeartbeat();
        });

        this.ws.on('message', (data) => this.onCommand(this, data));

        this.ws.on('close', () => {
            console.log(`Disconnected from ${this.config.serverId}`);
            this.stopHeartbeat();
            this.scheduleReconnect();
        });

        this.ws.on('error', (err) => {
            console.error(`WebSocket error [${this.config.serverId}]:`, err.message);
        });
    }

    private async register() {
        const systemInfo = await this.getSystemInfo();
        this.send({
            type: 'register',
            clientKey: this.clientKey,
            serverId: this.config.serverId,
            timestamp: Date.now(),
            payload: systemInfo
        });
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            this.send({
                type: 'heartbeat',
                clientKey: this.clientKey,
                serverId: this.config.serverId,
                timestamp: Date.now(),
                payload: {}
            });
        }, 30000);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private scheduleReconnect() {
        if (this.reconnectInterval) return;
        this.reconnectInterval = setInterval(() => this.connect(), 5000);
    }

    send(message: ClientMessage) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    sendResponse(payload: any) {
        this.send({
            type: 'response',
            clientKey: this.clientKey,
            serverId: this.config.serverId,
            timestamp: Date.now(),
            command: this.lastCommand,
            payload
        });
    }

    setLastCommand(command: string) {
        this.lastCommand = command;
    }

    close() {
        this.stopHeartbeat();
        if (this.reconnectInterval) clearInterval(this.reconnectInterval);
        this.ws?.close();
    }
}

class ClientMonitor {
    private connections: Map<string, MonitorConnection> = new Map();
    private clientKey: string = '';
    private context: vscode.ExtensionContext | null = null;
    private notifierIntervals: Map<string, NodeJS.Timeout> = new Map();
    private reminderPanels: Map<string, vscode.WebviewPanel> = new Map();
    private notifierRunningInstances: Set<string> = new Set();
    private usageLogPath: string = '';

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        // Standard log file path for BBrainy usage tracking
        this.usageLogPath = require('path').join(
            require('os').homedir(),
            'AppData', 'Local', 'AI4ALL_log', 'AI4ALL_log.log'
        );
    }

    async updateConnections() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const servers = config.get<ServerConfig[]>('servers') || [];
        this.clientKey = this.getOrCreateClientKey();

        // Close old connections not in new config (by URL + ID)
        const currentServerKeys = new Set(servers.map(s => `${s.serverId}@${s.url}`));
        for (const [key, conn] of this.connections) {
            if (!currentServerKeys.has(key)) {
                conn.close();
                this.connections.delete(key);
            }
        }

        // Add or update connections
        for (const server of servers) {
            const key = `${server.serverId}@${server.url}`;
            if (!this.connections.has(key)) {
                const conn = new MonitorConnection(
                    server,
                    this.clientKey,
                    (c, d) => this.handleServerCommand(c, d),
                    () => this.collectSystemInfo()
                );
                this.connections.set(key, conn);
                conn.connect();
            }
        }
    }

    private async collectSystemInfo() {
        return {
            hostname: require('os').hostname(),
            username: require('os').userInfo().username,
            platform: process.platform,
            vscodeVersion: vscode.version,
            workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
            extensions: vscode.extensions.all
                .filter(ext => !ext.packageJSON.isBuiltin)
                .map(ext => ({
                    id: ext.id,
                    isActive: ext.isActive
                })),
            bbrainyStatus: this.checkBBrainyStatus()
        };
    }

    private checkBBrainyStatus() {
        const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
        
        let lastUsedTime = 'Unknown';
        let usageCount = 0;
        
        // Try to get BBrainy usage information
        try {
            const fs = require('fs');
            const path = require('path');
            const logPath = path.join(require('os').homedir(), 'AppData', 'Local', 'AI4ALL_log', 'AI4ALL_log.log');
            
            if (fs.existsSync(logPath)) {
                const logContent = fs.readFileSync(logPath, 'utf-8');
                const lines = logContent.split('\n').filter((l: string) => l.trim());
                
                if (lines.length > 0) {
                    // Get last entry
                    const lastLine = lines[lines.length - 1];
                    const match = lastLine.match(/'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'/);
                    if (match) {
                        lastUsedTime = match[1];
                    }
                    usageCount = lines.length;
                }
            }
        } catch (e) {
            // Silently fail if can't read log
        }
        
        return {
            installed: !!bbrainy,
            active: bbrainy?.isActive || false,
            version: bbrainy?.packageJSON.version || 'Unknown',
            lastUsedTime: lastUsedTime,
            totalUsage: usageCount
        };
    }

    private async handleServerCommand(conn: MonitorConnection, data: WebSocket.Data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (e) {
            return;
        }

        const command = message.command;
        conn.setLastCommand(command);

        switch (command) {
            case 'getSystemInfo':
                conn.sendResponse(await this.collectSystemInfo());
                break;

            case 'checkBBrainy':
                const bbrainyStatus = this.checkBBrainyStatus();
                conn.sendResponse(bbrainyStatus);
                break;

            case 'forceBBrainy':
                await this.activateBBrainy(conn);
                break;

            case 'setAlarm':
                this.setupAlarm(conn, message.payload);
                break;

            case 'getWorkspace':
                conn.sendResponse({
                    workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                    openFiles: vscode.workspace.textDocuments.map(d => d.fileName)
                });
                break;

            case 'getUsageReport':
                const usageData = await this.getUsageReport(message.payload?.hours);
                conn.sendResponse(usageData);
                break;

            case 'setNotifier':
                this.setNotifier(conn, message.payload?.intervalMs);
                break;

            case 'closeNotifier':
                this.closeNotifier(conn);
                break;

            case 'displayReminderScreen':
                this.displayReminderScreen(conn, message.payload);
                break;

            case 'getAssets':
                // This command broadcasts to all clients, showing assets on monitor client
                // Return a response to acknowledge
                conn.sendResponse({ acknowledged: true });
                break;

            default:
                conn.sendResponse({ error: 'Unknown command', command: message.command });
        }
    }

    private async activateBBrainy(conn: MonitorConnection) {
        const bbrainy = vscode.extensions.getExtension('bbrainy-id');
        if (bbrainy && !bbrainy.isActive) {
            await bbrainy.activate();
            vscode.window.showInformationMessage('BBrainy has been activated');
        }
        conn.sendResponse({ success: true, active: bbrainy?.isActive });
    }

    private setupAlarm(conn: MonitorConnection, config: any) {
        setInterval(() => {
            const bbrainy = vscode.extensions.getExtension('bbrainy-id');
            if (!bbrainy?.isActive) {
                vscode.window.showWarningMessage('Please activate BBrainy extension', 'Activate')
                    .then(choice => {
                        if (choice === 'Activate') this.activateBBrainy(conn);
                    });
            }
        }, config.intervalMs || 3600000);
    }

    private async getUsageReport(hours?: number): Promise<any> {
        try {
            const fs = require('fs');
            const path = require('path');

            if (!fs.existsSync(this.usageLogPath)) {
                return {
                    success: false,
                    error: 'Usage log file not found',
                    logPath: this.usageLogPath
                };
            }

            const logContent = fs.readFileSync(this.usageLogPath, 'utf-8');
            const lines = logContent.split('\n').filter((l: string) => l.trim());
            
            const now = Date.now();
            const timeFilter = hours ? hours * 3600 * 1000 : undefined;
            const usageMap = new Map<string, number>();
            let totalEntries = 0;
            let earliestEntry: number | null = null;
            let latestEntry: number | null = null;

            // Regex pattern to match the log format: '2026-02-23 04:21:06', '...', 'agentName', '...'
            const logRegex = /'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', '.*?', '(.*?)', '.*?'/;

            for (const line of lines) {
                try {
                    // Try to match the old log format first
                    const match = line.match(logRegex);
                    if (match && match[1] && match[2]) {
                        const dateStr = match[1]; // '2026-02-23 04:21:06'
                        const agentName = match[2];
                        const entryTime = new Date(dateStr).getTime();
                        
                        // Filter by time if specified
                        if (timeFilter && now - entryTime > timeFilter) {
                            continue;
                        }

                        totalEntries++;
                        usageMap.set(agentName, (usageMap.get(agentName) || 0) + 1);
                        
                        // Track earliest and latest entries for date range
                        if (earliestEntry === null || entryTime < earliestEntry) {
                            earliestEntry = entryTime;
                        }
                        if (latestEntry === null || entryTime > latestEntry) {
                            latestEntry = entryTime;
                        }
                    } else {
                        // Try JSON format as fallback
                        const entry = JSON.parse(line);
                        const entryTime = new Date(entry.timestamp || entry.time).getTime();
                        
                        // Filter by time if specified
                        if (timeFilter && now - entryTime > timeFilter) {
                            continue;
                        }

                        totalEntries++;
                        const agent = entry.agent || entry.name || 'Unknown';
                        usageMap.set(agent, (usageMap.get(agent) || 0) + 1);
                        
                        // Track earliest and latest entries for date range
                        if (earliestEntry === null || entryTime < earliestEntry) {
                            earliestEntry = entryTime;
                        }
                        if (latestEntry === null || entryTime > latestEntry) {
                            latestEntry = entryTime;
                        }
                    }
                } catch (e) {
                    // Skip malformed lines silently
                    continue;
                }
            }

            // Determine timeframe label
            let timeframeLabel = 'All time';
            if (hours) {
                if (hours === 24) {
                    timeframeLabel = 'Last 24 hours';
                } else if (hours === 168) {
                    timeframeLabel = 'Last 7 days';
                } else {
                    timeframeLabel = `Last ${hours} hours`;
                }
            }

            const reportData = {
                success: true,
                timestamp: new Date().toISOString(),
                timeframe: timeframeLabel,
                timeframeHours: hours,
                dateRange: {
                    earliest: earliestEntry ? new Date(earliestEntry).toISOString() : null,
                    latest: latestEntry ? new Date(latestEntry).toISOString() : null
                },
                totalEntries: totalEntries,
                agents: Array.from(usageMap.entries()).map(([agent, count]) => ({
                    name: agent,
                    count: count,
                    percentage: totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(2) : '0.00'
                })).sort((a, b) => b.count - a.count)
            };

            return reportData;
        } catch (error) {
            console.error('Error generating usage report:', error);
            return {
                success: false,
                error: String(error),
                logPath: this.usageLogPath
            };
        }
    }

    private setNotifier(conn: MonitorConnection, intervalMs?: number): void {
        const serverId = (conn as any).config?.serverId || 'unknown';
        let interval = intervalMs || 3600000; // Default 1 hour

        // Validate interval (1 min to 120 min)
        const minInterval = 60000; // 1 minute
        const maxInterval = 120 * 60000; // 120 minutes
        
        if (interval < minInterval) {
            conn.sendResponse({
                success: false,
                message: 'Interval must be at least 1 minute (60000 ms)',
                intervalMs: minInterval
            });
            return;
        }
        
        if (interval > maxInterval) {
            conn.sendResponse({
                success: false,
                message: 'Interval cannot exceed 120 minutes (7200000 ms)',
                intervalMs: maxInterval
            });
            return;
        }
        
        // Only allow one instance to run the notifier
        if (this.notifierRunningInstances.has(serverId)) {
            conn.sendResponse({
                success: true,
                message: 'Notifier already active in another instance',
                intervalMs: interval
            });
            return;
        }

        // Clear existing notifier for this server
        this.closeNotifier(conn);

        // Mark this instance as running the notifier
        this.notifierRunningInstances.add(serverId);

        // Set up new notifier
        const notifierId = serverId;
        const notifierInterval = setInterval(() => {
            // Beep sound using PowerShell on Windows
            const { exec } = require('child_process');
            if (require('os').platform() === 'win32') {
                exec('powershell.exe -c "[console]::beep(500, 300); Start-Sleep -m 100; [console]::beep(500, 300)"');
            }

            const bbrainyExt = vscode.extensions.getExtension('bbrainy-usage-assistant');
            if (bbrainyExt?.isActive) {
                vscode.window.showInformationMessage(
                    "Don't forget to use BBrainy for assistance!",
                    'OK',
                    'Dismiss'
                ).then(choice => {
                    if (choice === 'OK') {
                        vscode.commands.executeCommand('bbrainy.showUsageCommands');
                    }
                });
            } else {
                // Fallback if BBrainy extension is not active
                vscode.window.showInformationMessage("Don't forget to use BBrainy for assistance!");
            }
        }, interval);

        this.notifierIntervals.set(notifierId, notifierInterval);
        
        conn.sendResponse({
            success: true,
            message: 'Notifier set (running in this instance only)',
            intervalMs: interval
        });
    }

    private closeNotifier(conn: MonitorConnection): void {
        const serverId = (conn as any).config?.serverId || 'unknown';
        const interval = this.notifierIntervals.get(serverId);
        
        if (interval) {
            clearInterval(interval);
            this.notifierIntervals.delete(serverId);
            this.notifierRunningInstances.delete(serverId);
        }

        conn.sendResponse({
            success: true,
            message: 'Notifier closed'
        });
    }

    private displayReminderScreen(conn: MonitorConnection, payload: any): void {
        const serverId = (conn as any).config?.serverId || 'unknown';
        const title = payload?.title || 'Reminder';
        const body = payload?.body || 'No message provided';
        
        // Close existing panel if any
        const existingPanel = this.reminderPanels.get(serverId);
        if (existingPanel) {
            existingPanel.dispose();
        }

        // Create new webview panel
        const panel = vscode.window.createWebviewPanel(
            'reminderScreen',
            'Reminder from Monitor',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        // Set up the webview content
        panel.webview.html = this.getReminderScreenHtml(title, body);

        // Handle panel disposal
        panel.onDidDispose(() => {
            this.reminderPanels.delete(serverId);
        });

        this.reminderPanels.set(serverId, panel);

        conn.sendResponse({
            success: true,
            message: 'Reminder screen displayed in all instances'
        });
    }

    private getReminderScreenHtml(title: string, body: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reminder</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        padding: 40px;
                    }

                    .header {
                        display: flex;
                        align-items: center;
                        gap: 25px;
                        margin-bottom: 50px;
                        flex-shrink: 0;
                    }

                    .icon {
                        font-size: 56px;
                        animation: pulse 1s ease-in-out infinite;
                        flex-shrink: 0;
                    }

                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.15); }
                    }

                    h1 {
                        color: #60a5fa;
                        font-size: 40px;
                        font-weight: 700;
                        letter-spacing: -0.5px;
                        background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    .body-area {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 20px;
                        padding: 50px 45px;
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 350px;
                        backdrop-filter: blur(8px);
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    }

                    .body-text {
                        color: #e2e8f0;
                        font-size: 20px;
                        line-height: 1.9;
                        text-align: center;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        letter-spacing: 0.3px;
                    }

                    .info {
                        color: #64748b;
                        font-size: 13px;
                        text-align: center;
                        margin-top: 50px;
                        flex-shrink: 0;
                        font-weight: 500;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="icon">🔔</div>
                    <h1>${title}</h1>
                </div>
                
                <div class="body-area">
                    <div class="body-text">${body}</div>
                </div>

                <div class="info">Close this window to dismiss</div>
            </body>
            </html>
        `;
    }

    private getOrCreateClientKey(): string {
        if (!this.context) return this.generateKey();
        
        // Try to get from globalState (persistent)
        let key = this.context.globalState.get<string>('clientKey');
        if (!key) {
            key = this.generateKey();
            // Store it persistently
            this.context.globalState.update('clientKey', key);
        }
        return key;
    }

    private generateKey(): string {
        const crypto = require('crypto');
        const machineId = require('os').hostname();
        const userId = require('os').userInfo().username;
        // Generate key WITHOUT timestamp so it's consistent across reconnections
        return crypto.createHash('sha256').update(`${machineId}-${userId}`).digest('hex');
    }

    cleanup(): void {
        // Clean up all notifier intervals
        for (const interval of this.notifierIntervals.values()) {
            clearInterval(interval);
        }
        this.notifierIntervals.clear();

        // Close all WebSocket connections
        for (const conn of this.connections.values()) {
            conn.close();
        }
        this.connections.clear();
    }
}

export function activate(context: vscode.ExtensionContext) {
    const monitor = new ClientMonitor(context);
    monitor.updateConnections();

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('clientMonitor.servers')) {
                monitor.updateConnections();
            }
        }),
        vscode.commands.registerCommand('clientMonitor.reconnect', () => {
            monitor.updateConnections();
        })
    );
}

export function deactivate() {
    // Clean up will be handled by VS Code disposing subscriptions
}
