# Client Monitor User Guide

## Purpose

Client Monitor is the machine-side extension for BBrainy Champion Assistant.
It runs inside VS Code on each client machine and communicates with the server extension through a shared sync folder.

The client extension is responsible for:

- Registering the machine with a server key
- Reading queued commands from the shared sync folder
- Returning results back to the server
- Reporting system and workspace information
- Showing local status in the VS Code status bar
- Checking for extension updates from a shared release folder
- Running local reminder and notifier actions when requested

## Before You Start

You need:

- VS Code installed on the client machine
- The Client Monitor extension installed
- Access to the same shared folders used by the server
- A server key supplied by the server operator

Typical shared folders:

- Sync folder: used for commands, responses, and presence files
- Client release folder: used for client VSIX updates

Default values in this project:

```json
{
  "clientMonitor.serverKey": "default",
  "clientMonitor.syncPath": "\\\\cai1-users\\share\\AI-Champion-Assist\\sync",
  "clientMonitor.clientReleasePath": "\\\\cai1-users\\share\\AI-Champion-Assist\\client-release"
}
```

## Initial Setup

Open the Command Palette and run these commands as needed:

- `Client Monitor: Set Server Key`
- `Client Monitor: Set Sync Folder`
- `Client Monitor: Set Client Release Folder`

Recommended setup order:

1. Set the sync folder.
2. Set the client release folder.
3. Set the server key.
4. Wait for the status bar to show the extension as active.

## Daily Use

The extension activates automatically on startup.

When configured correctly, it will:

- Write a presence file into the shared sync folder
- Poll its own queue file for commands from the server
- Execute supported commands locally
- Write results back to the server through the shared sync folder
- Refresh its presence periodically so the server sees the client as online

## Status Bar

The client adds a status bar item on the right side of VS Code.

States:

- `Monitor: Active` means the sync-folder mode is configured and polling is running.
- `Monitor: Inactive` usually means the sync path is missing or disabled.

Click the status bar item to open the action menu.

## Client Commands

These commands are available from the Command Palette:

- `Client Monitor: Set Server Key`
- `Client Monitor: Set Sync Folder`
- `Client Monitor: Set Client Release Folder`
- `Client Monitor: Show Connection Status`
- `Client Monitor: Reset to Default Server`
- `Client Monitor: Open Action Menu`
- `Client Monitor: Show BBrainy Usage Report`
- `Client Monitor: Set BBrainy Notifier`
- `Client Monitor: Close BBrainy Notifier`

## Action Menu

The action menu is opened from the status bar item.

Depending on the current state, it allows the user to:

- View status
- Change the server key
- Show the usage report
- Enable or disable the notifier
- Reset back to the default server key

## Commands the Server Can Send

The client can handle these server-initiated commands:

- `getSystemInfo`
- `checkBBrainy`
- `forceBBrainy`
- `setAlarm`
- `getWorkspace`
- `getUsageReport`
- `setNotifier`
- `closeNotifier`
- `displayReminderScreen`
- `setPollInterval`
- `setUpdateCheckInterval`
- `getAssets`

## How Updates Work

If `clientMonitor.clientReleasePath` is configured, the client checks the shared release folder for newer VSIX files.

Expected naming pattern:

```text
client-monitor-x.y.z.vsix
```

When a newer version is found:

1. The VSIX is copied locally.
2. VS Code installs it.
3. The user is prompted to reload the window.

The server can also push a different update-check interval through the dashboard.

## Usage Report

The client can read a local usage log and show a usage report.

Current log path used by the extension:

```text
C:\Users\<username>\AppData\Local\AI4ALL_log\AI4ALL_log.log
```

If the file does not exist or cannot be parsed, the report may be empty or partial.

## Notifier and Reminder Features

The client supports local reminder actions, including:

- Periodic notifier intervals
- Closing an active notifier
- Displaying a reminder screen
- Setting alarm-style reminders through server commands

These actions run locally on the client machine.

## Settings Reference

### `clientMonitor.serverKey`

- Type: string
- Default: `default`
- Must match the server's configured key

### `clientMonitor.syncPath`

- Type: string
- Shared folder used for queue, results, presence, and backlog
- Leave empty to disable sync-folder communication

### `clientMonitor.clientReleasePath`

- Type: string
- Shared folder containing client VSIX releases for auto-update
- Leave empty to disable client auto-updates

## Shared Folder Behavior

The client uses the sync folder for:

- `clients/<serverKey>/...` presence files
- `queue/...` incoming commands
- `results/...` live responses when the server is online
- `server-backlog/...` responses when the server is offline

The implementation is designed to be safe for UNC paths and multi-instance edge cases.

## Troubleshooting

### Client stays inactive

Check:

- `clientMonitor.syncPath` is set correctly
- The shared folder is reachable from the machine
- VS Code has permission to access the folder

### Server does not see the client

Check:

- The client and server use the same server key
- The client and server use the same sync folder
- A presence file is being written under `clients/<serverKey>/`

### Commands are not executed

Check:

- The queue file exists under `queue/<username-hostname>.json`
- The client machine can access the sync folder
- The client status bar shows `Monitor: Active`

### Auto-update does not run

Check:

- `clientMonitor.clientReleasePath` is configured
- The release folder contains a correctly named VSIX
- The VSIX version is newer than the installed client version

## Recommended User Workflow

1. Install the extension.
2. Configure the sync folder.
3. Configure the release folder if updates are used.
4. Set the server key provided by the server operator.
5. Confirm the status bar shows the client as active.
6. Use the action menu for local status, report, and notifier actions.

## Notes

- This extension uses the sync-folder workflow in the current implementation.
- The top-level repository README may describe older architecture details that no longer match the shipped behavior.