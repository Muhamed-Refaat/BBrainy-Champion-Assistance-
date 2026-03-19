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

## Quick Start

1. **Set Sync Folder**
   - Open Command Palette (Ctrl+Shift+P)
   - Run: `Client Monitor: Set Sync Folder`
   - Provide the UNC path to the shared sync folder (e.g., `\\server\share\sync`)

2. **Set Server Key**
   - Run: `Client Monitor: Set Server Key`
   - Enter the server key (must match server's `serverMonitor.serverId`)

3. **Check Status**
   - Look at the status bar on the right side of VS Code
   - Should show `Monitor: Active` when configured correctly
   - Click the status bar item to open the action menu

4. **Wait for Server**
   - The client automatically scans for commands from the server
   - Once the server is running and sees this client, commands will arrive
   - Check the status bar action menu to see the current state

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

When a server sends the `checkBBrainy` command, the client responds with:
```json
{
  "installed": true,
  "active": true,
  "version": "4.4.1",
  "lastUsedTime": "2026-02-23 16:47:45",
  "totalUsage": 4339
}
```

This data is then displayed in the server's web view with a contribution graph showing usage activity over the last 12 weeks.

## Commands the Server Can Send

The client can handle these server-initiated commands:

### System Information
- `getSystemInfo` - Collects and returns system information

### BBrainy Management
- `checkBBrainy` - Checks BBrainy installation status and usage data
- `forceBBrainy` - Activates BBrainy extension if not already active

### Workspace Management
- `getWorkspace` - Returns current workspace and open files
- `getAssets` - Returns asset/client information

### Reporting
- `getUsageReport` - Generates a usage report for specified time period

### Notifications & Reminders
- `setNotifier` - Starts a periodic notifier with beep sounds (1-120 minute intervals)
- `closeNotifier` - Stops the active notifier
- `displayReminderScreen` - Shows a reminder screen with title and body text
- `setAlarm` - Sets an alarm-style reminder

### Configuration
- `setPollInterval` - Adjusts how often the client polls for new commands
- `setUpdateCheckInterval` - Adjusts how often the client checks for extension updates

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

### Set Notifier

When the server sends a `setNotifier` command with an interval (1-120 minutes):
- The client validates the interval on the client side
- A periodic beep notification plays at the specified interval
- Each beep uses PowerShell's console beep function for audio feedback
- Only one notifier can run per client instance
- The notifier continues until explicitly closed

### Reminder Screen

The `displayReminderScreen` command shows a dedicated popup with:
- A title (e.g., "Important Message")
- Body text content
- Large 56px bell icon for visibility
- Professional dark theme with gradient styling
- Easy dismissal by closing the window

Example reminder screen display:
- Title appears horizontally next to the bell icon
- Body text can contain longer messages
- Styled with glass-morphism effect and smooth animations

### Close Notifier

The `closeNotifier` command:
- Stops the active periodic notifier
- Clears the interval timer
- Removes the notification from the client instance

## Common Workflows

### Responding to a BBrainy Status Check

When the server sends a `checkBBrainy` command:
1. The client automatically collects BBrainy status information
2. Returns data including:
   - Installation status (true/false)
   - Activation status (true/false)
   - Version number from the extension
   - Last used time (parsed from log file)
   - Total usage count (from log entries)
3. The server displays this in a detailed webview with a contribution graph

No action is required from you; the client handles this automatically.

### Enabling Periodic Reminders

When the server sends a `setNotifier` command:
1. A periodic beep plays on your machine at the specified interval
2. Each beep consists of two 300ms tones separated by 100ms
3. To stop the notifier, the server can send `closeNotifier`
4. Only one notifier runs at a time per client instance

### Viewing Reminder Messages

When the server sends a `displayReminderScreen` command:
1. A modal window appears on your machine
2. It displays the title and message body from the server
3. You can dismiss it by closing the window
4. The message is styled with icons and professional formatting

### Checking Usage Reports

Use `Client Monitor: Show BBrainy Usage Report` command to:
1. View your own usage statistics
2. See a breakdown of time spent in different agents
3. Access chart visualizations of your usage patterns
4. Verify that the log file is being tracked correctly

If the report is empty, check:
- The log file path: `C:\Users\<username>\AppData\Local\AI4ALL_log\AI4ALL_log.log`
- The file exists and is readable
- The sync folder is correctly configured

## Tips & Best Practices

### Configuration Tips

- **Server Key**: Make sure it exactly matches the server's `serverMonitor.serverId`
- **Sync Folder Path**: Use UNC paths (e.g., `\\server\share\sync`) for shared network folders
- **Test Connection**: After setup, click the status bar item to verify "Monitor: Active"

### Notification Tips

- **Volume**: Beep notifications play through your system speaker; adjust system volume as needed
- **Interval Duration**: 5-15 minutes is typical for reminders; 30-60 minutes for less urgent items
- **Multiple Reminders**: Only one notifier runs at a time; new ones replace old ones
- **Dismissing**: Close reminder screens promptly to avoid clutter

### Usage Report Tips

- **Log File Path**: The client reads from `C:\Users\<username>\AppData\Local\AI4ALL_log\AI4ALL_log.log`
- **Reporting**: The server can request custom time periods; provide the hours you need analyzed
- **History**: The log file grows over time; server may periodically archive old entries

### Connection Tips

- **Status Bar Indicator**: If it shows "Inactive", verify sync folder path and network connectivity
- **Network Issues**: If you become offline and then online, the client automatically re-establishes connection
- **Backlog**: If the server is offline when you complete tasks, responses are queued in backlog

### Performance Tips

- **Sync Folder Size**: Very large shared folders may take longer to scan; keep old files archived
- **Response Time**: Expect 1-5 second delays for commands depending on network speed
- **Polling**: The poll interval controls how often the client checks for new commands; adjust per server config

### Troubleshooting Tips

- **Not Receiving Commands**: Check that your server key matches the server's ID
- **Status Shows Offline**: Verify network access to the sync folder; check firewall rules
- **Empty Usage Report**: Ensure the log file exists and the sync folder is properly configured
- **Sync Folder Error**: Try remapping the network drive if using UNC paths

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