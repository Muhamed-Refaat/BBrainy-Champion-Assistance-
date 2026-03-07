import * as vscode from 'vscode';
import { MonitorServer } from './MonitorServer';
import { MonitorViewProvider } from './providers/MonitorViewProvider';

let serverInstance: MonitorServer | null = null;

export function activate(context: vscode.ExtensionContext) {
    const server = new MonitorServer();
    serverInstance = server;
    server.initialize(context);

    const provider = new MonitorViewProvider(context.extensionUri, server);
    server.setProvider(provider);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(MonitorViewProvider.viewType, provider),
        vscode.commands.registerCommand('serverMonitor.start', () => server.start()),
        vscode.commands.registerCommand('serverMonitor.showDashboard', () => {
            vscode.commands.executeCommand('workbench.view.extension.monitor-explorer');
        }),
        vscode.commands.registerCommand('serverMonitor.generateReport', () => server.generateReport()),
        vscode.commands.registerCommand('serverMonitor.publishUpdate', () => server.publishClientUpdate()),
        vscode.commands.registerCommand('serverMonitor.stop', () => server.stop()),
        vscode.commands.registerCommand('serverMonitor.viewBacklog', () => server.showBacklogWebview())
    );

    const config = vscode.workspace.getConfiguration('serverMonitor');
    if (config.get<boolean>('autoStart')) {
        server.start();
    }
}

export function deactivate() {
    // Remove the server identity file from the sync folder when the extension is uninstalled
    serverInstance?.removeServerPresenceFile();
    serverInstance = null;
}
