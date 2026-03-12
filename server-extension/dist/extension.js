"use strict";var T=Object.create;var U=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var O=Object.getPrototypeOf,V=Object.prototype.hasOwnProperty;var J=(o,e)=>{for(var t in e)U(o,t,{get:e[t],enumerable:!0})},D=(o,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of N(e))!V.call(o,r)&&r!==t&&U(o,r,{get:()=>e[r],enumerable:!(s=W(e,r))||s.enumerable});return o};var C=(o,e,t)=>(t=o!=null?T(O(o)):{},D(e||!o||!o.__esModule?U(t,"default",{value:o,enumerable:!0}):t,o)),Q=o=>D(U({},"__esModule",{value:!0}),o);var Y={};J(Y,{activate:()=>_,deactivate:()=>H});module.exports=Q(Y);var b=C(require("vscode"));var c=C(require("vscode")),u=C(require("fs")),h=C(require("path")),f=C(require("os")),$=require("child_process");function I(o){return process.platform==="win32"&&o.startsWith("\\\\")}function q(o){if(I(o)){try{(0,$.execSync)(`mkdir "${o}"`,{shell:"cmd.exe",stdio:"pipe",timeout:1e4})}catch{}return}u.mkdirSync(o,{recursive:!0})}function y(o){if(I(o))try{return(0,$.execSync)(`dir /b "${o}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3}),!0}catch{return!1}return u.existsSync(o)}function S(o){if(I(o)){let e=h.join(f.tmpdir(),`bba-rd-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{(0,$.execSync)(`copy /Y "${o}" "${e}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});let t=u.readFileSync(e,"utf-8");try{u.unlinkSync(e)}catch{}return t}catch(t){try{u.unlinkSync(e)}catch{}throw t}}return u.readFileSync(o,"utf-8")}function E(o,e){if(I(o)){let t=h.join(f.tmpdir(),`bba-wr-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{u.writeFileSync(t,e,"utf-8"),(0,$.execSync)(`copy /Y "${t}" "${o}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});try{u.unlinkSync(t)}catch{}}catch(s){try{u.unlinkSync(t)}catch{}throw s}return}u.writeFileSync(o,e)}function P(o){if(I(o)){try{(0,$.execSync)(`del /F /Q "${o}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3})}catch{}return}u.unlinkSync(o)}function A(o){if(I(o))try{return(0,$.execSync)(`dir /b "${o}"`,{shell:"cmd.exe",timeout:1e4}).toString("utf-8").split(/\r?\n/).filter(t=>t.trim().length>0)}catch{return[]}return u.readdirSync(o)}var L=class{syncPath="";serverKey="";backlogPollInterval=null;onBacklogResponse=null;recentBacklogEntries=[];onBacklogArrived=null;configure(e,t,s,r){this.syncPath=e,this.serverKey=t,this.onBacklogResponse=s,this.onBacklogArrived=r??null}get isConfigured(){return!!this.syncPath}get syncPathValue(){return this.syncPath}scanRegisteredClients(){if(!this.isConfigured)return[];let e=h.join(this.syncPath,"clients",this.serverKey);if(!y(e))return[];let t=[];try{let s=A(e).filter(r=>r.endsWith(".json"));for(let r of s)try{let n=JSON.parse(S(h.join(e,r)));n.clientKey&&n.clientLabel&&t.push(n)}catch{console.warn(`[ServerFallback] Skipping malformed presence file: ${r}`)}}catch(s){console.warn("[ServerFallback] Error scanning clients dir:",s)}return t}startPolling(e=15e3){this.stopPolling(),this.isConfigured&&(this.pollResultsDir(),this.pollServerBacklog(),this.backlogPollInterval=setInterval(()=>{this.pollResultsDir(),this.pollServerBacklog()},e),console.log(`[ServerFallback] Polling results+backlog every ${e/1e3}s from: ${this.syncPath}`))}stopPolling(){this.backlogPollInterval&&(clearInterval(this.backlogPollInterval),this.backlogPollInterval=null)}enqueueCommand(e,t,s,r,n){if(!this.isConfigured)throw new Error("Sync path is not configured. Set serverMonitor.syncPath in settings.");try{let a=h.join(this.syncPath,"queue");q(a);let p=h.join(a,`${e}.json`),g=[];if(y(p))try{g=JSON.parse(S(p))}catch{g=[]}let x=n??`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,w={id:x,clientKey:t,clientLabel:e,command:s,payload:r,timestamp:Date.now(),serverKey:this.serverKey};return g.push(w),E(p,JSON.stringify(g,null,2)),console.log(`[ServerFallback] Enqueued command "${s}" for ${e} \xE2\u2020\u2019 ${p}`),x}catch(a){throw new Error(`Failed to write queue file at "${this.syncPath}\\queue\\${e}.json": ${a?.message||a}`)}}peekQueuedCommands(e){if(!this.isConfigured)return[];let t=h.join(this.syncPath,"queue",`${e}.json`);if(!y(t))return[];try{return JSON.parse(S(t))}catch{return[]}}listQueuedClients(){if(!this.isConfigured)return[];let e=h.join(this.syncPath,"queue");return y(e)?A(e).filter(t=>t.endsWith(".json")).map(t=>t.replace(/\.json$/,"")):[]}dequeueCommands(e){if(!this.isConfigured)return[];let t=h.join(this.syncPath,"queue",`${e}.json`);if(!y(t))return[];try{let s=JSON.parse(S(t));return P(t),console.log(`[ServerFallback] Dequeued ${s.length} command(s) for ${e}`),s}catch(s){return console.error(`[ServerFallback] Error reading queue for ${e}:`,s),[]}}pollResultsDir(){if(!(!this.isConfigured||!this.onBacklogResponse))try{let e=h.join(this.syncPath,"results");if(!y(e))return;let t=A(e).filter(s=>s.endsWith(".json"));for(let s of t){let r=h.join(e,s);try{let n=JSON.parse(S(r)),a=s.replace(/\.json$/,"");P(r);for(let p of n)console.log(`[ServerFallback] Got live result from ${a}: ${p.command}`),this.onBacklogResponse(a,{...p,channel:"live"})}catch(n){console.error(`[ServerFallback] Error reading results file ${s}:`,n)}}}catch(e){console.error("[ServerFallback] Results poll error:",e)}}pollServerBacklog(){if(!(!this.isConfigured||!this.onBacklogResponse))try{let e=h.join(this.syncPath,"server-backlog");if(!y(e))return;let t=A(e).filter(r=>r.endsWith(".json")),s=[];for(let r of t){let n=h.join(e,r);try{let a=JSON.parse(S(n)),p=r.replace(/\.json$/,"");for(let g of a)console.log(`[ServerFallback] Got server-backlog entry from ${p}: ${g.command}`),s.push({...g,clientLabel:p}),this.onBacklogResponse(p,g);P(n)}catch(a){console.error(`[ServerFallback] Error reading backlog file ${r}:`,a)}}s.length>0&&(this.recentBacklogEntries.push(...s),this.onBacklogArrived&&this.onBacklogArrived(s))}catch(e){console.error("[ServerFallback] Backlog poll error:",e)}}getRecentBacklog(){return this.recentBacklogEntries}clearRecentBacklog(){this.recentBacklogEntries=[]}},F=class{clients=new Map;provider=null;context=null;running=!1;serverId="default";presenceCheckInterval=null;syncScanInterval=null;offlineTimeoutMs=3e5;fallback=new L;clientReleasePath="";serverPresenceInterval=null;version="1.0.0";backlogPollMs=15e3;presenceCheckMs=3e4;syncScanMs=3e4;serverPresenceMs=3e4;clientPollMs=15e3;initialize(e){this.context=e,this.version=e.extension?.packageJSON?.version||"1.0.0";let t=c.workspace.getConfiguration("serverMonitor"),s=e.globalState.get("serverKey");this.serverId=s||t.get("serverId")||"default",console.log(`[MonitorServer] Initializing with serverId: ${this.serverId}`),this.loadPersistentClients(),this.setupFallback(),console.log(`[MonitorServer] Loaded ${this.clients.size} persistent clients`)}setupFallback(){let e=c.workspace.getConfiguration("serverMonitor"),t=e.get("syncPath")||"";this.clientReleasePath=e.get("clientReleasePath")||"",t&&(this.fallback.configure(t,this.serverId,(s,r)=>{this.handleBacklogResponse(s,r)},s=>{let r=s.length;c.window.showInformationMessage(`${r} backlog result${r===1?"":"s"} received from offline clients`,"View Backlog").then(n=>{n==="View Backlog"&&this.showBacklogWebview()})}),this.fallback.startPolling(this.backlogPollMs),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),this.syncScanMs))}async changeServerKey(e){!e||!this.context||(this.removeServerPresenceFile(),this.serverId=e,await this.context.globalState.update("serverKey",e),this.running&&this.writeServerPresenceFile("online"),console.log(`[MonitorServer] Server key changed to: ${e}`),c.window.showInformationMessage(`Server key changed to: ${e}`),this.triggerUpdate())}serverPresenceFilePath(){let e=this.fallback.syncPathValue;return h.join(e,"servers",`${this.serverId}-${f.hostname()}.json`)}writeServerPresenceFile(e){if(this.fallback.isConfigured)try{let t=h.join(this.fallback.syncPathValue,"servers");q(t);let s=this.serverPresenceFilePath(),r=Date.now();if(e==="online"&&y(s))try{let g=JSON.parse(S(s));g.status==="online"&&(r=g.startedAt)}catch{}let n=Array.from(this.clients.values()).map(g=>({key:g.key,label:g.clientLabel,status:g.status})),a=f.hostname(),p={key:this.serverId,machine:a,username:f.userInfo().username,version:this.version,clients:n,startedAt:r,lastSeen:Date.now(),status:e};E(s,JSON.stringify(p,null,2)),console.log(`[MonitorServer] Server presence file written (${e}): ${s}`)}catch(t){console.warn(`[MonitorServer] Could not write server presence file: ${t?.message||t}`)}}removeServerPresenceFile(){if(this.fallback.isConfigured)try{let e=this.serverPresenceFilePath();y(e)&&(P(e),console.log(`[MonitorServer] Server presence file removed: ${e}`))}catch(e){console.warn(`[MonitorServer] Could not remove server presence file: ${e?.message||e}`)}}showBacklogWebview(){let e=i=>String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t=i=>`<span class="r-badge ${i?"ok":"err"}">${i?"&#10004; ok":"&#10006; err"}</span>`,s=i=>{try{return new Date(i).toLocaleString()}catch{return e(i)}},r=(i,d)=>`<span class="r-key">${e(i)}</span><span class="r-val">${d}</span>`,n=i=>{let d=i.agents||[],v='<div class="r-card"><div class="r-kv">';return v+=r("Status",t(!!i.success)),i.timeframe&&(v+=r("Timeframe",e(i.timeframe))),i.totalEntries!==void 0&&(v+=r("Total entries",`<strong>${e(i.totalEntries)}</strong>`)),i.dateRange?.earliest&&(v+=r("From",e(s(i.dateRange.earliest))),v+=r("To",e(s(i.dateRange.latest)))),v+="</div>",d.length>0?(v+='<table class="r-subtable"><thead><tr><th>Agent</th><th>Count</th><th>%</th></tr></thead><tbody>',d.forEach(k=>{v+=`<tr><td>${e(k.name)}</td><td>${e(k.count)}</td><td>${e(k.percentage)}%</td></tr>`}),v+="</tbody></table>"):v+='<span class="r-none">No agent data for this period.</span>',v+"</div>"},a=i=>{let d='<div class="r-card"><div class="r-kv">';return d+=r("Status",t(!!i.success)),i.installed!==void 0&&(d+=r("Installed",t(!!i.installed))),i.version&&(d+=r("Version",e(i.version))),i.active!==void 0&&(d+=r("Active",t(!!i.active))),i.message&&(d+=r("Message",e(i.message))),d+"</div></div>"},p=i=>{let d='<div class="r-card"><div class="r-kv">';return["hostname","username","os","platform","arch","cpu","memory","vscodeVersion","nodeVersion"].forEach(v=>{i[v]!==void 0&&(d+=r(v,e(i[v])))}),d+"</div></div>"},g=i=>{let d='<div class="r-card"><div class="r-kv">';i.name&&(d+=r("Name",e(i.name))),i.workspace&&(d+=r("Workspace",e(i.workspace)));let v=i.rootPaths||(i.rootPath?[i.rootPath]:[]);return v.length&&(d+=r("Root",e(v.join(", ")))),d+"</div></div>"},x=(i,d)=>{if(d==null)return'<span class="r-none">&mdash;</span>';if(typeof d!="object")return`<pre class="r-pre">${e(String(d))}</pre>`;if(i==="getUsageReport"||i==="generateReport")return n(d);if(i==="checkBBrainy"||i==="forceBBrainy"||i==="showBBrainyStatus")return a(d);if(i==="getSystemInfo")return p(d);if(i==="getWorkspace")return g(d);let v=JSON.stringify(d,null,2);return v.length<300?`<pre class="r-pre">${e(v)}</pre>`:`<details class="r-details"><summary>{ &hellip; } show JSON</summary><pre class="r-pre">${e(v)}</pre></details>`},w=this.fallback.getRecentBacklog(),l={};for(let i of w){let d=i.clientLabel||"unknown";l[d]||(l[d]=[]),l[d].push(i)}let m=c.window.createWebviewPanel("serverBacklog",`Server Backlog (${w.length})`,c.ViewColumn.Beside,{enableScripts:!0}),B=Object.entries(l).map(([i,d])=>{let v=d.map(k=>`<tr>
                <td class="cell time">${e(s(k.timestamp||Date.now()))}</td>
                <td class="cell cmd">${e(k.command||"")}</td>
                <td class="cell result-cell">${x(k.command||"",k.payload??k.result??null)}</td>
            </tr>`).join("");return`<div class="section"><h3>${e(i)}</h3>
            <table><colgroup><col class="col-time"><col class="col-cmd"><col class="col-result"></colgroup>
            <thead><tr><th>Time</th><th>Command</th><th>Result</th></tr></thead>
            <tbody>${v}</tbody></table></div>`}).join(""),M=w.length;m.webview.html=['<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>',":root{color-scheme:dark}","body{background:var(--vscode-editor-background,#1e1e2e);color:var(--vscode-foreground,#cdd6f4);","  font-family:var(--vscode-font-family,ui-sans-serif,system-ui,sans-serif);padding:24px;margin:0}","h2{margin:0 0 4px;font-size:1.1rem}","h3{color:var(--vscode-charts-green,#a6e3a1);font-size:.85rem;border-bottom:1px solid var(--vscode-panel-border,#313244);padding-bottom:6px;margin:0 0 8px}",".section{margin-bottom:28px}","table{width:100%;border-collapse:collapse;table-layout:fixed}","col.col-time{width:140px}col.col-cmd{width:160px}col.col-result{width:auto}","th{text-align:left;font-size:.7rem;color:var(--vscode-descriptionForeground,#6c7086);padding-bottom:6px;font-weight:600;text-transform:uppercase;border-bottom:1px solid var(--vscode-panel-border,#313244)}",".cell{padding:6px 8px 6px 0;vertical-align:top;font-size:.75rem;border-bottom:1px solid var(--vscode-panel-border,#252535)}",".time{color:var(--vscode-descriptionForeground,#a6adc8);white-space:nowrap}",".cmd{color:var(--vscode-textLink-foreground,#89b4fa);font-family:monospace;font-size:.75rem}",".result-cell{color:var(--vscode-foreground,#cdd6f4)}",".r-pre{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.7rem;opacity:.85}",".toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}",".empty{color:var(--vscode-descriptionForeground,#6c7086);font-style:italic;margin-top:20px}","button{background:var(--vscode-button-secondaryBackground,#313244);border:1px solid var(--vscode-panel-border,#45475a);","  color:var(--vscode-button-secondaryForeground,#cdd6f4);padding:5px 14px;border-radius:4px;cursor:pointer;font-size:.8rem}","button:hover{background:var(--vscode-button-secondaryHoverBackground,#45475a)}",".r-card{background:var(--vscode-editor-inactiveSelectionBackground,#2a2a3e);border-radius:6px;padding:8px 10px;font-size:.73rem}",".r-kv{display:grid;grid-template-columns:max-content 1fr;gap:2px 10px;margin-bottom:6px}",".r-key{color:var(--vscode-descriptionForeground,#888);font-weight:600;white-space:nowrap}",".r-val{color:var(--vscode-foreground,#cdd6f4);word-break:break-word}",".r-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:.68rem;font-weight:700}",".r-badge.ok{background:rgba(166,227,161,.15);color:var(--vscode-charts-green,#a6e3a1)}",".r-badge.err{background:rgba(241,76,76,.15);color:var(--vscode-charts-red,#f38ba8)}",".r-subtable{width:100%;border-collapse:collapse;margin-top:6px}",".r-subtable th{font-size:.66rem;color:var(--vscode-descriptionForeground,#888);border-bottom:1px solid var(--vscode-panel-border,#313244);padding:2px 6px 3px 0}",".r-subtable td{font-size:.7rem;padding:2px 6px 2px 0;border-bottom:1px solid var(--vscode-panel-border,#25253a)}",".r-none{opacity:.4}",".r-details summary{font-size:.65rem;color:var(--vscode-textLink-foreground,#89b4fa);cursor:pointer;user-select:none;padding:2px 0}",".r-details .r-pre{margin-top:4px}","</style></head><body>",`<div class="toolbar"><h2>Server Backlog &mdash; ${M} result${M===1?"":"s"}</h2>`,'<button onclick="clearAll()">Clear All</button></div>',M===0?'<p class="empty">No backlog entries.</p>':B,"<script>","const vscode=acquireVsCodeApi();",'function clearAll(){vscode.postMessage({action:"clearBacklog"});}',"</script></body></html>"].join(`
`),m.webview.onDidReceiveMessage(i=>{i.action==="clearBacklog"&&(this.fallback.clearRecentBacklog(),m.dispose(),this.triggerUpdate())})}handleBacklogResponse(e,t){let s=Array.from(this.clients.values()).find(p=>p.clientLabel===e);if(!s){console.warn(`[MonitorServer] Response for unknown clientLabel: ${e}`);return}let r=t.payload&&t.payload.success===!1&&t.payload.error!==void 0,n=s.commandLog.find(p=>p.id===t.id);n?(n.status=r?"error":"executed",n.result=t.payload):s.commandLog.push({id:t.id,command:t.command,status:r?"error":"executed",timestamp:t.timestamp||Date.now(),result:t.payload}),t.payload!==void 0&&t.payload!==null&&(s.lastResponse={command:t.command,data:t.payload,timestamp:t.timestamp||Date.now()}),s.info||(s.info={}),t.command==="checkBBrainy"&&t.payload&&(s.info.bbrainyStatus=t.payload),t.command==="getSystemInfo"&&t.payload?.hostname&&Object.assign(s.info,{hostname:t.payload.hostname,username:t.payload.username,os:t.payload.os,vscodeVersion:t.payload.vscodeVersion}),t.command==="getWorkspace"&&t.payload?.workspace&&(s.info.workspace=t.payload.workspace),t.command==="getUsageReport"&&t.payload?.totalEntries!==void 0&&(s.info.lastUsageReport=t.payload);let a=t.channel==="live"?"Live result":"Backlog result";console.log(`[MonitorServer] ${a} from ${e}: ${t.command} -> ${r?"error":"executed"}`),this.savePersistentClients(),this.triggerUpdate()}importSyncClients(){let e=this.fallback.scanRegisteredClients();if(e.length===0)return;let t=2*60*60*1e3,s=n=>n.status==="inactive"&&Date.now()-n.lastSeen<t?"active":n.status??"active",r=0;for(let n of e){let p=Date.now()-n.lastSeen<12e4;if(this.clients.has(n.clientKey)){let g=this.clients.get(n.clientKey);g.extensionStatus=s(n),g.lastSeen=Math.max(g.lastSeen,n.lastSeen),g.status=p?"sync":"offline";continue}this.clients.set(n.clientKey,{key:n.clientKey,info:{username:n.username,hostname:n.hostname},lastSeen:n.lastSeen,status:p?"sync":"offline",clientLabel:n.clientLabel,commandLog:[],extensionStatus:s(n)}),console.log(`[MonitorServer] Discovered new client via presence file: ${n.clientLabel} (${n.clientKey})`),r++}r>0&&(this.savePersistentClients(),this.triggerUpdate(),console.log(`[MonitorServer] Imported ${r} new client(s) from sync folder`))}loadPersistentClients(){if(!this.context||!this.serverId){console.warn(`[MonitorServer] Cannot load persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let t=(this.context.globalState.get("persistentAssets")||{})[this.serverId]||[];console.log(`[MonitorServer] Loading ${t.length} persistent clients for serverId: ${this.serverId}`),t.forEach(s=>{this.clients.set(s.key,{...s,ws:null,status:"offline",clientLabel:s.clientLabel||`${s.info?.username||"unknown"}-${s.info?.hostname||"unknown"}`,commandLog:[]})})}restorePendingQueueToLog(){if(!this.fallback.isConfigured)return;let e=this.fallback.listQueuedClients();for(let t of e){let s=Array.from(this.clients.values()).find(n=>n.clientLabel===t);if(!s)continue;let r=this.fallback.peekQueuedCommands(t);for(let n of r)s.commandLog.find(a=>a.id===n.id)||s.commandLog.push({id:n.id,command:n.command,status:"queued",timestamp:n.timestamp});console.log(`[MonitorServer] Restored ${r.length} pending queued command(s) to log for ${t}`)}}deduplicateClients(){let e=new Set,t=[];for(let[s,r]of this.clients){let n=`${r.info?.hostname}:${r.info?.username}`;e.has(n)?(t.push(s),console.log(`[MonitorServer] Found duplicate client: ${s} (${r.info?.username}@${r.info?.hostname})`)):e.add(n)}t.forEach(s=>this.clients.delete(s)),t.length>0&&(this.savePersistentClients(),console.log(`[MonitorServer] Removed ${t.length} duplicate client entries`),c.window.showInformationMessage(`Cleaned up ${t.length} duplicate clients on startup`))}savePersistentClients(){if(!this.context||!this.serverId){console.error(`[MonitorServer] Cannot save persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let e=this.context.globalState.get("persistentAssets")||{};e[this.serverId]=Array.from(this.clients.values()).map(t=>({key:t.key,info:t.info,lastSeen:t.lastSeen,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-100)})),this.context.globalState.update("persistentAssets",e),console.debug(`[MonitorServer] Saved ${this.clients.size} clients to persistent storage`)}setProvider(e){this.provider=e}async start(){if(this.running){console.warn("[MonitorServer] Already running, ignoring start request");return}if(!this.context){console.error("[MonitorServer] Cannot start: context not initialized"),c.window.showErrorMessage("Server not initialized with Context");return}let e=c.workspace.getConfiguration("serverMonitor"),t=this.context.globalState.get("serverKey");this.serverId=t||e.get("serverId")||"default",console.log(`[MonitorServer] Starting server with serverId: ${this.serverId}`),this.clients.clear(),this.loadPersistentClients(),this.deduplicateClients(),this.setupFallback(),this.importSyncClients(),this.restorePendingQueueToLog(),this.running=!0,this.startPresenceCheck(),this.writeServerPresenceFile("online"),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),this.serverPresenceMs),this.triggerUpdate(),console.log(`[MonitorServer] Server started successfully [${this.serverId}]`),c.window.showInformationMessage(`Monitor server [${this.serverId}] running (sync-folder mode)`)}startPresenceCheck(){this.presenceCheckInterval&&clearInterval(this.presenceCheckInterval),this.presenceCheckInterval=setInterval(()=>{this.checkClientPresence()},this.presenceCheckMs)}stop(){if(!this.running){console.warn("[MonitorServer] Not running, ignoring stop request");return}console.log("[MonitorServer] Stopping server"),this.presenceCheckInterval&&(clearInterval(this.presenceCheckInterval),this.presenceCheckInterval=null),this.syncScanInterval&&(clearInterval(this.syncScanInterval),this.syncScanInterval=null),this.writeServerPresenceFile("offline"),this.serverPresenceInterval&&(clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=null),this.fallback.stopPolling(),this.running=!1;for(let e of this.clients.values())e.status="offline";this.triggerUpdate(),console.log("[MonitorServer] Server stopped"),c.window.showInformationMessage("Monitor server stopped")}setServerIntervals(e){let t=(s,r,n,a)=>s!==void 0?Math.max(r,Math.min(n,s)):a;this.backlogPollMs=t(e.backlogPollMs,3e3,3e5,this.backlogPollMs),this.presenceCheckMs=t(e.presenceCheckMs,5e3,3e5,this.presenceCheckMs),this.syncScanMs=t(e.syncScanMs,5e3,3e5,this.syncScanMs),this.serverPresenceMs=t(e.serverPresenceMs,5e3,3e5,this.serverPresenceMs),this.running&&(this.fallback.startPolling(this.backlogPollMs),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),this.syncScanMs),this.startPresenceCheck(),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),this.serverPresenceMs)),console.log(`[MonitorServer] Server intervals updated \u2014 backlog: ${this.backlogPollMs/1e3}s, presence: ${this.presenceCheckMs/1e3}s, sync-scan: ${this.syncScanMs/1e3}s, server-presence: ${this.serverPresenceMs/1e3}s`),this.triggerUpdate()}async setClientPollInterval(e,t){this.clientPollMs=Math.max(3e3,Math.min(3e5,t)),await this.sendCommand(e,"setPollInterval",{intervalMs:this.clientPollMs})}async setAllClientsPollInterval(e){this.clientPollMs=Math.max(3e3,Math.min(3e5,e)),await this.queryAllClients("setPollInterval");for(let t of this.clients.keys())await this.sendCommand(t,"setPollInterval",{intervalMs:this.clientPollMs})}getIntervals(){return{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs}}checkClientPresence(){let e=Date.now(),t=[];for(let[s,r]of this.clients)r.status==="sync"&&e-r.lastSeen>2*60*1e3?(r.status="offline",console.log(`[MonitorServer] Sync client demoted to offline (stale presence): ${s}`)):r.status==="offline"&&e-r.lastSeen>this.offlineTimeoutMs&&(t.push(s),console.log(`[MonitorServer] Removing stale offline client: ${s} (${r.info?.username}@${r.info?.hostname})`));t.forEach(s=>this.clients.delete(s)),t.length>0&&(console.log(`[MonitorServer] Removed ${t.length} stale client(s)`),this.savePersistentClients(),this.triggerUpdate())}showUsageReportWebview(e,t="Unknown",s="Unknown"){try{let r={labels:e.agents.map(a=>a.name),datasets:[{label:"Usage Count",data:e.agents.map(a=>a.count),backgroundColor:["rgba(59, 130, 246, 0.2)","rgba(16, 185, 129, 0.2)","rgba(168, 85, 247, 0.2)","rgba(251, 146, 60, 0.2)","rgba(244, 63, 94, 0.2)","rgba(236, 72, 153, 0.2)"],borderColor:["rgba(59, 130, 246, 1)","rgba(16, 185, 129, 1)","rgba(168, 85, 247, 1)","rgba(251, 146, 60, 1)","rgba(244, 63, 94, 1)","rgba(236, 72, 153, 1)"],borderWidth:2}]},n=c.window.createWebviewPanel("bbrainyUsageReport",`BBrainy Usage: ${e.timeframe}`,c.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});n.webview.html=this.getUsageReportHtml(e,r,t,s),console.log(`[MonitorServer] Opened usage report webview for ${t}@${s}: ${e.timeframe}`)}catch(r){console.error("[MonitorServer] Failed to show usage report:",r),c.window.showErrorMessage(`Failed to show usage report: ${r}`)}}getUsageReportHtml(e,t,s,r){let n=e.agents.map(a=>`<tr>
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
                        <div class="client-info">&#128205; Client: <strong>${s}@${r}</strong></div>
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
        `}async sendCommand(e,t,s){let r=this.clients.get(e);if(!r){console.warn(`[MonitorServer] Attempted to send command to non-existent client: ${e}`),c.window.showErrorMessage("Client not found");return}let n=`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,a={id:n,command:t,status:"queued",timestamp:Date.now()};if(r.commandLog.push(a),this.triggerUpdate(),!this.fallback.isConfigured){a.status="error";let g=`Sync path not configured. Current value: "${c.workspace.getConfiguration("serverMonitor").get("syncPath")||"(empty)"}". Set serverMonitor.syncPath in settings.`;console.error(`[MonitorServer] ${g}`),c.window.showErrorMessage(g),this.savePersistentClients(),this.triggerUpdate();return}try{this.fallback.enqueueCommand(r.clientLabel,e,t,s,n),this.savePersistentClients(),this.triggerUpdate(),console.log(`[MonitorServer] Queued "${t}" for ${r.clientLabel}`),c.window.showInformationMessage(`Queued "${t}" for ${r.clientLabel}`)}catch(p){a.status="error";let g=`Failed to queue command: ${p?.message||p}`;console.error(`[MonitorServer] ${g}`),c.window.showErrorMessage(g),this.savePersistentClients(),this.triggerUpdate()}}clearClientQueue(e){let t=this.clients.get(e);if(t){if(this.fallback.isConfigured)try{let s=h.join(this.fallback.syncPathValue,"queue",`${t.clientLabel}.json`);y(s)&&P(s)}catch(s){console.error("[MonitorServer] clearClientQueue: failed to delete queue file",s)}t.commandLog=[],this.savePersistentClients(),this.triggerUpdate()}}clearBacklog(){this.fallback.clearRecentBacklog(),this.triggerUpdate()}cancelQueueEntry(e,t){let s=this.clients.get(e);if(s){if(this.fallback.isConfigured)try{let r=h.join(this.fallback.syncPathValue,"queue",`${s.clientLabel}.json`);if(y(r)){let a=JSON.parse(S(r)).filter(p=>p.id!==t);a.length===0?P(r):E(r,JSON.stringify(a,null,2))}}catch(r){console.error("[MonitorServer] cancelQueueEntry: failed to update queue file",r)}s.commandLog=s.commandLog.filter(r=>r.id!==t),this.savePersistentClients(),this.triggerUpdate()}}async queryAllClients(e){console.log(`[MonitorServer] Broadcasting command to all ${this.clients.size} clients: ${e}`);let t=Array.from(this.clients.keys()).map(s=>this.sendCommand(s,e));await Promise.all(t),console.log(`[MonitorServer] Broadcast complete for command: ${e}`)}getAllClientsInfo(){return Array.from(this.clients.values()).map(e=>({key:e.key,username:e.info?.username||"Unknown",hostname:e.info?.hostname||"Unknown",workspace:e.info?.workspace,bbrainyActive:e.info?.bbrainyStatus?.active||!1,status:e.status,lastSeen:e.lastSeen,onlineStatus:e.status==="sync"?"active":"offline"}))}showAllAssetsWebview(){let e=this.getAllClientsInfo(),t=c.window.createWebviewPanel("allAssets","All Assets",c.ViewColumn.One,{enableScripts:!0});t.webview.html=this.getAllAssetsHtml(e)}getAllAssetsHtml(e){let t=e.map(s=>`
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${s.username}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${s.hostname}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${s.onlineStatus==="active"?"#f59e0b":"#ef4444"};"></span>
                    ${s.onlineStatus}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${s.bbrainyActive?"&#10003; Active":"&#10007; Inactive"}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">${s.lastSeen?new Date(s.lastSeen).toLocaleString():"Never"}</td>
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
                            <div class="stat-value">${e.filter(s=>s.onlineStatus==="active").length}</div>
                            <div class="stat-label">Active (Sync)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${e.filter(s=>s.bbrainyActive).length}</div>
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
        `}showBBrainyStatusWebview(e){let t=this.clients.get(e);if(!t){c.window.showErrorMessage(`Client ${e} not found`);return}let s=t.info?.bbrainyStatus||{installed:!1,active:!1,version:"Unknown",lastUsedTime:"Never",totalUsage:0},r=c.window.createWebviewPanel(`bbrainyStatus-${e}`,`BBrainy Status - ${t.info?.username}@${t.info?.hostname}`,c.ViewColumn.One,{enableScripts:!0});r.webview.html=this.getBBrainyStatusHtml(s,t.info?.username,t.info?.hostname)}getBBrainyStatusHtml(e,t="Unknown",s="Unknown"){let r=e.installed,n=e.active,a=e.version||"Unknown",p=e.lastUsedTime||"Never",g=e.totalUsage||0,x=r?n?"#34d399":"#f59e0b":"#ef4444";return`
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
                        background-color: ${x}20;
                        color: ${x};
                        border: 2px solid ${x};
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
                        <div class="client-name">&#128241; ${t}@${s}</div>
                        <h1>&#129504; BBrainy Status</h1>
                        <div class="status-badge">${r?n?"Active":"Installed - Inactive":"Not Installed"}</div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Installed</div>
                            <div class="stat-value">${r?"&#10003; Yes":"&#10007; No"}</div>
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
                            <div class="stat-value">${g}</div>
                        </div>
                    </div>

                    <div class="contribution-graph">
                        <div class="graph-title">&#128202; Contribution Graph (Last 12 Weeks)</div>
                        <div class="graph-grid">
                            ${Array.from({length:84},(l,m)=>`<div class="graph-cell" style="background: rgba(52, 211, 153, ${Math.random()*.5});"></div>`).join("")}
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; text-align: center;">Green intensity shows activity level</div>
                    </div>
                </div>
            </body>
            </html>
        `}async generateReport(){let e=new Date,t=Array.from(this.clients.values()),s=t.filter(l=>l.status==="sync"),r=t.filter(l=>l.status==="offline"),n=t.filter(l=>l.extensionStatus==="inactive"),a={generatedAt:e.toISOString(),server:{key:this.serverId,machine:f.hostname(),username:f.userInfo().username,version:this.version,running:this.running,syncPath:this.fallback.syncPathValue||"(not configured)"},summary:{total:t.length,sync:s.length,offline:r.length,inactive:n.length},clients:t.map(l=>({label:l.clientLabel,key:l.key,username:l.info?.username,hostname:l.info?.hostname,workspace:l.info?.workspace,version:l.info?.version,bbrainyActive:l.info?.bbrainyStatus?.active,status:l.status,extensionStatus:l.extensionStatus??"active",lastSeen:new Date(l.lastSeen).toISOString(),pendingCommands:l.commandLog.filter(m=>m.status==="queued"||m.status==="sent").length,lastCommand:l.commandLog.length>0?l.commandLog[l.commandLog.length-1]?.command:null}))},p=JSON.stringify(a,null,2),g={sync:"#f59e0b",offline:"#94a3b8",active:"#22c55e",inactive:"#f97316"},x=t.map(l=>{let m=l.commandLog.filter(M=>M.status==="queued"||M.status==="sent").length,B=l.info?.bbrainyStatus?.active?"#22c55e":"#475569";return`<tr>
                <td><span class="label">${l.clientLabel}</span></td>
                <td>${l.info?.username||"&#8212;"}</td>
                <td>${l.info?.hostname||"&#8212;"}</td>
                <td>${l.info?.version||"&#8212;"}</td>
                <td><span class="badge" style="color:${g[l.status]||"#94a3b8"}">${l.status}</span></td>
                <td><span class="badge" style="color:${g[l.extensionStatus??"active"]||"#94a3b8"}">${l.extensionStatus??"active"}</span></td>
                <td><span style="color:${B};font-size:18px">&#9679;</span></td>
                <td>${m>0?`<span class="badge-warn">${m} pending</span>`:'<span class="badge-ok">0</span>'}</td>
                <td>${new Date(l.lastSeen).toLocaleString()}</td>
            </tr>`}).join(""),w=c.window.createWebviewPanel("serverReport",`Server Report - ${this.serverId}`,c.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});w.webview.onDidReceiveMessage(l=>{l.action==="exportJson"&&c.window.showSaveDialog({defaultUri:c.Uri.file(h.join(f.homedir(),`server-report-${this.serverId}-${Date.now()}.json`)),filters:{JSON:["json"]},title:"Save Server Report"}).then(m=>{if(m)try{u.writeFileSync(m.fsPath,p,"utf-8"),c.window.showInformationMessage(`Report saved to ${m.fsPath}`)}catch(B){c.window.showErrorMessage(`Failed to save: ${B}`)}})}),w.webview.html=`<!DOCTYPE html>
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
  <div class="subtitle">Generated: ${e.toLocaleString()} &nbsp;|&nbsp; Server: <strong>${this.serverId}</strong> on <strong>${f.hostname()}</strong></div>

  <div class="section">
    <h2>Summary</h2>
    <div class="grid">
      <div class="card"><div class="card-label">Total Clients</div><div class="card-value">${t.length}</div></div>
      <div class="card"><div class="card-label">Active (Sync)</div><div class="card-value amber">${s.length}</div></div>
      <div class="card"><div class="card-label">Offline</div><div class="card-value red">${r.length}</div></div>
      <div class="card"><div class="card-label">Uninstalled</div><div class="card-value orange">${n.length}</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Server Info</h2>
    <div class="info-grid">
      <div><div class="info-row"><span class="info-key">Server Key</span><span class="info-val">${this.serverId}</span></div>
           <div class="info-row"><span class="info-key">Machine</span><span class="info-val">${f.hostname()}</span></div>
           <div class="info-row"><span class="info-key">Username</span><span class="info-val">${f.userInfo().username}</span></div>
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
      <tbody>${x||'<tr><td colspan="9" style="text-align:center;color:#475569;padding:20px">No clients registered</td></tr>'}</tbody>
    </table>
  </div>

  <button class="export-btn" onclick="vscode.postMessage({action:'exportJson'})">&#11015; Export as JSON</button>
</div>
<script>const vscode=acquireVsCodeApi();</script>
</body>
</html>`}async publishClientUpdate(){let e=await c.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"VSIX Extension":["vsix"]},title:"Select client extension VSIX to publish"});if(e&&e[0])if(this.clientReleasePath)try{let t=h.join(this.clientReleasePath,"updates");u.mkdirSync(t,{recursive:!0});let s=h.basename(e[0].fsPath);u.copyFileSync(e[0].fsPath,h.join(t,s)),console.log(`[MonitorServer] Published update to client-release: ${s}`),c.window.showInformationMessage(`Update published: ${s}`)}catch(t){console.error("[MonitorServer] Failed to publish update:",t),c.window.showErrorMessage(`Failed to publish update: ${t}`)}else c.window.showErrorMessage("Client release path not configured. Set serverMonitor.clientReleasePath first.")}triggerUpdate(){if(this.provider){let e=Array.from(this.clients.values());this.provider.update({serverStatus:{running:this.running,serverId:this.serverId},total:this.clients.size,sync:e.filter(t=>t.status==="sync").length,offline:e.filter(t=>t.status==="offline").length,clients:e.map(t=>({key:t.key,hostname:t.info?.hostname,username:t.info?.username,workspace:t.info?.workspace,bbrainyActive:t.info?.bbrainyStatus?.active,lastSeen:t.lastSeen,status:t.status,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-50),lastResponse:t.lastResponse,extensionStatus:t.extensionStatus})),backlogCount:this.fallback.getRecentBacklog().length,intervals:{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs}})}}};var z=C(require("vscode")),R=class{constructor(e,t){this._extensionUri=e;this.server=t}static viewType="monitor-dashboard";_view;resolveWebviewView(e,t,s){this._view=e,e.webview.options={enableScripts:!0,localResourceRoots:[z.Uri.joinPath(this._extensionUri,"dist")]},e.webview.html=this._getWebviewContent(e.webview),e.webview.onDidReceiveMessage(async r=>{switch(r.action){case"sendCommand":await this.server.sendCommand(r.clientKey,r.command,r.payload);break;case"queryAll":await this.server.queryAllClients(r.command);break;case"showAssets":this.server.showAllAssetsWebview();break;case"showBBrainyStatus":this.server.showBBrainyStatusWebview(r.clientKey);break;case"generateReport":await this.server.generateReport();break;case"startServer":await this.server.start();break;case"stopServer":this.server.stop();break;case"changeServerKey":await this.server.changeServerKey(r.newKey);break;case"viewBacklog":this.server.showBacklogWebview();break;case"clearBacklog":this.server.clearBacklog();break;case"clearClientQueue":this.server.clearClientQueue(r.clientKey);break;case"cancelQueueEntry":this.server.cancelQueueEntry(r.clientKey,r.entryId);break;case"setServerIntervals":this.server.setServerIntervals(r.intervals);break;case"setClientPollInterval":await this.server.setClientPollInterval(r.clientKey,r.intervalMs);break;case"setAllClientsPollInterval":await this.server.setAllClientsPollInterval(r.intervalMs);break}}),this.server.triggerUpdate()}update(e){this._view&&this._view.webview.postMessage({type:"update",data:e})}_getWebviewContent(e){let t=K(),s=a=>e.asWebviewUri(z.Uri.joinPath(this._extensionUri,"dist",a)),r=s("monitor-webview.js"),n=s("monitor-webview.css");return`
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
                <script nonce="${t}" src="${r}"></script>
            </body>
            </html>
        `}};function K(){let o="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<32;t++)o+=e.charAt(Math.floor(Math.random()*e.length));return o}var j=null;function _(o){let e=new F;j=e,e.initialize(o);let t=new R(o.extensionUri,e);e.setProvider(t),o.subscriptions.push(b.window.registerWebviewViewProvider(R.viewType,t,{webviewOptions:{retainContextWhenHidden:!0}}),b.commands.registerCommand("serverMonitor.start",()=>e.start()),b.commands.registerCommand("serverMonitor.showDashboard",()=>{b.commands.executeCommand("workbench.view.extension.monitor-explorer")}),b.commands.registerCommand("serverMonitor.generateReport",()=>e.generateReport()),b.commands.registerCommand("serverMonitor.publishUpdate",()=>e.publishClientUpdate()),b.commands.registerCommand("serverMonitor.stop",()=>e.stop()),b.commands.registerCommand("serverMonitor.viewBacklog",()=>e.showBacklogWebview())),b.workspace.getConfiguration("serverMonitor").get("autoStart")&&e.start()}function H(){j?.removeServerPresenceFile(),j=null}0&&(module.exports={activate,deactivate});
