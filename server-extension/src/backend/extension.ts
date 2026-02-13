import * as vscode from 'vscode';
import { MonitorServer } from './MonitorServer';
import { MonitorViewProvider } from './providers/MonitorViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const server = new MonitorServer();
    server.initialize(context);

    const provider = new MonitorViewProvider(context.extensionUri, server);
    server.setProvider(provider);

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
