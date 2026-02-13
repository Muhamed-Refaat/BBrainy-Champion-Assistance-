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
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ws_1 = require("ws");
const http = __importStar(require("http"));
const path_1 = require("path");
class MonitorServer {
    wss = null;
    server = null;
    clients = new Map();
    panel = null;
    async start() {
        const config = vscode.workspace.getConfiguration('serverMonitor');
        const port = config.get('port') || 8080;
        this.server = http.createServer();
        this.wss = new ws_1.WebSocketServer({ server: this.server });
        this.wss.on('connection', (ws) => {
            ws.on('message', (data) => this.handleClientMessage(ws, data));
            ws.on('close', () => this.handleClientDisconnect(ws));
        });
        this.server.listen(port, () => {
            vscode.window.showInformationMessage(`Monitor server running on port ${port}`);
        });
        setInterval(() => this.checkHeartbeats(), 30000);
    }
    handleClientMessage(ws, data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        }
        catch (e) {
            return;
        }
        if (message.type === 'register') {
            this.registerClient(ws, message);
        }
        else if (message.type === 'response') {
            this.handleResponse(message);
        }
        else if (message.type === 'heartbeat') {
            this.updateHeartbeat(message.clientKey);
        }
        this.updateDashboard();
    }
    registerClient(ws, message) {
        const client = {
            key: message.clientKey,
            ws: ws,
            info: message.payload,
            lastSeen: Date.now(),
            status: 'online'
        };
        this.clients.set(message.clientKey, client);
        vscode.window.showInformationMessage(`Client registered: ${client.info.username}@${client.info.hostname}`);
    }
    handleClientDisconnect(ws) {
        for (const [key, client] of this.clients) {
            if (client.ws === ws) {
                client.status = 'offline';
                this.updateDashboard();
                break;
            }
        }
    }
    updateHeartbeat(clientKey) {
        const client = this.clients.get(clientKey);
        if (client) {
            client.lastSeen = Date.now();
            client.status = 'online';
        }
    }
    checkHeartbeats() {
        const now = Date.now();
        for (const [key, client] of this.clients) {
            if (now - client.lastSeen > 60000) {
                client.status = 'offline';
            }
        }
        this.updateDashboard();
    }
    handleResponse(message) {
        console.log('Response from', message.clientKey, message.payload);
    }
    async sendCommand(clientKey, command, payload) {
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
    async queryAllClients(command) {
        const promises = Array.from(this.clients.keys()).map(key => this.sendCommand(key, command));
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
        }
        catch (e) {
            vscode.window.showErrorMessage(`Failed to save report: ${e}`);
        }
    }
    showDashboard() {
        if (this.panel) {
            this.panel.reveal();
        }
        else {
            this.panel = vscode.window.createWebviewPanel('monitorDashboard', 'Monitor Command Center', vscode.ViewColumn.One, {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file((0, path_1.resolve)(__dirname, '..', 'dist'))]
            });
            this.panel.webview.html = this.getDashboardHtml();
            this.panel.webview.onDidReceiveMessage(message => this.handleDashboardAction(message));
            this.panel.onDidDispose(() => { this.panel = null; });
        }
        this.updateDashboard();
    }
    getDashboardHtml() {
        const filePath = (0, path_1.resolve)(__dirname, '..', 'dist', 'index.html');
        try {
            return require('fs').readFileSync(filePath, 'utf8');
        }
        catch (e) {
            return `
        <!DOCTYPE html>
        <html>
          <body style="background: #0f172a; color: #94a3b8; font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #60a5fa;">Command Center Not Ready</h1>
            <p>Please run <code>npm run build:webview</code> in the server-extension folder.</p>
          </body>
        </html>
      `;
        }
    }
    updateDashboard() {
        if (!this.panel)
            return;
        const clientsArray = Array.from(this.clients.values());
        this.panel.webview.postMessage({
            type: 'update',
            data: {
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
            }
        });
    }
    async handleDashboardAction(message) {
        switch (message.action) {
            case 'sendCommand':
                await this.sendCommand(message.clientKey, message.command, message.payload);
                break;
            case 'queryAll':
                await this.queryAllClients(message.command);
                break;
            case 'generateReport':
                await this.generateReport();
                break;
        }
    }
    stop() {
        this.wss?.close();
        this.server?.close();
    }
}
function activate(context) {
    const server = new MonitorServer();
    context.subscriptions.push(vscode.commands.registerCommand('serverMonitor.start', () => server.start()), vscode.commands.registerCommand('serverMonitor.showDashboard', () => server.showDashboard()), vscode.commands.registerCommand('serverMonitor.generateReport', () => server.generateReport()));
    const config = vscode.workspace.getConfiguration('serverMonitor');
    if (config.get('autoStart')) {
        server.start();
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map