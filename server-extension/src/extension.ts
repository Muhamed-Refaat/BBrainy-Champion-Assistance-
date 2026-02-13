import * as vscode from 'vscode';
import { WebSocketServer } from 'ws';
import * as http from 'http';
import { resolve } from 'path';

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
  private view: vscode.WebviewView | null = null;
  private extensionUri: vscode.Uri | null = null;

  initialize(extensionUri: vscode.Uri) {
    this.extensionUri = extensionUri;
  }

  async start() {
    if (!this.extensionUri) {
      vscode.window.showErrorMessage('Server not initialized with extensionUri');
      return;
    }
    const config = vscode.workspace.getConfiguration('serverMonitor');
    const port = config.get<number>('port') || 8080;

    this.server = http.createServer();
    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on('connection', (ws) => {
      ws.on('message', (data) => this.handleClientMessage(ws, data));
      ws.on('close', () => this.handleClientDisconnect(ws));
    });

    this.server.listen(port, () => {
      vscode.window.showInformationMessage(`Monitor server running on port ${port}`);
    });

    setInterval(() => this.checkHeartbeats(), 30000);
  }

  setWebviewView(view: vscode.WebviewView) {
    this.view = view;

    // Ensure we have a valid URI for the dist folder
    const distUri = this.extensionUri
      ? vscode.Uri.joinPath(this.extensionUri, 'dist')
      : vscode.Uri.file(resolve(__dirname, '..', 'dist'));

    this.view.webview.options = {
      enableScripts: true,
      localResourceRoots: [distUri]
    };

    this.view.webview.html = this.getDashboardHtml();
    this.view.webview.onDidReceiveMessage(message => this.handleDashboardAction(message));

    // Initial data push
    this.updateDashboard();
  }

  private handleClientMessage(ws: any, data: any) {
    let message;
    try {
      message = JSON.parse(data.toString());
    } catch (e) {
      return;
    }

    if (message.type === 'register') {
      this.registerClient(ws, message);
    } else if (message.type === 'response') {
      this.handleResponse(message);
    } else if (message.type === 'heartbeat') {
      this.updateHeartbeat(message.clientKey);
    }

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
    vscode.window.showInformationMessage(`Client registered: ${client.info.username}@${client.info.hostname}`);
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
      if (now - client.lastSeen > 60000) {
        client.status = 'offline';
      }
    }
    this.updateDashboard();
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

  private getDashboardHtml(): string {
    const fs = require('fs');
    const path = require('path');

    if (!this.extensionUri || !this.view) {
      return '';
    }

    const distUri = vscode.Uri.joinPath(this.extensionUri, 'dist');
    const distPath = distUri.fsPath;

    // We prioritize the generated index.html which contains the inline bundle
    const filePath = path.join(distPath, 'index.html');

    if (!fs.existsSync(filePath)) {
      return `
        <!DOCTYPE html>
        <html>
            <body style="background: #0f172a; color: #94a3b8; font-family: sans-serif; padding: 20px; text-align: center;">
            <h1 style="color: #60a5fa; font-size: 1.2rem;">Dashboard Build Not Found</h1>
            <p style="font-size: 0.8rem;">Expected file at: <br/>${filePath}</p>
            <p style="font-size: 0.8rem;">Please run <code>npm run build:webview</code></p>
            </body>
        </html>
        `;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Extract script and style content using regex
      // We match any script/style tag content. 
      // Note: This assumes the build output is flat (inline).
      const scriptMatch = fileContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      const styleMatch = fileContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);

      // If no inline script found, maybe it's external? 
      // Ideally we handled external bundle generation, but we are falling back to parsing index.html.
      // If we can't find inline script, we just use the original content but inject CSP.
      const scriptContent = scriptMatch ? scriptMatch[1] : '';
      const styleContent = styleMatch ? styleMatch[1] : '';

      // Create a webview-compatible URI for the build output directory
      const baseUri = this.view.webview.asWebviewUri(distUri);
      const nonce = getNonce();

      // Strict CSP
      const csp = `
            default-src 'none'; 
            style-src 'unsafe-inline' ${this.view.webview.cspSource}; 
            script-src 'unsafe-inline' ${this.view.webview.cspSource} 'nonce-${nonce}'; 
            img-src 'self' data: https:; 
            font-src 'self' data: https:; 
            connect-src 'self' ${this.view.webview.cspSource} https: ws:;
        `.replace(/\s+/g, ' ').trim();

      // If we extracted content effectively, we reconstruct. 
      // If not (complex html structure), we fallback to injection.
      // Given the minified single-file output, reconstruction is safer to control headers.

      if (scriptContent) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="${csp}">
                <base href="${baseUri}/">
                <title>Monitor Dashboard</title>
                ${styleContent ? `<style>${styleContent}</style>` : ''}
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}">
                   ${scriptContent}
                </script>
            </body>
            </html>
           `;
      } else {
        // Fallback: Use original HTML but force CSP
        let html = fileContent;
        // Remove existing CSP
        html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, '');
        // Inject new head config
        html = html.replace('<head>', `<head>
                <meta http-equiv="Content-Security-Policy" content="${csp}">
                <base href="${baseUri}/">
             `);
        return html;
      }

    } catch (e) {
      return `<h1>Error reading dashboard file: ${e}</h1>`;
    }
  }

  updateDashboard() {
    if (!this.view) return;

    const clientsArray = Array.from(this.clients.values());
    this.view.webview.postMessage({
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
    this.wss?.close();
    this.server?.close();
  }
}

class MonitorViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'monitor-dashboard';

  constructor(private readonly server: MonitorServer) { }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.server.setWebviewView(webviewView);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const server = new MonitorServer();
  server.initialize(context.extensionUri);

  const provider = new MonitorViewProvider(server);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(MonitorViewProvider.viewType, provider),
    vscode.commands.registerCommand('serverMonitor.start', () => server.start()),
    vscode.commands.registerCommand('serverMonitor.showDashboard', () => {
      vscode.commands.executeCommand('workbench.view.extension.monitor-explorer');
    }),
    vscode.commands.registerCommand('serverMonitor.generateReport', () => server.generateReport())
  );

  const config = vscode.workspace.getConfiguration('serverMonitor');
  if (config.get<boolean>('autoStart')) {
    server.start();
  }
}

export function deactivate() { }

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
