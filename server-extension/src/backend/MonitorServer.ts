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

    initialize(context: vscode.ExtensionContext) {
        this.context = context;
        const config = vscode.workspace.getConfiguration('serverMonitor');
        this.serverId = config.get<string>('serverId') || 'uwb-01';
        this.loadPersistentClients();
    }

    private loadPersistentClients() {
        if (!this.context || !this.serverId) return;
        const allSaved = this.context.globalState.get<Record<string, any[]>>('persistentAssets') || {};
        const savedClients = allSaved[this.serverId] || [];
        savedClients.forEach(c => {
            this.clients.set(c.key, {
                ...c,
                ws: null,
                status: 'offline'
            });
        });
    }

    private savePersistentClients() {
        if (!this.context || !this.serverId) return;
        const allSaved = this.context.globalState.get<Record<string, any[]>>('persistentAssets') || {};
        allSaved[this.serverId] = Array.from(this.clients.values()).map(c => ({
            key: c.key,
            info: c.info,
            lastSeen: c.lastSeen
        }));
        this.context.globalState.update('persistentAssets', allSaved);
    }

    setProvider(provider: MonitorViewProvider) {
        this.provider = provider;
    }

    async start() {
        if (this.running) return;
        if (!this.context) {
            vscode.window.showErrorMessage('Server not initialized with Context');
            return;
        }
        const config = vscode.workspace.getConfiguration('serverMonitor');
        const basePort = config.get<number>('port') || 54321;
        this.serverId = config.get<string>('serverId') || 'uwb-01';

        // Reload clients for the specific Server ID
        this.clients.clear();
        this.loadPersistentClients();

        this.server = http.createServer();
        this.wss = new WebSocketServer({ server: this.server });

        this.wss.on('connection', (ws) => {
            ws.on('message', (data) => this.handleClientMessage(ws, data));
            ws.on('close', () => this.handleClientDisconnect(ws));
        });

        this.listenWithRetry(basePort);
    }

    private listenWithRetry(port: number, attempt: number = 0) {
        if (attempt >= 10) {
            vscode.window.showErrorMessage(`Failed to start server: Ports ${port - 10} to ${port - 1} are busy.`);
            return;
        }

        this.server?.listen(port, () => {
            this.port = port;
            this.running = true;
            this.triggerUpdate();
            vscode.window.showInformationMessage(`Monitor server [${this.serverId}] running on port ${this.port}`);
        }).on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} busy, trying ${port + 1}...`);
                this.listenWithRetry(port + 1, attempt + 1);
            } else {
                vscode.window.showErrorMessage(`Server error: ${err.message}`);
            }
        });
    }

    stop() {
        if (!this.running) return;
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
        vscode.window.showInformationMessage('Monitor server stopped');
    }

    private handleClientMessage(ws: any, data: any) {
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (e) {
            return;
        }

        if (message.type === 'register') {
            if (message.serverId !== this.serverId) {
                console.warn(`Client attempt to register with wrong Server ID: ${message.serverId}`);
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid Server ID' }));
                return;
            }
            this.registerClient(ws, message);
        } else if (message.type === 'response') {
            this.handleResponse(message);
        } else if (message.type === 'heartbeat') {
            this.updateHeartbeat(message.clientKey);
        }

        this.triggerUpdate();
    }

    private registerClient(ws: any, message: any) {
        const client: Client = {
            key: message.clientKey,
            ws: ws,
            info: message.payload,
            lastSeen: Date.now(),
            status: 'online'
        };

        this.clients.set(message.clientKey, client);
        this.savePersistentClients();
        vscode.window.showInformationMessage(`Client registered: ${client.info.username}@${client.info.hostname}`);
    }

    private handleClientDisconnect(ws: any) {
        for (const [key, client] of this.clients) {
            if (client.ws === ws) {
                client.status = 'offline';
                client.ws = null;
                this.triggerUpdate();
                break;
            }
        }
    }

    private updateHeartbeat(clientKey: string) {
        const client = this.clients.get(clientKey);
        if (client) {
            client.lastSeen = Date.now();
            client.status = 'online';
            this.savePersistentClients(); // Update last seen in storage
        }
    }

    private checkHeartbeats() {
        const now = Date.now();
        for (const [key, client] of this.clients) {
            if (client.status === 'online' && now - client.lastSeen > 90000) {
                client.status = 'offline';
                client.ws = null;
            }
        }
        this.triggerUpdate();
    }

    private handleResponse(message: any) {
        console.log('Response from', message.clientKey, message.payload);
    }

    async sendCommand(clientKey: string, command: string, payload?: any) {
        const client = this.clients.get(clientKey);
        if (!client || client.status === 'offline') {
            vscode.window.showErrorMessage('Client is offline');
            return;
        }

        client.ws.send(JSON.stringify({
            command,
            payload,
            timestamp: Date.now()
        }));
    }

    async queryAllClients(command: string) {
        const promises = Array.from(this.clients.keys()).map(key =>
            this.sendCommand(key, command)
        );
        await Promise.all(promises);
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
                    status: c.status
                }))
            });
        }
    }

}
