import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { execSync, exec } from 'child_process';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_SERVER_KEY = 'default';
const FALLBACK_POLL_INTERVAL_MS = 15000;
const UPDATE_CHECK_INTERVAL_MS = 3600000; // 1 hour
const EXTENSION_ID = 'client-monitor';

// ─── Diagnostic Logger ────────────────────────────────────────────────────────
// Writes sync-folder activity to a local file so issues on remote machines can
// be investigated without needing physical access.
//
// Log path (Windows): %LOCALAPPDATA%\BBrainySyncLog\client-sync.log
// Log path (other):   ~/BBrainySyncLog/client-sync.log
// Rotation: capped at 2 MB; older half saved as .log.1
const LOG_MAX_BYTES = 2 * 1024 * 1024;

class DiagnosticLogger {
    private readonly logDir: string;
    private readonly logFile: string;
    private readonly tag: string;

    constructor() {
        const base = (process.platform === 'win32' && process.env['LOCALAPPDATA'])
            ? process.env['LOCALAPPDATA']!
            : os.homedir();
        this.logDir  = path.join(base, 'BBrainySyncLog');
        this.logFile = path.join(this.logDir, 'client-sync.log');
        this.tag     = `${os.userInfo().username}@${os.hostname()}`;
        try { fs.mkdirSync(this.logDir, { recursive: true }); } catch {}
        this._write('INFO ', `=== Session start — pid=${process.pid} platform=${process.platform} ===`);
    }

    info (msg: string) { this._write('INFO ', msg); }
    warn (msg: string) { this._write('WARN ', msg); }
    error(msg: string) { this._write('ERROR', msg); }
    debug(msg: string) { this._write('DEBUG', msg); }

    private _write(level: string, msg: string): void {
        const line = `[${new Date().toISOString()}] [${level}] [${this.tag}] ${msg}\n`;
        console.log(`[SyncDiag] ${line.trimEnd()}`);
        try {
            try {
                if (fs.statSync(this.logFile).size > LOG_MAX_BYTES) {
                    try { fs.unlinkSync(this.logFile + '.1'); } catch {}
                    fs.renameSync(this.logFile, this.logFile + '.1');
                }
            } catch { /* file missing — no rotation needed */ }
            fs.appendFileSync(this.logFile, line, 'utf-8');
        } catch { /* never throw from logger */ }
    }

    get filePath(): string { return this.logFile; }
}

const syncLog = new DiagnosticLogger();

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface FallbackCommand {
    id: string;
    command: string;
    payload?: any;
    timestamp: number;
    serverKey: string;
    clientKey?: string;
    clientLabel?: string;
}

// ─── UNC-safe filesystem helpers ─────────────────────────────────────────────────────────────
// VS Code's Node.js runtime (Node.js 20+) blocks fs access to UNC paths
// (\\server\share) via an internal validatePath check.  These helpers fall back
// to cmd.exe which has its own UNC network stack, bypassing the restriction.

function isUncPath(p: string): boolean {
    return process.platform === 'win32' && p.startsWith('\\\\');
}

function fsEnsureDir(dirPath: string): void {
    if (isUncPath(dirPath)) {
        try { execSync(`mkdir "${dirPath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 10000 }); } catch { /* already exists */ }
        return;
    }
    fs.mkdirSync(dirPath, { recursive: true });
}

function fsPathExists(p: string): boolean {
    if (isUncPath(p)) {
        try {
            const out = execSync(`if exist "${p}" (echo Y) else (echo N)`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 8000 }).toString().trim();
            return out === 'Y';
        } catch { return false; }
    }
    return fs.existsSync(p);
}

function fsReadText(filePath: string): string {
    if (isUncPath(filePath)) {
        const tmp = path.join(os.tmpdir(), `bba-rd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
        try {
            execSync(`copy /Y "${filePath}" "${tmp}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 15000 });
            const data = fs.readFileSync(tmp, 'utf-8');
            try { fs.unlinkSync(tmp); } catch {}
            return data;
        } catch (e) { try { fs.unlinkSync(tmp); } catch {} throw e; }
    }
    return fs.readFileSync(filePath, 'utf-8');
}

function fsWriteText(filePath: string, content: string): void {
    if (isUncPath(filePath)) {
        const tmp = path.join(os.tmpdir(), `bba-wr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
        try {
            fs.writeFileSync(tmp, content, 'utf-8');
            execSync(`copy /Y "${tmp}" "${filePath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 15000 });
            try { fs.unlinkSync(tmp); } catch {}
        } catch (e) { try { fs.unlinkSync(tmp); } catch {} throw e; }
        return;
    }
    fs.writeFileSync(filePath, content);
}

function fsDeleteFile(filePath: string): void {
    if (isUncPath(filePath)) {
        // Do NOT swallow errors — callers rely on a throw to know deletion failed.
        execSync(`del /F /Q "${filePath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 5000 });
        return;
    }
    fs.unlinkSync(filePath);
}

function fsListDir(dirPath: string): string[] {
    if (isUncPath(dirPath)) {
        try {
            const out = execSync(`dir /b "${dirPath}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 10000 }).toString();
            return out.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        } catch { return []; }
    }
    try { return fs.readdirSync(dirPath); } catch { return []; }
}

function fsCopyFile(src: string, dest: string): void {
    if (isUncPath(src) || isUncPath(dest)) {
        execSync(`copy /Y "${src}" "${dest}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 30000 });
        return;
    }
    fs.copyFileSync(src, dest);
}

function fsRenameFile(src: string, dest: string): void {
    if (isUncPath(src) || isUncPath(dest)) {
        execSync(`move /Y "${src}" "${dest}"`, { shell: 'cmd.exe', stdio: 'pipe', timeout: 10000 });
        return;
    }
    fs.renameSync(src, dest);
}

// ─── PresenceEntry ─────────────────────────────────────────────────────────────
// Written to <syncPath>/clients/<serverKey>/<username-hostname>.json on activation.
interface PresenceEntry {
    clientLabel: string;
    clientKey: string;
    serverKey: string;
    username: string;
    hostname: string;
    version: string;
    registeredAt: number;
    lastSeen: number;
    status?: 'active' | 'inactive';
}

// ─── GitFallbackManager ──────────────────────────────────────────────────────
// File-based fallback using a shared folder.
// Sync-folder layout:
//   <syncPath>/queue/<username-hostname>.json          — server enqueues commands here
//   <syncPath>/server-backlog/<username-hostname>.json — client writes results here when server is offline
//   <syncPath>/clients/<serverKey>/<username-hostname>.json — presence file written on activation
class GitFallbackManager {
    private pollInterval: NodeJS.Timeout | null = null;
    private fallbackPath: string = '';
    private clientKey: string = '';
    private clientLabel: string = '';
    private serverKey: string = '';
    private version: string = '1.0.0';
    private onCommand: ((cmd: FallbackCommand) => Promise<any>) | null = null;
    private pollIntervalMs: number = FALLBACK_POLL_INTERVAL_MS;
    private executedIds: Set<string> = new Set();
    private context: vscode.ExtensionContext | null = null;
    private _isLeader: boolean = false;

    configure(
        fallbackPath: string,
        clientKey: string,
        clientLabel: string,
        serverKey: string,
        version: string,
        onCommand: (cmd: FallbackCommand) => Promise<any>,
        context?: vscode.ExtensionContext
    ) {
        this.fallbackPath = fallbackPath;
        this.clientKey = clientKey;
        this.clientLabel = clientLabel;
        this.serverKey = serverKey;
        this.version = version;
        this.onCommand = onCommand;
        // Persist executedIds across VS Code sessions for cross-instance dedup
        if (context) {
            this.context = context;
            const saved = context.globalState.get<string[]>('executedIds');
            if (saved) { this.executedIds = new Set(saved); }
        }
        // Write presence file immediately — this is the "installation hook"
        this.writePresenceFile();
        // Attempt to become the leader for sync-folder polling
        this.tryAcquireLeadership();
        syncLog.info(`Configured — serverKey="${serverKey}" clientLabel="${clientLabel}" isUNC=${isUncPath(fallbackPath)} pid=${process.pid}`);
        // Self-test: verify write+rename permission on the queue folder so
        // permission issues surface immediately with a clear actionable message
        // rather than silently failing on every poll tick.
        this.testSyncFolderPermissions(fallbackPath);
    }

    // ─── Leader election ─────────────────────────────────────────────
    // Only one VS Code instance per client (same username-hostname) polls
    // the sync folder.  A small lock file in <syncPath>/leaders/ tracks the
    // current leader's PID.  Other instances become followers — they still
    // refresh the presence file but skip queue polling & result writing.

    private leaderFilePath(): string {
        return path.join(this.fallbackPath, 'leaders', `${this.clientLabel}.json`);
    }

    /** Check whether a given process ID is alive on this machine. */
    private static isProcessAlive(pid: number): boolean {
        try { process.kill(pid, 0); return true; } catch { return false; }
    }

    /** Try to claim leadership.  Returns true if this instance is (or becomes) the leader. */
    private tryAcquireLeadership(): boolean {
        if (!this.fallbackPath) { return false; }
        try {
            const dir = path.join(this.fallbackPath, 'leaders');
            fsEnsureDir(dir);
            const lockPath = this.leaderFilePath();

            if (fsPathExists(lockPath)) {
                try {
                    const lock = JSON.parse(fsReadText(lockPath));
                    if (lock.pid === process.pid) {
                        // We are already the leader — refresh timestamp
                        this._isLeader = true;
                        lock.timestamp = Date.now();
                        fsWriteText(lockPath, JSON.stringify(lock));
                        return true;
                    }
                    if (GitFallbackManager.isProcessAlive(lock.pid)) {
                        // Another living instance owns the lock — stay follower
                        this._isLeader = false;
                        return false;
                    }
                    // Owner PID is dead — take over
                    syncLog.info(`Previous leader PID ${lock.pid} is dead — taking over leadership`);
                    console.log(`[Fallback] Previous leader PID ${lock.pid} is dead — claiming leadership`);
                } catch { /* corrupt file — take over */ }
            }

            // Claim leadership
            fsWriteText(lockPath, JSON.stringify({ pid: process.pid, timestamp: Date.now() }));
            this._isLeader = true;
            syncLog.info(`Leader acquired — PID ${process.pid} for clientLabel="${this.clientLabel}"`);
            console.log(`[Fallback] This instance (PID ${process.pid}) is now the leader for ${this.clientLabel}`);
            return true;
        } catch (e: any) {
            syncLog.warn(`Leader acquisition failed: ${e?.message || e} — falling back to leader mode`);
            console.warn(`[Fallback] Leader acquisition failed: ${e?.message || e}`);
            // If we can't write the lock file, fall back to being a leader anyway
            // (better one extra poller than zero pollers)
            this._isLeader = true;
            return true;
        }
    }

    /** Release leadership on shutdown so another instance can take over immediately. */
    releaseLeadership(): void {
        if (!this._isLeader || !this.fallbackPath) { return; }
        try {
            const lockPath = this.leaderFilePath();
            if (fsPathExists(lockPath)) {
                try {
                    const lock = JSON.parse(fsReadText(lockPath));
                    // Only delete if we own it
                    if (lock.pid === process.pid) {
                        fsDeleteFile(lockPath);
                        console.log(`[Fallback] Leadership released (PID ${process.pid})`);
                    }
                } catch {
                    // Corrupt — just delete it
                    try { fsDeleteFile(lockPath); } catch {}
                }
            }
        } catch { /* best-effort */ }
        this._isLeader = false;
    }

    get isLeader(): boolean { return this._isLeader; }

    // Write/update the presence file so the server can discover this client via sync folder
    private writePresenceFile() {
        if (!this.fallbackPath || !this.clientKey) { return; }
        try {
            const dir = path.join(this.fallbackPath, 'clients', this.serverKey);
            fsEnsureDir(dir);
            const filePath = path.join(dir, `${this.clientLabel}.json`);
            let registeredAt = Date.now();
            if (fsPathExists(filePath)) {
                try {
                    const existing: PresenceEntry = JSON.parse(fsReadText(filePath));
                    registeredAt = existing.registeredAt ?? registeredAt;
                } catch { /* keep current timestamp */ }
            }
            const entry: PresenceEntry = {
                clientLabel: this.clientLabel,
                clientKey: this.clientKey,
                serverKey: this.serverKey,
                username: os.userInfo().username,
                hostname: os.hostname(),
                version: this.version,
                registeredAt,
                lastSeen: Date.now(),
                status: 'active'
            };
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
            syncLog.debug(`Presence written: ${filePath}`);
            console.log(`[Fallback] Presence file written: ${filePath}`);
        } catch (e: any) {
            syncLog.error(`Presence write FAILED: ${e?.message || e} — attempted path: ${path.join(this.fallbackPath || '', 'clients', this.serverKey, this.clientLabel + '.json')}`);
            console.warn(`[Fallback] Could not write presence file: ${e?.message || e}`);
        }
    }

    // Update only lastSeen in the presence file (called on each poll cycle)
    private updatePresenceLastSeen() {
        if (!this.fallbackPath || !this.clientKey || !this.serverKey) { return; }
        try {
            const filePath = path.join(this.fallbackPath, 'clients', this.serverKey, `${this.clientLabel}.json`);
            if (!fsPathExists(filePath)) {
                // File missing — re-write the full presence entry
                this.writePresenceFile();
                return;
            }
            let entry: PresenceEntry;
            try {
                entry = JSON.parse(fsReadText(filePath));
            } catch {
                this.writePresenceFile();
                return;
            }
            entry.lastSeen = Date.now();
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
        } catch { /* silent — presence updates are best-effort */ }
    }

    // Remove the presence file from the OLD server key folder (call before reconfiguring)
    removeOldPresenceFile(oldServerKey: string) {
        if (!this.fallbackPath || !this.clientLabel || !oldServerKey) { return; }
        try {
            const oldFile = path.join(this.fallbackPath, 'clients', oldServerKey, `${this.clientLabel}.json`);
            if (fsPathExists(oldFile)) {
                fsDeleteFile(oldFile);
                console.log(`[Fallback] Removed stale presence file: ${oldFile}`);
            }
        } catch (e: any) {
            console.warn(`[Fallback] Could not remove old presence file: ${e?.message || e}`);
        }
    }

    // Mark this client as inactive in the presence file (called on extension deactivation)
    markInactive(): void {
        if (!this.fallbackPath || !this.clientKey || !this.serverKey) { return; }
        try {
            const filePath = path.join(this.fallbackPath, 'clients', this.serverKey, `${this.clientLabel}.json`);
            if (!fsPathExists(filePath)) { return; }
            let entry: PresenceEntry;
            try {
                entry = JSON.parse(fsReadText(filePath));
            } catch { return; }
            entry.status = 'inactive';
            entry.lastSeen = Date.now();
            fsWriteText(filePath, JSON.stringify(entry, null, 2));
            console.log(`[Fallback] Marked client as inactive: ${filePath}`);
        } catch (e: any) {
            console.warn(`[Fallback] Could not mark client inactive: ${e?.message || e}`);
        }
    }

    /** Quick write+rename probe to confirm the sync folder is writable. */
    private testSyncFolderPermissions(syncPath: string): void {
        const queueDir = path.join(syncPath, 'queue');
        try { fsEnsureDir(queueDir); } catch { /* ignore — dir may already exist */ }
        const probe  = path.join(queueDir, `.perm-probe-${process.pid}.tmp`);
        const probe2 = probe + '.2';
        let renameOk = false;
        try {
            fsWriteText(probe, 'probe');
            try {
                fsRenameFile(probe, probe2);
                renameOk = true;
                try { fsDeleteFile(probe2); } catch {}
            } catch (renameErr: any) {
                // Write succeeded but rename did not — indicate limited permissions
                try { fsDeleteFile(probe); } catch {}
                const msg = `Sync folder write permission OK but rename (MODIFY) permission is MISSING. ` +
                    `Commands will fall back to read-only mode (dedup via executedIds). ` +
                    `To allow atomic claiming, grant Modify permission on: ${queueDir}`;
                syncLog.warn(msg);
                vscode.window.showWarningMessage(
                    `Client Monitor: Sync folder has limited permissions (rename denied). ` +
                    `Commands will still work via fallback mode. ` +
                    `For best reliability, grant Modify access on the shared queue folder.`,
                    'View Log'
                ).then(choice => {
                    if (choice === 'View Log') {
                        vscode.commands.executeCommand('clientMonitor.openDiagLog');
                    }
                });
                return;
            }
            if (renameOk) {
                syncLog.info(`Sync folder permission check PASSED (write + rename OK)`);
            }
        } catch (writeErr: any) {
            // Even write failed — no write permission at all
            const msg = `Sync folder is NOT writable: ${writeErr?.message || writeErr}. ` +
                `Path: ${queueDir}. Grant at least Write permission for this user.`;
            syncLog.error(msg);
            vscode.window.showErrorMessage(
                `Client Monitor: Cannot write to sync folder (Access Denied). ` +
                `The extension will not function until write permission is granted on: ${queueDir}`,
                'View Log'
            ).then(choice => {
                if (choice === 'View Log') {
                    vscode.commands.executeCommand('clientMonitor.openDiagLog');
                }
            });
        }
    }

    get isConfigured(): boolean {
        return !!this.fallbackPath && !!this.clientKey;
    }

    get basePath(): string {
        return this.fallbackPath;
    }

    startPolling(intervalMs?: number) {
        this.stopPolling();
        if (!this.isConfigured) { return; }
        if (intervalMs !== undefined && intervalMs >= 3000) { this.pollIntervalMs = intervalMs; }
        // Do an immediate check, then poll
        this.checkBacklog();
        this.pollInterval = setInterval(() => this.checkBacklog(), this.pollIntervalMs);
        syncLog.info(`Polling started — interval=${this.pollIntervalMs / 1000}s isUNC=${isUncPath(this.fallbackPath)}`);
        console.log(`[Fallback] Polling started (${this.pollIntervalMs / 1000}s): ${this.fallbackPath}`);
    }

    /** Change the poll interval at runtime (called when server sends setPollInterval command) */
    setPollInterval(ms: number) {
        if (ms < 3000) { ms = 3000; }      // floor at 3 s
        if (ms > 300000) { ms = 300000; }  // cap at 5 min
        this.pollIntervalMs = ms;
        if (this.pollInterval) { this.startPolling(); }  // restart with new interval
        console.log(`[Fallback] Poll interval changed to ${ms / 1000}s`);
    }

    get currentPollIntervalMs(): number { return this.pollIntervalMs; }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    private async checkBacklog() {
        if (!this.isConfigured || !this.onCommand) { return; }

        // ── Leader election check ────────────────────────────────────
        // Re-evaluate leadership on every tick.  If the leader died between
        // ticks, a follower will promote itself.
        this.tryAcquireLeadership();

        // Keep presence file fresh regardless of leader/follower status
        // so the server always sees an up-to-date lastSeen.
        this.updatePresenceLastSeen();

        // Only the leader interacts with the queue and writes results.
        if (!this._isLeader) { return; }

        const queueFile = path.join(this.fallbackPath, 'queue', `${this.clientLabel}.json`);
        const claimedFile = queueFile + `.lock-${process.pid}`;
        syncLog.debug(`Poll tick — checking queue for clientLabel="${this.clientLabel}"`);

        try {
            // Strategy: attempt an atomic rename (Modify permission) so only one
            // VS Code instance processes each queue file.  If rename is denied
            // (e.g. the share grants only Write but not Modify, or the file was
            // created by a different user), fall back to reading the file directly
            // and relying on executedIds for deduplication.  Either way blank the
            // queue file afterwards so it is not re-processed on the next tick.
            let raw: string | null = null;
            let claimedViaRename = false;

            // ── Phase 1: try atomic rename ───────────────────────────
            try {
                fsRenameFile(queueFile, claimedFile);
                claimedViaRename = true;
                syncLog.debug(`Queue file claimed via rename`);
            } catch (renameErr: any) {
                const errMsg: string = renameErr?.message || String(renameErr);
                const isAccessDenied = /access is denied|access denied|permission denied/i.test(errMsg);
                const fileExists = fsPathExists(queueFile);

                if (!fileExists) {
                    // Normal case: queue file doesn't exist yet
                    syncLog.debug(`Queue file absent — nothing to do`);
                    return;
                }

                if (isAccessDenied) {
                    // Limited-permission fallback: read directly, dedup via executedIds
                    syncLog.warn(`Rename denied (limited share permissions) — reading queue directly`);
                    try {
                        raw = fsReadText(queueFile);
                    } catch (readErr: any) {
                        syncLog.error(`Queue read FAILED in fallback mode: ${readErr?.message || readErr}`);
                        return;
                    }
                } else {
                    // Some other transient error (lock held by another instance, etc.)
                    syncLog.debug(`Queue rename skipped: ${errMsg}`);
                    return;
                }
            }

            // ── Phase 2: read lock file (rename succeeded) ───────────
            if (claimedViaRename) {
                try {
                    raw = fsReadText(claimedFile);
                } catch (readErr: any) {
                    syncLog.error(`Queue read FAILED after rename: ${readErr?.message || readErr}`);
                    return;
                }
                try { fsDeleteFile(claimedFile); } catch {}
            }

            if (!raw) { return; }

            let cmds: FallbackCommand[] = [];
            try {
                cmds = JSON.parse(raw);
            } catch (parseErr: any) {
                syncLog.error(`Queue file has invalid JSON — discarded. Error: ${parseErr?.message || parseErr}`);
                console.warn(`[Fallback] Queue file has invalid JSON — discarded`);
                return;
            }

            if (cmds.length === 0) { return; }

            // Filter to only commands addressed to this server — ignore stale entries from other servers.
            const allCount = cmds.length;
            const allServerKeys = [...new Set(cmds.map(c => c.serverKey))];
            cmds = cmds.filter(c => !c.serverKey || c.serverKey === this.serverKey);
            if (cmds.length === 0) {
                syncLog.info(`Queue had ${allCount} cmd(s) but none matched serverKey="${this.serverKey}" — found keys: [${allServerKeys.join(', ')}]`);
                console.log(`[Fallback] Queue had commands but none for serverKey="${this.serverKey}" — skipping`);
                return;
            }

            // Filter out already-executed commands
            const toExecute = cmds.filter(cmd => !this.executedIds.has(cmd.id));
            if (toExecute.length === 0) {
                syncLog.info(`Queue had ${cmds.length} cmd(s) — all already executed (IDs cached)`);
                return;
            }

            syncLog.info(`Executing ${toExecute.length} cmd(s): ${toExecute.map(c => `${c.command}(${c.id.slice(0, 8)})`).join(', ')}`);
            console.log(`[Fallback] Found ${cmds.length} queued command(s) for ${this.clientLabel}`);

            // Pre-mark all IDs before parallel execution to prevent double-processing
            // if another instance claims the same work concurrently.
            for (const cmd of toExecute) { this.executedIds.add(cmd.id); }

            // Execute all commands in parallel — independent of each other, so no ordering constraint.
            const batchResults = await Promise.all(toExecute.map(async cmd => {
                const t0 = Date.now();
                try {
                    console.log(`[Fallback] Executing queued command: ${cmd.command} (${cmd.id})`);
                    const payload = await this.onCommand!(cmd);
                    syncLog.info(`Command OK: ${cmd.command} (${cmd.id.slice(0, 8)}) in ${Date.now() - t0}ms`);
                    return { id: cmd.id, command: cmd.command, payload };
                } catch (e: any) {
                    syncLog.error(`Command FAILED: ${cmd.command} (${cmd.id.slice(0, 8)}) — ${e?.message || String(e)}`);
                    console.error(`[Fallback] Error executing queued command ${cmd.command}:`, e);
                    return { id: cmd.id, command: cmd.command, payload: { success: false, error: e?.message || String(e) } };
                }
            }));

            // Persist executedIds once for the entire batch (single globalState write)
            if (this.context) {
                // Trim to max 500 entries
                while (this.executedIds.size > 500) {
                    const first = this.executedIds.values().next().value;
                    if (first !== undefined) { this.executedIds.delete(first); } else { break; }
                }
                this.context.globalState.update('executedIds', [...this.executedIds]);
            }

            // Write all results as a single batch file — one UNC write instead of N
            this.writeServerBacklogBatch(batchResults);
            syncLog.info(`Results dispatched: ${batchResults.length} entries for ${this.clientLabel}`);
            console.log(`[Fallback] Wrote batch result file (${batchResults.length} entries) for ${this.clientLabel}`);

            // ── Phase 3: clear the queue file so the next poll tick doesn't re-read it.
            // For the rename path the lock file is already gone (deleted above).
            // For the direct-read path we overwrite the queue file with [] so commands
            // are not re-read on the next tick (executedIds is the authoritative dedup
            // guard, but clearing the file avoids noisy repeated dedup log entries).
            if (!claimedViaRename) {
                try {
                    fsWriteText(queueFile, '[]');
                    syncLog.debug(`Queue file blanked after direct-read execution`);
                } catch { /* best-effort — executedIds will deduplicate anyway */ }
            }
        } catch (e: any) {
            syncLog.error(`Poll loop unhandled error: ${e?.message || String(e)}`);
            console.error('[Fallback] Backlog check error:', e);
        }
    }

    private addExecutedId(id: string): void {
        this.executedIds.add(id);
        if (this.executedIds.size > 500) {
            const first = this.executedIds.values().next().value;
            if (first !== undefined) { this.executedIds.delete(first); }
        }
        if (this.context) {
            this.context.globalState.update('executedIds', [...this.executedIds]);
        }
    }

    private writeServerBacklog(commandId: string, command: string, payload: any) {
        if (!this.isConfigured) { return; }
        // Route to results/ (server online = live channel) or server-backlog/ (server offline = offline accumulation)
        const targetDir = this.isServerOnline()
            ? path.join(this.fallbackPath, 'results')
            : path.join(this.fallbackPath, 'server-backlog');
        fsEnsureDir(targetDir);
        // Write one file per result entry — eliminates read-modify-write race for multi-instance safety.
        // Two-phase write: write to .tmp first, then rename to .json so the server
        // (which only scans for .json) never sees a partially-written file.
        const entry = { id: commandId, command, clientKey: this.clientKey, clientLabel: this.clientLabel, timestamp: Date.now(), payload };
        const baseName = `${this.clientLabel}-${commandId}`;
        const tmpFile = path.join(targetDir, `${baseName}.tmp`);
        const finalFile = path.join(targetDir, `${baseName}.json`);
        fsWriteText(tmpFile, JSON.stringify(entry, null, 2));
        // Rename .tmp → .json (atomic on the same volume). Retry once on transient UNC lock.
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                fsRenameFile(tmpFile, finalFile);
                return;
            } catch (e: any) {
                if (attempt < 2) {
                    // Brief delay before retry — UNC lock is usually very short-lived
                    try { execSync('ping -n 2 127.0.0.1 >nul', { shell: 'cmd.exe', stdio: 'pipe', timeout: 3000 }); } catch {}
                } else {
                    console.error(`[Fallback] Failed to rename result .tmp → .json after retries: ${e?.message || e}`);
                    // Last resort: try direct write to final path
                    try { fsWriteText(finalFile, JSON.stringify(entry, null, 2)); } catch {}
                    try { fsDeleteFile(tmpFile); } catch {}
                }
            }
        }
    }

    // Write all results from one checkBacklog() sweep as a single file (array).
    // One UNC write instead of N — eliminates per-command disk round-trips.
    // Server's pollResultsDir/pollServerBacklog already handle both single-object
    // and array-of-objects formats, so no server-side changes are needed.
    private writeServerBacklogBatch(entries: Array<{ id: string; command: string; payload: any }>) {
        if (!this.isConfigured || entries.length === 0) { return; }
        const serverOnline = this.isServerOnline();
        const targetDir = serverOnline
            ? path.join(this.fallbackPath, 'results')
            : path.join(this.fallbackPath, 'server-backlog');
        fsEnsureDir(targetDir);
        syncLog.info(`Writing ${entries.length} result(s) → ${serverOnline ? 'results/' : 'server-backlog/'} (server ${serverOnline ? 'online' : 'offline'})`);
        const batchEntries = entries.map(e => ({
            id: e.id,
            command: e.command,
            clientKey: this.clientKey,
            clientLabel: this.clientLabel,
            timestamp: Date.now(),
            payload: e.payload,
        }));
        const batchId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const baseName = `${this.clientLabel}-batch-${batchId}`;
        const tmpFile = path.join(targetDir, `${baseName}.tmp`);
        const finalFile = path.join(targetDir, `${baseName}.json`);
        // Two-phase write: .tmp then rename.  If rename is denied (limited share
        // permissions) fall back to writing directly to the .json path.
        try {
            fsWriteText(tmpFile, JSON.stringify(batchEntries, null, 2));
        } catch (writeErr: any) {
            syncLog.error(`Result .tmp write FAILED: ${writeErr?.message || writeErr} — attempting direct write`);
            try { fsWriteText(finalFile, JSON.stringify(batchEntries, null, 2)); } catch (e2: any) {
                syncLog.error(`Result direct write also FAILED: ${e2?.message || e2}`);
            }
            return;
        }
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                fsRenameFile(tmpFile, finalFile);
                return;
            } catch (e: any) {
                const isAccessDenied = /access is denied|access denied|permission denied/i.test(e?.message || '');
                if (isAccessDenied) {
                    // Rename denied — write directly (re-serialise to final path)
                    syncLog.warn(`Result rename denied — writing directly to .json`);
                    try { fsWriteText(finalFile, JSON.stringify(batchEntries, null, 2)); } catch {}
                    try { fsDeleteFile(tmpFile); } catch {}
                    return;
                }
                if (attempt < 2) {
                    try { execSync('ping -n 2 127.0.0.1 >nul', { shell: 'cmd.exe', stdio: 'pipe', timeout: 3000 }); } catch {}
                } else {
                    syncLog.error(`Result batch rename failed after retries: ${e?.message || e} — file: ${path.basename(finalFile)}`);
                    console.error(`[Fallback] Failed to rename batch .tmp → .json after retries: ${e?.message || e}`);
                    try { fsWriteText(finalFile, JSON.stringify(batchEntries, null, 2)); } catch {}
                    try { fsDeleteFile(tmpFile); } catch {}
                }
            }
        }
    }

    // Check whether the server is currently online by reading its presence file.
    // Server is considered online if its presence file has lastSeen within 90 seconds.
    private isServerOnline(): boolean {
        if (!this.fallbackPath || !this.serverKey) { return false; }
        try {
            const serversDir = path.join(this.fallbackPath, 'servers');
            if (!fsPathExists(serversDir)) { return false; }
            // Server presence filenames are "<key>-<hostname>-<pid>.json".
            // Use an exact key+separator prefix to avoid prefix collisions
            // (e.g. key "uwb_2" must NOT match "uwb_2a-hostname-pid.json").
            const keyPrefix = `${this.serverKey}-`;
            const files = fsListDir(serversDir).filter(f => f.endsWith('.json') && f.startsWith(keyPrefix));
            for (const file of files) {
                try {
                    const entry = JSON.parse(fsReadText(path.join(serversDir, file)));
                    if (entry.status === 'online' && (Date.now() - entry.lastSeen) < 90000) { return true; }
                } catch { }
            }
        } catch { }
        return false;
    }


}

// ─── AutoUpdateManager ───────────────────────────────────────────────────────
// Checks a shared path (same fallback folder) for newer VSIX files and installs silently.
class AutoUpdateManager {
    private checkInterval: NodeJS.Timeout | null = null;
    private currentVersion: string;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.currentVersion = context.extension?.packageJSON?.version || '1.0.0';
    }

    startChecking(fallbackPath: string) {
        this.stopChecking();
        if (!fallbackPath) { return; }
        // Check immediately, then periodically
        this.checkForUpdates(fallbackPath);
        this.checkInterval = setInterval(() => this.checkForUpdates(fallbackPath), UPDATE_CHECK_INTERVAL_MS);
        console.log(`[AutoUpdate] Checking for updates in: ${fallbackPath}`);
    }

    stopChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    setCheckInterval(ms: number, fallbackPath: string) {
        this.stopChecking();
        if (!fallbackPath) { return; }
        this.checkInterval = setInterval(() => this.checkForUpdates(fallbackPath), ms);
        console.log(`[AutoUpdate] Check interval changed to ${ms / 1000}s`);
    }

    private async checkForUpdates(fallbackPath: string) {
        try {
            const updatesDir = path.join(fallbackPath, 'updates');
            if (!fsPathExists(updatesDir)) { return; }

            const vsixFiles = fsListDir(updatesDir)
                .filter(f => f.endsWith('.vsix') && f.startsWith(EXTENSION_ID))
                .sort();

            if (vsixFiles.length === 0) { return; }

            // Get the latest VSIX filename, expected pattern: client-monitor-<version>.vsix
            const latest = vsixFiles[vsixFiles.length - 1];
            const versionMatch = latest.match(/(\d+\.\d+\.\d+)/);
            if (!versionMatch) { return; }

            const availableVersion = versionMatch[1];
            if (!this.isNewer(availableVersion, this.currentVersion)) { return; }

            console.log(`[AutoUpdate] New version available: ${availableVersion} (current: ${this.currentVersion})`);
            const remoteVsix = path.join(updatesDir, latest);

            // Copy VSIX locally first (UNC paths may not be accepted by VS Code install API)
            const localTmp = path.join(os.tmpdir(), latest);
            try { fsCopyFile(remoteVsix, localTmp); } catch (copyErr) {
                console.error('[AutoUpdate] Failed to copy VSIX locally:', copyErr);
                return;
            }

            try {
                await vscode.commands.executeCommand('workbench.extensions.installExtension', vscode.Uri.file(localTmp));
                console.log(`[AutoUpdate] Successfully installed ${latest}`);
                try { fs.unlinkSync(localTmp); } catch {}
                vscode.window.showInformationMessage(
                    `Client Monitor updated to v${availableVersion}. Reload to activate.`,
                    'Reload'
                ).then(choice => {
                    if (choice === 'Reload') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            } catch (installErr) {
                console.error('[AutoUpdate] Install failed:', installErr);
                try { fs.unlinkSync(localTmp); } catch {}
            }
        } catch (e) {
            console.error('[AutoUpdate] Check failed:', e);
        }
    }

    private isNewer(available: string, current: string): boolean {
        const a = available.split('.').map(Number);
        const c = current.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
            if ((a[i] || 0) > (c[i] || 0)) { return true; }
            if ((a[i] || 0) < (c[i] || 0)) { return false; }
        }
        return false;
    }
}

// ─── ClientMonitor ───────────────────────────────────────────────────────────
// Main class: manages a single server connection, git fallback, and auto-update.
class ClientMonitor {
    private clientKey: string = '';
    private serverKey: string = DEFAULT_SERVER_KEY;
    private context: vscode.ExtensionContext;
    private fallback: GitFallbackManager;
    private autoUpdater: AutoUpdateManager;
    private notifierIntervals: Map<string, NodeJS.Timeout> = new Map();
    private reminderPanels: Map<string, vscode.WebviewPanel> = new Map();
    private notifierRunningInstances: Set<string> = new Set();
    private usageLogPath: string;
    private statusBarItem: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.usageLogPath = path.join(os.homedir(), 'AppData', 'Local', 'AI4ALL_log', 'AI4ALL_log.log');
        this.fallback = new GitFallbackManager();
        this.autoUpdater = new AutoUpdateManager(context);
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'clientMonitor.statusBarMenu';
        context.subscriptions.push(this.statusBarItem);
        this.updateStatusBar('inactive');
    }

    private updateStatusBar(state: 'active' | 'inactive') {
        if (state === 'active') {
            this.statusBarItem.text = '$(cloud-download) Monitor: Active';
            this.statusBarItem.tooltip = `Sync-folder mode — server key: "${this.serverKey}"`;
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = '$(debug-disconnect) Monitor: Inactive';
            this.statusBarItem.tooltip = 'No sync path configured';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
        this.statusBarItem.show();
    }


    async initialize() {
        this.clientKey = this.getOrCreateClientKey();
        this.loadConfig();
        this.setupFallback();
        this.setupAutoUpdate();
    }

    private loadConfig() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        this.serverKey = config.get<string>('serverKey') || DEFAULT_SERVER_KEY;
    }

    private setupFallback() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const syncPath = config.get<string>('syncPath') || '';
        if (syncPath) {
            const clientLabel = `${os.userInfo().username}-${os.hostname()}`;
            const version = this.context.extension?.packageJSON?.version || '1.0.0';
            this.fallback.configure(
                syncPath,
                this.clientKey,
                clientLabel,
                this.serverKey,
                version,
                (cmd) => this.executeFallbackCommand(cmd),
                this.context
            );
            this.fallback.startPolling();
            this.updateStatusBar('active');
        }
    }

    private setupAutoUpdate() {
        const config = vscode.workspace.getConfiguration('clientMonitor');
        const clientReleasePath = config.get<string>('clientReleasePath') || '';
        if (clientReleasePath) {
            this.autoUpdater.startChecking(clientReleasePath);
        }
    }



    async setServerKey(newKey: string) {
        const oldKey = this.serverKey;
        this.serverKey = newKey;
        const config = vscode.workspace.getConfiguration('clientMonitor');
        await config.update('serverKey', newKey, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Server key set to: ${newKey}`);
        // Re-configure fallback: writes new presence file under clients/<newKey>/
        // and starts polling the correct queue folder
        this.setupFallback();
        // Clean up the stale presence file from the old server key folder
        if (oldKey && oldKey !== newKey) {
            this.fallback.removeOldPresenceFile(oldKey);
        }
    }



    private async executeFallbackCommand(cmd: FallbackCommand): Promise<any> {
        // Execute a command received via sync-folder and return the result directly
        return this.executeCommand(cmd.command, cmd.payload);
    }

    private async executeCommand(command: string, payload?: any): Promise<any> {
        switch (command) {
            case 'getSystemInfo':
                return await this.collectSystemInfo();
            case 'checkBBrainy':
                return this.checkBBrainyStatus();
            case 'forceBBrainy':
                return await this.activateBBrainyDirect();
            case 'setAlarm':
                this.setupAlarmDirect(payload);
                return { success: true };
            case 'getWorkspace':
                return {
                    workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                    openFiles: vscode.workspace.textDocuments.map(d => d.fileName)
                };
            case 'getUsageReport':
                return await this.getUsageReport(payload?.hours);
            case 'setNotifier':
                return this.setNotifierDirect(payload?.intervalMs);
            case 'closeNotifier':
                return this.closeNotifierDirect();
            case 'displayReminderScreen':
                this.displayReminderScreenDirect(payload);
                return { success: true, message: 'Reminder displayed' };
            case 'setPollInterval': {
                const ms = payload?.intervalMs;
                if (typeof ms === 'number' && ms >= 3000) {
                    this.fallback.setPollInterval(ms);
                    return { success: true, intervalMs: this.fallback.currentPollIntervalMs };
                }
                return { success: false, error: 'intervalMs must be >= 3000' };
            }
            case 'setUpdateCheckInterval': {
                const ms = payload?.intervalMs;
                if (typeof ms === 'number' && ms >= 60000) {
                    this.autoUpdater.setCheckInterval(ms, vscode.workspace.getConfiguration('clientMonitor').get<string>('clientReleasePath') || '');
                    return { success: true, intervalMs: ms };
                }
                return { success: false, error: 'intervalMs must be >= 60000 (1 minute)' };
            }
            case 'getDiagLog': {
                // Returns the tail of the local diagnostics log — useful for remote debugging.
                const maxLines = Math.min((payload?.lines ?? 200), 1000);
                const logPath = syncLog.filePath;
                try {
                    if (!fs.existsSync(logPath)) {
                        return { success: true, log: '(no log file yet — no sync activity recorded)', logPath };
                    }
                    const content = fs.readFileSync(logPath, 'utf-8');
                    const allLines = content.split('\n').filter((l: string) => l.trim());
                    const tail = allLines.slice(-maxLines);
                    return { success: true, log: tail.join('\n'), lineCount: tail.length, logPath };
                } catch (e: any) {
                    return { success: false, error: e?.message || String(e), logPath };
                }
            }
            case 'getAssets':
                return { acknowledged: true };
            default:
                return { error: 'Unknown command', command };
        }
    }

    private async collectSystemInfo() {
        return {
            hostname: os.hostname(),
            username: os.userInfo().username,
            platform: process.platform,
            vscodeVersion: vscode.version,
            extensionVersion: this.context.extension?.packageJSON?.version || '1.0.0',
            workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
            extensions: vscode.extensions.all
                .filter(ext => !ext.packageJSON.isBuiltin)
                .map(ext => ({ id: ext.id, isActive: ext.isActive })),
            bbrainyStatus: this.checkBBrainyStatus()
        };
    }

    private checkBBrainyStatus() {
        const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
        let lastUsedTime = 'Unknown';
        let usageCount = 0;

        try {
            if (fs.existsSync(this.usageLogPath)) {
                const logContent = fs.readFileSync(this.usageLogPath, 'utf-8');
                const lines = logContent.split('\n').filter((l: string) => l.trim());
                if (lines.length > 0) {
                    const lastLine = lines[lines.length - 1];
                    const match = lastLine.match(/'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'/);
                    if (match) { lastUsedTime = match[1]; }
                    usageCount = lines.length;
                }
            }
        } catch { /* ignore */ }

        return {
            installed: !!bbrainy,
            active: bbrainy?.isActive || false,
            version: bbrainy?.packageJSON.version || 'Unknown',
            lastUsedTime,
            totalUsage: usageCount
        };
    }



    // ─── Direct command implementations (no conn dependency) ──────────────
    private async activateBBrainyDirect(): Promise<any> {
        const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
        if (bbrainy && !bbrainy.isActive) {
            await bbrainy.activate();
            vscode.window.showInformationMessage('BBrainy has been activated');
        }
        return { success: true, active: bbrainy?.isActive };
    }

    private setupAlarmDirect(config: any) {
        setInterval(() => {
            const bbrainy = vscode.extensions.getExtension('Valeo.BBrainy');
            if (!bbrainy?.isActive) {
                vscode.window.showWarningMessage('Please activate BBrainy extension', 'Activate')
                    .then(choice => {
                        if (choice === 'Activate') { this.activateBBrainyDirect(); }
                    });
            }
        }, config?.intervalMs || 3600000);
    }

    // ── Local BBrainy Usage Report (same as BBrainyUsageAssistant) ──────────────
    async showUsageReportInteractive(): Promise<void> {
        const options = [
            { label: 'Last 24 hours', hours: 24 },
            { label: 'Last 7 days', hours: 168 },
            { label: 'All time', hours: undefined },
            { label: 'Custom...', hours: -1 }
        ];
        const picked = await vscode.window.showQuickPick(options.map(o => o.label), {
            placeHolder: 'Select time period'
        });
        if (!picked) { return; }

        let hours: number | undefined;
        let label = picked;
        if (picked === 'Custom...') {
            const input = await vscode.window.showInputBox({
                prompt: 'Enter number of hours (1-23)',
                validateInput: v => {
                    const n = parseInt(v, 10);
                    return (isNaN(n) || n < 1 || n > 23) ? 'Enter a number between 1 and 23' : null;
                }
            });
            if (!input) { return; }
            hours = parseInt(input, 10);
            label = `Last ${hours} hours`;
        } else {
            hours = options.find(o => o.label === picked)?.hours;
        }

        const data = await this.getUsageReport(hours);
        if (!data.success) {
            vscode.window.showErrorMessage(`Cannot load usage report: ${data.error}`);
            return;
        }
        this.openUsageReportWebview(data, label);
    }

    private openUsageReportWebview(usageData: any, timeframeLabel: string): void {
        const username = os.userInfo().username;
        const hostname = os.hostname();
        const panel = vscode.window.createWebviewPanel(
            'bbrainyUsageReport',
            `BBrainy Usage: ${timeframeLabel}`,
            vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        const agents: any[] = usageData.agents || [];
        const total: number = usageData.totalEntries || 0;
        const mostUsed: string = agents[0]?.name || '—';

        const agentRows = agents.map((a: any) =>
            `<tr><td><span class="agent-name">${a.name}</span></td>` +
            `<td class="count">${a.count}</td>` +
            `<td class="percentage">${a.percentage}%</td></tr>`
        ).join('');

        const chartLabels = JSON.stringify(agents.map((a: any) => a.name));
        const chartData   = JSON.stringify(agents.map((a: any) => a.count));
        const bgColors = JSON.stringify([
            'rgba(59,130,246,0.2)', 'rgba(16,185,129,0.2)', 'rgba(168,85,247,0.2)',
            'rgba(251,146,60,0.2)', 'rgba(244,63,94,0.2)',  'rgba(236,72,153,0.2)'
        ]);
        const borderColors = JSON.stringify([
            'rgba(59,130,246,1)', 'rgba(16,185,129,1)', 'rgba(168,85,247,1)',
            'rgba(251,146,60,1)', 'rgba(244,63,94,1)',  'rgba(236,72,153,1)'
        ]);
        const generatedAt = new Date().toLocaleString();

        panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>BBrainy Usage Report</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);color:#e2e8f0;padding:32px;min-height:100vh}
.container{max-width:1200px;margin:0 auto}
.header{margin-bottom:32px;border-bottom:2px solid rgba(59,130,246,0.3);padding-bottom:20px}
h1{font-size:28px;font-weight:700;margin-bottom:6px;background:linear-gradient(135deg,#60a5fa 0%,#34d399 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.client-info{font-size:13px;color:#94a3b8;margin-bottom:4px}
.timeframe{font-size:16px;color:#cbd5e1;font-weight:600;margin-bottom:4px}
.generated{font-size:11px;color:#475569}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:28px}
.stat-card{background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:18px}
.stat-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:6px}
.stat-value{font-size:26px;font-weight:700;color:#60a5fa}
.stat-value.green{color:#34d399;font-size:15px;margin-top:4px}
table{width:100%;border-collapse:collapse;background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:12px;overflow:hidden;margin-bottom:28px}
thead{background:rgba(15,23,42,0.6)}
th{padding:12px 16px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px}
th.right,td.count,td.percentage{text-align:right}
td{padding:10px 16px;border-top:1px solid rgba(59,130,246,0.1);font-size:13px}
td.count{color:#60a5fa;font-weight:700}
td.percentage{color:#64748b}
.agent-name{color:#34d399;font-weight:500}
.chart-section{background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:24px}
h2{font-size:16px;font-weight:600;color:#60a5fa;margin-bottom:16px}
#usageChart{max-height:300px}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>&#127919; BBrainy Usage Report</h1>
    <div class="client-info">&#128205; Client: <strong>${username}@${hostname}</strong></div>
    <div class="timeframe">${timeframeLabel}</div>
    <div class="generated">Generated: ${generatedAt}</div>
  </div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-label">Total Usages</div><div class="stat-value">${total}</div></div>
    <div class="stat-card"><div class="stat-label">Unique Agents</div><div class="stat-value">${agents.length}</div></div>
    <div class="stat-card"><div class="stat-label">Most Used</div><div class="stat-value green">${mostUsed}</div></div>
  </div>
  <table>
    <thead><tr><th>Agent Name</th><th class="right">Count</th><th class="right">Usage %</th></tr></thead>
    <tbody>${agentRows || '<tr><td colspan="3" style="text-align:center;color:#475569;padding:24px">No data for this period</td></tr>'}</tbody>
  </table>
  <div class="chart-section">
    <h2>Usage Distribution</h2>
    <canvas id="usageChart"></canvas>
  </div>
</div>
<script>
const ctx = document.getElementById('usageChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ${chartLabels},
    datasets: [{ label: 'Usage Count', data: ${chartData},
      backgroundColor: ${bgColors}, borderColor: ${borderColors}, borderWidth: 2 }]
  },
  options: {
    indexAxis: 'y', responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(59,130,246,0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(59,130,246,0.1)' } }
    }
  }
});
</script>
</body>
</html>`;
    }

    private async getUsageReport(hours?: number): Promise<any> {
        try {
            if (!fs.existsSync(this.usageLogPath)) {
                return { success: false, error: 'Usage log file not found', logPath: this.usageLogPath };
            }

            const logContent = fs.readFileSync(this.usageLogPath, 'utf-8');
            const lines = logContent.split('\n').filter((l: string) => l.trim());

            const now = Date.now();
            const timeFilter = hours ? hours * 3600 * 1000 : undefined;
            const usageMap = new Map<string, number>();
            let totalEntries = 0;
            let earliestEntry: number | null = null;
            let latestEntry: number | null = null;

            const logRegex = /'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', '.*?', '(.*?)', '.*?'/;

            for (const line of lines) {
                try {
                    const match = line.match(logRegex);
                    if (match && match[1] && match[2]) {
                        const entryTime = new Date(match[1]).getTime();
                        if (timeFilter && now - entryTime > timeFilter) { continue; }
                        totalEntries++;
                        usageMap.set(match[2], (usageMap.get(match[2]) || 0) + 1);
                        if (earliestEntry === null || entryTime < earliestEntry) { earliestEntry = entryTime; }
                        if (latestEntry === null || entryTime > latestEntry) { latestEntry = entryTime; }
                    } else {
                        const entry = JSON.parse(line);
                        const entryTime = new Date(entry.timestamp || entry.time).getTime();
                        if (timeFilter && now - entryTime > timeFilter) { continue; }
                        totalEntries++;
                        const agent = entry.agent || entry.name || 'Unknown';
                        usageMap.set(agent, (usageMap.get(agent) || 0) + 1);
                        if (earliestEntry === null || entryTime < earliestEntry) { earliestEntry = entryTime; }
                        if (latestEntry === null || entryTime > latestEntry) { latestEntry = entryTime; }
                    }
                } catch { continue; }
            }

            let timeframeLabel = 'All time';
            if (hours) {
                timeframeLabel = hours === 24 ? 'Last 24 hours' : hours === 168 ? 'Last 7 days' : `Last ${hours} hours`;
            }

            return {
                success: true,
                timestamp: new Date().toISOString(),
                timeframe: timeframeLabel,
                timeframeHours: hours,
                dateRange: {
                    earliest: earliestEntry ? new Date(earliestEntry).toISOString() : null,
                    latest: latestEntry ? new Date(latestEntry).toISOString() : null
                },
                totalEntries,
                agents: Array.from(usageMap.entries()).map(([agent, count]) => ({
                    name: agent, count,
                    percentage: totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(2) : '0.00'
                })).sort((a, b) => b.count - a.count)
            };
        } catch (error) {
            return { success: false, error: String(error), logPath: this.usageLogPath };
        }
    }

    private setNotifierDirect(intervalMs?: number): any {
        let interval = intervalMs || 3600000;
        const minInterval = 60000;
        const maxInterval = 120 * 60000;

        if (interval < minInterval) {
            return { success: false, message: 'Interval must be at least 1 minute', intervalMs: minInterval };
        }
        if (interval > maxInterval) {
            return { success: false, message: 'Interval cannot exceed 120 minutes', intervalMs: maxInterval };
        }

        if (this.notifierRunningInstances.has(this.serverKey)) {
            return { success: true, message: 'Notifier already active', intervalMs: interval };
        }

        this.closeNotifierDirect();
        this.notifierRunningInstances.add(this.serverKey);

        const notifierInterval = setInterval(() => {
            if (os.platform() === 'win32') {
                exec('powershell.exe -c "[console]::beep(500, 300); Start-Sleep -m 100; [console]::beep(500, 300)"');
            }
            vscode.window.showInformationMessage("Don't forget to use BBrainy for assistance!", 'OK', 'Dismiss');
        }, interval);

        this.notifierIntervals.set(this.serverKey, notifierInterval);
        return { success: true, message: 'Notifier set', intervalMs: interval };
    }

    private closeNotifierDirect(): any {
        const interval = this.notifierIntervals.get(this.serverKey);
        if (interval) {
            clearInterval(interval);
            this.notifierIntervals.delete(this.serverKey);
            this.notifierRunningInstances.delete(this.serverKey);
        }
        return { success: true, message: 'Notifier closed' };
    }

    private displayReminderScreenDirect(payload: any): void {
        const title = payload?.title || 'Reminder';
        const body = payload?.body || 'No message provided';

        const existingPanel = this.reminderPanels.get(this.serverKey);
        if (existingPanel) { existingPanel.dispose(); }

        const panel = vscode.window.createWebviewPanel(
            'reminderScreen', 'Reminder from Monitor', vscode.ViewColumn.One, { enableScripts: true }
        );

        panel.webview.html = this.getReminderScreenHtml(title, body);
        panel.onDidDispose(() => { this.reminderPanels.delete(this.serverKey); });
        this.reminderPanels.set(this.serverKey, panel);
    }

    private getReminderScreenHtml(title: string, body: string): string {
        // Sanitize inputs to prevent XSS
        const safeTitle = title.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c));
        const safeBody = body.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c));
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reminder</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            min-height: 100vh; display: flex; flex-direction: column; padding: 40px;
        }
        .header { display: flex; align-items: center; gap: 25px; margin-bottom: 50px; }
        .icon { font-size: 56px; animation: pulse 1s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        h1 { font-size: 40px; font-weight: 700; background: linear-gradient(135deg, #60a5fa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .body-area { background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8)); border: 2px solid rgba(96,165,250,0.2); border-radius: 20px; padding: 50px 45px; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 350px; backdrop-filter: blur(8px); }
        .body-text { color: #e2e8f0; font-size: 20px; line-height: 1.9; text-align: center; white-space: pre-wrap; word-wrap: break-word; }
        .info { color: #64748b; font-size: 13px; text-align: center; margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header"><div class="icon">🔔</div><h1>${safeTitle}</h1></div>
    <div class="body-area"><div class="body-text">${safeBody}</div></div>
    <div class="info">Close this window to dismiss</div>
</body>
</html>`;
    }

    private getOrCreateClientKey(): string {
        let key = this.context.globalState.get<string>('clientKey');
        if (!key) {
            key = this.generateKey();
            this.context.globalState.update('clientKey', key);
        }
        return key;
    }

    private generateKey(): string {
        const machineId = os.hostname();
        const userId = os.userInfo().username;
        return crypto.createHash('sha256').update(`${machineId}-${userId}`).digest('hex');
    }

    getInfo() {
        return {
            clientKey: this.clientKey,
            serverKey: this.serverKey,
            fallbackConfigured: this.fallback.isConfigured,
            pollIntervalMs: this.fallback.currentPollIntervalMs
        };
    }

    cleanup(): void {
        this.fallback.releaseLeadership();
        this.fallback.markInactive();
        for (const interval of this.notifierIntervals.values()) { clearInterval(interval); }
        this.notifierIntervals.clear();
        this.fallback.stopPolling();
        this.autoUpdater.stopChecking();
        this.statusBarItem.dispose();
    }
}

// ─── Extension activation ─────────────────────────────────────────────────────
let monitor: ClientMonitor | null = null;

export function activate(context: vscode.ExtensionContext) {
    monitor = new ClientMonitor(context);
    monitor.initialize();

    // React to config changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('clientMonitor.serverKey') ||
                e.affectsConfiguration('clientMonitor.syncPath') ||
                e.affectsConfiguration('clientMonitor.clientReleasePath')) {
                monitor?.cleanup();
                monitor = new ClientMonitor(context);
                monitor.initialize();
            }
        })
    );

    // Command: Set Server Key (interactive prompt)
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.setServerKey', async () => {
            const current = vscode.workspace.getConfiguration('clientMonitor').get<string>('serverKey') || DEFAULT_SERVER_KEY;
            const key = await vscode.window.showInputBox({
                prompt: 'Enter the server key to connect to',
                value: current,
                placeHolder: 'e.g., uwb-01 or default'
            });
            if (key !== undefined && key.trim()) {
                await monitor?.setServerKey(key.trim());
            }
        })
    );

    // Command: Set Client Release Path
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.setClientReleasePath', async () => {
            const folders = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                title: 'Select client-release folder for auto-updates'
            });
            if (folders && folders[0]) {
                const config = vscode.workspace.getConfiguration('clientMonitor');
                await config.update('clientReleasePath', folders[0].fsPath, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Client release path set to: ${folders[0].fsPath}`);
            }
        })
    );

    // Command: Show Status
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.showStatus', () => {
            const info = monitor?.getInfo();
            if (info) {
                vscode.window.showInformationMessage(
                    `Client Key: ${info.clientKey.substring(0, 12)}...\n` +
                    `Server Key: ${info.serverKey}`
                );
            }
        })
    );

    // Status bar menu — click the status bar item
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.statusBarMenu', async () => {
            const info = monitor?.getInfo();
            const notifierActive = info ? (monitor as any)?.notifierRunningInstances?.has((monitor as any)?.serverKey) : false;

            type MenuItem = { label: string; description?: string; action: () => void | Promise<void> | Thenable<void> };
            const items: MenuItem[] = [
                {
                    label: '$(graph) Show BBrainy Usage Report',
                    description: 'View your local BBrainy usage statistics',
                    action: () => monitor?.showUsageReportInteractive()
                },
                notifierActive
                    ? {
                        label: '$(bell-slash) Close BBrainy Notifier',
                        description: 'Stop the periodic BBrainy reminder',
                        action: () => {
                            (monitor as any)?.closeNotifierDirect();
                            vscode.window.showInformationMessage('BBrainy notifier closed');
                        }
                    }
                    : {
                        label: '$(bell) Set BBrainy Notifier',
                        description: 'Set a periodic reminder to use BBrainy',
                        action: async () => {
                            const presets = [
                                { label: 'Every 30 minutes', ms: 30 * 60000 },
                                { label: 'Every 1 hour',     ms: 60 * 60000 },
                                { label: 'Every 2 hours',    ms: 120 * 60000 }
                            ];
                            const picked = await vscode.window.showQuickPick(presets.map(p => p.label), { placeHolder: 'Select reminder interval' });
                            if (!picked) { return; }
                            const ms = presets.find(p => p.label === picked)!.ms;
                            const result = (monitor as any)?.setNotifierDirect(ms);
                            vscode.window.showInformationMessage(result?.message || 'Notifier set');
                        }
                    },
                { label: '$(info) Connection Status', description: info ? `${info.serverKey} — Connected` : 'Not initialized',
                    action: () => vscode.commands.executeCommand('clientMonitor.showStatus') },
                { label: '$(key) Change Server Key',       action: () => vscode.commands.executeCommand('clientMonitor.setServerKey') },
                { label: '$(list-ordered) Open Sync Diagnostics Log', description: 'View local sync folder activity log',
                    action: () => vscode.commands.executeCommand('clientMonitor.openDiagLog') },
            ];

            const picked = await vscode.window.showQuickPick(
                items.map(i => ({ label: i.label, description: i.description, _action: i.action })),
                { placeHolder: 'BBrainy Champion — choose an action' }
            );
            if (picked) { await (picked as any)._action(); }
        })
    );

    // Command: Reset to Default Server
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.resetToDefault', async () => {
            await monitor?.setServerKey(DEFAULT_SERVER_KEY);
            vscode.window.showInformationMessage('Reset to default server key');
        })
    );

    // Command: Show BBrainy Usage Report
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.showUsageReport', async () => {
            if (!monitor) { vscode.window.showWarningMessage('Client Monitor not initialized'); return; }
            await monitor.showUsageReportInteractive();
        })
    );

    // Command: Set BBrainy Notifier
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.setNotifier', async () => {
            if (!monitor) { vscode.window.showWarningMessage('Client Monitor not initialized'); return; }
            const presets = [
                { label: 'Every 30 minutes', ms: 30 * 60000 },
                { label: 'Every 1 hour',     ms: 60 * 60000 },
                { label: 'Every 2 hours',    ms: 120 * 60000 }
            ];
            const picked = await vscode.window.showQuickPick(presets.map(p => p.label), {
                placeHolder: 'Select reminder interval'
            });
            if (!picked) { return; }
            const ms = presets.find(p => p.label === picked)!.ms;
            const result = (monitor as any).setNotifierDirect(ms);
            vscode.window.showInformationMessage(result.message || 'Notifier set');
        })
    );

    // Command: Close BBrainy Notifier
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.closeNotifier', () => {
            if (!monitor) { vscode.window.showWarningMessage('Client Monitor not initialized'); return; }
            const result = (monitor as any).closeNotifierDirect();
            vscode.window.showInformationMessage(result.message || 'Notifier closed');
        })
    );

    // Command: Open Sync Diagnostics Log
    context.subscriptions.push(
        vscode.commands.registerCommand('clientMonitor.openDiagLog', () => {
            const logPath = syncLog.filePath;
            vscode.workspace.openTextDocument(vscode.Uri.file(logPath)).then(
                doc => vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.One }),
                () => vscode.window.showWarningMessage(
                    `Diagnostics log not found yet — no sync activity has been recorded.`,
                    'Show Path'
                ).then(choice => {
                    if (choice === 'Show Path') {
                        vscode.window.showInformationMessage(`Log path: ${logPath}`);
                    }
                })
            );
        })
    );
}

export function deactivate() {
    monitor?.cleanup();
    monitor = null;
}
