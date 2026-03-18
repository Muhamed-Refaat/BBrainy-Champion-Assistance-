"use strict";var q=Object.create;var A=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var O=Object.getOwnPropertyNames;var V=Object.getPrototypeOf,Q=Object.prototype.hasOwnProperty;var J=(l,e)=>{for(var t in e)A(l,t,{get:e[t],enumerable:!0})},N=(l,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of O(e))!Q.call(l,s)&&s!==t&&A(l,s,{get:()=>e[s],enumerable:!(n=W(e,s))||n.enumerable});return l};var I=(l,e,t)=>(t=l!=null?q(V(l)):{},N(e||!l||!l.__esModule?A(t,"default",{value:l,enumerable:!0}):t,l)),K=l=>N(A({},"__esModule",{value:!0}),l);var G={};J(G,{activate:()=>H,deactivate:()=>Y});module.exports=K(G);var w=I(require("vscode"));var h=I(require("vscode")),f=I(require("fs")),v=I(require("path")),b=I(require("os")),C=require("child_process");function M(l){return process.platform==="win32"&&l.startsWith("\\\\")}function z(l){if(M(l)){try{(0,C.execSync)(`mkdir "${l}"`,{shell:"cmd.exe",stdio:"pipe",timeout:1e4})}catch{}return}f.mkdirSync(l,{recursive:!0})}function k(l){if(M(l))try{return(0,C.execSync)(`if exist "${l}" (echo Y) else (echo N)`,{shell:"cmd.exe",stdio:"pipe",timeout:8e3}).toString().trim()==="Y"}catch{return!1}return f.existsSync(l)}function $(l){if(M(l)){let e=v.join(b.tmpdir(),`bba-rd-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{(0,C.execSync)(`copy /Y "${l}" "${e}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});let t=f.readFileSync(e,"utf-8");try{f.unlinkSync(e)}catch{}return t}catch(t){try{f.unlinkSync(e)}catch{}throw t}}return f.readFileSync(l,"utf-8")}function R(l,e){if(M(l)){let t=v.join(b.tmpdir(),`bba-wr-${Date.now()}-${Math.random().toString(36).slice(2,6)}.tmp`);try{f.writeFileSync(t,e,"utf-8"),(0,C.execSync)(`copy /Y "${t}" "${l}"`,{shell:"cmd.exe",stdio:"pipe",timeout:15e3});try{f.unlinkSync(t)}catch{}}catch(n){try{f.unlinkSync(t)}catch{}throw n}return}f.writeFileSync(l,e)}function x(l){if(M(l)){try{(0,C.execSync)(`del /F /Q "${l}"`,{shell:"cmd.exe",stdio:"pipe",timeout:5e3})}catch{}return}f.unlinkSync(l)}function L(l,e){if(M(l)||M(e)){(0,C.execSync)(`move /Y "${l}" "${e}"`,{shell:"cmd.exe",stdio:"pipe",timeout:1e4});return}f.renameSync(l,e)}function U(l){if(M(l))try{return(0,C.execSync)(`dir /b "${l}"`,{shell:"cmd.exe",timeout:1e4}).toString("utf-8").split(/\r?\n/).filter(t=>t.trim().length>0)}catch{return[]}return f.readdirSync(l)}var T=class{syncPath="";serverKey="";backlogPollInterval=null;onBacklogResponse=null;recentBacklogEntries=[];onBacklogArrived=null;onBatchComplete=null;pendingQueue=new Map;flushTimer=null;configure(e,t,n,s,r){this.syncPath=e,this.serverKey=t,this.onBacklogResponse=n,this.onBacklogArrived=s??null,this.onBatchComplete=r??null}get isConfigured(){return!!this.syncPath}get syncPathValue(){return this.syncPath}scanRegisteredClients(){if(!this.isConfigured)return[];let e=v.join(this.syncPath,"clients",this.serverKey);if(!k(e))return[];let t=[];try{let n=U(e).filter(s=>s.endsWith(".json"));for(let s of n)try{let r=JSON.parse($(v.join(e,s)));r.clientKey&&r.clientLabel&&t.push(r)}catch{console.warn(`[ServerFallback] Skipping malformed presence file: ${s}`)}}catch(n){console.warn("[ServerFallback] Error scanning clients dir:",n)}return t}startPolling(e=15e3){this.stopPolling(),this.isConfigured&&(this.pollResultsDir(),this.pollServerBacklog(),this.backlogPollInterval=setInterval(()=>{this.pollResultsDir(),this.pollServerBacklog()},e),console.log(`[ServerFallback] Polling results+backlog every ${e/1e3}s from: ${this.syncPath}`))}stopPolling(){this.backlogPollInterval&&(clearInterval(this.backlogPollInterval),this.backlogPollInterval=null)}stageCommand(e,t,n,s,r){let i=r??`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,o={id:i,clientKey:t,clientLabel:e,command:n,payload:s,timestamp:Date.now(),serverKey:this.serverKey};return this.pendingQueue.has(e)||this.pendingQueue.set(e,[]),this.pendingQueue.get(e).push(o),i}scheduleFlush(){this.flushTimer||(this.flushTimer=setTimeout(()=>{this.flushTimer=null,this.flushPendingQueue()},0))}clearStagedCommands(e){this.pendingQueue.delete(e)}flushPendingQueue(){let e=[],t=[];if(!this.isConfigured||this.pendingQueue.size===0)return{succeeded:e,failed:t};this.flushTimer&&(clearTimeout(this.flushTimer),this.flushTimer=null);let n=v.join(this.syncPath,"queue");z(n);for(let[s,r]of this.pendingQueue)try{let i=v.join(n,`${s}.json`),o=[];if(k(i))try{o=JSON.parse($(i))}catch{o=[]}o.push(...r);let d=i+".tmp";R(d,JSON.stringify(o,null,2));try{L(d,i)}catch{R(i,JSON.stringify(o,null,2));try{x(d)}catch{}}e.push(s),console.log(`[ServerFallback] Flushed ${r.length} command(s) for ${s}`)}catch(i){t.push(s),console.error(`[ServerFallback] Failed to flush queue for ${s}: ${i?.message||i}`)}return this.pendingQueue.clear(),{succeeded:e,failed:t}}enqueueCommand(e,t,n,s,r){if(!this.isConfigured)throw new Error("Sync path is not configured. Set serverMonitor.syncPath in settings.");try{let i=v.join(this.syncPath,"queue");z(i);let o=v.join(i,`${e}.json`),d=[];if(k(o))try{d=JSON.parse($(o))}catch{d=[]}let p=r??`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,m={id:p,clientKey:t,clientLabel:e,command:n,payload:s,timestamp:Date.now(),serverKey:this.serverKey};d.push(m);let c=o+".tmp";R(c,JSON.stringify(d,null,2));try{L(c,o)}catch{R(o,JSON.stringify(d,null,2));try{x(c)}catch{}}return console.log(`[ServerFallback] Enqueued command "${n}" for ${e} \xE2\u2020\u2019 ${o}`),p}catch(i){throw new Error(`Failed to write queue file at "${this.syncPath}\\queue\\${e}.json": ${i?.message||i}`)}}peekQueuedCommands(e){if(!this.isConfigured)return[];let t=v.join(this.syncPath,"queue",`${e}.json`);if(!k(t))return[];try{return JSON.parse($(t))}catch{return[]}}listQueuedClients(){if(!this.isConfigured)return[];let e=v.join(this.syncPath,"queue");return k(e)?U(e).filter(t=>t.endsWith(".json")).map(t=>t.replace(/\.json$/,"")):[]}dequeueCommands(e){if(!this.isConfigured)return[];let t=v.join(this.syncPath,"queue",`${e}.json`);if(!k(t))return[];try{let n=JSON.parse($(t));return x(t),console.log(`[ServerFallback] Dequeued ${n.length} command(s) for ${e}`),n}catch(n){return console.error(`[ServerFallback] Error reading queue for ${e}:`,n),[]}}pollResultsDir(){if(!this.isConfigured||!this.onBacklogResponse)return;let e=0;try{let t=v.join(this.syncPath,"results");if(!k(t))return;let n=U(t).filter(s=>s.endsWith(".json"));for(let s of n){let r=v.join(t,s),i=r+`.lock-${process.pid}`;try{L(r,i)}catch{continue}try{let o=JSON.parse($(i));try{x(i)}catch{}let d=Array.isArray(o)?o:[o];for(let p of d){let m=p.clientLabel||s.replace(/\.json$/,"");console.log(`[ServerFallback] Got live result from ${m}: ${p.command}`),this.onBacklogResponse(m,{...p,channel:"live"}),e++}}catch(o){console.error(`[ServerFallback] Error reading results file ${s}:`,o);try{x(i)}catch{}}}}catch(t){console.error("[ServerFallback] Results poll error:",t)}e>0&&this.onBatchComplete?.()}pollServerBacklog(){if(!this.isConfigured||!this.onBacklogResponse)return;let e=0;try{let t=v.join(this.syncPath,"server-backlog");if(!k(t))return;let n=U(t).filter(r=>r.endsWith(".json")),s=[];for(let r of n){let i=v.join(t,r),o=i+`.lock-${process.pid}`;try{L(i,o)}catch{continue}try{let d=JSON.parse($(o));try{x(o)}catch{}let p=Array.isArray(d)?d:[d];for(let m of p){let c=m.clientLabel||r.replace(/\.json$/,"");console.log(`[ServerFallback] Got server-backlog entry from ${c}: ${m.command}`),s.push({...m,clientLabel:c}),this.onBacklogResponse(c,m),e++}}catch(d){console.error(`[ServerFallback] Error reading backlog file ${r}:`,d);try{x(o)}catch{}}}s.length>0&&(this.recentBacklogEntries.push(...s),this.onBacklogArrived&&this.onBacklogArrived(s))}catch(t){console.error("[ServerFallback] Backlog poll error:",t)}e>0&&this.onBatchComplete?.()}getRecentBacklog(){return this.recentBacklogEntries}clearRecentBacklog(){this.recentBacklogEntries=[]}},E=class{clients=new Map;provider=null;context=null;running=!1;serverId="default";presenceCheckInterval=null;syncScanInterval=null;offlineTimeoutMs=3e5;fallback=new T;pendingIntervalRollbacks=new Map;isScanning=!1;clientReleasePath="";serverPresenceInterval=null;version="1.0.0";cancelledCommandIds=new Set;backlogPollMs=15e3;presenceCheckMs=3e4;syncScanMs=3e4;serverPresenceMs=3e4;clientPollMs=15e3;commandTimeoutMs=12e4;updateDebounceTimer=null;initialize(e){this.context=e,this.version=e.extension?.packageJSON?.version||"1.0.0";let t=h.workspace.getConfiguration("serverMonitor"),n=e.globalState.get("serverKey");this.serverId=n||t.get("serverId")||"default";let s=e.globalState.get("serverIntervals");s&&(s.backlogPollMs&&(this.backlogPollMs=s.backlogPollMs),s.presenceCheckMs&&(this.presenceCheckMs=s.presenceCheckMs),s.syncScanMs&&(this.syncScanMs=s.syncScanMs),s.serverPresenceMs&&(this.serverPresenceMs=s.serverPresenceMs),s.clientPollMs&&(this.clientPollMs=s.clientPollMs),console.log(`[MonitorServer] Restored persisted intervals: backlog=${this.backlogPollMs}, presence=${this.presenceCheckMs}, syncScan=${this.syncScanMs}, serverPresence=${this.serverPresenceMs}, clientPoll=${this.clientPollMs}`)),console.log(`[MonitorServer] Initializing with serverId: ${this.serverId}`),this.loadPersistentClients(),this.setupFallback(),console.log(`[MonitorServer] Loaded ${this.clients.size} persistent clients`)}setupFallback(){let e=h.workspace.getConfiguration("serverMonitor"),t=e.get("syncPath")||"";this.clientReleasePath=e.get("clientReleasePath")||"",t&&(this.fallback.configure(t,this.serverId,(n,s)=>{this.handleBacklogResponse(n,s)},n=>{let s=n.length;h.window.showInformationMessage(`${s} backlog result${s===1?"":"s"} received from offline clients`,"View Backlog").then(r=>{r==="View Backlog"&&this.showBacklogWebview()})},()=>{this.savePersistentClients(),this.flushUpdate()}),this.fallback.startPolling(this.backlogPollMs),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),this.syncScanMs),this.importSyncClients())}async changeServerKey(e){!e||!this.context||(this.removeServerPresenceFile(),this.serverId=e,this.isScanning=!0,this.triggerUpdate(),setImmediate(async()=>{await this.context.globalState.update("serverKey",e),this.running&&this.writeServerPresenceFile("online"),this.clients.clear(),this.loadPersistentClients(),this.setupFallback(),this.isScanning=!1,this.triggerUpdate(),console.log(`[MonitorServer] Server key changed to: ${e}`),h.window.showInformationMessage(`Server key changed to: ${e}`)}))}serverPresenceFilePath(){let e=this.fallback.syncPathValue;return v.join(e,"servers",`${this.serverId}-${b.hostname()}-${process.pid}.json`)}cleanStaleServerPresenceFiles(){if(this.fallback.isConfigured)try{let e=v.join(this.fallback.syncPathValue,"servers");if(!k(e))return;let t=`${this.serverId}-${b.hostname()}-`,n=`${this.serverId}-${b.hostname()}-${process.pid}.json`,s=U(e).filter(r=>r.startsWith(t)&&r.endsWith(".json")&&r!==n);for(let r of s)try{x(v.join(e,r)),console.log(`[MonitorServer] Cleaned stale server presence file: ${r}`)}catch{}}catch(e){console.warn(`[MonitorServer] Could not clean stale server presence files: ${e?.message||e}`)}}writeServerPresenceFile(e){if(this.fallback.isConfigured)try{let t=v.join(this.fallback.syncPathValue,"servers");z(t),this.cleanStaleServerPresenceFiles();let n=this.serverPresenceFilePath(),s=Date.now();if(e==="online"&&k(n))try{let d=JSON.parse($(n));d.status==="online"&&(s=d.startedAt)}catch{}let r=Array.from(this.clients.values()).map(d=>({key:d.key,label:d.clientLabel,status:d.status})),i=b.hostname(),o={key:this.serverId,machine:i,username:b.userInfo().username,version:this.version,clients:r,startedAt:s,lastSeen:Date.now(),status:e};R(n,JSON.stringify(o,null,2)),console.log(`[MonitorServer] Server presence file written (${e}): ${n}`)}catch(t){console.warn(`[MonitorServer] Could not write server presence file: ${t?.message||t}`)}}removeServerPresenceFile(){if(this.fallback.isConfigured)try{let e=this.serverPresenceFilePath();k(e)&&(x(e),console.log(`[MonitorServer] Server presence file removed: ${e}`)),this.cleanStaleServerPresenceFiles()}catch(e){console.warn(`[MonitorServer] Could not remove server presence file: ${e?.message||e}`)}}showBacklogWebview(){let e=a=>String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),t=a=>`<span class="r-badge ${a?"ok":"err"}">${a?"&#10004; ok":"&#10006; err"}</span>`,n=a=>{try{return new Date(a).toLocaleString()}catch{return e(a)}},s=(a,g)=>`<span class="r-key">${e(a)}</span><span class="r-val">${g}</span>`,r=a=>{let g=a.agents||[],u='<div class="r-card"><div class="r-kv">';return u+=s("Status",t(!!a.success)),a.timeframe&&(u+=s("Timeframe",e(a.timeframe))),a.totalEntries!==void 0&&(u+=s("Total entries",`<strong>${e(a.totalEntries)}</strong>`)),a.dateRange?.earliest&&(u+=s("From",e(n(a.dateRange.earliest))),u+=s("To",e(n(a.dateRange.latest)))),u+="</div>",g.length>0?(u+='<table class="r-subtable"><thead><tr><th>Agent</th><th>Count</th><th>%</th></tr></thead><tbody>',g.forEach(S=>{u+=`<tr><td>${e(S.name)}</td><td>${e(S.count)}</td><td>${e(S.percentage)}%</td></tr>`}),u+="</tbody></table>"):u+='<span class="r-none">No agent data for this period.</span>',u+"</div>"},i=a=>{let g='<div class="r-card"><div class="r-kv">';return g+=s("Status",t(!!a.success)),a.installed!==void 0&&(g+=s("Installed",t(!!a.installed))),a.version&&(g+=s("Version",e(a.version))),a.active!==void 0&&(g+=s("Active",t(!!a.active))),a.message&&(g+=s("Message",e(a.message))),g+"</div></div>"},o=a=>{let g='<div class="r-card"><div class="r-kv">';return["hostname","username","os","platform","arch","cpu","memory","vscodeVersion","nodeVersion"].forEach(u=>{a[u]!==void 0&&(g+=s(u,e(a[u])))}),g+"</div></div>"},d=a=>{let g='<div class="r-card"><div class="r-kv">';a.name&&(g+=s("Name",e(a.name))),a.workspace&&(g+=s("Workspace",e(a.workspace)));let u=a.rootPaths||(a.rootPath?[a.rootPath]:[]);return u.length&&(g+=s("Root",e(u.join(", ")))),g+"</div></div>"},p=(a,g)=>{if(g==null)return'<span class="r-none">&mdash;</span>';if(typeof g!="object")return`<pre class="r-pre">${e(String(g))}</pre>`;if(a==="getUsageReport"||a==="generateReport")return r(g);if(a==="checkBBrainy"||a==="forceBBrainy"||a==="showBBrainyStatus")return i(g);if(a==="getSystemInfo")return o(g);if(a==="getWorkspace")return d(g);let u=JSON.stringify(g,null,2);return u.length<300?`<pre class="r-pre">${e(u)}</pre>`:`<details class="r-details"><summary>{ &hellip; } show JSON</summary><pre class="r-pre">${e(u)}</pre></details>`},m=this.fallback.getRecentBacklog(),c={};for(let a of m){let g=a.clientLabel||"unknown";c[g]||(c[g]=[]),c[g].push(a)}let y=h.window.createWebviewPanel("serverBacklog",`Server Backlog (${m.length})`,h.ViewColumn.Beside,{enableScripts:!0}),B=Object.entries(c).map(([a,g])=>{let u=g.map(S=>`<tr>
                <td class="cell time">${e(n(S.timestamp||Date.now()))}</td>
                <td class="cell cmd">${e(S.command||"")}</td>
                <td class="cell result-cell">${p(S.command||"",S.payload??S.result??null)}</td>
            </tr>`).join("");return`<div class="section"><h3>${e(a)}</h3>
            <table><colgroup><col class="col-time"><col class="col-cmd"><col class="col-result"></colgroup>
            <thead><tr><th>Time</th><th>Command</th><th>Result</th></tr></thead>
            <tbody>${u}</tbody></table></div>`}).join(""),P=m.length;y.webview.html=['<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>',":root{color-scheme:dark}","body{background:var(--vscode-editor-background,#1e1e2e);color:var(--vscode-foreground,#cdd6f4);","  font-family:var(--vscode-font-family,ui-sans-serif,system-ui,sans-serif);padding:24px;margin:0}","h2{margin:0 0 4px;font-size:1.1rem}","h3{color:var(--vscode-charts-green,#a6e3a1);font-size:.85rem;border-bottom:1px solid var(--vscode-panel-border,#313244);padding-bottom:6px;margin:0 0 8px}",".section{margin-bottom:28px}","table{width:100%;border-collapse:collapse;table-layout:fixed}","col.col-time{width:140px}col.col-cmd{width:160px}col.col-result{width:auto}","th{text-align:left;font-size:.7rem;color:var(--vscode-descriptionForeground,#6c7086);padding-bottom:6px;font-weight:600;text-transform:uppercase;border-bottom:1px solid var(--vscode-panel-border,#313244)}",".cell{padding:6px 8px 6px 0;vertical-align:top;font-size:.75rem;border-bottom:1px solid var(--vscode-panel-border,#252535)}",".time{color:var(--vscode-descriptionForeground,#a6adc8);white-space:nowrap}",".cmd{color:var(--vscode-textLink-foreground,#89b4fa);font-family:monospace;font-size:.75rem}",".result-cell{color:var(--vscode-foreground,#cdd6f4)}",".r-pre{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.7rem;opacity:.85}",".toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}",".empty{color:var(--vscode-descriptionForeground,#6c7086);font-style:italic;margin-top:20px}","button{background:var(--vscode-button-secondaryBackground,#313244);border:1px solid var(--vscode-panel-border,#45475a);","  color:var(--vscode-button-secondaryForeground,#cdd6f4);padding:5px 14px;border-radius:4px;cursor:pointer;font-size:.8rem}","button:hover{background:var(--vscode-button-secondaryHoverBackground,#45475a)}",".r-card{background:var(--vscode-editor-inactiveSelectionBackground,#2a2a3e);border-radius:6px;padding:8px 10px;font-size:.73rem}",".r-kv{display:grid;grid-template-columns:max-content 1fr;gap:2px 10px;margin-bottom:6px}",".r-key{color:var(--vscode-descriptionForeground,#888);font-weight:600;white-space:nowrap}",".r-val{color:var(--vscode-foreground,#cdd6f4);word-break:break-word}",".r-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:.68rem;font-weight:700}",".r-badge.ok{background:rgba(166,227,161,.15);color:var(--vscode-charts-green,#a6e3a1)}",".r-badge.err{background:rgba(241,76,76,.15);color:var(--vscode-charts-red,#f38ba8)}",".r-subtable{width:100%;border-collapse:collapse;margin-top:6px}",".r-subtable th{font-size:.66rem;color:var(--vscode-descriptionForeground,#888);border-bottom:1px solid var(--vscode-panel-border,#313244);padding:2px 6px 3px 0}",".r-subtable td{font-size:.7rem;padding:2px 6px 2px 0;border-bottom:1px solid var(--vscode-panel-border,#25253a)}",".r-none{opacity:.4}",".r-details summary{font-size:.65rem;color:var(--vscode-textLink-foreground,#89b4fa);cursor:pointer;user-select:none;padding:2px 0}",".r-details .r-pre{margin-top:4px}","</style></head><body>",`<div class="toolbar"><h2>Server Backlog &mdash; ${P} result${P===1?"":"s"}</h2>`,'<button onclick="clearAll()">Clear All</button></div>',P===0?'<p class="empty">No backlog entries.</p>':B,"<script>","const vscode=acquireVsCodeApi();",'function clearAll(){vscode.postMessage({action:"clearBacklog"});}',"</script></body></html>"].join(`
`),y.webview.onDidReceiveMessage(a=>{a.action==="clearBacklog"&&(this.fallback.clearRecentBacklog(),y.dispose(),this.triggerUpdate())})}handleBacklogResponse(e,t){if(t.id&&this.cancelledCommandIds.has(t.id)){this.cancelledCommandIds.delete(t.id),console.log(`[MonitorServer] Suppressed result for cancelled command ${t.id} (${t.command})`);return}let n=(t.clientKey?this.clients.get(t.clientKey):void 0)||Array.from(this.clients.values()).find(d=>d.clientLabel===e);if(!n){console.warn(`[MonitorServer] Response for unknown client: label=${e}, key=${t.clientKey}`);return}let s=t.payload&&t.payload.success===!1&&t.payload.error!==void 0,r=n.commandLog.find(d=>d.id===t.id),i=s?"error":"executed";r?(r.status=i,r.completedAt=Date.now(),r.result=t.payload):n.commandLog.push({id:t.id,command:t.command,status:i,timestamp:t.timestamp||Date.now(),completedAt:Date.now(),result:t.payload}),console.log(`[MonitorServer] Command ${t.id} (${t.command}) \u2192 ${i} [matched=${!!r}, client=${n.key}]`),t.payload!==void 0&&t.payload!==null&&(n.lastResponse={command:t.command,data:t.payload,timestamp:t.timestamp||Date.now()}),n.info||(n.info={}),t.command==="checkBBrainy"&&t.payload&&(n.info.bbrainyStatus=t.payload,this.showBBrainyStatusWebview(n.key)),t.command==="getSystemInfo"&&t.payload?.hostname&&(Object.assign(n.info,{hostname:t.payload.hostname,username:t.payload.username,os:t.payload.os,vscodeVersion:t.payload.vscodeVersion}),t.payload.extensionVersion&&(n.info.version=t.payload.extensionVersion),t.payload.bbrainyStatus&&(n.info.bbrainyStatus=t.payload.bbrainyStatus)),t.command==="getWorkspace"&&t.payload?.workspace&&(n.info.workspace=t.payload.workspace),t.command==="getUsageReport"&&t.payload?.totalEntries!==void 0&&(n.info.lastUsageReport=t.payload,this.showUsageReportWebview(t.payload,n.info?.username||e,n.info?.hostname||"Unknown")),t.command,t.command==="setPollInterval"&&(s?this.revertIntervalIfPending(t.id):(this.pendingIntervalRollbacks.delete(t.id),typeof t.payload?.intervalMs=="number"&&(n.info.pollMs=t.payload.intervalMs))),t.command==="setUpdateCheckInterval"&&(s?this.revertIntervalIfPending(t.id):(this.pendingIntervalRollbacks.delete(t.id),typeof t.payload?.intervalMs=="number"&&(n.info.updateCheckMs=t.payload.intervalMs)));let o=t.channel==="live"?"Live result":"Backlog result";console.log(`[MonitorServer] ${o} from ${e}: ${t.command} -> ${i}`)}importSyncClients(){let e=this.fallback.scanRegisteredClients();if(e.length===0)return;let t=2*60*60*1e3,n=r=>r.status==="inactive"&&Date.now()-r.lastSeen<t?"active":r.status??"active",s=0;for(let r of e){let o=Date.now()-r.lastSeen<12e4;if(this.clients.has(r.clientKey)){let d=this.clients.get(r.clientKey);d.extensionStatus=n(r),d.lastSeen=Math.max(d.lastSeen,r.lastSeen),d.status=o?"sync":"offline",r.version&&d.info&&(d.info.version=r.version);continue}this.clients.set(r.clientKey,{key:r.clientKey,info:{username:r.username,hostname:r.hostname,version:r.version||void 0},lastSeen:r.lastSeen,status:o?"sync":"offline",clientLabel:r.clientLabel,commandLog:[],extensionStatus:n(r)}),console.log(`[MonitorServer] Discovered new client via presence file: ${r.clientLabel} (${r.clientKey})`),s++}s>0&&(this.savePersistentClients(),this.triggerUpdate(),console.log(`[MonitorServer] Imported ${s} new client(s) from sync folder`))}loadPersistentClients(){if(!this.context||!this.serverId){console.warn(`[MonitorServer] Cannot load persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let t=(this.context.globalState.get("persistentAssets")||{})[this.serverId]||[];console.log(`[MonitorServer] Loading ${t.length} persistent clients for serverId: ${this.serverId}`),t.forEach(n=>{this.clients.set(n.key,{...n,ws:null,status:"offline",clientLabel:n.clientLabel||`${n.info?.username||"unknown"}-${n.info?.hostname||"unknown"}`,commandLog:[]})})}restorePendingQueueToLog(){if(!this.fallback.isConfigured)return;let e=this.fallback.listQueuedClients();for(let t of e){let n=Array.from(this.clients.values()).find(r=>r.clientLabel===t);if(!n)continue;let s=this.fallback.peekQueuedCommands(t);for(let r of s)n.commandLog.find(i=>i.id===r.id)||n.commandLog.push({id:r.id,command:r.command,status:"queued",timestamp:r.timestamp});console.log(`[MonitorServer] Restored ${s.length} pending queued command(s) to log for ${t}`)}}deduplicateClients(){let e=new Set,t=[];for(let[n,s]of this.clients){let r=`${s.info?.hostname}:${s.info?.username}`;e.has(r)?(t.push(n),console.log(`[MonitorServer] Found duplicate client: ${n} (${s.info?.username}@${s.info?.hostname})`)):e.add(r)}t.forEach(n=>this.clients.delete(n)),t.length>0&&(this.savePersistentClients(),console.log(`[MonitorServer] Removed ${t.length} duplicate client entries`),h.window.showInformationMessage(`Cleaned up ${t.length} duplicate clients on startup`))}savePersistentClients(){if(!this.context||!this.serverId){console.error(`[MonitorServer] Cannot save persistent clients: context=${!!this.context}, serverId=${this.serverId}`);return}let e=this.context.globalState.get("persistentAssets")||{};e[this.serverId]=Array.from(this.clients.values()).map(t=>({key:t.key,info:t.info,lastSeen:t.lastSeen,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-100)})),this.context.globalState.update("persistentAssets",e),console.debug(`[MonitorServer] Saved ${this.clients.size} clients to persistent storage`)}setProvider(e){this.provider=e}async start(){if(this.running){console.warn("[MonitorServer] Already running, ignoring start request");return}if(!this.context){console.error("[MonitorServer] Cannot start: context not initialized"),h.window.showErrorMessage("Server not initialized with Context");return}let e=h.workspace.getConfiguration("serverMonitor"),t=this.context.globalState.get("serverKey");this.serverId=t||e.get("serverId")||"default",console.log(`[MonitorServer] Starting server with serverId: ${this.serverId}`),this.isScanning=!0,this.flushUpdate(),setImmediate(async()=>{this.clients.clear(),this.loadPersistentClients(),this.deduplicateClients(),this.setupFallback(),this.importSyncClients(),this.restorePendingQueueToLog(),this.running=!0,this.startPresenceCheck(),this.writeServerPresenceFile("online"),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),this.serverPresenceMs),await new Promise(n=>setTimeout(n,600)),this.isScanning=!1,this.triggerUpdate(),console.log(`[MonitorServer] Server started successfully [${this.serverId}]`),h.window.showInformationMessage(`Monitor server [${this.serverId}] running`)})}async scanFleetNow(){!this.running||this.isScanning||(this.isScanning=!0,this.flushUpdate(),setImmediate(async()=>{this.importSyncClients(),this.checkClientPresence(),await new Promise(e=>setTimeout(e,600)),this.isScanning=!1,this.triggerUpdate()}))}startPresenceCheck(){this.presenceCheckInterval&&clearInterval(this.presenceCheckInterval),this.presenceCheckInterval=setInterval(()=>{this.checkClientPresence()},this.presenceCheckMs)}stop(){if(!this.running){console.warn("[MonitorServer] Not running, ignoring stop request");return}console.log("[MonitorServer] Stopping server"),this.presenceCheckInterval&&(clearInterval(this.presenceCheckInterval),this.presenceCheckInterval=null),this.syncScanInterval&&(clearInterval(this.syncScanInterval),this.syncScanInterval=null),this.writeServerPresenceFile("offline"),this.serverPresenceInterval&&(clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=null),this.fallback.stopPolling(),this.running=!1;for(let e of this.clients.values())e.status="offline";this.triggerUpdate(),console.log("[MonitorServer] Server stopped"),h.window.showInformationMessage("Monitor server stopped")}setServerIntervals(e){let t=(n,s,r,i)=>n!==void 0?Math.max(s,Math.min(r,n)):i;this.backlogPollMs=t(e.backlogPollMs,3e3,3e5,this.backlogPollMs),this.presenceCheckMs=t(e.presenceCheckMs,3e3,3e5,this.presenceCheckMs),this.syncScanMs=t(e.syncScanMs,3e3,3e5,this.syncScanMs),this.serverPresenceMs=t(e.serverPresenceMs,3e3,3e5,this.serverPresenceMs),this.running&&(this.fallback.startPolling(this.backlogPollMs),this.syncScanInterval&&clearInterval(this.syncScanInterval),this.syncScanInterval=setInterval(()=>this.importSyncClients(),this.syncScanMs),this.startPresenceCheck(),this.serverPresenceInterval&&clearInterval(this.serverPresenceInterval),this.serverPresenceInterval=setInterval(()=>this.writeServerPresenceFile("online"),this.serverPresenceMs)),console.log(`[MonitorServer] Server intervals updated \u2014 backlog: ${this.backlogPollMs/1e3}s, presence: ${this.presenceCheckMs/1e3}s, sync-scan: ${this.syncScanMs/1e3}s, server-presence: ${this.serverPresenceMs/1e3}s`),this.persistIntervals(),this.triggerUpdate()}persistIntervals(){this.context&&this.context.globalState.update("serverIntervals",{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs})}async setClientPollInterval(e,t,n){let s=Math.max(3e3,Math.min(3e5,t)),r=this.clients.get(e);if(r){r.info||(r.info={});let i=r.info.pollMs;r.info.pollMs=s,this.savePersistentClients();let o=await this.sendCommand(e,"setPollInterval",{intervalMs:s},n);o?this.pendingIntervalRollbacks.set(o,{clientKey:e,field:"pollMs",oldValue:i}):(r.info.pollMs=i,this.savePersistentClients(),this.triggerUpdate())}else await this.sendCommand(e,"setPollInterval",{intervalMs:s},n);s<this.backlogPollMs&&this.setServerIntervals({backlogPollMs:s})}async setClientUpdateCheckInterval(e,t,n){let s=Math.max(6e4,Math.min(864e5,t)),r=this.clients.get(e);if(r){r.info||(r.info={});let i=r.info.updateCheckMs;r.info.updateCheckMs=s,this.savePersistentClients();let o=await this.sendCommand(e,"setUpdateCheckInterval",{intervalMs:s},n);o?this.pendingIntervalRollbacks.set(o,{clientKey:e,field:"updateCheckMs",oldValue:i}):(r.info.updateCheckMs=i,this.savePersistentClients(),this.triggerUpdate())}else await this.sendCommand(e,"setUpdateCheckInterval",{intervalMs:s},n)}revertIntervalIfPending(e){let t=this.pendingIntervalRollbacks.get(e);if(!t)return;this.pendingIntervalRollbacks.delete(e);let n=this.clients.get(t.clientKey);n?.info&&(t.field==="pollMs"?n.info.pollMs=t.oldValue:n.info.updateCheckMs=t.oldValue,console.log(`[MonitorServer] Reverted ${t.field} for ${t.clientKey} back to ${t.oldValue??"default"}`))}getIntervals(){return{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs}}checkClientPresence(){let e=Date.now(),t=[],n=!1,s=new Set;if(this.fallback.isConfigured)try{for(let r of this.fallback.scanRegisteredClients())s.add(r.clientKey)}catch{}for(let[r,i]of this.clients){if(i.status==="sync"&&e-i.lastSeen>2*60*1e3)i.status="offline",console.log(`[MonitorServer] Sync client demoted to offline (stale presence): ${r}`);else if(i.status==="offline"&&e-i.lastSeen>this.offlineTimeoutMs){if(s.has(r))continue;t.push(r),console.log(`[MonitorServer] Removing stale offline client: ${r} (${i.info?.username}@${i.info?.hostname})`)}if(i.commandLog){let o=null,d=()=>{if(o===null&&(o=new Set,this.fallback.isConfigured))try{let p=this.fallback.peekQueuedCommands(i.clientLabel);for(let m of p)o.add(m.id)}catch{}};for(let p of i.commandLog)(p.status==="queued"||p.status==="sent")&&e-p.timestamp>this.commandTimeoutMs&&(d(),o.has(p.id)||(p.status="error",p.completedAt=e,p.result={success:!1,error:"Timed out \u2013 client consumed the command but did not respond"},n=!0,console.log(`[MonitorServer] Command ${p.id} (${p.command}) timed out for ${i.clientLabel}`)))}}if(t.forEach(r=>this.clients.delete(r)),this.cancelledCommandIds.size>500){let r=this.cancelledCommandIds.size-250,i=this.cancelledCommandIds.values();for(let o=0;o<r;o++)this.cancelledCommandIds.delete(i.next().value)}(t.length>0||n)&&(t.length>0&&console.log(`[MonitorServer] Removed ${t.length} stale client(s)`),this.savePersistentClients(),this.triggerUpdate())}showUsageReportWebview(e,t="Unknown",n="Unknown"){try{let s={labels:e.agents.map(i=>i.name),datasets:[{label:"Usage Count",data:e.agents.map(i=>i.count),backgroundColor:["rgba(59, 130, 246, 0.2)","rgba(16, 185, 129, 0.2)","rgba(168, 85, 247, 0.2)","rgba(251, 146, 60, 0.2)","rgba(244, 63, 94, 0.2)","rgba(236, 72, 153, 0.2)"],borderColor:["rgba(59, 130, 246, 1)","rgba(16, 185, 129, 1)","rgba(168, 85, 247, 1)","rgba(251, 146, 60, 1)","rgba(244, 63, 94, 1)","rgba(236, 72, 153, 1)"],borderWidth:2}]},r=h.window.createWebviewPanel("bbrainyUsageReport",`BBrainy Usage: ${e.timeframe}`,h.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});r.webview.html=this.getUsageReportHtml(e,s,t,n),console.log(`[MonitorServer] Opened usage report webview for ${t}@${n}: ${e.timeframe}`)}catch(s){console.error("[MonitorServer] Failed to show usage report:",s),h.window.showErrorMessage(`Failed to show usage report: ${s}`)}}getUsageReportHtml(e,t,n,s){let r=e.agents.map(i=>`<tr>
                <td><span class="agent-name">${i.name}</span></td>
                <td class="count">${i.count}</td>
                <td class="percentage">${i.percentage}%</td>
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
                        <div class="client-info">&#128205; Client: <strong>${n}@${s}</strong></div>
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
                                ${r}
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
        `}async sendCommand(e,t,n,s){let r=this.clients.get(e);if(!r){console.warn(`[MonitorServer] Attempted to send command to non-existent client: ${e}`),h.window.showErrorMessage("Client not found");return}let i=s??`${Date.now()}-${Math.random().toString(36).substring(2,8)}`,o={id:i,command:t,status:"queued",timestamp:Date.now()};if(r.commandLog.push(o),this.triggerUpdate(),!this.fallback.isConfigured){o.status="error",o.completedAt=Date.now();let d="Communication path not configured. Please check serverMonitor.syncPath in settings.";console.error(`[MonitorServer] ${d}`),h.window.showErrorMessage(d),this.savePersistentClients(),this.triggerUpdate();return}return this.fallback.stageCommand(r.clientLabel,e,t,n,i),this.fallback.scheduleFlush(),this.savePersistentClients(),console.log(`[MonitorServer] Staged "${t}" for ${r.clientLabel}`),i}clearClientQueue(e){let t=this.clients.get(e);if(t){for(let n of t.commandLog)this.cancelledCommandIds.add(n.id),this.revertIntervalIfPending(n.id);if(this.fallback.clearStagedCommands(t.clientLabel),this.fallback.isConfigured)try{let n=v.join(this.fallback.syncPathValue,"queue",`${t.clientLabel}.json`);k(n)&&x(n)}catch(n){console.error("[MonitorServer] clearClientQueue: failed to delete queue file",n)}t.commandLog=[],this.savePersistentClients(),this.triggerUpdate()}}clearBacklog(){this.fallback.clearRecentBacklog(),this.triggerUpdate()}cancelQueueEntry(e,t){let n=this.clients.get(e);if(n){if(this.cancelledCommandIds.add(t),this.revertIntervalIfPending(t),this.fallback.isConfigured)try{let s=v.join(this.fallback.syncPathValue,"queue",`${n.clientLabel}.json`);if(k(s)){let i=JSON.parse($(s)).filter(o=>o.id!==t);i.length===0?x(s):R(s,JSON.stringify(i,null,2))}}catch(s){console.error("[MonitorServer] cancelQueueEntry: failed to update queue file",s)}n.commandLog=n.commandLog.filter(s=>s.id!==t),this.savePersistentClients(),this.triggerUpdate()}}async queryAllClients(e){console.log(`[MonitorServer] Broadcasting command to all ${this.clients.size} clients: ${e}`);for(let s of this.clients.keys())await this.sendCommand(s,e);let{succeeded:t,failed:n}=this.fallback.flushPendingQueue();n.length>0&&h.window.showWarningMessage(`Failed to queue command for ${n.length} client(s)`),this.triggerUpdate(),console.log(`[MonitorServer] Broadcast complete: ${t.length} queued, ${n.length} failed`)}getAllClientsInfo(){return Array.from(this.clients.values()).map(e=>({key:e.key,username:e.info?.username||"Unknown",hostname:e.info?.hostname||"Unknown",workspace:e.info?.workspace,bbrainyActive:e.info?.bbrainyStatus?.active||!1,status:e.status,lastSeen:e.lastSeen,onlineStatus:e.status==="sync"?"active":"offline"}))}showAllAssetsWebview(){let e=this.getAllClientsInfo(),t=h.window.createWebviewPanel("allAssets","All Assets",h.ViewColumn.One,{enableScripts:!0});t.webview.html=this.getAllAssetsHtml(e)}getAllAssetsHtml(e){let t=e.map(n=>`
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${n.username}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${n.hostname}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${n.onlineStatus==="active"?"#f59e0b":"#ef4444"};"></span>
                    ${n.onlineStatus}
                </td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">${n.bbrainyActive?"&#10003; Active":"&#10007; Inactive"}</td>
                <td style="padding: 15px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); text-align: center;">${n.lastSeen?new Date(n.lastSeen).toLocaleString():"Never"}</td>
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
                            <div class="stat-value">${e.filter(n=>n.onlineStatus==="active").length}</div>
                            <div class="stat-label">Active (Sync)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${e.filter(n=>n.bbrainyActive).length}</div>
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
        `}showBBrainyStatusWebview(e){let t=this.clients.get(e);if(!t){h.window.showErrorMessage(`Client ${e} not found`);return}let n=t.info?.bbrainyStatus||{installed:!1,active:!1,version:"Unknown",lastUsedTime:"Never",totalUsage:0},s=h.window.createWebviewPanel(`bbrainyStatus-${e}`,`BBrainy Status - ${t.info?.username}@${t.info?.hostname}`,h.ViewColumn.One,{enableScripts:!0});s.webview.html=this.getBBrainyStatusHtml(n,t.info?.username,t.info?.hostname)}getBBrainyStatusHtml(e,t="Unknown",n="Unknown"){let s=e.installed,r=e.active,i=e.version||"Unknown",o=e.lastUsedTime||"Never",d=e.totalUsage||0,p=s?r?"#34d399":"#f59e0b":"#ef4444";return`
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
                        background-color: ${p}20;
                        color: ${p};
                        border: 2px solid ${p};
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
                        <div class="client-name">&#128241; ${t}@${n}</div>
                        <h1>&#129504; BBrainy Status</h1>
                        <div class="status-badge">${s?r?"Active":"Installed - Inactive":"Not Installed"}</div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Installed</div>
                            <div class="stat-value">${s?"&#10003; Yes":"&#10007; No"}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Version</div>
                            <div class="stat-value">${i}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Last Used</div>
                            <div class="stat-value" style="font-size: 14px;">${o}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Usage</div>
                            <div class="stat-value">${d}</div>
                        </div>
                    </div>

                    <div class="contribution-graph">
                        <div class="graph-title">&#128202; Contribution Graph (Last 12 Weeks)</div>
                        <div class="graph-grid">
                            ${Array.from({length:84},(c,y)=>`<div class="graph-cell" style="background: rgba(52, 211, 153, ${Math.random()*.5});"></div>`).join("")}
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; text-align: center;">Green intensity shows activity level</div>
                    </div>
                </div>
            </body>
            </html>
        `}async generateReport(){let e=new Date,t=Array.from(this.clients.values()),n=t.filter(c=>c.status==="sync"),s=t.filter(c=>c.status==="offline"),r=t.filter(c=>c.extensionStatus==="inactive"),i={generatedAt:e.toISOString(),server:{key:this.serverId,machine:b.hostname(),username:b.userInfo().username,version:this.version,running:this.running},summary:{total:t.length,sync:n.length,offline:s.length,inactive:r.length},clients:t.map(c=>({label:c.clientLabel,key:c.key,username:c.info?.username,hostname:c.info?.hostname,workspace:c.info?.workspace,version:c.info?.version,bbrainyActive:c.info?.bbrainyStatus?.active,status:c.status,extensionStatus:c.extensionStatus??"active",lastSeen:new Date(c.lastSeen).toISOString(),pendingCommands:c.commandLog.filter(y=>y.status==="queued"||y.status==="sent").length,lastCommand:c.commandLog.length>0?c.commandLog[c.commandLog.length-1]?.command:null}))},o=JSON.stringify(i,null,2),d={sync:"#f59e0b",offline:"#94a3b8",active:"#22c55e",inactive:"#f97316"},p=t.map(c=>{let y=c.commandLog.filter(P=>P.status==="queued"||P.status==="sent").length,B=c.info?.bbrainyStatus?.active?"#22c55e":"#475569";return`<tr>
                <td><span class="label">${c.clientLabel}</span></td>
                <td>${c.info?.username||"&#8212;"}</td>
                <td>${c.info?.hostname||"&#8212;"}</td>
                <td>${c.info?.version||"&#8212;"}</td>
                <td><span class="badge" style="color:${d[c.status]||"#94a3b8"}">${c.status}</span></td>
                <td><span class="badge" style="color:${d[c.extensionStatus??"active"]||"#94a3b8"}">${c.extensionStatus??"active"}</span></td>
                <td><span style="color:${B};font-size:18px">&#9679;</span></td>
                <td>${y>0?`<span class="badge-warn">${y} pending</span>`:'<span class="badge-ok">0</span>'}</td>
                <td>${new Date(c.lastSeen).toLocaleString()}</td>
            </tr>`}).join(""),m=h.window.createWebviewPanel("serverReport",`Server Report - ${this.serverId}`,h.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});m.webview.onDidReceiveMessage(c=>{c.action==="exportJson"&&h.window.showSaveDialog({defaultUri:h.Uri.file(v.join(b.homedir(),`server-report-${this.serverId}-${Date.now()}.json`)),filters:{JSON:["json"]},title:"Save Server Report"}).then(y=>{if(y)try{f.writeFileSync(y.fsPath,o,"utf-8"),h.window.showInformationMessage(`Report saved to ${y.fsPath}`)}catch(B){h.window.showErrorMessage(`Failed to save: ${B}`)}})}),m.webview.html=`<!DOCTYPE html>
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
  <div class="subtitle">Generated: ${e.toLocaleString()} &nbsp;|&nbsp; Server: <strong>${this.serverId}</strong> on <strong>${b.hostname()}</strong></div>

  <div class="section">
    <h2>Summary</h2>
    <div class="grid">
      <div class="card"><div class="card-label">Total Clients</div><div class="card-value">${t.length}</div></div>
      <div class="card"><div class="card-label">Active (Sync)</div><div class="card-value amber">${n.length}</div></div>
      <div class="card"><div class="card-label">Offline</div><div class="card-value red">${s.length}</div></div>
      <div class="card"><div class="card-label">Uninstalled</div><div class="card-value orange">${r.length}</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Server Info</h2>
    <div class="info-grid">
      <div><div class="info-row"><span class="info-key">Server Key</span><span class="info-val">${this.serverId}</span></div>
           <div class="info-row"><span class="info-key">Machine</span><span class="info-val">${b.hostname()}</span></div>
           <div class="info-row"><span class="info-key">Username</span><span class="info-val">${b.userInfo().username}</span></div>
           <div class="info-row"><span class="info-key">Version</span><span class="info-val">${this.version}</span></div></div>
      <div>
           <div class="info-row"><span class="info-key">Status</span><span class="info-val" style="color:${this.running?"#22c55e":"#f87171"}">${this.running?"Running":"Stopped"}</span></div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Clients (${t.length})</h2>
    <table>
      <thead><tr>
        <th>Label</th><th>User</th><th>Host</th><th>Version</th>
        <th>Sync Status</th><th>Ext Status</th><th>BBrainy</th><th>Queue</th><th>Last Seen</th>
      </tr></thead>
      <tbody>${p||'<tr><td colspan="9" style="text-align:center;color:#475569;padding:20px">No clients registered</td></tr>'}</tbody>
    </table>
  </div>

  <button class="export-btn" onclick="vscode.postMessage({action:'exportJson'})">&#11015; Export as JSON</button>
</div>
<script>const vscode=acquireVsCodeApi();</script>
</body>
</html>`}async publishClientUpdate(){let e=await h.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"VSIX Extension":["vsix"]},title:"Select client extension VSIX to publish"});if(e&&e[0])if(this.clientReleasePath)try{let t=v.join(this.clientReleasePath,"updates");f.mkdirSync(t,{recursive:!0});let n=v.basename(e[0].fsPath);f.copyFileSync(e[0].fsPath,v.join(t,n)),console.log(`[MonitorServer] Published update to client-release: ${n}`),h.window.showInformationMessage(`Update published: ${n}`)}catch(t){console.error("[MonitorServer] Failed to publish update:",t),h.window.showErrorMessage(`Failed to publish update: ${t}`)}else h.window.showErrorMessage("Client release path not configured. Set serverMonitor.clientReleasePath first.")}triggerUpdate(){this.updateDebounceTimer&&clearTimeout(this.updateDebounceTimer),this.updateDebounceTimer=setTimeout(()=>{this.updateDebounceTimer=null,this.flushUpdate()},150)}flushUpdate(){if(this.provider){let e=Array.from(this.clients.values());this.provider.update({serverStatus:{running:this.running,serverId:this.serverId},total:this.clients.size,sync:e.filter(t=>t.status==="sync").length,offline:e.filter(t=>t.status==="offline").length,clients:e.map(t=>({key:t.key,hostname:t.info?.hostname,username:t.info?.username,workspace:t.info?.workspace,bbrainyActive:t.info?.bbrainyStatus?.active,lastSeen:t.lastSeen,status:t.status,clientLabel:t.clientLabel,commandLog:t.commandLog.slice(-100),lastResponse:t.lastResponse,extensionStatus:t.extensionStatus,pollMs:t.info?.pollMs,updateCheckMs:t.info?.updateCheckMs})),backlogCount:this.fallback.getRecentBacklog().length,intervals:{backlogPollMs:this.backlogPollMs,presenceCheckMs:this.presenceCheckMs,syncScanMs:this.syncScanMs,serverPresenceMs:this.serverPresenceMs,clientPollMs:this.clientPollMs},scanning:this.isScanning})}}};var j=I(require("vscode")),F=class{constructor(e,t){this._extensionUri=e;this.server=t}static viewType="monitor-dashboard";_view;resolveWebviewView(e,t,n){this._view=e,e.webview.options={enableScripts:!0,localResourceRoots:[j.Uri.joinPath(this._extensionUri,"dist")]},e.webview.html=this._getWebviewContent(e.webview),e.webview.onDidReceiveMessage(async s=>{switch(s.action){case"sendCommand":await this.server.sendCommand(s.clientKey,s.command,s.payload,s.cmdId);break;case"queryAll":await this.server.queryAllClients(s.command);break;case"scanFleet":await this.server.scanFleetNow();break;case"showAssets":this.server.showAllAssetsWebview(),this._view?.webview.postMessage({type:"actionDone",action:"showAssets"});break;case"showBBrainyStatus":this.server.showBBrainyStatusWebview(s.clientKey);break;case"generateReport":await this.server.generateReport(),this._view?.webview.postMessage({type:"actionDone",action:"generateReport"});break;case"startServer":await this.server.start();break;case"stopServer":this.server.stop();break;case"changeServerKey":await this.server.changeServerKey(s.newKey);break;case"viewBacklog":this.server.showBacklogWebview();break;case"clearBacklog":this.server.clearBacklog();break;case"clearClientQueue":this.server.clearClientQueue(s.clientKey);break;case"cancelQueueEntry":this.server.cancelQueueEntry(s.clientKey,s.entryId);break;case"setServerIntervals":this.server.setServerIntervals(s.intervals);break;case"setClientPollInterval":await this.server.setClientPollInterval(s.clientKey,s.intervalMs,s.cmdId);break;case"setClientUpdateCheckInterval":await this.server.setClientUpdateCheckInterval(s.clientKey,s.intervalMs,s.cmdId);break}}),this.server.triggerUpdate()}update(e){this._view&&this._view.webview.postMessage({type:"update",data:e})}_getWebviewContent(e){let t=_(),n=i=>e.asWebviewUri(j.Uri.joinPath(this._extensionUri,"dist",i)),s=n("monitor-webview.js"),r=n("monitor-webview.css");return`
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
                <link href="${r}" rel="stylesheet">
                <title>Monitor Dashboard</title>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${t}" src="${s}"></script>
            </body>
            </html>
        `}};function _(){let l="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<32;t++)l+=e.charAt(Math.floor(Math.random()*e.length));return l}var D=null;function H(l){let e=new E;D=e,e.initialize(l);let t=new F(l.extensionUri,e);e.setProvider(t),l.subscriptions.push(w.window.registerWebviewViewProvider(F.viewType,t,{webviewOptions:{retainContextWhenHidden:!0}}),w.commands.registerCommand("serverMonitor.start",()=>e.start()),w.commands.registerCommand("serverMonitor.showDashboard",()=>{w.commands.executeCommand("workbench.view.extension.monitor-explorer")}),w.commands.registerCommand("serverMonitor.generateReport",()=>e.generateReport()),w.commands.registerCommand("serverMonitor.publishUpdate",()=>e.publishClientUpdate()),w.commands.registerCommand("serverMonitor.stop",()=>e.stop()),w.commands.registerCommand("serverMonitor.viewBacklog",()=>e.showBacklogWebview())),w.workspace.getConfiguration("serverMonitor").get("autoStart")&&e.start()}function Y(){D?.removeServerPresenceFile(),D=null}0&&(module.exports={activate,deactivate});
