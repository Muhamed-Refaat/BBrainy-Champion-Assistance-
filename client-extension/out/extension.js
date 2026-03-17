"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var os = __toESM(require("os"));
var crypto = __toESM(require("crypto"));
var import_child_process = require("child_process");
var DEFAULT_SERVER_KEY = "default";
var FALLBACK_POLL_INTERVAL_MS = 15e3;
var UPDATE_CHECK_INTERVAL_MS = 36e5;
var EXTENSION_ID = "client-monitor";
function isUncPath(p) {
  return process.platform === "win32" && p.startsWith("\\\\");
}
function fsEnsureDir(dirPath) {
  if (isUncPath(dirPath)) {
    try {
      (0, import_child_process.execSync)(`mkdir "${dirPath}"`, { shell: "cmd.exe", stdio: "pipe", timeout: 1e4 });
    } catch {
    }
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
}
function fsPathExists(p) {
  if (isUncPath(p)) {
    try {
      const out = (0, import_child_process.execSync)(`if exist "${p}" (echo Y) else (echo N)`, { shell: "cmd.exe", stdio: "pipe", timeout: 8e3 }).toString().trim();
      return out === "Y";
    } catch {
      return false;
    }
  }
  return fs.existsSync(p);
}
function fsReadText(filePath) {
  if (isUncPath(filePath)) {
    const tmp = path.join(os.tmpdir(), `bba-rd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
    try {
      (0, import_child_process.execSync)(`copy /Y "${filePath}" "${tmp}"`, { shell: "cmd.exe", stdio: "pipe", timeout: 15e3 });
      const data = fs.readFileSync(tmp, "utf-8");
      try {
        fs.unlinkSync(tmp);
      } catch {
      }
      return data;
    } catch (e) {
      try {
        fs.unlinkSync(tmp);
      } catch {
      }
      throw e;
    }
  }
  return fs.readFileSync(filePath, "utf-8");
}
function fsWriteText(filePath, content) {
  if (isUncPath(filePath)) {
    const tmp = path.join(os.tmpdir(), `bba-wr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.tmp`);
    try {
      fs.writeFileSync(tmp, content, "utf-8");
      (0, import_child_process.execSync)(`copy /Y "${tmp}" "${filePath}"`, { shell: "cmd.exe", stdio: "pipe", timeout: 15e3 });
      try {
        fs.unlinkSync(tmp);
      } catch {
      }
    } catch (e) {
      try {
        fs.unlinkSync(tmp);
      } catch {
      }
      throw e;
    }
    return;
  }
  fs.writeFileSync(filePath, content);
}
function fsDeleteFile(filePath) {
  if (isUncPath(filePath)) {
    (0, import_child_process.execSync)(`del /F /Q "${filePath}"`, { shell: "cmd.exe", stdio: "pipe", timeout: 5e3 });
    return;
  }
  fs.unlinkSync(filePath);
}
function fsListDir(dirPath) {
  if (isUncPath(dirPath)) {
    try {
      const out = (0, import_child_process.execSync)(`dir /b "${dirPath}"`, { shell: "cmd.exe", stdio: "pipe", timeout: 1e4 }).toString();
      return out.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    } catch {
      return [];
    }
  }
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}
function fsCopyFile(src, dest) {
  if (isUncPath(src) || isUncPath(dest)) {
    (0, import_child_process.execSync)(`copy /Y "${src}" "${dest}"`, { shell: "cmd.exe", stdio: "pipe", timeout: 3e4 });
    return;
  }
  fs.copyFileSync(src, dest);
}
function fsRenameFile(src, dest) {
  if (isUncPath(src) || isUncPath(dest)) {
    (0, import_child_process.execSync)(`move /Y "${src}" "${dest}"`, { shell: "cmd.exe", stdio: "pipe", timeout: 1e4 });
    return;
  }
  fs.renameSync(src, dest);
}
var GitFallbackManager = class _GitFallbackManager {
  pollInterval = null;
  fallbackPath = "";
  clientKey = "";
  clientLabel = "";
  serverKey = "";
  version = "1.0.0";
  onCommand = null;
  pollIntervalMs = FALLBACK_POLL_INTERVAL_MS;
  executedIds = /* @__PURE__ */ new Set();
  context = null;
  _isLeader = false;
  configure(fallbackPath, clientKey, clientLabel, serverKey, version2, onCommand, context) {
    this.fallbackPath = fallbackPath;
    this.clientKey = clientKey;
    this.clientLabel = clientLabel;
    this.serverKey = serverKey;
    this.version = version2;
    this.onCommand = onCommand;
    if (context) {
      this.context = context;
      const saved = context.globalState.get("executedIds");
      if (saved) {
        this.executedIds = new Set(saved);
      }
    }
    this.writePresenceFile();
    this.tryAcquireLeadership();
  }
  // ─── Leader election ─────────────────────────────────────────────
  // Only one VS Code instance per client (same username-hostname) polls
  // the sync folder.  A small lock file in <syncPath>/leaders/ tracks the
  // current leader's PID.  Other instances become followers — they still
  // refresh the presence file but skip queue polling & result writing.
  leaderFilePath() {
    return path.join(this.fallbackPath, "leaders", `${this.clientLabel}.json`);
  }
  /** Check whether a given process ID is alive on this machine. */
  static isProcessAlive(pid) {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }
  /** Try to claim leadership.  Returns true if this instance is (or becomes) the leader. */
  tryAcquireLeadership() {
    if (!this.fallbackPath) {
      return false;
    }
    try {
      const dir = path.join(this.fallbackPath, "leaders");
      fsEnsureDir(dir);
      const lockPath = this.leaderFilePath();
      if (fsPathExists(lockPath)) {
        try {
          const lock = JSON.parse(fsReadText(lockPath));
          if (lock.pid === process.pid) {
            this._isLeader = true;
            lock.timestamp = Date.now();
            fsWriteText(lockPath, JSON.stringify(lock));
            return true;
          }
          if (_GitFallbackManager.isProcessAlive(lock.pid)) {
            this._isLeader = false;
            return false;
          }
          console.log(`[Fallback] Previous leader PID ${lock.pid} is dead \u2014 claiming leadership`);
        } catch {
        }
      }
      fsWriteText(lockPath, JSON.stringify({ pid: process.pid, timestamp: Date.now() }));
      this._isLeader = true;
      console.log(`[Fallback] This instance (PID ${process.pid}) is now the leader for ${this.clientLabel}`);
      return true;
    } catch (e) {
      console.warn(`[Fallback] Leader acquisition failed: ${e?.message || e}`);
      this._isLeader = true;
      return true;
    }
  }
  /** Release leadership on shutdown so another instance can take over immediately. */
  releaseLeadership() {
    if (!this._isLeader || !this.fallbackPath) {
      return;
    }
    try {
      const lockPath = this.leaderFilePath();
      if (fsPathExists(lockPath)) {
        try {
          const lock = JSON.parse(fsReadText(lockPath));
          if (lock.pid === process.pid) {
            fsDeleteFile(lockPath);
            console.log(`[Fallback] Leadership released (PID ${process.pid})`);
          }
        } catch {
          try {
            fsDeleteFile(lockPath);
          } catch {
          }
        }
      }
    } catch {
    }
    this._isLeader = false;
  }
  get isLeader() {
    return this._isLeader;
  }
  // Write/update the presence file so the server can discover this client via sync folder
  writePresenceFile() {
    if (!this.fallbackPath || !this.clientKey) {
      return;
    }
    try {
      const dir = path.join(this.fallbackPath, "clients", this.serverKey);
      fsEnsureDir(dir);
      const filePath = path.join(dir, `${this.clientLabel}.json`);
      let registeredAt = Date.now();
      if (fsPathExists(filePath)) {
        try {
          const existing = JSON.parse(fsReadText(filePath));
          registeredAt = existing.registeredAt ?? registeredAt;
        } catch {
        }
      }
      const entry = {
        clientLabel: this.clientLabel,
        clientKey: this.clientKey,
        serverKey: this.serverKey,
        username: os.userInfo().username,
        hostname: os.hostname(),
        version: this.version,
        registeredAt,
        lastSeen: Date.now(),
        status: "active"
      };
      fsWriteText(filePath, JSON.stringify(entry, null, 2));
      console.log(`[Fallback] Presence file written: ${filePath}`);
    } catch (e) {
      console.warn(`[Fallback] Could not write presence file: ${e?.message || e}`);
    }
  }
  // Update only lastSeen in the presence file (called on each poll cycle)
  updatePresenceLastSeen() {
    if (!this.fallbackPath || !this.clientKey || !this.serverKey) {
      return;
    }
    try {
      const filePath = path.join(this.fallbackPath, "clients", this.serverKey, `${this.clientLabel}.json`);
      if (!fsPathExists(filePath)) {
        this.writePresenceFile();
        return;
      }
      let entry;
      try {
        entry = JSON.parse(fsReadText(filePath));
      } catch {
        this.writePresenceFile();
        return;
      }
      entry.lastSeen = Date.now();
      fsWriteText(filePath, JSON.stringify(entry, null, 2));
    } catch {
    }
  }
  // Remove the presence file from the OLD server key folder (call before reconfiguring)
  removeOldPresenceFile(oldServerKey) {
    if (!this.fallbackPath || !this.clientLabel || !oldServerKey) {
      return;
    }
    try {
      const oldFile = path.join(this.fallbackPath, "clients", oldServerKey, `${this.clientLabel}.json`);
      if (fsPathExists(oldFile)) {
        fsDeleteFile(oldFile);
        console.log(`[Fallback] Removed stale presence file: ${oldFile}`);
      }
    } catch (e) {
      console.warn(`[Fallback] Could not remove old presence file: ${e?.message || e}`);
    }
  }
  // Mark this client as inactive in the presence file (called on extension deactivation)
  markInactive() {
    if (!this.fallbackPath || !this.clientKey || !this.serverKey) {
      return;
    }
    try {
      const filePath = path.join(this.fallbackPath, "clients", this.serverKey, `${this.clientLabel}.json`);
      if (!fsPathExists(filePath)) {
        return;
      }
      let entry;
      try {
        entry = JSON.parse(fsReadText(filePath));
      } catch {
        return;
      }
      entry.status = "inactive";
      entry.lastSeen = Date.now();
      fsWriteText(filePath, JSON.stringify(entry, null, 2));
      console.log(`[Fallback] Marked client as inactive: ${filePath}`);
    } catch (e) {
      console.warn(`[Fallback] Could not mark client inactive: ${e?.message || e}`);
    }
  }
  get isConfigured() {
    return !!this.fallbackPath && !!this.clientKey;
  }
  get basePath() {
    return this.fallbackPath;
  }
  startPolling(intervalMs) {
    this.stopPolling();
    if (!this.isConfigured) {
      return;
    }
    if (intervalMs !== void 0 && intervalMs >= 3e3) {
      this.pollIntervalMs = intervalMs;
    }
    this.checkBacklog();
    this.pollInterval = setInterval(() => this.checkBacklog(), this.pollIntervalMs);
    console.log(`[Fallback] Polling started (${this.pollIntervalMs / 1e3}s): ${this.fallbackPath}`);
  }
  /** Change the poll interval at runtime (called when server sends setPollInterval command) */
  setPollInterval(ms) {
    if (ms < 3e3) {
      ms = 3e3;
    }
    if (ms > 3e5) {
      ms = 3e5;
    }
    this.pollIntervalMs = ms;
    if (this.pollInterval) {
      this.startPolling();
    }
    console.log(`[Fallback] Poll interval changed to ${ms / 1e3}s`);
  }
  get currentPollIntervalMs() {
    return this.pollIntervalMs;
  }
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
  async checkBacklog() {
    if (!this.isConfigured || !this.onCommand) {
      return;
    }
    this.tryAcquireLeadership();
    this.updatePresenceLastSeen();
    if (!this._isLeader) {
      return;
    }
    const queueFile = path.join(this.fallbackPath, "queue", `${this.clientLabel}.json`);
    const claimedFile = queueFile + `.lock-${process.pid}`;
    try {
      try {
        fsRenameFile(queueFile, claimedFile);
      } catch {
      }
      let raw;
      try {
        raw = fsReadText(claimedFile);
      } catch {
        return;
      }
      try {
        fsDeleteFile(claimedFile);
      } catch {
      }
      let cmds = [];
      try {
        cmds = JSON.parse(raw);
      } catch {
        console.warn(`[Fallback] Queue file has invalid JSON \u2014 discarded`);
        return;
      }
      if (cmds.length === 0) {
        return;
      }
      cmds = cmds.filter((c) => !c.serverKey || c.serverKey === this.serverKey);
      if (cmds.length === 0) {
        console.log(`[Fallback] Queue had commands but none for serverKey="${this.serverKey}" \u2014 skipping`);
        return;
      }
      console.log(`[Fallback] Found ${cmds.length} queued command(s) for ${this.clientLabel}`);
      const toExecute = cmds.filter((cmd) => !this.executedIds.has(cmd.id));
      if (toExecute.length === 0) {
        return;
      }
      for (const cmd of toExecute) {
        this.executedIds.add(cmd.id);
      }
      const batchResults = await Promise.all(toExecute.map(async (cmd) => {
        try {
          console.log(`[Fallback] Executing queued command: ${cmd.command} (${cmd.id})`);
          const payload = await this.onCommand(cmd);
          return { id: cmd.id, command: cmd.command, payload };
        } catch (e) {
          console.error(`[Fallback] Error executing queued command ${cmd.command}:`, e);
          return { id: cmd.id, command: cmd.command, payload: { success: false, error: e?.message || String(e) } };
        }
      }));
      if (this.context) {
        while (this.executedIds.size > 500) {
          const first = this.executedIds.values().next().value;
          if (first !== void 0) {
            this.executedIds.delete(first);
          } else {
            break;
          }
        }
        this.context.globalState.update("executedIds", [...this.executedIds]);
      }
      this.writeServerBacklogBatch(batchResults);
      console.log(`[Fallback] Wrote batch result file (${batchResults.length} entries) for ${this.clientLabel}`);
    } catch (e) {
      console.error("[Fallback] Backlog check error:", e);
    }
  }
  addExecutedId(id) {
    this.executedIds.add(id);
    if (this.executedIds.size > 500) {
      const first = this.executedIds.values().next().value;
      if (first !== void 0) {
        this.executedIds.delete(first);
      }
    }
    if (this.context) {
      this.context.globalState.update("executedIds", [...this.executedIds]);
    }
  }
  writeServerBacklog(commandId, command, payload) {
    if (!this.isConfigured) {
      return;
    }
    const targetDir = this.isServerOnline() ? path.join(this.fallbackPath, "results") : path.join(this.fallbackPath, "server-backlog");
    fsEnsureDir(targetDir);
    const entry = { id: commandId, command, clientKey: this.clientKey, clientLabel: this.clientLabel, timestamp: Date.now(), payload };
    const baseName = `${this.clientLabel}-${commandId}`;
    const tmpFile = path.join(targetDir, `${baseName}.tmp`);
    const finalFile = path.join(targetDir, `${baseName}.json`);
    fsWriteText(tmpFile, JSON.stringify(entry, null, 2));
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        fsRenameFile(tmpFile, finalFile);
        return;
      } catch (e) {
        if (attempt < 2) {
          try {
            (0, import_child_process.execSync)("ping -n 2 127.0.0.1 >nul", { shell: "cmd.exe", stdio: "pipe", timeout: 3e3 });
          } catch {
          }
        } else {
          console.error(`[Fallback] Failed to rename result .tmp \u2192 .json after retries: ${e?.message || e}`);
          try {
            fsWriteText(finalFile, JSON.stringify(entry, null, 2));
          } catch {
          }
          try {
            fsDeleteFile(tmpFile);
          } catch {
          }
        }
      }
    }
  }
  // Write all results from one checkBacklog() sweep as a single file (array).
  // One UNC write instead of N — eliminates per-command disk round-trips.
  // Server's pollResultsDir/pollServerBacklog already handle both single-object
  // and array-of-objects formats, so no server-side changes are needed.
  writeServerBacklogBatch(entries) {
    if (!this.isConfigured || entries.length === 0) {
      return;
    }
    const targetDir = this.isServerOnline() ? path.join(this.fallbackPath, "results") : path.join(this.fallbackPath, "server-backlog");
    fsEnsureDir(targetDir);
    const batchEntries = entries.map((e) => ({
      id: e.id,
      command: e.command,
      clientKey: this.clientKey,
      clientLabel: this.clientLabel,
      timestamp: Date.now(),
      payload: e.payload
    }));
    const batchId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const baseName = `${this.clientLabel}-batch-${batchId}`;
    const tmpFile = path.join(targetDir, `${baseName}.tmp`);
    const finalFile = path.join(targetDir, `${baseName}.json`);
    fsWriteText(tmpFile, JSON.stringify(batchEntries, null, 2));
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        fsRenameFile(tmpFile, finalFile);
        return;
      } catch (e) {
        if (attempt < 2) {
          try {
            (0, import_child_process.execSync)("ping -n 2 127.0.0.1 >nul", { shell: "cmd.exe", stdio: "pipe", timeout: 3e3 });
          } catch {
          }
        } else {
          console.error(`[Fallback] Failed to rename batch .tmp \u2192 .json after retries: ${e?.message || e}`);
          try {
            fsWriteText(finalFile, JSON.stringify(batchEntries, null, 2));
          } catch {
          }
          try {
            fsDeleteFile(tmpFile);
          } catch {
          }
        }
      }
    }
  }
  // Check whether the server is currently online by reading its presence file.
  // Server is considered online if its presence file has lastSeen within 90 seconds.
  isServerOnline() {
    if (!this.fallbackPath || !this.serverKey) {
      return false;
    }
    try {
      const serversDir = path.join(this.fallbackPath, "servers");
      if (!fsPathExists(serversDir)) {
        return false;
      }
      const keyPrefix = `${this.serverKey}-`;
      const files = fsListDir(serversDir).filter((f) => f.endsWith(".json") && f.startsWith(keyPrefix));
      for (const file of files) {
        try {
          const entry = JSON.parse(fsReadText(path.join(serversDir, file)));
          if (entry.status === "online" && Date.now() - entry.lastSeen < 9e4) {
            return true;
          }
        } catch {
        }
      }
    } catch {
    }
    return false;
  }
};
var AutoUpdateManager = class {
  checkInterval = null;
  currentVersion;
  context;
  constructor(context) {
    this.context = context;
    this.currentVersion = context.extension?.packageJSON?.version || "1.0.0";
  }
  startChecking(fallbackPath) {
    this.stopChecking();
    if (!fallbackPath) {
      return;
    }
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
  setCheckInterval(ms, fallbackPath) {
    this.stopChecking();
    if (!fallbackPath) {
      return;
    }
    this.checkInterval = setInterval(() => this.checkForUpdates(fallbackPath), ms);
    console.log(`[AutoUpdate] Check interval changed to ${ms / 1e3}s`);
  }
  async checkForUpdates(fallbackPath) {
    try {
      const updatesDir = path.join(fallbackPath, "updates");
      if (!fsPathExists(updatesDir)) {
        return;
      }
      const vsixFiles = fsListDir(updatesDir).filter((f) => f.endsWith(".vsix") && f.startsWith(EXTENSION_ID)).sort();
      if (vsixFiles.length === 0) {
        return;
      }
      const latest = vsixFiles[vsixFiles.length - 1];
      const versionMatch = latest.match(/(\d+\.\d+\.\d+)/);
      if (!versionMatch) {
        return;
      }
      const availableVersion = versionMatch[1];
      if (!this.isNewer(availableVersion, this.currentVersion)) {
        return;
      }
      console.log(`[AutoUpdate] New version available: ${availableVersion} (current: ${this.currentVersion})`);
      const remoteVsix = path.join(updatesDir, latest);
      const localTmp = path.join(os.tmpdir(), latest);
      try {
        fsCopyFile(remoteVsix, localTmp);
      } catch (copyErr) {
        console.error("[AutoUpdate] Failed to copy VSIX locally:", copyErr);
        return;
      }
      try {
        await vscode.commands.executeCommand("workbench.extensions.installExtension", vscode.Uri.file(localTmp));
        console.log(`[AutoUpdate] Successfully installed ${latest}`);
        try {
          fs.unlinkSync(localTmp);
        } catch {
        }
        vscode.window.showInformationMessage(
          `Client Monitor updated to v${availableVersion}. Reload to activate.`,
          "Reload"
        ).then((choice) => {
          if (choice === "Reload") {
            vscode.commands.executeCommand("workbench.action.reloadWindow");
          }
        });
      } catch (installErr) {
        console.error("[AutoUpdate] Install failed:", installErr);
        try {
          fs.unlinkSync(localTmp);
        } catch {
        }
      }
    } catch (e) {
      console.error("[AutoUpdate] Check failed:", e);
    }
  }
  isNewer(available, current) {
    const a = available.split(".").map(Number);
    const c = current.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      if ((a[i] || 0) > (c[i] || 0)) {
        return true;
      }
      if ((a[i] || 0) < (c[i] || 0)) {
        return false;
      }
    }
    return false;
  }
};
var ClientMonitor = class {
  clientKey = "";
  serverKey = DEFAULT_SERVER_KEY;
  context;
  fallback;
  autoUpdater;
  notifierIntervals = /* @__PURE__ */ new Map();
  reminderPanels = /* @__PURE__ */ new Map();
  notifierRunningInstances = /* @__PURE__ */ new Set();
  usageLogPath;
  statusBarItem;
  constructor(context) {
    this.context = context;
    this.usageLogPath = path.join(os.homedir(), "AppData", "Local", "AI4ALL_log", "AI4ALL_log.log");
    this.fallback = new GitFallbackManager();
    this.autoUpdater = new AutoUpdateManager(context);
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = "clientMonitor.statusBarMenu";
    context.subscriptions.push(this.statusBarItem);
    this.updateStatusBar("inactive");
  }
  updateStatusBar(state) {
    if (state === "active") {
      this.statusBarItem.text = "$(cloud-download) Monitor: Active";
      this.statusBarItem.tooltip = `Sync-folder mode \u2014 server key: "${this.serverKey}"`;
      this.statusBarItem.backgroundColor = void 0;
    } else {
      this.statusBarItem.text = "$(debug-disconnect) Monitor: Inactive";
      this.statusBarItem.tooltip = "No sync path configured";
      this.statusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
    }
    this.statusBarItem.show();
  }
  async initialize() {
    this.clientKey = this.getOrCreateClientKey();
    this.loadConfig();
    this.setupFallback();
    this.setupAutoUpdate();
  }
  loadConfig() {
    const config = vscode.workspace.getConfiguration("clientMonitor");
    this.serverKey = config.get("serverKey") || DEFAULT_SERVER_KEY;
  }
  setupFallback() {
    const config = vscode.workspace.getConfiguration("clientMonitor");
    const syncPath = config.get("syncPath") || "";
    if (syncPath) {
      const clientLabel = `${os.userInfo().username}-${os.hostname()}`;
      const version2 = this.context.extension?.packageJSON?.version || "1.0.0";
      this.fallback.configure(
        syncPath,
        this.clientKey,
        clientLabel,
        this.serverKey,
        version2,
        (cmd) => this.executeFallbackCommand(cmd),
        this.context
      );
      this.fallback.startPolling();
      this.updateStatusBar("active");
    }
  }
  setupAutoUpdate() {
    const config = vscode.workspace.getConfiguration("clientMonitor");
    const clientReleasePath = config.get("clientReleasePath") || "";
    if (clientReleasePath) {
      this.autoUpdater.startChecking(clientReleasePath);
    }
  }
  async setServerKey(newKey) {
    const oldKey = this.serverKey;
    this.serverKey = newKey;
    const config = vscode.workspace.getConfiguration("clientMonitor");
    await config.update("serverKey", newKey, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Server key set to: ${newKey}`);
    this.setupFallback();
    if (oldKey && oldKey !== newKey) {
      this.fallback.removeOldPresenceFile(oldKey);
    }
  }
  async executeFallbackCommand(cmd) {
    return this.executeCommand(cmd.command, cmd.payload);
  }
  async executeCommand(command, payload) {
    switch (command) {
      case "getSystemInfo":
        return await this.collectSystemInfo();
      case "checkBBrainy":
        return this.checkBBrainyStatus();
      case "forceBBrainy":
        return await this.activateBBrainyDirect();
      case "setAlarm":
        this.setupAlarmDirect(payload);
        return { success: true };
      case "getWorkspace":
        return {
          workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
          openFiles: vscode.workspace.textDocuments.map((d) => d.fileName)
        };
      case "getUsageReport":
        return await this.getUsageReport(payload?.hours);
      case "setNotifier":
        return this.setNotifierDirect(payload?.intervalMs);
      case "closeNotifier":
        return this.closeNotifierDirect();
      case "displayReminderScreen":
        this.displayReminderScreenDirect(payload);
        return { success: true, message: "Reminder displayed" };
      case "setPollInterval": {
        const ms = payload?.intervalMs;
        if (typeof ms === "number" && ms >= 3e3) {
          this.fallback.setPollInterval(ms);
          return { success: true, intervalMs: this.fallback.currentPollIntervalMs };
        }
        return { success: false, error: "intervalMs must be >= 3000" };
      }
      case "setUpdateCheckInterval": {
        const ms = payload?.intervalMs;
        if (typeof ms === "number" && ms >= 6e4) {
          this.autoUpdater.setCheckInterval(ms, vscode.workspace.getConfiguration("clientMonitor").get("clientReleasePath") || "");
          return { success: true, intervalMs: ms };
        }
        return { success: false, error: "intervalMs must be >= 60000 (1 minute)" };
      }
      case "getAssets":
        return { acknowledged: true };
      default:
        return { error: "Unknown command", command };
    }
  }
  async collectSystemInfo() {
    return {
      hostname: os.hostname(),
      username: os.userInfo().username,
      platform: process.platform,
      vscodeVersion: vscode.version,
      extensionVersion: this.context.extension?.packageJSON?.version || "1.0.0",
      workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
      extensions: vscode.extensions.all.filter((ext) => !ext.packageJSON.isBuiltin).map((ext) => ({ id: ext.id, isActive: ext.isActive })),
      bbrainyStatus: this.checkBBrainyStatus()
    };
  }
  checkBBrainyStatus() {
    const bbrainy = vscode.extensions.getExtension("Valeo.BBrainy");
    let lastUsedTime = "Unknown";
    let usageCount = 0;
    try {
      if (fs.existsSync(this.usageLogPath)) {
        const logContent = fs.readFileSync(this.usageLogPath, "utf-8");
        const lines = logContent.split("\n").filter((l) => l.trim());
        if (lines.length > 0) {
          const lastLine = lines[lines.length - 1];
          const match = lastLine.match(/'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'/);
          if (match) {
            lastUsedTime = match[1];
          }
          usageCount = lines.length;
        }
      }
    } catch {
    }
    return {
      installed: !!bbrainy,
      active: bbrainy?.isActive || false,
      version: bbrainy?.packageJSON.version || "Unknown",
      lastUsedTime,
      totalUsage: usageCount
    };
  }
  // ─── Direct command implementations (no conn dependency) ──────────────
  async activateBBrainyDirect() {
    const bbrainy = vscode.extensions.getExtension("Valeo.BBrainy");
    if (bbrainy && !bbrainy.isActive) {
      await bbrainy.activate();
      vscode.window.showInformationMessage("BBrainy has been activated");
    }
    return { success: true, active: bbrainy?.isActive };
  }
  setupAlarmDirect(config) {
    setInterval(() => {
      const bbrainy = vscode.extensions.getExtension("Valeo.BBrainy");
      if (!bbrainy?.isActive) {
        vscode.window.showWarningMessage("Please activate BBrainy extension", "Activate").then((choice) => {
          if (choice === "Activate") {
            this.activateBBrainyDirect();
          }
        });
      }
    }, config?.intervalMs || 36e5);
  }
  // ── Local BBrainy Usage Report (same as BBrainyUsageAssistant) ──────────────
  async showUsageReportInteractive() {
    const options = [
      { label: "Last 24 hours", hours: 24 },
      { label: "Last 7 days", hours: 168 },
      { label: "All time", hours: void 0 },
      { label: "Custom...", hours: -1 }
    ];
    const picked = await vscode.window.showQuickPick(options.map((o) => o.label), {
      placeHolder: "Select time period"
    });
    if (!picked) {
      return;
    }
    let hours;
    let label = picked;
    if (picked === "Custom...") {
      const input = await vscode.window.showInputBox({
        prompt: "Enter number of hours (1-23)",
        validateInput: (v) => {
          const n = parseInt(v, 10);
          return isNaN(n) || n < 1 || n > 23 ? "Enter a number between 1 and 23" : null;
        }
      });
      if (!input) {
        return;
      }
      hours = parseInt(input, 10);
      label = `Last ${hours} hours`;
    } else {
      hours = options.find((o) => o.label === picked)?.hours;
    }
    const data = await this.getUsageReport(hours);
    if (!data.success) {
      vscode.window.showErrorMessage(`Cannot load usage report: ${data.error}`);
      return;
    }
    this.openUsageReportWebview(data, label);
  }
  openUsageReportWebview(usageData, timeframeLabel) {
    const username = os.userInfo().username;
    const hostname2 = os.hostname();
    const panel = vscode.window.createWebviewPanel(
      "bbrainyUsageReport",
      `BBrainy Usage: ${timeframeLabel}`,
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    const agents = usageData.agents || [];
    const total = usageData.totalEntries || 0;
    const mostUsed = agents[0]?.name || "\u2014";
    const agentRows = agents.map(
      (a) => `<tr><td><span class="agent-name">${a.name}</span></td><td class="count">${a.count}</td><td class="percentage">${a.percentage}%</td></tr>`
    ).join("");
    const chartLabels = JSON.stringify(agents.map((a) => a.name));
    const chartData = JSON.stringify(agents.map((a) => a.count));
    const bgColors = JSON.stringify([
      "rgba(59,130,246,0.2)",
      "rgba(16,185,129,0.2)",
      "rgba(168,85,247,0.2)",
      "rgba(251,146,60,0.2)",
      "rgba(244,63,94,0.2)",
      "rgba(236,72,153,0.2)"
    ]);
    const borderColors = JSON.stringify([
      "rgba(59,130,246,1)",
      "rgba(16,185,129,1)",
      "rgba(168,85,247,1)",
      "rgba(251,146,60,1)",
      "rgba(244,63,94,1)",
      "rgba(236,72,153,1)"
    ]);
    const generatedAt = (/* @__PURE__ */ new Date()).toLocaleString();
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
    <div class="client-info">&#128205; Client: <strong>${username}@${hostname2}</strong></div>
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
  async getUsageReport(hours) {
    try {
      if (!fs.existsSync(this.usageLogPath)) {
        return { success: false, error: "Usage log file not found", logPath: this.usageLogPath };
      }
      const logContent = fs.readFileSync(this.usageLogPath, "utf-8");
      const lines = logContent.split("\n").filter((l) => l.trim());
      const now = Date.now();
      const timeFilter = hours ? hours * 3600 * 1e3 : void 0;
      const usageMap = /* @__PURE__ */ new Map();
      let totalEntries = 0;
      let earliestEntry = null;
      let latestEntry = null;
      const logRegex = /'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', '.*?', '(.*?)', '.*?'/;
      for (const line of lines) {
        try {
          const match = line.match(logRegex);
          if (match && match[1] && match[2]) {
            const entryTime = new Date(match[1]).getTime();
            if (timeFilter && now - entryTime > timeFilter) {
              continue;
            }
            totalEntries++;
            usageMap.set(match[2], (usageMap.get(match[2]) || 0) + 1);
            if (earliestEntry === null || entryTime < earliestEntry) {
              earliestEntry = entryTime;
            }
            if (latestEntry === null || entryTime > latestEntry) {
              latestEntry = entryTime;
            }
          } else {
            const entry = JSON.parse(line);
            const entryTime = new Date(entry.timestamp || entry.time).getTime();
            if (timeFilter && now - entryTime > timeFilter) {
              continue;
            }
            totalEntries++;
            const agent = entry.agent || entry.name || "Unknown";
            usageMap.set(agent, (usageMap.get(agent) || 0) + 1);
            if (earliestEntry === null || entryTime < earliestEntry) {
              earliestEntry = entryTime;
            }
            if (latestEntry === null || entryTime > latestEntry) {
              latestEntry = entryTime;
            }
          }
        } catch {
          continue;
        }
      }
      let timeframeLabel = "All time";
      if (hours) {
        timeframeLabel = hours === 24 ? "Last 24 hours" : hours === 168 ? "Last 7 days" : `Last ${hours} hours`;
      }
      return {
        success: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        timeframe: timeframeLabel,
        timeframeHours: hours,
        dateRange: {
          earliest: earliestEntry ? new Date(earliestEntry).toISOString() : null,
          latest: latestEntry ? new Date(latestEntry).toISOString() : null
        },
        totalEntries,
        agents: Array.from(usageMap.entries()).map(([agent, count]) => ({
          name: agent,
          count,
          percentage: totalEntries > 0 ? (count / totalEntries * 100).toFixed(2) : "0.00"
        })).sort((a, b) => b.count - a.count)
      };
    } catch (error) {
      return { success: false, error: String(error), logPath: this.usageLogPath };
    }
  }
  setNotifierDirect(intervalMs) {
    let interval = intervalMs || 36e5;
    const minInterval = 6e4;
    const maxInterval = 120 * 6e4;
    if (interval < minInterval) {
      return { success: false, message: "Interval must be at least 1 minute", intervalMs: minInterval };
    }
    if (interval > maxInterval) {
      return { success: false, message: "Interval cannot exceed 120 minutes", intervalMs: maxInterval };
    }
    if (this.notifierRunningInstances.has(this.serverKey)) {
      return { success: true, message: "Notifier already active", intervalMs: interval };
    }
    this.closeNotifierDirect();
    this.notifierRunningInstances.add(this.serverKey);
    const notifierInterval = setInterval(() => {
      if (os.platform() === "win32") {
        (0, import_child_process.exec)('powershell.exe -c "[console]::beep(500, 300); Start-Sleep -m 100; [console]::beep(500, 300)"');
      }
      vscode.window.showInformationMessage("Don't forget to use BBrainy for assistance!", "OK", "Dismiss");
    }, interval);
    this.notifierIntervals.set(this.serverKey, notifierInterval);
    return { success: true, message: "Notifier set", intervalMs: interval };
  }
  closeNotifierDirect() {
    const interval = this.notifierIntervals.get(this.serverKey);
    if (interval) {
      clearInterval(interval);
      this.notifierIntervals.delete(this.serverKey);
      this.notifierRunningInstances.delete(this.serverKey);
    }
    return { success: true, message: "Notifier closed" };
  }
  displayReminderScreenDirect(payload) {
    const title = payload?.title || "Reminder";
    const body = payload?.body || "No message provided";
    const existingPanel = this.reminderPanels.get(this.serverKey);
    if (existingPanel) {
      existingPanel.dispose();
    }
    const panel = vscode.window.createWebviewPanel(
      "reminderScreen",
      "Reminder from Monitor",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );
    panel.webview.html = this.getReminderScreenHtml(title, body);
    panel.onDidDispose(() => {
      this.reminderPanels.delete(this.serverKey);
    });
    this.reminderPanels.set(this.serverKey, panel);
  }
  getReminderScreenHtml(title, body) {
    const safeTitle = title.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c] || c);
    const safeBody = body.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c] || c);
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
    <div class="header"><div class="icon">\u{1F514}</div><h1>${safeTitle}</h1></div>
    <div class="body-area"><div class="body-text">${safeBody}</div></div>
    <div class="info">Close this window to dismiss</div>
</body>
</html>`;
  }
  getOrCreateClientKey() {
    let key = this.context.globalState.get("clientKey");
    if (!key) {
      key = this.generateKey();
      this.context.globalState.update("clientKey", key);
    }
    return key;
  }
  generateKey() {
    const machineId = os.hostname();
    const userId = os.userInfo().username;
    return crypto.createHash("sha256").update(`${machineId}-${userId}`).digest("hex");
  }
  getInfo() {
    const config = vscode.workspace.getConfiguration("clientMonitor");
    return {
      clientKey: this.clientKey,
      serverKey: this.serverKey,
      fallbackConfigured: this.fallback.isConfigured,
      syncPath: config.get("syncPath") || "",
      clientReleasePath: config.get("clientReleasePath") || "",
      pollIntervalMs: this.fallback.currentPollIntervalMs
    };
  }
  cleanup() {
    this.fallback.releaseLeadership();
    this.fallback.markInactive();
    for (const interval of this.notifierIntervals.values()) {
      clearInterval(interval);
    }
    this.notifierIntervals.clear();
    this.fallback.stopPolling();
    this.autoUpdater.stopChecking();
    this.statusBarItem.dispose();
  }
};
var monitor = null;
function activate(context) {
  monitor = new ClientMonitor(context);
  monitor.initialize();
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("clientMonitor.serverKey") || e.affectsConfiguration("clientMonitor.syncPath") || e.affectsConfiguration("clientMonitor.clientReleasePath")) {
        monitor?.cleanup();
        monitor = new ClientMonitor(context);
        monitor.initialize();
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.setServerKey", async () => {
      const current = vscode.workspace.getConfiguration("clientMonitor").get("serverKey") || DEFAULT_SERVER_KEY;
      const key = await vscode.window.showInputBox({
        prompt: "Enter the server key to connect to",
        value: current,
        placeHolder: "e.g., uwb-01 or default"
      });
      if (key !== void 0 && key.trim()) {
        await monitor?.setServerKey(key.trim());
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.setSyncPath", async () => {
      const folders = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        title: "Select sync folder (shared/git-synced) for offline command queuing"
      });
      if (folders && folders[0]) {
        const config = vscode.workspace.getConfiguration("clientMonitor");
        await config.update("syncPath", folders[0].fsPath, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Sync path set to: ${folders[0].fsPath}`);
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.setClientReleasePath", async () => {
      const folders = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        title: "Select client-release folder for auto-updates"
      });
      if (folders && folders[0]) {
        const config = vscode.workspace.getConfiguration("clientMonitor");
        await config.update("clientReleasePath", folders[0].fsPath, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Client release path set to: ${folders[0].fsPath}`);
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.showStatus", () => {
      const info = monitor?.getInfo();
      if (info) {
        vscode.window.showInformationMessage(
          `Client Key: ${info.clientKey.substring(0, 12)}...
Server Key: ${info.serverKey}
Sync: ${info.syncPath || "Not set"}
Sync: ${info.syncPath || "Not set"}
Releases: ${info.clientReleasePath || "Not set"}`
        );
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.statusBarMenu", async () => {
      const info = monitor?.getInfo();
      const notifierActive = info ? monitor?.notifierRunningInstances?.has(monitor?.serverKey) : false;
      const items = [
        {
          label: "$(graph) Show BBrainy Usage Report",
          description: "View your local BBrainy usage statistics",
          action: () => monitor?.showUsageReportInteractive()
        },
        notifierActive ? {
          label: "$(bell-slash) Close BBrainy Notifier",
          description: "Stop the periodic BBrainy reminder",
          action: () => {
            monitor?.closeNotifierDirect();
            vscode.window.showInformationMessage("BBrainy notifier closed");
          }
        } : {
          label: "$(bell) Set BBrainy Notifier",
          description: "Set a periodic reminder to use BBrainy",
          action: async () => {
            const presets = [
              { label: "Every 30 minutes", ms: 30 * 6e4 },
              { label: "Every 1 hour", ms: 60 * 6e4 },
              { label: "Every 2 hours", ms: 120 * 6e4 }
            ];
            const picked2 = await vscode.window.showQuickPick(presets.map((p) => p.label), { placeHolder: "Select reminder interval" });
            if (!picked2) {
              return;
            }
            const ms = presets.find((p) => p.label === picked2).ms;
            const result = monitor?.setNotifierDirect(ms);
            vscode.window.showInformationMessage(result?.message || "Notifier set");
          }
        },
        {
          label: "$(info) Connection Status",
          description: info ? `${info.serverKey} \u2014 Sync-folder mode` : "Not initialized",
          action: () => vscode.commands.executeCommand("clientMonitor.showStatus")
        },
        { label: "$(key) Change Server Key", action: () => vscode.commands.executeCommand("clientMonitor.setServerKey") }
      ];
      const picked = await vscode.window.showQuickPick(
        items.map((i) => ({ label: i.label, description: i.description, _action: i.action })),
        { placeHolder: "BBrainy Champion \u2014 choose an action" }
      );
      if (picked) {
        await picked._action();
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.resetToDefault", async () => {
      await monitor?.setServerKey(DEFAULT_SERVER_KEY);
      vscode.window.showInformationMessage("Reset to default server key");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.showUsageReport", async () => {
      if (!monitor) {
        vscode.window.showWarningMessage("Client Monitor not initialized");
        return;
      }
      await monitor.showUsageReportInteractive();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.setNotifier", async () => {
      if (!monitor) {
        vscode.window.showWarningMessage("Client Monitor not initialized");
        return;
      }
      const presets = [
        { label: "Every 30 minutes", ms: 30 * 6e4 },
        { label: "Every 1 hour", ms: 60 * 6e4 },
        { label: "Every 2 hours", ms: 120 * 6e4 }
      ];
      const picked = await vscode.window.showQuickPick(presets.map((p) => p.label), {
        placeHolder: "Select reminder interval"
      });
      if (!picked) {
        return;
      }
      const ms = presets.find((p) => p.label === picked).ms;
      const result = monitor.setNotifierDirect(ms);
      vscode.window.showInformationMessage(result.message || "Notifier set");
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("clientMonitor.closeNotifier", () => {
      if (!monitor) {
        vscode.window.showWarningMessage("Client Monitor not initialized");
        return;
      }
      const result = monitor.closeNotifierDirect();
      vscode.window.showInformationMessage(result.message || "Notifier closed");
    })
  );
}
function deactivate() {
  monitor?.cleanup();
  monitor = null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
