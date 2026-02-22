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
const vscode = __importStar(require("vscode"));
const ws_1 = __importDefault(require("ws"));
class MonitorConnection {
    config;
    clientKey;
    onCommand;
    getSystemInfo;
    ws = null;
    reconnectInterval = null;
    heartbeatInterval = null;
    constructor(config, clientKey, onCommand, getSystemInfo) {
        this.config = config;
        this.clientKey = clientKey;
        this.onCommand = onCommand;
        this.getSystemInfo = getSystemInfo;
    }
    connect() {
        if (this.ws) {
            this.ws.close();
        }
        console.log(`Connecting to ${this.config.serverId} at ${this.config.url}`);
        this.ws = new ws_1.default(this.config.url);
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
    async register() {
        const systemInfo = await this.getSystemInfo();
        this.send({
            type: 'register',
            clientKey: this.clientKey,
            serverId: this.config.serverId,
            timestamp: Date.now(),
            payload: systemInfo
        });
    }
    startHeartbeat() {
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
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    scheduleReconnect() {
        if (this.reconnectInterval)
            return;
        this.reconnectInterval = setInterval(() => this.connect(), 5000);
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
            serverId: this.config.serverId,
            timestamp: Date.now(),
            payload
        });
    }
    close() {
        this.stopHeartbeat();
        if (this.reconnectInterval)
            clearInterval(this.reconnectInterval);
        this.ws?.close();
    }
}
class ClientMonitor {
    connections = new Map();
    clientKey = '';
    async updateConnections() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const servers = config.get('servers') || [];
        this.clientKey = config.get('clientKey') || this.generateKey();
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
                const conn = new MonitorConnection(server, this.clientKey, (c, d) => this.handleServerCommand(c, d), () => this.collectSystemInfo());
                this.connections.set(key, conn);
                conn.connect();
            }
        }
    }
    async collectSystemInfo() {
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
    checkBBrainyStatus() {
        const bbrainy = vscode.extensions.getExtension('bbrainy-id');
        return {
            installed: !!bbrainy,
            active: bbrainy?.isActive || false,
            version: bbrainy?.packageJSON.version
        };
    }
    async handleServerCommand(conn, data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        }
        catch (e) {
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
    async activateBBrainy(conn) {
        const bbrainy = vscode.extensions.getExtension('bbrainy-id');
        if (bbrainy && !bbrainy.isActive) {
            await bbrainy.activate();
            vscode.window.showInformationMessage('BBrainy has been activated');
        }
        conn.sendResponse({ success: true, active: bbrainy?.isActive });
    }
    setupAlarm(conn, config) {
        setInterval(() => {
            const bbrainy = vscode.extensions.getExtension('bbrainy-id');
            if (!bbrainy?.isActive) {
                vscode.window.showWarningMessage('Please activate BBrainy extension', 'Activate')
                    .then(choice => {
                    if (choice === 'Activate')
                        this.activateBBrainy(conn);
                });
            }
        }, config.intervalMs || 3600000);
    }
    generateKey() {
        const crypto = require('crypto');
        const machineId = require('os').hostname();
        const userId = require('os').userInfo().username;
        return crypto.createHash('sha256').update(`${machineId}-${userId}-${Date.now()}`).digest('hex');
    }
}
function activate(context) {
    const monitor = new ClientMonitor();
    monitor.updateConnections();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('clientMonitor.servers')) {
            monitor.updateConnections();
        }
    }), vscode.commands.registerCommand('clientMonitor.reconnect', () => {
        monitor.updateConnections();
    }));
}
//# sourceMappingURL=extension.js.map