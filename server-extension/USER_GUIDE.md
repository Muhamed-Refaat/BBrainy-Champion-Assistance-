# Server Monitor Dashboard User Guide

## Purpose

Server Monitor Dashboard is the operator-side extension for BBrainy Champion Assistant.
It runs inside VS Code and provides a dashboard for monitoring clients, sending commands, reviewing responses, and publishing client updates.

The server extension is responsible for:

- Discovering clients through a shared sync folder
- Tracking online and offline clients
- Sending commands to individual clients
- Showing command results and backlog results
- Managing sync timing from the dashboard
- Publishing client VSIX updates to a shared release folder

## Before You Start

You need:

- VS Code installed on the server/operator machine
- The Server Monitor Dashboard extension installed
- A shared sync folder accessible by both the server and all clients
- Optionally, a shared release folder for client extension updates

Default values in this project:

```json
{
  "serverMonitor.serverId": "default",
  "serverMonitor.syncPath": "\\\\cai1-users\\share\\AI-Champion-Assist\\sync",
  "serverMonitor.clientReleasePath": "\\\\cai1-users\\share\\AI-Champion-Assist\\client-release"
}
```

## Initial Setup

Open VS Code settings and configure:

- `serverMonitor.serverId`
- `serverMonitor.syncPath`
- `serverMonitor.clientReleasePath` if you plan to publish updates

Optional settings:

- `serverMonitor.autoStart`
- `serverMonitor.authorizedKeys`
- `serverMonitor.port`

Important:

- The current client/server workflow is sync-folder based.
- The port setting still exists in configuration but is not the primary transport used by the current implementation.

## Starting the Server

Use one of these commands:

- `Server Monitor: Start Server`
- `Focus Monitor Dashboard`

Stopping:

- `Server Monitor: Stop Server`

When running, the server writes its own presence information into the shared sync folder and starts scanning for clients and results.

## Quick Start

1. **Start the Server**
   - Open Command Palette (Ctrl+Shift+P)
   - Run: `Server Monitor: Start Server`
   - The Monitor icon appears in the activity bar

2. **View Clients**
   - Click the Monitor icon
   - See the list of connected clients in MANAGED FLEET
   - Status indicators show online/sync status

3. **Check Fleet Status**
   - Click "Scan Fleet" to broadcast BBrainy status check to all clients
   - Click "Check Assets" to view all clients in a summary webview

4. **Select and Manage a Client**
   - Click on a client in the MANAGED FLEET
   - The Control Center displays available actions
   - Choose an action from System, BBrainy, Analytics, or Notifications

5. **View Reports**
   - Click "Generate Client Report" to create a comprehensive server report
   - Use analytics buttons to generate client-specific usage reports

## Opening the Dashboard

The extension contributes a Monitor icon in the VS Code activity bar.

Inside it you will find the `Command Center` webview, which is the main dashboard for:

- Viewing clients
- Selecting a client
- Sending commands
- Reviewing responses
- Managing sync timing
- Opening backlog views

### Dashboard Overview

![Monitor Command Center](./resources/screenshots/monitor-command-center.png)

The dashboard displays:
- Server status and activity state
- Fleet statistics (total, active, and offline clients)
- Managed fleet with all connected clients
- Control center for per-client actions

## Server Commands

These commands are available from the Command Palette:

- `Focus Monitor Dashboard`
- `Generate Client Report`
- `Server Monitor: Publish Client Update (VSIX)`
- `Server Monitor: Start Server`
- `Server Monitor: Stop Server`

There is also an internal backlog view command used by the dashboard:

- `serverMonitor.viewBacklog`

## Fleet Operations

### Scan Fleet

The "Scan Fleet" button triggers a broadcast `checkBBrainy` command to all connected clients, allowing you to verify BBrainy status across your entire fleet.

![Scanning Fleet](./resources/screenshots/scanning-fleet.png)

When scanning:
- The server broadcasts the command to all clients
- Each client responds with their BBrainy installation and activation status
- Results are collected and displayed in the dashboard
- The operation shows a scanning progress state with the current server key

### Check Assets

The "Check Assets" button displays a comprehensive webview showing all connected clients with their status information:

- Total number of assets
- Online vs offline client count
- BBrainy active status count
- Detailed table with username, hostname, status indicators, and last seen timestamps

### Check Status (Per Client)

When you select a client and click "Check Status", the server:
1. Sends a `checkBBrainy` command to that specific client
2. Collects the response containing BBrainy status data
3. Displays a detailed webview showing:
   - Client identifier (username@hostname)
   - Installation status (badge indicator)
   - Version number
   - Last used time
   - Total usage count
   - 12-week contribution graph showing activity intensity

The contribution graph uses color intensity to represent usage levels, similar to GitHub contribution graphs.

Clients register themselves by writing presence files into the shared sync folder.

The server imports and refreshes clients from:

```text
clients/<serverKey>/
```

The dashboard will continue showing known clients, including clients that become offline, until they age out according to the server rules.

## Sending Commands to Clients

The server sends commands by writing queue entries into the shared sync folder.

Typical operations include:

- Get system information
- Check BBrainy status
- Force BBrainy actions
- Get workspace information
- Generate usage reports
- Set reminders and notifiers
- Adjust client poll interval
- Adjust client update-check interval

Queued commands appear in the selected client's command queue section.

### Control Center

When you select a client from the managed fleet, the Control Center displays all available actions:

![Control Center Actions](./resources/screenshots/control-center-actions.png)

The control center is organized by sections:

- **System**: Refresh node, peek directory
- **BBrainy**: Activate, Check Status, Scan Fleet
- **Analytics**: 24h Report, 7d Report, All Time, Custom
- **Notifications**: Set Reminder, Close Reminder, Reminder Screen
- **Command Queue**: Shows pending and completed commands

#### System Section

- **Refresh Node**: Collects fresh system information from the selected client
- **Peek Directory**: Shows the current workspace directory structure

#### BBrainy Section

- **Activate**: Forces the BBrainy extension to activate on the client
- **Check Status**: Retrieves and displays BBrainy status with usage data and contribution graph
- **Scan Fleet**: Broadcasts BBrainy status check to all clients (server-wide operation)

#### Analytics Section

- **24h Report**: Generates a usage report for the last 24 hours
- **7d Report**: Generates a usage report for the last 7 days
- **All Time**: Generates a usage report for all available history
- **Custom**: Allows specifying a custom time period for the report

Analytics reports display:
- Agent usage statistics
- Total entries processed
- Time-based usage breakdowns
- Chart visualization of usage patterns

#### Notifications Section

- **Set Reminder**: Opens a modal to set a periodic notifier (1-120 minute intervals)
- **Close Reminder**: Stops the active notifier on the client
- **Reminder Screen**: Opens a modal to display a reminder with title and body text

### Modal Dialogs

#### Set Notifier Modal

When you click "Set Reminder", a modal appears with:
- A number input field labeled "Set Reminder (1-120 minutes)"
- Client-side validation to ensure the interval is between 1 and 120 minutes
- A confirm button to send the command

The notifier plays a beep sound on the client at the specified interval.

#### Reminder Screen Modal

When you click "Reminder Screen", a modal appears with:
- A "Title" text input field (default: "Important Message")
- A "Body" textarea field (default: "This is your message content")
- A confirm button to send and display the reminder

The reminder screen shows on the client with:
- Large bell icon (56px)
- Title displayed horizontally next to the icon
- Body text below with proper formatting
- Glass-morphism styling with dark theme

#### Analytics Custom Report Modal

The "Custom" analytics option allows:
- Specifying a custom time period in hours
- Flexible time-based reporting

## Command Queue Log

For the selected client, the dashboard shows:

- Pending commands
- Completed commands
- Error responses
- Elapsed time for pending commands
- Frozen elapsed time for completed commands

You can also:

- Cancel a queued command
- Clear the client's queue log
- Expand a completed command to inspect its response payload inline

## Results and Backlog

There are two response paths:

- `results/` for live responses while the server is online
- `server-backlog/` for responses accumulated while the server is offline

The server polls both locations and updates the dashboard automatically.

When backlog results arrive, the server can show a dedicated backlog webview.

## Sync Tuning

The dashboard includes tuning controls for:

- Backlog poll interval
- Presence check interval
- Sync scan interval
- Selected client poll interval
- Selected client update-check interval

Behavior details:

- Server timers are persisted across VS Code sessions.
- Client-specific tuning values are shown per selected client.
- Changing one client's poll or update interval should not overwrite another client's displayed settings.

![Sync Tuning Controls](./resources/screenshots/sync-tuning-controls.png)

## Generating Reports

Use `Generate Client Report` or the dashboard actions to collect usage or machine information.

The server can display formatted results for:

- Usage reports
- BBrainy status
- System information
- Workspace data

Usage reports may open automatically in a dedicated webview when returned by a client.

### Server Report

![Server Monitor Report](./resources/screenshots/server-monitor-report.png)

The report displays:

- **Summary**: Total clients, active sync count, offline count, uninstalled count
- **Server Info**: Server key, status, machine name, username, version
- **Clients Table**: Detailed information for each connected client
  - Label, user, hostname, version, sync status, extension status
  - BBrainy active status, command queue count, last seen timestamp
- **Export as JSON**: Option to export the full report for external analysis

## Publishing Client Updates

Use:

- `Server Monitor: Publish Client Update (VSIX)`

This publishes the client extension VSIX into the configured release folder so clients can detect and install it.

Recommended practice:

1. Build the client VSIX.
2. Publish it to the shared release folder.
3. Let clients detect it through their configured update checks.

## Common Workflows

### Checking BBrainy Status Across the Fleet

1. Click "Scan Fleet" in the GLOBAL section
2. The server broadcasts `checkBBrainy` to all clients
3. Wait for responses to arrive
4. View the "Check Assets" webview to see all client statuses with a summary count

### Detailed Single Client Review

1. Select a client from the MANAGED FLEET section
2. Click "Check Status" to get detailed BBrainy information
3. View the client-specific webview showing:
   - Installation and activation status
   - Version number
   - Last used time
   - Total usage count
   - 12-week contribution graph

### Setting Up a Reminder Notification

1. Select a client from the MANAGED FLEET section
2. Click "Set Reminder" in the NOTIFICATIONS section
3. Enter an interval between 1 and 120 minutes
4. Click confirm to start the notifier
5. The client receives periodic beep notifications at the specified interval
6. Click "Close Reminder" to stop the notifier

### Sending a Custom Reminder Message

1. Select a client from the MANAGED FLEET section
2. Click "Reminder Screen" in the NOTIFICATIONS section
3. Enter a title (e.g., "Update Required")
4. Enter body text with your message
5. Click confirm to display the reminder on the client
6. The client shows a modal with your full message and large icon

### Generating Usage Reports

1. Select a client from the MANAGED FLEET section
2. Under ANALYTICS, choose:
   - "24h Report" for the last day
   - "7d Report" for the last week
   - "All Time" for complete history
   - "Custom" for a specific time period
3. The report displays in a dedicated webview with:
   - Agent usage breakdown
   - Chart visualization
   - Total entries processed

## Tips & Best Practices

### Monitoring Tips

- **Regular Fleet Checks**: Click "Scan Fleet" daily to keep up-to-date on BBrainy status
- **Check Assets View**: Use this to get a quick overview of all clients' health and status
- **Offline Clients**: The dashboard shows offline clients; consider investigating if too many are offline
- **Last Seen Timestamp**: Use this to identify clients that haven't checked in recently

### Command Tips

- **Queue Status**: Check the Command Queue log to see if commands are pending or completed
- **Error Responses**: If a command fails, the queue log shows the error message for troubleshooting
- **One Client at a Time**: Select one client before sending per-client commands for clarity

### Notification Tips

- **Short Intervals**: Use 5-15 minute intervals for time-sensitive reminders
- **Longer Messages**: Use "Reminder Screen" for detailed instructions; "Set Reminder" for periodic alarms
- **Stopping Notifiers**: Remember to close reminders when done; only one can run per client

### Report Tips

- **Compare Time Periods**: Generate 24h, 7d, and all-time reports to see usage trends
- **Export for Analysis**: Use "Export as JSON" to analyze server reports in other tools
- **Timing**: Run "Generate Client Report" regularly to track fleet metrics over time

### Sync Folder Tips

- **Monitor Folder Size**: The sync folder can grow; periodically clean up old response files
- **Network Latency**: If using UNC paths, factor in network latency when waiting for responses
- **Backlog**: Check "View Backlog" if responses seem to be delayed

### Performance Tips

- **Large Fleets**: For more than 20 clients, space out "Scan Fleet" operations to avoid overwhelming the network
- **Batch Reports**: Generate reports outside peak usage hours
- **Connection Timeouts**: Adjust polling intervals if clients frequently appear offline then online

## Settings Reference

### `serverMonitor.serverId`

- Type: string
- Default: `default`
- Must match the key used by clients

### `serverMonitor.syncPath`

- Type: string
- Shared folder used for queueing, presence, results, and backlog

### `serverMonitor.clientReleasePath`

- Type: string
- Shared folder used to publish client VSIX updates

### `serverMonitor.autoStart`

- Type: boolean
- Starts the server automatically when VS Code launches

### `serverMonitor.authorizedKeys`

- Type: array
- Reserved for client authorization scenarios

### `serverMonitor.port`

- Type: number
- Present in settings, but not the main transport path for the current sync-folder workflow

## Shared Folder Layout

The current implementation uses these main paths:

```text
queue/
results/
server-backlog/
clients/<serverKey>/
servers/
```

In practice:

- The server writes commands into `queue/`
- Clients write live results into `results/`
- Clients write deferred results into `server-backlog/`
- Clients advertise presence under `clients/<serverKey>/`
- The server advertises its own presence under `servers/`

## Troubleshooting

### No clients appear in the dashboard

Check:

- The server and clients use the same `serverId` or server key
- Both sides use the same sync folder
- Presence files are appearing under `clients/<serverKey>/`

### Commands stay queued

Check:

- The client is online and has access to the sync folder
- The queue file is being created under `queue/`
- The client status bar shows active on the client machine

### Results do not appear

Check:

- `results/` and `server-backlog/` are writable by clients
- The server still has access to the sync folder
- The selected client is the one you actually sent the command to

### Update publishing does not reach clients

Check:

- `serverMonitor.clientReleasePath` matches the client release path used by clients
- The published VSIX has the expected version bump
- The client update-check interval is not too long for your test cycle

## Recommended Operator Workflow

1. Configure the server key and sync folder.
2. Start the server.
3. Open the Command Center dashboard.
4. Confirm clients appear and are updating presence.
5. Select a client and run a simple command such as system info.
6. Adjust sync tuning only if needed.
7. Use backlog and report views when investigating offline or delayed results.
8. Publish client updates through the shared release folder when required.

## Notes

- The current implementation is centered on shared-folder synchronization.
- The top-level repository README still contains older WebSocket-oriented architecture notes and should not be treated as the main user reference.