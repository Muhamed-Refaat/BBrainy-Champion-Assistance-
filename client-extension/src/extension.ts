import * as vscode from 'vscode';
import WebSocket from 'ws';

interface ClientMessage {
    type: 'register' | 'heartbeat' | 'response' | 'event';
    clientKey: string;
    serverId: string;
    timestamp: number;
    payload: any;
}

interface ServerConfig {
    url: string;
    serverId: string;
}

class MonitorConnection {
    private ws: WebSocket | null = null;
    private reconnectInterval: NodeJS.Timeout | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;

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
            payload
        });
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

    async updateConnections() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const servers = config.get<ServerConfig[]>('servers') || [];
        this.clientKey = config.get<string>('clientKey') || this.generateKey();

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
        const bbrainy = vscode.extensions.getExtension('bbrainy-id');
        return {
            installed: !!bbrainy,
            active: bbrainy?.isActive || false,
            version: bbrainy?.packageJSON.version
        };
    }

    private async handleServerCommand(conn: MonitorConnection, data: WebSocket.Data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (e) {
            return;
        }

        switch (message.command) {
            case 'getSystemInfo':
                conn.sendResponse(await this.collectSystemInfo());
                break;

            case 'checkBBrainy':
                conn.sendResponse(this.checkBBrainyStatus());
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

    private generateKey(): string {
        const crypto = require('crypto');
        const machineId = require('os').hostname();
        const userId = require('os').userInfo().username;
        return crypto.createHash('sha256').update(`${machineId}-${userId}-${Date.now()}`).digest('hex');
    }
}

export function activate(context: vscode.ExtensionContext) {
    const monitor = new ClientMonitor();
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
