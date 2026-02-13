# VS Code Client-Server Extension Architecture

## Overview

This document describes the architecture for a scalable, many-to-many VS Code extension system consisting of:
- **Client Extension**: Installed on machines to monitor/report info. Supports connecting to multiple servers via unique Server IDs.
- **Server Extension**: Scoped dashboard (Sidebar) managing assets for a specific `serverId`. Supports automatic port failover and persistent asset tracking.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     SERVER EXTENSION                         │
│  (Identified by unique 'serverId', e.g., 'uwb-01')           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            Sidebar Dashboard (React)                    │  │
│  │  - Scoped client list (Online + Persistent Offline)     │  │
│  │  - Real-time fleet orchestration                       │  │
│  │  - Port Failover Monitoring (Auto-incrementing)         │  │
│  └────────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │         Extension Host (Backend Services)               │  │
│  │  - WebSocket Server (Auth via serverId)                │  │
│  │  - Scoped Persistent Registry (globalState)             │  │
│  │  - Port Conflict Resolution (Retry Logic)               │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ WSS (Server ID Filtered)
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT EXTENSION                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │         Extension Host (Many-to-Many)                  │  │
│  │  - Handles Multiple Server Connections                 │  │
│  │  - Heartbeat & Auto-reconnect                          │  │
│  │  - System info collector & Command executor            │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Communication Protocol: WebSocket (WSS) - RECOMMENDED

### Why WebSocket over HTTP/TCP:

- ✅ **Bidirectional**: Real-time server → client commands
- ✅ **Persistent**: Maintains connection for live status
- ✅ **Efficient**: Lower overhead than HTTP polling
- ✅ **Built-in**: Libraries like `ws` work great with VS Code
- ✅ **Firewall-friendly**: Works over standard ports (443)

### Message Format

```typescript
interface Message {
  type: 'register' | 'heartbeat' | 'response' | 'error' | 'command';
  serverId: string;    // Required: Must match server's configured ID
  clientKey: string;
  timestamp: number;
  payload: any;
}
```

## Client Extension Architecture

### Configuration

**Settings**: `clientMonitor.*`

```json
{
  "clientMonitor.serverUrl": "wss://localhost:54321", // Default: 54321
  "clientMonitor.serverId": "uwb-01",              // Required: Target server ID
  "clientMonitor.clientKey": "unique-key-here",
  "clientMonitor.autoConnect": true
}
```
### Configuration

**File**: `settings.json`

```json
{
  "clientMonitor.serverUrl": "wss://your-server.com",
  "clientMonitor.clientKey": "unique-key-here",
  "clientMonitor.autoConnect": true,
  "clientMonitor.reportInterval": 60000
}
```

## Server Extension Architecture

### Configuration

**Settings**: `serverMonitor.*`

```json
{
  "serverMonitor.port": 54321,
  "serverMonitor.serverId": "uwb-01",
  "serverMonitor.autoStart": false
}
```

### Scoped Persistence & Asset Management

The server uses `vscode.ExtensionContext.globalState` to maintain a registry of "Known Assets" indexed by `serverId`. This ensures:
1. **Total Assets** visibility: Known but offline assets are always visible.
2. **Server Isolation**: No leakage of assets between different Server ID instances.
3. **Consistency**: State is preserved across VS Code reloads.

### Automatic Port Failover

To support opening multiple VS Code windows (multiple "Servers"), the extension implements a retry logic:
- Catch `EADDRINUSE` errors on `listen()`.
- Automatically increment port and retry (up to 10 attempts).
- Update the UI with the actual active port.

### Core Implementation Highlights

**File**: `src/server/extension.ts`

```typescript
import * as vscode from 'vscode';
import { WebSocketServer } from 'ws';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('serverMonitor');
  const serverId = config.get<string>('serverId');
  let port = config.get<number>('port') || 54321;

  if (!serverId) {
    vscode.window.showErrorMessage('Server Monitor: "serverId" is not configured.');
    return;
  }

  let wss: WebSocketServer | null = null;
  let retryCount = 0;
  const MAX_RETRIES = 10;

  function startServer(currentPort: number) {
    try {
      wss = new WebSocketServer({ port: currentPort });
      vscode.window.showInformationMessage(`Server Monitor: Server started on port ${currentPort} for serverId: ${serverId}`);

      wss.on('connection', ws => {
        ws.on('message', message => {
          const parsedMessage = JSON.parse(message.toString());
          if (parsedMessage.serverId === serverId) {
            // Handle client messages
            console.log(`Received message from client ${parsedMessage.clientKey}:`, parsedMessage);
            // Store client info in globalState, update dashboard etc.
          } else {
            console.warn(`Message with mismatched serverId received: ${parsedMessage.serverId}`);
            ws.close(1008, 'Invalid serverId');
          }
        });
      });

      wss.on('error', error => {
        if ((error as any).code === 'EADDRINUSE' && retryCount < MAX_RETRIES) {
          retryCount++;
          const nextPort = currentPort + retryCount;
          vscode.window.showWarningMessage(`Port ${currentPort} is in use. Retrying on port ${nextPort}...`);
          startServer(nextPort);
        } else {
          vscode.window.showErrorMessage(`Server Monitor: WebSocket server error: ${error.message}`);
        }
      });

    } catch (error: any) {
      vscode.window.showErrorMessage(`Server Monitor: Failed to start server: ${error.message}`);
    }
  }

  if (config.get<boolean>('autoStart')) {
    startServer(port);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('serverMonitor.start', () => startServer(port)),
    vscode.commands.registerCommand('serverMonitor.stop', () => {
      if (wss) {
        wss.close();
        vscode.window.showInformationMessage('Server Monitor: Server stopped.');
      }
    })
  );
}

export function deactivate() {
  // Clean up resources if necessary
}
```

### Core Implementation

**File**: `src/client/extension.ts`

```typescript
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
  private clientKey: string;
  private reconnectInterval: NodeJS.Timeout | null = null;

  async connect() {
    const config = vscode.workspace.getConfiguration('clientMonitor');
    const serverUrl = config.get<string>('serverUrl');
    this.clientKey = config.get<string>('clientKey') || this.generateKey();

    this.ws = new WebSocket(serverUrl);
    
    this.ws.on('open', () => this.register());
    this.ws.on('message', (data) => this.handleServerCommand(data));
    this.ws.on('close', () => this.scheduleReconnect());
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
    const message = JSON.parse(data.toString());
    
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
```

### Client Package.json

```json
{
  "name": "client-monitor",
  "displayName": "Client Monitor",
  "description": "Client-side monitoring extension",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "activationEvents": ["onStartupFinished"],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "clientMonitor.reconnect",
        "title": "Reconnect to Monitor Server"
      }
    ],
    "configuration": {
      "title": "Client Monitor",
      "properties": {
        "clientMonitor.serverUrl": {
          "type": "string",
          "default": "ws://localhost:8080",
          "description": "WebSocket server URL"
        },
        "clientMonitor.clientKey": {
          "type": "string",
          "description": "Unique client key for authentication"
        },
        "clientMonitor.autoConnect": {
          "type": "boolean",
          "default": true,
          "description": "Automatically connect on startup"
        },
        "clientMonitor.reportInterval": {
          "type": "number",
          "default": 60000,
          "description": "Heartbeat interval in milliseconds"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "dependencies": {
    "ws": "^8.14.0"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "@types/vscode": "^1.85.0",
    "@types/ws": "^8.5.0",
    "typescript": "^5.3.0"
  }
}
```

## Server Extension Architecture

### Core Implementation

**File**: `src/server/extension.ts`

```typescript
import * as vscode from 'vscode';
import { WebSocketServer } from 'ws';
import * as http from 'http';

interface Client {
  key: string;
  ws: any;
  info: any;
  lastSeen: number;
  status: 'online' | 'offline' | 'idle';
}

class MonitorServer {
  private wss: WebSocketServer | null = null;
  private server: http.Server | null = null;
  private clients: Map<string, Client> = new Map();
  private panel: vscode.WebviewPanel | null = null;

  async start() {
    const config = vscode.workspace.getConfiguration('serverMonitor');
    const port = config.get<number>('port') || 8080;

    // Create HTTP server for WebSocket
    this.server = http.createServer();
    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on('connection', (ws) => {
      ws.on('message', (data) => this.handleClientMessage(ws, data));
      ws.on('close', () => this.handleClientDisconnect(ws));
    });

    this.server.listen(port, () => {
      vscode.window.showInformationMessage(
        `Monitor server running on port ${port}`
      );
    });

    // Start heartbeat checker
    setInterval(() => this.checkHeartbeats(), 30000);
  }

  private handleClientMessage(ws: any, data: any) {
    const message = JSON.parse(data.toString());

    if (message.type === 'register') {
      this.registerClient(ws, message);
    } else if (message.type === 'response') {
      this.handleResponse(message);
    } else if (message.type === 'heartbeat') {
      this.updateHeartbeat(message.clientKey);
    }

    // Update dashboard
    this.updateDashboard();
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
    
    vscode.window.showInformationMessage(
      `Client registered: ${client.info.hostname}`
    );
  }

  private handleClientDisconnect(ws: any) {
    for (const [key, client] of this.clients) {
      if (client.ws === ws) {
        client.status = 'offline';
        this.updateDashboard();
        break;
      }
    }
  }

  private updateHeartbeat(clientKey: string) {
    const client = this.clients.get(clientKey);
    if (client) {
      client.lastSeen = Date.now();
      client.status = 'online';
    }
  }

  private checkHeartbeats() {
    const now = Date.now();
    for (const [key, client] of this.clients) {
      if (now - client.lastSeen > 60000) { // 1 minute timeout
        client.status = 'offline';
      }
    }
    this.updateDashboard();
  }

  private handleResponse(message: any) {
    // Handle responses from clients
    console.log('Response from', message.clientKey, message.payload);
  }

  // Commands to send to clients
  async sendCommand(clientKey: string, command: string, payload?: any) {
    const client = this.clients.get(clientKey);
    if (!client || client.status === 'offline') {
      vscode.window.showErrorMessage('Client is offline');
      return;
    }

    const message = {
      command,
      payload,
      timestamp: Date.now()
    };

    client.ws.send(JSON.stringify(message));
  }

  async queryAllClients(command: string) {
    const promises = Array.from(this.clients.keys()).map(key =>
      this.sendCommand(key, command)
    );
    await Promise.all(promises);
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalClients: this.clients.size,
      onlineClients: Array.from(this.clients.values())
        .filter(c => c.status === 'online').length,
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

    // Save report
    const reportPath = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders![0].uri,
      'reports',
      `report-${Date.now()}.json`
    );
    
    await vscode.workspace.fs.writeFile(
      reportPath,
      Buffer.from(JSON.stringify(report, null, 2))
    );

    vscode.window.showInformationMessage(
      `Report saved to ${reportPath.fsPath}`
    );

    return report;
  }

  showDashboard() {
    if (this.panel) {
      this.panel.reveal();
    } else {
      this.panel = vscode.window.createWebviewPanel(
        'monitorDashboard',
        'Client Monitor Dashboard',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      this.panel.webview.html = this.getDashboardHtml();
      
      // Handle messages from webview
      this.panel.webview.onDidReceiveMessage(message => {
        this.handleDashboardAction(message);
      });

      this.panel.onDidDispose(() => {
        this.panel = null;
      });
    }

    this.updateDashboard();
  }

  private getDashboardHtml(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: var(--vscode-font-family); 
            padding: 20px;
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
          }
          h1 {
            color: var(--vscode-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 10px;
          }
          .client-card {
            border: 1px solid var(--vscode-panel-border);
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            background: var(--vscode-editor-background);
          }
          .online { border-left: 4px solid #4caf50; }
          .offline { border-left: 4px solid #f44336; }
          .stats { 
            display: flex; 
            gap: 20px; 
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          .stat-box {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            padding: 15px;
            border-radius: 5px;
            flex: 1;
            min-width: 150px;
          }
          .stat-box h3 {
            margin-top: 0;
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
          }
          .stat-value {
            font-size: 32px;
            font-weight: bold;
          }
          button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            margin: 5px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 13px;
          }
          button:hover {
            background: var(--vscode-button-hoverBackground);
          }
          .actions {
            margin: 20px 0;
            padding: 15px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
          }
          .client-info {
            margin: 5px 0;
            font-size: 13px;
          }
          .client-info strong {
            color: var(--vscode-foreground);
          }
        </style>
      </head>
      <body>
        <h1>🖥️ Client Monitor Dashboard</h1>
        
        <div class="stats" id="stats"></div>
        
        <div class="actions">
          <h3>Global Actions</h3>
          <button onclick="queryAll('getSystemInfo')">🔄 Refresh All</button>
          <button onclick="generateReport()">📊 Generate Report</button>
          <button onclick="queryAll('checkBBrainy')">🔍 Check BBrainy Status</button>
        </div>
        
        <h2>Connected Clients</h2>
        <div id="clients"></div>
        
        <script>
          const vscode = acquireVsCodeApi();
          
          function queryAll(command) {
            vscode.postMessage({ action: 'queryAll', command });
          }
          
          function sendCommand(clientKey, command, payload) {
            vscode.postMessage({ action: 'sendCommand', clientKey, command, payload });
          }
          
          function generateReport() {
            vscode.postMessage({ action: 'generateReport' });
          }
          
          window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'update') {
              updateDashboard(message.data);
            }
          });
          
          function updateDashboard(data) {
            // Update stats
            document.getElementById('stats').innerHTML = \`
              <div class="stat-box">
                <h3>Total Clients</h3>
                <div class="stat-value">\${data.total}</div>
              </div>
              <div class="stat-box">
                <h3>Online</h3>
                <div class="stat-value" style="color: #4caf50;">\${data.online}</div>
              </div>
              <div class="stat-box">
                <h3>Offline</h3>
                <div class="stat-value" style="color: #f44336;">\${data.offline}</div>
              </div>
            \`;
            
            // Update client list
            const clientsHtml = data.clients.length > 0 
              ? data.clients.map(c => \`
                <div class="client-card \${c.status}">
                  <h3>\${c.hostname} (\${c.username})</h3>
                  <div class="client-info"><strong>Workspace:</strong> \${c.workspace || 'None'}</div>
                  <div class="client-info"><strong>BBrainy:</strong> \${c.bbrainyActive ? '✅ Active' : '❌ Inactive'}</div>
                  <div class="client-info"><strong>Status:</strong> \${c.status}</div>
                  <div class="client-info"><strong>Last Seen:</strong> \${new Date(c.lastSeen).toLocaleString()}</div>
                  <div style="margin-top: 10px;">
                    <button onclick="sendCommand('\${c.key}', 'getSystemInfo')">🔄 Refresh</button>
                    <button onclick="sendCommand('\${c.key}', 'forceBBrainy')">▶️ Force BBrainy</button>
                    <button onclick="sendCommand('\${c.key}', 'setAlarm', {intervalMs: 3600000})">⏰ Set Alarm</button>
                    <button onclick="sendCommand('\${c.key}', 'getWorkspace')">📁 Get Workspace</button>
                  </div>
                </div>
              \`).join('')
              : '<p>No clients connected</p>';
            
            document.getElementById('clients').innerHTML = clientsHtml;
          }
        </script>
      </body>
      </html>
    `;
  }

  private updateDashboard() {
    if (!this.panel) return;

    const clientsArray = Array.from(this.clients.values());
    const data = {
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
    };

    this.panel.webview.postMessage({ type: 'update', data });
  }

  private async handleDashboardAction(message: any) {
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
    if (this.wss) {
      this.wss.close();
    }
    if (this.server) {
      this.server.close();
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  const server = new MonitorServer();

  context.subscriptions.push(
    vscode.commands.registerCommand('serverMonitor.start', () => {
      server.start();
    }),
    vscode.commands.registerCommand('serverMonitor.showDashboard', () => {
      server.showDashboard();
    }),
    vscode.commands.registerCommand('serverMonitor.generateReport', () => {
      server.generateReport();
    })
  );

  // Auto-start server if configured
  const config = vscode.workspace.getConfiguration('serverMonitor');
  if (config.get<boolean>('autoStart')) {
    server.start();
  }
}

export function deactivate() {
  // Cleanup
}
```

### Server Package.json

```json
{
  "name": "server-monitor",
  "displayName": "Server Monitor Dashboard",
  "description": "Server-side monitoring and control dashboard",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "activationEvents": ["onStartupFinished"],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "serverMonitor.start",
        "title": "Start Monitor Server"
      },
      {
        "command": "serverMonitor.showDashboard",
        "title": "Show Monitor Dashboard"
      },
      {
        "command": "serverMonitor.generateReport",
        "title": "Generate Client Report"
      }
    ],
    "configuration": {
      "title": "Server Monitor",
      "properties": {
        "serverMonitor.port": {
          "type": "number",
          "default": 8080,
          "description": "WebSocket server port"
        },
        "serverMonitor.autoStart": {
          "type": "boolean",
          "default": false,
          "description": "Automatically start server on VS Code startup"
        },
        "serverMonitor.authorizedKeys": {
          "type": "array",
          "default": [],
          "description": "List of authorized client keys"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "dependencies": {
    "ws": "^8.14.0"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "@types/vscode": "^1.85.0",
    "@types/ws": "^8.5.0",
    "typescript": "^5.3.0"
  }
}
```

## Security & Authentication

### Client Key Generation

```typescript
function generateClientKey(): string {
  const crypto = require('crypto');
  const machineId = require('os').hostname();
  const userId = require('os').userInfo().username;
  
  return crypto
    .createHash('sha256')
    .update(`${machineId}-${userId}-${Date.now()}`)
    .digest('hex');
}
```

### Server-Side Validation

```typescript
class MonitorServer {
  private authorizedKeys: Set<string> = new Set();

  private async validateClient(clientKey: string): Promise<boolean> {
    const config = vscode.workspace.getConfiguration('serverMonitor');
    const authorizedKeys = config.get<string[]>('authorizedKeys') || [];
    
    // Auto-authorize or check against list
    if (authorizedKeys.length === 0) {
      return true; // Open mode
    }
    
    return authorizedKeys.includes(clientKey);
  }

  private async registerClient(ws: any, message: any) {
    const isValid = await this.validateClient(message.clientKey);
    
    if (!isValid) {
      ws.send(JSON.stringify({ error: 'Unauthorized' }));
      ws.close();
      return;
    }

    // Continue with registration...
  }
}
```

## Available Commands

### Server-to-Client Commands

| Command | Description | Payload |
|---------|-------------|---------|
| `getSystemInfo` | Get full system information | None |
| `checkBBrainy` | Check BBrainy extension status | None |
| `forceBBrainy` | Activate BBrainy extension | None |
| `setAlarm` | Set up BBrainy usage reminder | `{ intervalMs: number }` |
| `getWorkspace` | Get current workspace info | None |

### Adding Custom Commands

**Client Side**:
```typescript
private async handleServerCommand(data: WebSocket.Data) {
  const message = JSON.parse(data.toString());
  
  switch (message.command) {
    case 'customCommand':
      // Your custom logic here
      this.sendResponse({ result: 'success' });
      break;
  }
}
```

**Server Side**:
```typescript
// Send custom command
await this.sendCommand(clientKey, 'customCommand', { param: 'value' });
```

## Project Structure

```
workspace/
├── client-extension/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── extension.ts          # Main entry point
│   │   ├── client.ts              # WebSocket client logic
│   │   ├── collectors/
│   │   │   ├── systemInfo.ts      # System information collector
│   │   │   ├── workspaceInfo.ts   # Workspace information collector
│   │   │   └── bbrainyMonitor.ts  # BBrainy extension monitor
│   │   ├── commands/
│   │   │   └── handlers.ts        # Command handlers
│   │   └── utils/
│   │       ├── keyGenerator.ts    # Client key generation
│   │       └── reconnect.ts       # Reconnection logic
│   └── README.md
│
└── server-extension/
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── extension.ts           # Main entry point
    │   ├── server.ts              # WebSocket server logic
    │   ├── dashboard/
    │   │   ├── webview.html       # Dashboard UI
    │   │   └── styles.css         # Dashboard styles
    │   ├── reporting/
    │   │   ├── generator.ts       # Report generator
    │   │   └── templates.ts       # Report templates
    │   ├── auth/
    │   │   └── validator.ts       # Client authentication
    │   └── storage/
    │       └── clientRegistry.ts  # Client data persistence
    └── README.md
```

## Deployment Options

### 1. Local Network Deployment

**Best for**: Teams in same office/network

```typescript
// Server configuration
{
  "serverMonitor.port": 8080,
  "serverMonitor.autoStart": true
}

// Client configuration
{
  "clientMonitor.serverUrl": "ws://192.168.1.100:8080"
}
```

### 2. Cloud Deployment (AWS Example)

**Best for**: Distributed teams

1. Deploy WebSocket server to EC2/ECS
2. Use Application Load Balancer with WebSocket support
3. Configure SSL/TLS certificate
4. Update client configuration:

```json
{
  "clientMonitor.serverUrl": "wss://monitor.yourcompany.com"
}
```

### 3. Hybrid with ngrok

**Best for**: Testing/temporary access

```bash
# On server machine
ngrok http 8080
```

```json
// Client configuration
{
  "clientMonitor.serverUrl": "wss://xxxx-xx-xxx-xxx-xx.ngrok.io"
}
```

## Data Flow Examples

### Example 1: Check BBrainy Status on All Clients

```
Server Dashboard                 WebSocket                  Client 1, 2, 3...
      |                              |                            |
      |--- queryAll('checkBBrainy') -|                            |
      |                              |--- command: checkBBrainy ->|
      |                              |                            |
      |                              |<-- response: {installed, active} --|
      |<--- aggregate responses -----|                            |
      |                              |                            |
  [Display in UI]                                                 |
```

### Example 2: Force BBrainy Activation

```
Server Dashboard                 WebSocket                  Client
      |                              |                            |
      |--- sendCommand(key, 'forceBBrainy') --|                   |
      |                              |--- command: forceBBrainy ->|
      |                              |                            |
      |                              |                      [Activates BBrainy]
      |                              |                            |
      |                              |<-- response: {success: true} --|
      |<--- confirmation ------------|                            |
      |                              |                            |
  [Update UI status]                                              |
```

## Advanced Features

### 1. Historical Data Tracking

```typescript
interface ClientHistory {
  clientKey: string;
  records: {
    timestamp: number;
    systemInfo: any;
    bbrainyStatus: any;
  }[];
}

class HistoryTracker {
  private history: Map<string, ClientHistory> = new Map();

  addRecord(clientKey: string, data: any) {
    if (!this.history.has(clientKey)) {
      this.history.set(clientKey, { clientKey, records: [] });
    }
    
    this.history.get(clientKey)!.records.push({
      timestamp: Date.now(),
      ...data
    });
  }

  getClientHistory(clientKey: string, hours: number = 24) {
    const history = this.history.get(clientKey);
    if (!history) return [];
    
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return history.records.filter(r => r.timestamp > cutoff);
  }
}
```

### 2. Alert System

```typescript
interface Alert {
  type: 'warning' | 'error' | 'info';
  message: string;
  clientKey: string;
  timestamp: number;
}

class AlertSystem {
  private alerts: Alert[] = [];

  checkClientHealth(client: Client) {
    // Check if BBrainy should be active but isn't
    if (!client.info.bbrainyStatus?.active) {
      this.addAlert({
        type: 'warning',
        message: `BBrainy inactive on ${client.info.hostname}`,
        clientKey: client.key,
        timestamp: Date.now()
      });
    }

    // Check if client hasn't been seen in a while
    if (Date.now() - client.lastSeen > 300000) { // 5 minutes
      this.addAlert({
        type: 'error',
        message: `Client ${client.info.hostname} not responding`,
        clientKey: client.key,
        timestamp: Date.now()
      });
    }
  }

  addAlert(alert: Alert) {
    this.alerts.push(alert);
    vscode.window.showWarningMessage(alert.message);
  }
}
```

### 3. Batch Operations

```typescript
async executeBatchOperation(
  clientKeys: string[], 
  command: string, 
  payload?: any
) {
  const results = await Promise.allSettled(
    clientKeys.map(key => this.sendCommand(key, command, payload))
  );

  const success = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  vscode.window.showInformationMessage(
    `Batch operation complete: ${success} succeeded, ${failed} failed`
  );

  return results;
}
```

## Testing

### Unit Tests

```typescript
// test/client.test.ts
import * as assert from 'assert';
import { ClientMonitor } from '../src/client';

suite('Client Monitor Tests', () => {
  test('Should generate unique client key', () => {
    const key1 = generateClientKey();
    const key2 = generateClientKey();
    
    assert.notStrictEqual(key1, key2);
    assert.strictEqual(key1.length, 64); // SHA-256 hex
  });

  test('Should collect system info', async () => {
    const info = await collectSystemInfo();
    
    assert.ok(info.hostname);
    assert.ok(info.username);
    assert.ok(info.platform);
  });
});
```

### Integration Tests

```typescript
// test/integration.test.ts
suite('Client-Server Integration', () => {
  test('Client should register with server', async () => {
    const server = new MonitorServer();
    await server.start();

    const client = new ClientMonitor();
    await client.connect();

    // Wait for registration
    await new Promise(resolve => setTimeout(resolve, 1000));

    assert.strictEqual(server.clients.size, 1);
  });
});
```

## Performance Considerations

### 1. Connection Pooling

```typescript
const MAX_CLIENTS = 1000;
const MAX_MESSAGES_PER_SECOND = 100;

class RateLimiter {
  private messageCount = new Map<string, number>();

  canSend(clientKey: string): boolean {
    const count = this.messageCount.get(clientKey) || 0;
    if (count >= MAX_MESSAGES_PER_SECOND) {
      return false;
    }
    
    this.messageCount.set(clientKey, count + 1);
    return true;
  }

  reset() {
    this.messageCount.clear();
  }
}
```

### 2. Message Compression

```typescript
import * as zlib from 'zlib';

function compressMessage(data: any): Buffer {
  const json = JSON.stringify(data);
  return zlib.gzipSync(Buffer.from(json));
}

function decompressMessage(buffer: Buffer): any {
  const json = zlib.gunzipSync(buffer).toString();
  return JSON.parse(json);
}
```

## Troubleshooting

### Common Issues

#### 1. Client Can't Connect

**Symptoms**: Client shows "Connection refused" or timeout

**Solutions**:
- Check server is running: Look for "Monitor server running" message
- Verify firewall allows port 8080
- Check serverUrl configuration
- Test with: `telnet localhost 8080`

#### 2. Clients Disconnecting Frequently

**Symptoms**: Clients appear offline repeatedly

**Solutions**:
- Increase heartbeat timeout
- Check network stability
- Review WebSocket configuration
- Add reconnection backoff

```typescript
private scheduleReconnect() {
  const backoff = Math.min(this.reconnectAttempts * 1000, 30000);
  setTimeout(() => {
    this.connect();
    this.reconnectAttempts++;
  }, backoff);
}
```

#### 3. High Memory Usage

**Symptoms**: Server extension using excessive RAM

**Solutions**:
- Implement history rotation
- Limit stored messages
- Clear old client records

```typescript
private pruneOldClients() {
  const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
  
  for (const [key, client] of this.clients) {
    if (client.lastSeen < cutoff && client.status === 'offline') {
      this.clients.delete(key);
    }
  }
}
```

## Next Steps

### Phase 1: MVP
- [ ] Implement basic client-server connection
- [ ] Create simple dashboard
- [ ] Add system info collection
- [ ] Test with 2-3 clients

### Phase 2: Core Features
- [ ] BBrainy monitoring
- [ ] Command execution
- [ ] Report generation
- [ ] Client authentication

### Phase 3: Advanced Features
- [ ] Historical data tracking
- [ ] Alert system
- [ ] Batch operations
- [ ] Cloud deployment

### Phase 4: Polish
- [ ] UI improvements
- [ ] Performance optimization
- [ ] Comprehensive documentation
- [ ] User guide and tutorials

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [WebSocket Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Node.js ws Library](https://github.com/websockets/ws)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT

## Contributing

Contributions welcome! Please follow the standard fork and pull request workflow.
