"use strict";var N=Object.create;var U=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var O=Object.getOwnPropertyNames;var V=Object.getPrototypeOf,J=Object.prototype.hasOwnProperty;var Q=(o,e)=>{for(var t in e)U(o,t,{get:e[t],enumerable:!0})},T=(o,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of O(e))!J.call(o,s)&&s!==t&&U(o,s,{get:()=>e[s],enumerable:!(r=W(e,s))||r.enumerable});return o};var I=(o,e,t)=>(t=o!=null?N(V(o)):{},T(e||!o||!o.__esModule?U(t,"default",{value:o,enumerable:!0}):t,o)),K=o=>T(U({},"__esModule",{value:!0}),o);var G={};Q(G,{activate:()=>H,deactivate:()=>Y});module.exports=K(G);var x=I(require("vscode"));var d=I(require("vscode")),h=I(require("fs")),u=I(require("path")),m=I(require("os")),C=require("child_process");function M(o){return process.platform==="win32"&&o.startsWith("\\\\")}function q(o){if(M(o)){try{(0,C.execSync)(`mkdir "${o}"`,{shell:"cmd.exe",stdio:"pipe",timeout:1e4})}catch{}return}h.mkdirSync(o,{recursive:!0})}function w(o){if(M(o))try{return(0,C.execSync)(`if exist "${o}" (echo Y) else (echo N)`,{shell:"cmd.exe",stdio:"pipe",timeout:8e3}).toString().trim()==="Y"}catch{return!1}return h.existsSync(o)}function $(o){if(M(o)){let e=u.join(m.tmpdir(),`bba-rd-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{(0,C.execSync)(`copy /Y "${o}" "${e}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});let t=h.readFileSync(e,"utf-8");try{h.unlinkSync(e)}catch{}return t}catch(t){try{h.unlinkSync(e)}catch{}throw t}}return h.readFileSync(o,"utf-8")}function F(o,e){if(M(o)){let t=u.join(m.tmpdir(),`bba-wr-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{h.writeFileSync(t,e,"utf-8"),(0,C.execSync)(`copy /Y "${t}" "${o}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});try{h.unlinkSync(t)}catch{}}catch(r){try{h.unlinkSync(t)}catch{}throw r}return}h.writeFileSync(o,e)}function S(o){if(M(o)){try{(0,C.execSync)(`del /F /Q "${o}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3})}catch{}return}h.unlinkSync(o)}function L(o,e){if(M(o)||M(e)){(0,C.execSync)(`move /Y "${o}" "${e}"`,{shell:"cmd.exe",stdio:"pipe",timeout:1e4});return}h.renameSync(o,e)}function A(o){if(M(o))try{return(0,C.execSync)(`dir /b "${o}"`,{shell:"cmd.exe",timeout:1e4}).toString("utf-8").split(/\r?\n/).filter(t=>t.trim().length>0)}catch{return[]}return h.readdirSync(o)}var z=class{syncPath="";serverKey="";backlogPollInterval=null;onBacklogResponse=null;recentBacklogEntries=[];onBacklogArrived=null;configure(e,t,r,s){this.syncPath=e,this.serverKey=t,this.onBacklogResponse=r,this.onBacklogArrived=s??null}get isConfigured(){return!!this.syncPath}get syncPathValue(){return this.syncPath}scanRegisteredClients(){if(!this.isConfigured)return[];let e=u.join(this.syncPath,"clients",this.serverKey);if(!w(e))return[];let t=[];try{let r=A(e).filter(s=>s.endsWith(".json"));for(let s of r)try{let n=JSON.parse($(u.join(e,s)));n.clientKey&&n.clientLabel&&t.push(n)}catch{console.warn(`[ServerFallback] Skipping malformed presence file: ${s}`)}}catch(r){console.warn("[ServerFallback] Error scanning clients dir:",r)}return t}startPolling(e=15e3){this.stopPolling(),this.isConfigured&&(this.pollResultsDir(),this.pollServerBacklog(),this.backlogPollInterval=setInterval(()=>{this.pollResultsDir(),this.pollServerBacklog()},e),console.log(`[ServerFallback] Polling results+backlog every ${e/1e3}s from: ${this.syncPath}`))}stopPolling(){this.backlogPollInterval&&(clearInterval(this.backlogPollInterval),this.backlogPollInterval=null)}enqueueCommand(e,t,r,s,n){if(!this.isConfigured)throw new Error("Sync path is not configured. Set serverMonitor.syncPath in settings.");try{let a=u.join(this.syncPath,"queue");q(a);let p=u.join(a,`${e}.json`),c=[];if(w(p))try{c=JSON.parse($(p))}catch{c=[]}let f=n??`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,y={id:f,clientKey:t,clientLabel:e,command:r,payload:s,timestamp:Date.now(),serverKey:this.serverKey};c.push(y);let l=p+".tmp";F(l,JSON.stringify(c,null,2));try{L(l,p)}catch{F(p,JSON.stringify(c,null,2));try{S(l)}catch{}}return console.log(`[ServerFallback] Enqueued command "${r}" for ${e} \xE2\u2020\u2019 ${p}`),f}catch(a){throw new Error(`Failed to write queue file at "${this.syncPath}\\queue\\${e}.json": ${a?.message||a}`)}}peekQueuedCommands(e){if(!this.isConfigured)return[];let t=u.join(this.syncPath,"queue",`${e}.json`);if(!w(t))return[];try{return JSON.parse($(t))}catch{return[]}}listQueuedClients(){if(!this.isConfigured)return[];let e=u.join(this.syncPath,"queue");return w(e)?A(e).filter(t=>t.endsWith(".json")).map(t=>t.replace(/\.json$/,"")):[]}dequeueCommands(e){if(!this.isConfigured)return[];let t=u.join(this.syncPath,"queue",`${e}.json`);if(!w(t))return[];try{let r=JSON.parse($(t));return S(t),console.log(`[ServerFallback] Dequeued ${r.length} command(s) for ${e}`),r}catch(r){return console.error(`[ServerFallback] Error reading queue for ${e}:`,r),[]}}pollResultsDir(){if(!(!this.isConfigured||!this.onBacklogResponse))try{let e=u.join(this.syncPath,"results");if(!w(e))return;let t=A(e).filter(r=>r.endsWith(".json"));for(let r of t){let s=u.join(e,r),n=s+`.lock-${process.pid}`;try{L(s,n)}catch{continue}try{let a=JSON.parse($(n));try{S(n)}catch{}let p=Array.isArray(a)?a:[a];for(let c of p){let f=c.clientLabel||r.replace(/\.json$/,"");console.log(`[ServerFallback] Got live result from ${f}: ${c.command}`),this.onBacklogResponse(f,{...c,channel:"live"})}}catch(a){console.error(`[ServerFallback] Error reading results file ${r}:`,a);try{S(n)}catch{}}}}catch(e){console.error("[ServerFallback] Results poll error:",e)}}pollServerBacklog(){if(!(!this.isConfigured||!this.onBacklogResponse))try{let e=u.join(this.syncPath,"server-backlog");if(!w(e))return;let t=A(e).filter(s=>s.endsWith(".json")),r=[];for(let s of t){let n=u.join(e,s),a=n+`.lock-${process.pid}`;try{L(n,a)}catch{continue}try{let p=JSON.parse($(a));try{S(a)}catch{}let c=Array.isArray(p)?p:[p];for(let f of c){let y=f.clientLabel||s.replace(/\.json$/,"");console.log(`[ServerFallback] Got server-backlog entry from ${y}: ${f.command}`),r.push({...f,clientLabel:y}),this.onBacklogResponse(y,f)}}catch(p){console.error(`[ServerFallback] Error reading backlog file ${s}:`,p);try{S(a)}catch{}}}r.length>0&&(this.recentBacklogEntries.push(...r),this.onBacklogArrived&&this.onBacklogArrived(r))}catch(e){console.error("[ServerFallback] Backlog poll error:",e)}}getRecentBacklog(){return this.recentBacklogEntries}clearRecentBacklog(){this.recentBacklogEntries=[]}},E=class{clients=new Map;provider=null;context=null;running=!1;serverId="default";presenceCheckInterval=null;syncScanInterval=null;offlineTimeoutMs=3e5;fallback=new z;clientReleasePath="";serverPresenceInterval=null;version="1.0.0";backlogPollMs=15e3;presenceCheckMs=3e4;syncScanMs=3e4;serverPresenceMs=3e4;clientPollMs=15e3;initialize(e){this.context=e,this.version=e.extension?.packageJSON?.version||"1.0.0";let t=d.workspace.getConfiguration("serverMonitor"),r=e.globalState.get("serverKey");this.serverId=r||t.get("serverId")||"default";let s=e.globalState.get("serverIntervals");s&&(s.backlogPollMs&&(this.backlogPollMs=s.backlogPollMs),s.presenceCheckMs&&(this.presenceCheckMs=s.presenceCheckMs),s.syncScanMs&&(this.syncScanMs=s.syncScanMs),s.serverPresenceMs&&(this.serverPresenceMs=s.serverPresenceMs),s.clientPollMs&&(this.clientPollMs=s.clientPollMs),console.log(`[MonitorServer] Restored persisted intervals: backlog=${this.backlogPollMs}, presence=${this.presenceCheckMs}, syncScan=${this.syncScanMs}, serverPresence=${this.serverPresenceMs}, clientPoll=${this.clientPollMs}`)),console.log(`[MonitorServer] Initializing with serverId: ${this.serverId}`),this.loadPersistentClients(),this.setupFallback(),console.log(`[MonitorServer] Loaded ${this.clients.size} persistent clients`)}setupFallback(){let e=d.workspace.getConfiguration("serverMonitor"),t=e.get("syncPath")||"";this.clientReleasePath=e.get("clientReleasePath")||"",t&&(this.fallback.configure(t,this.serverId,(r,s)=>{this.handleBacklogResponse(r,s)},r=>{let s=r.length;d.window.showInformationMessage(`${s} backlog result${s===1?"":"s"} received from offline clients`,"View Backlog").then(n=>{n==="View Backlog"&&this.showBacklogWebview()})}),this.fallback.startPolling(this.backlogPollMs),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),this.syncScanMs))}async changeServerKey(e){!e||!this.context||(this.removeServerPresenceFile(),this.serverId=e,await this.context.globalState.update("serverKey",e),this.running&&this.writeServerPresenceFile("online"),console.log(`[MonitorServer] Server key changed to: ${e}`),d.window.showInformationMessage(`Server key changed to: ${e}`),this.triggerUpdate())}serverPresenceFilePath(){let e=this.fallback.syncPathValue;return u.join(e,"servers",`${this.serverId}-${m.hostname()}-${process.pid}.json`)}writeServerPresenceFile(e){if(this.fallback.isConfigured)try{let t=u.join(this.fallback.syncPathValue,"servers");q(t);let r=this.serverPresenceFilePath(),s=Date.now();if(e==="online"&&w(r))try{let c=JSON.parse($(r));c.status==="online"&&(s=c.startedAt)}catch{}let n=Array.from(this.clients.values()).map(c=>({key:c.key,label:c.clientLabel,status:c.status})),a=m.hostname(),p={key:this.serverId,machine:a,username:m.userInfo().username,version:this.version,clients:n,startedAt:s,lastSeen:Date.now(),status:e};F(r,JSON.stringify(p,null,2)),console.log(`[MonitorServer] Server presence file written (${e}): ${r}`)}catch(t){console.warn(`[MonitorServer] Could not write server presence file: ${t?.message||t}`)}}removeServerPresenceFile(){if(this.fallback.isConfigured)try{let e=this.serverPresenceFilePath();w(e)&&(S(e),console.log(`[MonitorServer] Server presence file removed: ${e}`))}catch(e){console.warn(`[MonitorServer] Could not remove server presence file: ${e?.message||e}`)}}showBacklogWebview(){let e=i=>String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t=i=>`<span class="r-badge ${i?"ok":"err"}">${i?"&#10004; ok":"&#10006; err"}</span>`,r=i=>{try{return new Date(i).toLocaleString()}catch{return e(i)}},s=(i,g)=>`<span class="r-key">${e(i)}</span><span class="r-val">${g}</span>`,n=i=>{let g=i.agents||[],v='<div class="r-card"><div class="r-kv">';return v+=s("Status",t(!!i.success)),i.timeframe&&(v+=s("Timeframe",e(i.timeframe))),i.totalEntries!==void 0&&(v+=s("Total entries",`<strong>${e(i.totalEntries)}</strong>`)),i.dateRange?.earliest&&(v+=s("From",e(r(i.dateRange.earliest))),v+=s("To",e(r(i.dateRange.latest)))),v+="</div>",g.length>0?(v+='<table class="r-subtable"><thead><tr><th>Agent</th><th>Count</th><th>%</th></tr></thead><tbody>',g.forEach(k=>{v+=`<tr><td>${e(k.name)}</td><td>${e(k.count)}</td><td>${e(k.percentage)}%</td></tr>`}),v+="</tbody></table>"):v+='<span class="r-none">No agent data for this period.</span>',v+"</div>"},a=i=>{let g='<div class="r-card"><div class="r-kv">';return g+=s("Status",t(!!i.success)),i.installed!==void 0&&(g+=s("Installed",t(!!i.installed))),i.version&&(g+=s("Version",e(i.version))),i.active!==void 0&&(g+=s("Active",t(!!i.active))),i.message&&(g+=s("Message",e(i.message))),g+"</div></div>"},p=i=>{let g='<div class="r-card"><div class="r-kv">';return["hostname","username","os","platform","arch","cpu","memory","vscodeVersion","nodeVersion"].forEach(v=>{i[v]!==void 0&&(g+=s(v,e(i[v])))}),g+"</div></div>"},c=i=>{let g='<div class="r-card"><div class="r-kv">';i.name&&(g+=s("Name",e(i.name))),i.workspace&&(g+=s("Workspace",e(i.workspace)));let v=i.rootPaths||(i.rootPath?[i.rootPath]:[]);return v.length&&(g+=s("Root",e(v.join(", ")))),g+"</div></div>"},f=(i,g)=>{if(g==null)return'<span class="r-none">&mdash;</span>';if(typeof g!="object")return`<pre class="r-pre">${e(String(g))}</pre>`;if(i==="getUsageReport"||i==="generateReport")return n(g);if(i==="checkBBrainy"||i==="forceBBrainy"||i==="showBBrainyStatus")return a(g);if(i==="getSystemInfo")return p(g);if(i==="getWorkspace")return c(g);let v=JSON.stringify(g,null,2);return v.length<300?`<pre class="r-pre">${e(v)}</pre>`:`<details class="r-details"><summary>{ &hellip; } show JSON</summary><pre class="r-pre">${e(v)}</pre></details>`},y=this.fallback.getRecentBacklog(),l={};for(let i of y){let g=i.clientLabel||"unknown";l[g]||(l[g]=[]),l[g].push(i)}let b=d.window.createWebviewPanel("serverBacklog",`Server Backlog (${y.length})`,d.ViewColumn.Beside,{enableScripts:!0}),B=Object.entries(l).map(([i,g])=>{let v=g.map(k=>`<tr>
                <td class="cell time">${e(r(k.timestamp||Date.now()))}</td>
                <td class="cell cmd">${e(k.command||"")}</td>
                <td class="cell result-cell">${f(k.command||"",k.payload??k.result??null)}</td>
            </tr>`).join("");return`<div class="section"><h3>${e(i)}</h3>
            <table><colgroup><col class="col-time"><col class="col-cmd"><col class="col-result"></colgroup>
            <thead><tr><th>Time</th><th>Command</th><th>Result</th></tr></thead>
            <tbody>${v}</tbody></table></div>`}).join(""),P=y.length;b.webview.html=['<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>',":root{color-scheme:dark}","body{background:var(--vscode-editor-background,#1e1e2e);color:var(--vscode-foreground,#cdd6f4);","  font-family:var(--vscode-font-family,ui-sans-serif,system-ui,sans-serif);padding:24px;margin:0}","h2{margin:0 0 4px;font-size:1.1rem}","h3{color:var(--vscode-charts-green,#a6e3a1);font-size:.85rem;border-bottom:1px solid var(--vscode-panel-border,#313244);padding-bottom:6px;margin:0 0 8px}",".section{margin-bottom:28px}","table{width:100%;border-collapse:collapse;table-layout:fixed}","col.col-time{width:140px}col.col-cmd{width:160px}col.col-result{width:auto}","th{text-align:left;font-size:.7rem;color:var(--vscode-descriptionForeground,#6c7086);padding-bottom:6px;font-weight:600;text-transform:uppercase;border-bottom:1px solid var(--vscode-panel-border,#313244)}",".cell{padding:6px 8px 6px 0;vertical-align:top;font-size:.75rem;border-bottom:1px solid var(--vscode-panel-border,#252535)}",".time{color:var(--vscode-descriptionForeground,#a6adc8);white-space:nowrap}",".cmd{color:var(--vscode-textLink-foreground,#89b4fa);font-family:monospace;font-size:.75rem}",".result-cell{color:var(--vscode-foreground,#cdd6f4)}",".r-pre{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.7rem;opacity:.85}",".toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}",".empty{color:var(--vscode-descriptionForeground,#6c7086);font-style:italic;margin-top:20px}","button{background:var(--vscode-button-secondaryBackground,#313244);border:1px solid var(--vscode-panel-border,#45475a);","  color:var(--vscode-button-secondaryForeground,#cdd6f4);padding:5px 14px;border-radius:4px;cursor:pointer;font-size:.8rem}","button:hover{background:var(--vscode-button-secondaryHoverBackground,#45475a)}",".r-card{background:var(--vscode-editor-inactiveSelectionBackground,#2a2a3e);border-radius:6px;padding:8px 10px;font-size:.73rem}",".r-kv{display:grid;grid-template-columns:max-content 1fr;gap:2px 10px;margin-bottom:6px}",".r-key{color:var(--vscode-descriptionForeground,#888);font-weight:600;white-space:nowrap}",".r-val{color:var(--vscode-foreground,#cdd6f4);word-break:break-word}",".r-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:.68rem;font-weight:700}",".r-badge.ok{background:rgba(166,227,161,.15);color:var(--vscode-charts-green,#a6e3a1)}",".r-badge.err{background:rgba(241,76,76,.15);color:var(--vscode-charts-red,#f38ba8)}",".r-subtable{width:100%;border-collapse:collapse;margin-top:6px}",".r-subtable th{font-size:.66rem;color:var(--vscode-descriptionForeground,#888);border-bottom:1px solid var(--vscode-panel-border,#313244);padding:2px 6px 3px 0}",".r-subtable td{font-size:.7rem;padding:2px 6px 2px 0;border-bottom:1px solid var(--vscode-panel-border,#25253a)}",".r-none{opacity:.4}",".r-details summary{font-size:.65rem;color:var(--vscode-textLink-foreground,#89b4fa);cursor:pointer;user-select:none;padding:2px 0}",".r-details .r-pre{margin-top:4px}","</style></head><body>",`<div class="toolbar"><h2>Server Backlog &mdash; ${P} result${P===1?"":"s"}</h2>`,'<button onclick="clearAll()">Clear All</button></div>',P===0?'<p class="empty">No backlog entries.</p>':B,"<script>","const vscode=acquireVsCodeApi();",'function clearAll(){vscode.postMessage({action:"clearBacklog"});}',"</script></body></html>"].join(`
`),b.webview.onDidReceiveMessage(i=>{i.action==="clearBacklog"&&(this.fallback.clearRecentBacklog(),b.dispose(),this.triggerUpdate())})}handleBacklogResponse(e,t){let r=Array.from(this.clients.values()).find(p=>p.clientLabel===e);if(!r){console.warn(`[MonitorServer] Response for unknown clientLabel: ${e}`);return}let s=t.payload&&t.payload.success===!1&&t.payload.error!==void 0,n=r.commandLog.find(p=>p.id===t.id);n?(n.status=s?"error":"executed",n.completedAt=Date.now(),n.result=t.payload):r.commandLog.push({id:t.id,command:t.command,status:s?"error":"executed",timestamp:t.timestamp||Date.now(),completedAt:Date.now(),result:t.payload}),t.payload!==void 0&&t.payload!==null&&(r.lastResponse={command:t.command,data:t.payload,timestamp:t.timestamp||Date.now()}),r.info||(r.info={}),t.command==="checkBBrainy"&&t.payload&&(r.info.bbrainyStatus=t.payload),t.command==="getSystemInfo"&&t.payload?.hostname&&(Object.assign(r.info,{hostname:t.payload.hostname,username:t.payload.username,os:t.payload.os,vscodeVersion:t.payload.vscodeVersion}),t.payload.extensionVersion&&(r.info.version=t.payload.extensionVersion)),t.command==="getWorkspace"&&t.payload?.workspace&&(r.info.workspace=t.payload.workspace),t.command==="getUsageReport"&&t.payload?.totalEntries!==void 0&&(r.info.lastUsageReport=t.payload,this.showUsageReportWebview(t.payload,r.info?.username||e,r.info?.hostname||"Unknown")),t.command;let a=t.channel==="live"?"Live result":"Backlog result";console.log(`[MonitorServer] ${a} from ${e}: ${t.command} -> ${s?"error":"executed"}`),this.savePersistentClients(),this.triggerUpdate()}importSyncClients(){let e=this.fallback.scanRegisteredClients();if(e.length===0)return;let t=2*60*60*1e3,r=n=>n.status==="inactive"&&Date.now()-n.lastSeen<t?"active":n.status??"active",s=0;for(let n of e){let p=Date.now()-n.lastSeen<12e4;if(this.clients.has(n.clientKey)){let c=this.clients.get(n.clientKey);c.extensionStatus=r(n),c.lastSeen=Math.max(c.lastSeen,n.lastSeen),c.status=p?"sync":"offline",n.version&&c.info&&(c.info.version=n.version);continue}this.clients.set(n.clientKey,{key:n.clientKey,info:{username:n.username,hostname:n.hostname,version:n.version||void 0},lastSeen:n.lastSeen,status:p?"sync":"offline",clientLabel:n.clientLabel,commandLog:[],extensionStatus:r(n)}),console.log(`[MonitorServer] Discovered new client via presence file: ${n.clientLabel} (${n.clientKey})`),s++}s>0&&(this.savePersistentClients(),this.triggerUpdate(),console.log(`[MonitorServer] Imported ${s} new client(s) from sync folder`))}loadPersistentClients(){if(!this.context||!this.serverId){console.warn(`[MonitorServer] Cannot load persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let t=(this.context.globalState.get("persistentAssets")||{})[this.serverId]||[];console.log(`[MonitorServer] Loading ${t.length} persistent clients for serverId: ${this.serverId}`),t.forEach(r=>{this.clients.set(r.key,{...r,ws:null,status:"offline",clientLabel:r.clientLabel||`${r.info?.username||"unknown"}-${r.info?.hostname||"unknown"}`,commandLog:[]})})}restorePendingQueueToLog(){if(!this.fallback.isConfigured)return;let e=this.fallback.listQueuedClients();for(let t of e){let r=Array.from(this.clients.values()).find(n=>n.clientLabel===t);if(!r)continue;let s=this.fallback.peekQueuedCommands(t);for(let n of s)r.commandLog.find(a=>a.id===n.id)||r.commandLog.push({id:n.id,command:n.command,status:"queued",timestamp:n.timestamp});console.log(`[MonitorServer] Restored ${s.length} pending queued command(s) to log for ${t}`)}}deduplicateClients(){let e=new Set,t=[];for(let[r,s]of this.clients){let n=`${s.info?.hostname}:${s.info?.username}`;e.has(n)?(t.push(r),console.log(`[MonitorServer] Found duplicate client: ${r} (${s.info?.username}@${s.info?.hostname})`)):e.add(n)}t.forEach(r=>this.clients.delete(r)),t.length>0&&(this.savePersistentClients(),console.log(`[MonitorServer] Removed ${t.length} duplicate client entries`),d.window.showInformationMessage(`Cleaned up ${t.length} duplicate clients on startup`))}savePersistentClients(){if(!this.context||!this.serverId){console.error(`[MonitorServer] Cannot save persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let e=this.context.globalState.get("persistentAssets")||{};e[this.serverId]=Array.from(this.clients.values()).map(t=>({key:t.key,info:t.info,lastSeen:t.lastSeen,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-100)})),this.context.globalState.update("persistentAssets",e),console.debug(`[MonitorServer] Saved ${this.clients.size} clients to persistent storage`)}setProvider(e){this.provider=e}async start(){if(this.running){console.warn("[MonitorServer] Already running, ignoring start request");return}if(!this.context){console.error("[MonitorServer] Cannot start: context not initialized"),d.window.showErrorMessage("Server not initialized with Context");return}let e=d.workspace.getConfiguration("serverMonitor"),t=this.context.globalState.get("serverKey");this.serverId=t||e.get("serverId")||"default",console.log(`[MonitorServer] Starting server with serverId: ${this.serverId}`),this.clients.clear(),this.loadPersistentClients(),this.deduplicateClients(),this.setupFallback(),this.importSyncClients(),this.restorePendingQueueToLog(),this.running=!0,this.startPresenceCheck(),this.writeServerPresenceFile("online"),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),this.serverPresenceMs),this.triggerUpdate(),console.log(`[MonitorServer] Server started successfully [${this.serverId}]`),d.window.showInformationMessage(`Monitor server [${this.serverId}] running (sync-folder mode)`)}startPresenceCheck(){this.presenceCheckInterval&&clearInterval(this.presenceCheckInterval),this.presenceCheckInterval=setInterval(()=>{this.checkClientPresence()},this.presenceCheckMs)}stop(){if(!this.running){console.warn("[MonitorServer] Not running, ignoring stop request");return}console.log("[MonitorServer] Stopping server"),this.presenceCheckInterval&&(clearInterval(this.presenceCheckInterval),this.presenceCheckInterval=null),this.syncScanInterval&&(clearInterval(this.syncScanInterval),this.syncScanInterval=null),this.writeServerPresenceFile("offline"),this.serverPresenceInterval&&(clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=null),this.fallback.stopPolling(),this.running=!1;for(let e of this.clients.values())e.status="offline";this.triggerUpdate(),console.log("[MonitorServer] Server stopped"),d.window.showInformationMessage("Monitor server stopped")}setServerIntervals(e){let t=(r,s,n,a)=>r!==void 0?Math.max(s,Math.min(n,r)):a;this.backlogPollMs=t(e.backlogPollMs,3e3,3e5,this.backlogPollMs),this.presenceCheckMs=t(e.presenceCheckMs,5e3,3e5,this.presenceCheckMs),this.syncScanMs=t(e.syncScanMs,5e3,3e5,this.syncScanMs),this.serverPresenceMs=t(e.serverPresenceMs,5e3,3e5,this.serverPresenceMs),this.running&&(this.fallback.startPolling(this.backlogPollMs),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),this.syncScanMs),this.startPresenceCheck(),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),this.serverPresenceMs)),console.log(`[MonitorServer] Server intervals updated \u2014 backlog: ${this.backlogPollMs/1e3}s, presence: ${this.presenceCheckMs/1e3}s, sync-scan: ${this.syncScanMs/1e3}s, server-presence: ${this.serverPresenceMs/1e3}s`),this.persistIntervals(),this.triggerUpdate()}persistIntervals(){this.context&&this.context.globalState.update("serverIntervals",{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs})}async setClientPollInterval(e,t){let r=Math.max(3e3,Math.min(3e5,t)),s=this.clients.get(e);s&&(s.info||(s.info={}),s.info.pollMs=r,this.savePersistentClients()),await this.sendCommand(e,"setPollInterval",{intervalMs:r})}async setClientUpdateCheckInterval(e,t){let r=Math.max(6e4,Math.min(864e5,t)),s=this.clients.get(e);s&&(s.info||(s.info={}),s.info.updateCheckMs=r,this.savePersistentClients()),await this.sendCommand(e,"setUpdateCheckInterval",{intervalMs:r})}getIntervals(){return{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs}}checkClientPresence(){let e=Date.now(),t=[];for(let[r,s]of this.clients)s.status==="sync"&&e-s.lastSeen>2*60*1e3?(s.status="offline",console.log(`[MonitorServer] Sync client demoted to offline (stale presence): ${r}`)):s.status==="offline"&&e-s.lastSeen>this.offlineTimeoutMs&&(t.push(r),console.log(`[MonitorServer] Removing stale offline client: ${r} (${s.info?.username}@${s.info?.hostname})`));t.forEach(r=>this.clients.delete(r)),t.length>0&&(console.log(`[MonitorServer] Removed ${t.length} stale client(s)`),this.savePersistentClients(),this.triggerUpdate())}showUsageReportWebview(e,t="Unknown",r="Unknown"){try{let s={labels:e.agents.map(a=>a.name),datasets:[{label:"Usage Count",data:e.agents.map(a=>a.count),backgroundColor:["rgba(59, 130, 246, 0.2)","rgba(16, 185, 129, 0.2)","rgba(168, 85, 247, 0.2)","rgba(251, 146, 60, 0.2)","rgba(244, 63, 94, 0.2)","rgba(236, 72, 153, 0.2)"],borderColor:["rgba(59, 130, 246, 1)","rgba(16, 185, 129, 1)","rgba(168, 85, 247, 1)","rgba(251, 146, 60, 1)","rgba(244, 63, 94, 1)","rgba(236, 72, 153, 1)"],borderWidth:2}]},n=d.window.createWebviewPanel("bbrainyUsageReport",`BBrainy Usage: ${e.timeframe}`,d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});n.webview.html=this.getUsageReportHtml(e,s,t,r),console.log(`[MonitorServer] Opened usage report webview for ${t}@${r}: ${e.timeframe}`)}catch(s){console.error("[MonitorServer] Failed to show usage report:",s),d.window.showErrorMessage(`Failed to show usage report: ${s}`)}}getUsageReportHtml(e,t,r,s){let n=e.agents.map(a=>`<tr>
                <td><span class="agent-name">${a.name}</span></td>
                <td class="count">${a.count}</td>
                <td class="percentage">${a.percentage}%</td>
            </tr>`).join("");return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BBrainy Usage Report</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        color: #e2e8f0;
                        padding: 32px;
                        min-height: 100vh;
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    
                    .header {
                        margin-bottom: 32px;
                        border-bottom: 2px solid rgba(59, 130, 246, 0.3);
                        padding-bottom: 20px;
                    }
                    
                    h1 {
                        font-size: 32px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    
                    .client-info {
                        font-size: 14px;
                        color: #94a3b8;
                        margin-bottom: 8px;
                    }
                    
                    .timeframe {
                        font-size: 18px;
                        color: #cbd5e1;
                        font-weight: 600;
                    }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 16px;
                        margin-bottom: 32px;
                    }
                    
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        padding: 20px;
                        backdrop-filter: blur(10px);
                    }
                    
                    .stat-label {
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #64748b;
                        margin-bottom: 8px;
                    }
                    
                    .stat-value {
                        font-size: 28px;
                        font-weight: 700;
                        color: #60a5fa;
                    }
                    
                    .agents-table {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        overflow: hidden;
                        margin-bottom: 32px;
                        backdrop-filter: blur(10px);
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    th {
                        background: rgba(15, 23, 42, 0.6);
                        padding: 16px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
                    }
                    
                    td {
                        padding: 14px 16px;
                        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
                        font-size: 14px;
                    }
                    
                    tr:hover {
                        background: rgba(59, 130, 246, 0.05);
                    }
                    
                    tr:last-child td {
                        border-bottom: none;
                    }
                    
                    .agent-name {
                        font-weight: 600;
                        color: #60a5fa;
                    }
                    
                    .count {
                        text-align: right;
                        font-weight: 600;
                        color: #34d399;
                    }
                    
                    .percentage {
                        text-align: right;
                        color: #94a3b8;
                        font-size: 12px;
                    }
                    
                    .chart-container {
                        background: rgba(30, 41, 59, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        border-radius: 12px;
                        padding: 24px;
                        margin-bottom: 32px;
                        backdrop-filter: blur(10px);
                        position: relative;
                        height: 400px;
                    }
                    
                    .chart-container h2 {
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #cbd5e1;
                    }
                    
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #64748b;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>&#127919; BBrainy Usage Report</h1>
                        <div class="client-info">&#128205; Client: <strong>${r}@${s}</strong></div>
                        <div class="timeframe">${e.timeframe}</div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Total Usages</div>
                            <div class="stat-value">${e.totalEntries}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Unique Agents</div>
                            <div class="stat-value">${e.agents.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Most Used</div>
                            <div class="stat-value" style="font-size: 18px; color: #34d399;">${e.agents[0]?.name||"N/A"}</div>
                        </div>
                    </div>
                    
                    <div class="agents-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Agent Name</th>
                                    <th class="count">Count</th>
                                    <th class="percentage">Usage %</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${n}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="chart-container">
                        <h2>Usage Distribution</h2>
                        <canvas id="usageChart"></canvas>
                    </div>
                    
                    <div class="footer">
                        <p>Generated: ${new Date(e.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                
                <script>
                    const ctx = document.getElementById('usageChart').getContext('2d');
                    const chart = new Chart(ctx, {
                        type: 'bar',
                        data: ${JSON.stringify(t)},
                        options: {
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        color: '#e2e8f0',
                                        font: {
                                            size: 12
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(59, 130, 246, 0.1)'
                                    },
                                    ticks: {
                                        color: '#94a3b8',
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                y: {
                                    grid: {
                                        display: false
                                    },
                                    ticks: {
                                        color: '#94a3b8',
                                        font: {
                                            size: 12
                                        }
                                    }
                                }
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `}async sendCommand(e,t,r){let s=this.clients.get(e);if(!s){console.warn(`[MonitorServer] Attempted to send command to non-existent client: ${e}`),d.window.showErrorMessage("Client not found");return}let n=`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,a={id:n,command:t,status:"queued",timestamp:Date.now()};if(s.commandLog.push(a),this.triggerUpdate(),!this.fallback.isConfigured){a.status="error",a.completedAt=Date.now();let c=`Sync path not configured. Current value: "${d.workspace.getConfiguration("serverMonitor").get("syncPath")||"(empty)"}". Set serverMonitor.syncPath in settings.`;console.error(`[MonitorServer] ${c}`),d.window.showErrorMessage(c),this.savePersistentClients(),this.triggerUpdate();return}try{this.fallback.enqueueCommand(s.clientLabel,e,t,r,n),this.savePersistentClients(),this.triggerUpdate(),console.log(`[MonitorServer] Queued "${t}" for ${s.clientLabel}`),d.window.showInformationMessage(`Queued "${t}" for ${s.clientLabel}`)}catch(p){a.status="error",a.completedAt=Date.now();let c=`Failed to queue command: ${p?.message||p}`;console.error(`[MonitorServer] ${c}`),d.window.showErrorMessage(c),this.savePersistentClients(),this.triggerUpdate()}}clearClientQueue(e){let t=this.clients.get(e);if(t){if(this.fallback.isConfigured)try{let r=u.join(this.fallback.syncPathValue,"queue",`${t.clientLabel}.json`);w(r)&&S(r)}catch(r){console.error("[MonitorServer] clearClientQueue: failed to delete queue file",r)}t.commandLog=[],this.savePersistentClients(),this.triggerUpdate()}}clearBacklog(){this.fallback.clearRecentBacklog(),this.triggerUpdate()}cancelQueueEntry(e,t){let r=this.clients.get(e);if(r){if(this.fallback.isConfigured)try{let s=u.join(this.fallback.syncPathValue,"queue",`${r.clientLabel}.json`);if(w(s)){let a=JSON.parse($(s)).filter(p=>p.id!==t);a.length===0?S(s):F(s,JSON.stringify(a,null,2))}}catch(s){console.error("[MonitorServer] cancelQueueEntry: failed to update queue file",s)}r.commandLog=r.commandLog.filter(s=>s.id!==t),this.savePersistentClients(),this.triggerUpdate()}}async queryAllClients(e){console.log(`[MonitorServer] Broadcasting command to all ${this.clients.size} clients: ${e}`);let t=Array.from(this.clients.keys()).map(r=>this.sendCommand(r,e));await Promise.all(t),console.log(`[MonitorServer] Broadcast complete for command: ${e}`)}getAllClientsInfo(){return Array.from(this.clients.values()).map(e=>({key:e.key,username:e.info?.username||"Unknown",hostname:e.info?.hostname||"Unknown",workspace:e.info?.workspace,bbrainyActive:e.info?.bbrainyStatus?.active||!1,status:e.status,lastSeen:e.lastSeen,onlineStatus:e.status==="sync"?"active":"offline"}))}showAllAssetsWebview(){let e=this.getAllClientsInfo(),t=d.window.createWebviewPanel("allAssets","All Assets",d.ViewColumn.One,{enableScripts:!0});t.webview.html=this.getAllAssetsHtml(e)}getAllAssetsHtml(e){let t=e.map(r=>`
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.username}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.hostname}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${r.onlineStatus==="active"?"#f59e0b":"#ef4444"};"></span>
                    ${r.onlineStatus}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${r.bbrainyActive?"&#10003; Active":"&#10007; Inactive"}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">${r.lastSeen?new Date(r.lastSeen).toLocaleString():"Never"}</td>
            </tr>
        `).join("");return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Assets Status</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        min-height: 100vh;
                        padding: 40px;
                        color: #e2e8f0;
                    }
                    .container { max-width: 1200px; margin: 0 auto; }
                    h1 {
                        font-size: 36px;
                        margin-bottom: 30px;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 700;
                    }
                    .summary-stats {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 20px;
                        backdrop-filter: blur(8px);
                        text-align: center;
                    }
                    .stat-value {
                        font-size: 28px;
                        font-weight: 700;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .stat-label {
                        color: #94a3b8;
                        font-size: 12px;
                        margin-top: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .table-container {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        overflow: hidden;
                        backdrop-filter: blur(8px);
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th {
                        background: rgba(96, 165, 250, 0.1);
                        padding: 15px;
                        text-align: left;
                        border-bottom: 2px solid rgba(96, 165, 250, 0.2);
                        font-weight: 600;
                        color: #60a5fa;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    tr:hover {
                        background: rgba(96, 165, 250, 0.05);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>&#128202; All Assets (${e.length} Total)</h1>
                    
                    <div class="summary-stats">
                        <div class="stat-card">
                            <div class="stat-value">${e.length}</div>
                            <div class="stat-label">Total Clients</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${e.filter(r=>r.onlineStatus==="active").length}</div>
                            <div class="stat-label">Active (Sync)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${e.filter(r=>r.bbrainyActive).length}</div>
                            <div class="stat-label">BBrainy Active</div>
                        </div>
                    </div>

                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Hostname</th>
                                    <th>Status</th>
                                    <th>BBrainy</th>
                                    <th>Last Seen</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${t}
                            </tbody>
                        </table>
                    </div>
                </div>
            </body>
            </html>
        `}showBBrainyStatusWebview(e){let t=this.clients.get(e);if(!t){d.window.showErrorMessage(`Client ${e} not found`);return}let r=t.info?.bbrainyStatus||{installed:!1,active:!1,version:"Unknown",lastUsedTime:"Never",totalUsage:0},s=d.window.createWebviewPanel(`bbrainyStatus-${e}`,`BBrainy Status - ${t.info?.username}@${t.info?.hostname}`,d.ViewColumn.One,{enableScripts:!0});s.webview.html=this.getBBrainyStatusHtml(r,t.info?.username,t.info?.hostname)}getBBrainyStatusHtml(e,t="Unknown",r="Unknown"){let s=e.installed,n=e.active,a=e.version||"Unknown",p=e.lastUsedTime||"Never",c=e.totalUsage||0,f=s?n?"#34d399":"#f59e0b":"#ef4444";return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BBrainy Status</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        min-height: 100vh;
                        padding: 40px;
                        color: #e2e8f0;
                    }
                    .container { max-width: 800px; margin: 0 auto; }
                    .client-info {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid rgba(96, 165, 250, 0.2);
                    }
                    .client-name {
                        font-size: 18px;
                        color: #94a3b8;
                        margin-bottom: 5px;
                    }
                    h1 {
                        font-size: 36px;
                        margin-bottom: 10px;
                        background: linear-gradient(135deg, #60a5fa, #34d399);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: 700;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 600;
                        background-color: ${f}20;
                        color: ${f};
                        border: 2px solid ${f};
                        margin-top: 15px;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .stat-card {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 25px;
                        backdrop-filter: blur(8px);
                    }
                    .stat-label {
                        color: #94a3b8;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                        font-weight: 600;
                    }
                    .stat-value {
                        color: #60a5fa;
                        font-size: 24px;
                        font-weight: 700;
                        word-break: break-word;
                    }
                    .contribution-graph {
                        background: rgba(30, 41, 59, 0.8);
                        border: 2px solid rgba(96, 165, 250, 0.2);
                        border-radius: 16px;
                        padding: 30px;
                        backdrop-filter: blur(8px);
                        margin-top: 30px;
                    }
                    .graph-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #60a5fa;
                    }
                    .graph-grid {
                        display: grid;
                        grid-template-columns: repeat(12, 1fr);
                        gap: 4px;
                        margin-bottom: 15px;
                    }
                    .graph-cell {
                        width: 100%;
                        aspect-ratio: 1;
                        background: rgba(100, 116, 139, 0.3);
                        border-radius: 4px;
                        border: 1px solid rgba(100, 116, 139, 0.2);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="client-info">
                        <div class="client-name">&#128241; ${t}@${r}</div>
                        <h1>&#129504; BBrainy Status</h1>
                        <div class="status-badge">${s?n?"Active":"Installed - Inactive":"Not Installed"}</div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Installed</div>
                            <div class="stat-value">${s?"&#10003; Yes":"&#10007; No"}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Version</div>
                            <div class="stat-value">${a}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Last Used</div>
                            <div class="stat-value" style="font-size: 14px;">${p}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Usage</div>
                            <div class="stat-value">${c}</div>
                        </div>
                    </div>

                    <div class="contribution-graph">
                        <div class="graph-title">&#128202; Contribution Graph (Last 12 Weeks)</div>
                        <div class="graph-grid">
                            ${Array.from({length:84},(l,b)=>`<div class="graph-cell" style="background: rgba(52, 211, 153, ${Math.random()*.5});"></div>`).join("")}
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; text-align: center;">Green intensity shows activity level</div>
                    </div>
                </div>
            </body>
            </html>
        `}async generateReport(){let e=new Date,t=Array.from(this.clients.values()),r=t.filter(l=>l.status==="sync"),s=t.filter(l=>l.status==="offline"),n=t.filter(l=>l.extensionStatus==="inactive"),a={generatedAt:e.toISOString(),server:{key:this.serverId,machine:m.hostname(),username:m.userInfo().username,version:this.version,running:this.running,syncPath:this.fallback.syncPathValue||"(not configured)"},summary:{total:t.length,sync:r.length,offline:s.length,inactive:n.length},clients:t.map(l=>({label:l.clientLabel,key:l.key,username:l.info?.username,hostname:l.info?.hostname,workspace:l.info?.workspace,version:l.info?.version,bbrainyActive:l.info?.bbrainyStatus?.active,status:l.status,extensionStatus:l.extensionStatus??"active",lastSeen:new Date(l.lastSeen).toISOString(),pendingCommands:l.commandLog.filter(b=>b.status==="queued"||b.status==="sent").length,lastCommand:l.commandLog.length>0?l.commandLog[l.commandLog.length-1]?.command:null}))},p=JSON.stringify(a,null,2),c={sync:"#f59e0b",offline:"#94a3b8",active:"#22c55e",inactive:"#f97316"},f=t.map(l=>{let b=l.commandLog.filter(P=>P.status==="queued"||P.status==="sent").length,B=l.info?.bbrainyStatus?.active?"#22c55e":"#475569";return`<tr>
                <td><span class="label">${l.clientLabel}</span></td>
                <td>${l.info?.username||"&#8212;"}</td>
                <td>${l.info?.hostname||"&#8212;"}</td>
                <td>${l.info?.version||"&#8212;"}</td>
                <td><span class="badge" style="color:${c[l.status]||"#94a3b8"}">${l.status}</span></td>
                <td><span class="badge" style="color:${c[l.extensionStatus??"active"]||"#94a3b8"}">${l.extensionStatus??"active"}</span></td>
                <td><span style="color:${B};font-size:18px">&#9679;</span></td>
                <td>${b>0?`<span class="badge-warn">${b} pending</span>`:'<span class="badge-ok">0</span>'}</td>
                <td>${new Date(l.lastSeen).toLocaleString()}</td>
            </tr>`}).join(""),y=d.window.createWebviewPanel("serverReport",`Server Report - ${this.serverId}`,d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});y.webview.onDidReceiveMessage(l=>{l.action==="exportJson"&&d.window.showSaveDialog({defaultUri:d.Uri.file(u.join(m.homedir(),`server-report-${this.serverId}-${Date.now()}.json`)),filters:{JSON:["json"]},title:"Save Server Report"}).then(b=>{if(b)try{h.writeFileSync(b.fsPath,p,"utf-8"),d.window.showInformationMessage(`Report saved to ${b.fsPath}`)}catch(B){d.window.showErrorMessage(`Failed to save: ${B}`)}})}),y.webview.html=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Server Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);color:#e2e8f0;padding:28px;min-height:100vh}
.container{max-width:1100px;margin:0 auto}
h1{font-size:24px;font-weight:700;margin-bottom:4px;background:linear-gradient(135deg,#60a5fa,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.subtitle{font-size:12px;color:#64748b;margin-bottom:24px}
.section{margin-bottom:28px}
h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#60a5fa;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid rgba(59,130,246,0.2)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px}
.card{background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.2);border-radius:10px;padding:14px}
.card-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:4px}
.card-value{font-size:20px;font-weight:700;color:#60a5fa}
.card-value.green{color:#22c55e}.card-value.red{color:#f87171}.card-value.orange{color:#f97316}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px}
.info-row{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
.info-key{color:#64748b;min-width:110px;flex-shrink:0}
.info-val{color:#cbd5e1;word-break:break-all}
table{width:100%;border-collapse:collapse;background:rgba(30,41,59,0.8);border:1px solid rgba(59,130,246,0.15);border-radius:10px;overflow:hidden;font-size:12px}
thead{background:rgba(15,23,42,0.6)}
th{padding:9px 12px;text-align:left;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;white-space:nowrap}
td{padding:8px 12px;border-top:1px solid rgba(59,130,246,0.08);color:#cbd5e1;vertical-align:middle}
.label{color:#34d399;font-weight:600}
.badge{font-weight:600;font-size:11px}
.badge-warn{color:#fbbf24;font-weight:600}
.badge-ok{color:#475569}
.export-btn{display:inline-flex;align-items:center;gap:6px;margin-top:20px;padding:8px 18px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:8px;color:#60a5fa;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.2s}
.export-btn:hover{background:rgba(59,130,246,0.3)}
</style>
</head>
<body>
<div class="container">
  <h1>&#128202; Server Monitor Report</h1>
  <div class="subtitle">Generated: ${e.toLocaleString()} &nbsp;|&nbsp; Server: <strong>${this.serverId}</strong> on <strong>${m.hostname()}</strong></div>

  <div class="section">
    <h2>Summary</h2>
    <div class="grid">
      <div class="card"><div class="card-label">Total Clients</div><div class="card-value">${t.length}</div></div>
      <div class="card"><div class="card-label">Active (Sync)</div><div class="card-value amber">${r.length}</div></div>
      <div class="card"><div class="card-label">Offline</div><div class="card-value red">${s.length}</div></div>
      <div class="card"><div class="card-label">Uninstalled</div><div class="card-value orange">${n.length}</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Server Info</h2>
    <div class="info-grid">
      <div><div class="info-row"><span class="info-key">Server Key</span><span class="info-val">${this.serverId}</span></div>
           <div class="info-row"><span class="info-key">Machine</span><span class="info-val">${m.hostname()}</span></div>
           <div class="info-row"><span class="info-key">Username</span><span class="info-val">${m.userInfo().username}</span></div>
           <div class="info-row"><span class="info-key">Version</span><span class="info-val">${this.version}</span></div></div>
      <div>
           <div class="info-row"><span class="info-key">Status</span><span class="info-val" style="color:${this.running?"#22c55e":"#f87171"}">${this.running?"Running":"Stopped"}</span></div>
           <div class="info-row"><span class="info-key">Sync Path</span><span class="info-val">${this.fallback.syncPathValue||"(not configured)"}</span></div></div>
    </div>
  </div>

  <div class="section">
    <h2>Clients (${t.length})</h2>
    <table>
      <thead><tr>
        <th>Label</th><th>User</th><th>Host</th><th>Version</th>
        <th>Sync Status</th><th>Ext Status</th><th>BBrainy</th><th>Queue</th><th>Last Seen</th>
      </tr></thead>
      <tbody>${f||'<tr><td colspan="9" style="text-align:center;color:#475569;padding:20px">No clients registered</td></tr>'}</tbody>
    </table>
  </div>

  <button class="export-btn" onclick="vscode.postMessage({action:'exportJson'})">&#11015; Export as JSON</button>
</div>
<script>const vscode=acquireVsCodeApi();</script>
</body>
</html>`}async publishClientUpdate(){let e=await d.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"VSIX Extension":["vsix"]},title:"Select client extension VSIX to publish"});if(e&&e[0])if(this.clientReleasePath)try{let t=u.join(this.clientReleasePath,"updates");h.mkdirSync(t,{recursive:!0});let r=u.basename(e[0].fsPath);h.copyFileSync(e[0].fsPath,u.join(t,r)),console.log(`[MonitorServer] Published update to client-release: ${r}`),d.window.showInformationMessage(`Update published: ${r}`)}catch(t){console.error("[MonitorServer] Failed to publish update:",t),d.window.showErrorMessage(`Failed to publish update: ${t}`)}else d.window.showErrorMessage("Client release path not configured. Set serverMonitor.clientReleasePath first.")}triggerUpdate(){if(this.provider){let e=Array.from(this.clients.values());this.provider.update({serverStatus:{running:this.running,serverId:this.serverId},total:this.clients.size,sync:e.filter(t=>t.status==="sync").length,offline:e.filter(t=>t.status==="offline").length,clients:e.map(t=>({key:t.key,hostname:t.info?.hostname,username:t.info?.username,workspace:t.info?.workspace,bbrainyActive:t.info?.bbrainyStatus?.active,lastSeen:t.lastSeen,status:t.status,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-50),lastResponse:t.lastResponse,extensionStatus:t.extensionStatus,pollMs:t.info?.pollMs,updateCheckMs:t.info?.updateCheckMs})),backlogCount:this.fallback.getRecentBacklog().length,intervals:{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs}})}}};var j=I(require("vscode")),R=class{constructor(e,t){this._extensionUri=e;this.server=t}static viewType="monitor-dashboard";_view;resolveWebviewView(e,t,r){this._view=e,e.webview.options={enableScripts:!0,localResourceRoots:[j.Uri.joinPath(this._extensionUri,"dist")]},e.webview.html=this._getWebviewContent(e.webview),e.webview.onDidReceiveMessage(async s=>{switch(s.action){case"sendCommand":await this.server.sendCommand(s.clientKey,s.command,s.payload);break;case"queryAll":await this.server.queryAllClients(s.command);break;case"showAssets":this.server.showAllAssetsWebview();break;case"showBBrainyStatus":this.server.showBBrainyStatusWebview(s.clientKey);break;case"generateReport":await this.server.generateReport();break;case"startServer":await this.server.start();break;case"stopServer":this.server.stop();break;case"changeServerKey":await this.server.changeServerKey(s.newKey);break;case"viewBacklog":this.server.showBacklogWebview();break;case"clearBacklog":this.server.clearBacklog();break;case"clearClientQueue":this.server.clearClientQueue(s.clientKey);break;case"cancelQueueEntry":this.server.cancelQueueEntry(s.clientKey,s.entryId);break;case"setServerIntervals":this.server.setServerIntervals(s.intervals);break;case"setClientPollInterval":await this.server.setClientPollInterval(s.clientKey,s.intervalMs);break;case"setClientUpdateCheckInterval":await this.server.setClientUpdateCheckInterval(s.clientKey,s.intervalMs);break}}),this.server.triggerUpdate()}update(e){this._view&&this._view.webview.postMessage({type:"update",data:e})}_getWebviewContent(e){let t=_(),r=a=>e.asWebviewUri(j.Uri.joinPath(this._extensionUri,"dist",a)),s=r("monitor-webview.js"),n=r("monitor-webview.css");return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="
                    default-src 'none';
                    style-src ${e.cspSource} 'unsafe-inline';
                    font-src ${e.cspSource};
                    img-src ${e.cspSource} https: data:;
                    script-src 'nonce-${t}';
                    connect-src 'self' ${e.cspSource} https: ws:;
                ">
                <link href="${n}" rel="stylesheet">
                <title>Monitor Dashboard</title>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${t}" src="${s}"></script>
            </body>
            </html>
        `}};function _(){let o="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<32;t++)o+=e.charAt(Math.floor(Math.random()*e.length));return o}var D=null;function H(o){let e=new E;D=e,e.initialize(o);let t=new R(o.extensionUri,e);e.setProvider(t),o.subscriptions.push(x.window.registerWebviewViewProvider(R.viewType,t,{webviewOptions:{retainContextWhenHidden:!0}}),x.commands.registerCommand("serverMonitor.start",()=>e.start()),x.commands.registerCommand("serverMonitor.showDashboard",()=>{x.commands.executeCommand("workbench.view.extension.monitor-explorer")}),x.commands.registerCommand("serverMonitor.generateReport",()=>e.generateReport()),x.commands.registerCommand("serverMonitor.publishUpdate",()=>e.publishClientUpdate()),x.commands.registerCommand("serverMonitor.stop",()=>e.stop()),x.commands.registerCommand("serverMonitor.viewBacklog",()=>e.showBacklogWebview())),x.workspace.getConfiguration("serverMonitor").get("autoStart")&&e.start()}function Y(){D?.removeServerPresenceFile(),D=null}0&&(module.exports={activate,deactivate});
