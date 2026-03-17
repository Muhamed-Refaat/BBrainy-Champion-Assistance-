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

## Opening the Dashboard

The extension contributes a Monitor icon in the VS Code activity bar.

Inside it you will find the `Command Center` webview, which is the main dashboard for:

- Viewing clients
- Selecting a client
- Sending commands
- Reviewing responses
- Managing sync timing
- Opening backlog views

## Server Commands

These commands are available from the Command Palette:

- `Focus Monitor Dashboard`
- `Generate Client Report`
- `Server Monitor: Publish Client Update (VSIX)`
- `Server Monitor: Start Server`
- `Server Monitor: Stop Server`

There is also an internal backlog view command used by the dashboard:

- `serverMonitor.viewBacklog`

## Dashboard Overview

The dashboard provides:

- A server status section
- Fleet counts for total, sync, and offline clients
- A selectable client list
- Per-client actions
- A command queue log
- A last response panel
- Sync tuning controls
- Global actions such as viewing and clearing backlog

## Client Discovery and Presence

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

## Generating Reports

Use `Generate Client Report` or the dashboard actions to collect usage or machine information.

The server can display formatted results for:

- Usage reports
- BBrainy status
- System information
- Workspace data

Usage reports may open automatically in a dedicated webview when returned by a client.

## Publishing Client Updates

Use:

- `Server Monitor: Publish Client Update (VSIX)`

This publishes the client extension VSIX into the configured release folder so clients can detect and install it.

Recommended practice:

1. Build the client VSIX.
2. Publish it to the shared release folder.
3. Let clients detect it through their configured update checks.

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