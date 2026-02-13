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
class ClientMonitor {
    ws = null;
    clientKey = '';
    reconnectInterval = null;
    async connect() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const serverUrl = config.get('serverUrl') || 'ws://localhost:8080';
        this.clientKey = config.get('clientKey') || this.generateKey();
        if (this.ws) {
            this.ws.close();
        }
        this.ws = new ws_1.default(serverUrl);
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
    async register() {
        const systemInfo = await this.collectSystemInfo();
        this.send({
            type: 'register',
            clientKey: this.clientKey,
            timestamp: Date.now(),
            payload: systemInfo
        });
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
    async handleServerCommand(data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        }
        catch (e) {
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
    async activateBBrainy() {
        const bbrainy = vscode.extensions.getExtension('bbrainy-id');
        if (bbrainy && !bbrainy.isActive) {
            await bbrainy.activate();
            vscode.window.showInformationMessage('BBrainy has been activated');
        }
        this.sendResponse({ success: true, active: bbrainy?.isActive });
    }
    setupAlarm(config) {
        // Set up reminder/alarm for BBrainy usage
        const interval = setInterval(() => {
            const bbrainy = vscode.extensions.getExtension('bbrainy-id');
            if (!bbrainy?.isActive) {
                vscode.window.showWarningMessage('Please activate BBrainy extension', 'Activate').then(choice => {
                    if (choice === 'Activate') {
                        this.activateBBrainy();
                    }
                });
            }
        }, config.intervalMs || 3600000); // Default 1 hour
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
            timestamp: Date.now(),
            payload
        });
    }
    generateKey() {
        const crypto = require('crypto');
        const machineId = require('os').hostname();
        const userId = require('os').userInfo().username;
        return crypto
            .createHash('sha256')
            .update(`${machineId}-${userId}-${Date.now()}`)
            .digest('hex');
    }
    scheduleReconnect() {
        if (this.reconnectInterval)
            return;
        this.reconnectInterval = setInterval(() => {
            this.connect();
        }, 5000); // Try reconnecting every 5 seconds
    }
}
function activate(context) {
    const monitor = new ClientMonitor();
    monitor.connect();
    context.subscriptions.push(vscode.commands.registerCommand('clientMonitor.reconnect', () => {
        monitor.connect();
    }));
}
//# sourceMappingURL=extension.js.map