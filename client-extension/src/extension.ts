import * as vscode from 'vscode';
import WebSocket from 'ws';

interface ClientMessage {
    type: 'register' | 'heartbeat' | 'response' | 'event';
    clientKey: string;
    timestamp: number;
    payload: any;
}

class ClientMonitor {
    private ws: WebSocket | null = null;
    private clientKey: string = '';
    private reconnectInterval: NodeJS.Timeout | null = null;

    async connect() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const serverUrl = config.get<string>('serverUrl') || 'ws://localhost:8080';
        this.clientKey = config.get<string>('clientKey') || this.generateKey();

        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(serverUrl);

        this.ws.on('open', () => {
            console.log('Connected to monitor server');
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            this.register();
        });

        this.ws.on('message', (data) => this.handleServerCommand(data));

        this.ws.on('close', () => {
            console.log('Disconnected from monitor server');
            this.scheduleReconnect();
        });

        this.ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });
    }

    private async register() {
        const systemInfo = await this.collectSystemInfo();
        this.send({
            type: 'register',
            clientKey: this.clientKey,
            timestamp: Date.now(),
            payload: systemInfo
        });
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

    private async handleServerCommand(data: WebSocket.Data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (e) {
            return;
        }

        switch (message.command) {
            case 'getSystemInfo':
                this.sendResponse(await this.collectSystemInfo());
                break;

            case 'checkBBrainy':
                this.sendResponse(this.checkBBrainyStatus());
                break;

            case 'forceBBrainy':
                await this.activateBBrainy();
                break;

            case 'setAlarm':
                this.setupAlarm(message.payload);
                break;

            case 'getWorkspace':
                this.sendResponse({
                    workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                    openFiles: vscode.workspace.textDocuments.map(d => d.fileName)
                });
                break;
        }
    }

    private async activateBBrainy() {
        const bbrainy = vscode.extensions.getExtension('bbrainy-id');
        if (bbrainy && !bbrainy.isActive) {
            await bbrainy.activate();
            vscode.window.showInformationMessage('BBrainy has been activated');
        }
        this.sendResponse({ success: true, active: bbrainy?.isActive });
    }

    private setupAlarm(config: any) {
        // Set up reminder/alarm for BBrainy usage
        const interval = setInterval(() => {
            const bbrainy = vscode.extensions.getExtension('bbrainy-id');
            if (!bbrainy?.isActive) {
                vscode.window.showWarningMessage(
                    'Please activate BBrainy extension',
                    'Activate'
                ).then(choice => {
                    if (choice === 'Activate') {
                        this.activateBBrainy();
                    }
                });
            }
        }, config.intervalMs || 3600000); // Default 1 hour
    }

    private send(message: ClientMessage) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    private sendResponse(payload: any) {
        this.send({
            type: 'response',
            clientKey: this.clientKey,
            timestamp: Date.now(),
            payload
        });
    }

    private generateKey(): string {
        const crypto = require('crypto');
        const machineId = require('os').hostname();
        const userId = require('os').userInfo().username;

        return crypto
            .createHash('sha256')
            .update(`${machineId}-${userId}-${Date.now()}`)
            .digest('hex');
    }

    private scheduleReconnect() {
        if (this.reconnectInterval) return;

        this.reconnectInterval = setInterval(() => {
            this.connect();
        }, 5000); // Try reconnecting every 5 seconds
    }
}

export function activate(context: vscode.ExtensionContext) {
    const monitor = new ClientMonitor();
    monitor.connect();

    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.reconnect', () => {
            monitor.connect();
        })
    );
}
