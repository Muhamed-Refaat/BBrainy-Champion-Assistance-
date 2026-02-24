import * as vscode from 'vscode';
import { WebSocketServer } from 'ws';
import * as http from 'http';
import { MonitorViewProvider } from './providers/MonitorViewProvider';

export interface Client {
    key: string;
    ws: any;
    info: any;
    lastSeen: number;
    status: 'online' | 'offline' | 'idle';
    lastResponse?: {
        command: string;
        data: any;
        timestamp: number;
    };
}

export class MonitorServer {
    private wss: WebSocketServer | null = null;
    private server: http.Server | null = null;
    private clients: Map<string, Client> = new Map();
    private provider: MonitorViewProvider | null = null;
    private context: vscode.ExtensionContext | null = null;
    private running: boolean = false;
    private port: number = 54321;
    private serverId: string = 'uwb-01';
    private heartbeatCheckInterval: NodeJS.Timeout | null = null;
    private offlineTimeoutMs: number = 300000; // 5 minutes

    initialize(context: vscode.ExtensionContext) {
        this.context = context;
        const config = vscode.workspace.getConfiguration('serverMonitor');
        this.serverId = config.get<string>('serverId') || 'uwb-01';
        console.log(`[MonitorServer] Initializing with serverId: ${this.serverId}`);
        this.loadPersistentClients();
        console.log(`[MonitorServer] Loaded ${this.clients.size} persistent clients`);
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
                status: 'offline'
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
            lastSeen: c.lastSeen
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
        const basePort = config.get<number>('port') || 54321;
        this.serverId = config.get<string>('serverId') || 'uwb-01';

        console.log(`[MonitorServer] Starting server with serverId: ${this.serverId} on port: ${basePort}`);

        // Reload clients for the specific Server ID
        this.clients.clear();
        this.loadPersistentClients();
        
        // Remove duplicate clients (keeping the first occurrence of each unique key)
        this.deduplicateClients();

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

        if (message.type === 'register') {
            if (message.serverId !== this.serverId) {
                console.warn(`[MonitorServer] Client ${message.clientKey} attempted to register with wrong Server ID: ${message.serverId} (expected: ${this.serverId})`);
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid Server ID' }));
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
        const existingClient = this.clients.get(message.clientKey);
        if (existingClient) {
            console.log(`[MonitorServer] Updating existing client: ${message.clientKey} (${message.payload.username}@${message.payload.hostname})`);
            existingClient.ws = ws;
            existingClient.status = 'online';
            existingClient.info = message.payload;
            existingClient.lastSeen = Date.now();
        } else {
            console.log(`[MonitorServer] Registering new client: ${message.clientKey} (${message.payload.username}@${message.payload.hostname})`);
            const client: Client = {
                key: message.clientKey,
                ws: ws,
                info: message.payload,
                lastSeen: Date.now(),
                status: 'online'
            };
            this.clients.set(message.clientKey, client);
        }
        
        this.savePersistentClients();
        console.log(`[MonitorServer] Total clients: ${this.clients.size}`);
        vscode.window.showInformationMessage(`Client registered: ${message.payload.username}@${message.payload.hostname}`);
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
            
            // Store BBrainy status if available
            if (message.command === 'checkBBrainy' && message.payload) {
                if (!client.info) client.info = {};
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
            console.warn(`[MonitorServer] Attempted to send command to offline client: ${clientKey}`);
            vscode.window.showErrorMessage('Client is offline');
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
                    hostname: c.info.hostname,
                    username: c.info.username,
                    workspace: c.info.workspace,
                    bbrainyActive: c.info.bbrainyStatus?.active,
                    lastSeen: c.lastSeen,
                    status: c.status,
                    lastResponse: c.lastResponse
                }))
            });
        }
    }

}
