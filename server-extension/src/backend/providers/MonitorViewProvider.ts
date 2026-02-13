import * as vscode from 'vscode';
import { MonitorServer } from '../MonitorServer';

export class MonitorViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'monitor-dashboard';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly server: MonitorServer
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        // Set options
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'dist')
            ]
        };

        // Set html
        webviewView.webview.html = this._getWebviewContent(webviewView.webview);

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.action) {
                case 'sendCommand':
                    await this.server.sendCommand(message.clientKey, message.command, message.payload);
                    break;
                case 'queryAll':
                    await this.server.queryAllClients(message.command);
                    break;
                case 'generateReport':
                    await this.server.generateReport();
                    break;
                case 'startServer':
                    await this.server.start();
                    break;
                case 'stopServer':
                    this.server.stop();
                    break;
            }
        });

        // Trigger initial update
        this.server.triggerUpdate();
    }

    public update(data: any) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'update',
                data: data
            });
        }
    }

    private _getWebviewContent(webview: vscode.Webview): string {
        const nonce = getNonce();
        const webviewUri = (filePath: string) => webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', filePath));

        const jsUri = webviewUri('monitor-webview.js');
        const cssUri = webviewUri('monitor-webview.css');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="
                    default-src 'none';
                    style-src ${webview.cspSource} 'unsafe-inline';
                    font-src ${webview.cspSource};
                    img-src ${webview.cspSource} https: data:;
                    script-src 'nonce-${nonce}';
                    connect-src 'self' ${webview.cspSource} https: ws:;
                ">
                <link href="${cssUri}" rel="stylesheet">
                <title>Monitor Dashboard</title>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${jsUri}"></script>
            </body>
            </html>
        `;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
