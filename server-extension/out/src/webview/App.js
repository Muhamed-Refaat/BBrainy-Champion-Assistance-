"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const vscode = acquireVsCodeApi();
const GlassCard = ({ children, className = "" }) => (<div className={`liquid-glass liquid-glass-glow rounded-2xl p-6 ${className}`}>
    <div className="relative z-10">{children}</div>
  </div>);
const App = () => {
    const [data, setData] = (0, react_1.useState)({ total: 0, online: 0, offline: 0, clients: [] });
    const [selectedClient, setSelectedClient] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'update') {
                setData(message.data);
            }
        });
    }, []);
    const queryAll = (command) => vscode.postMessage({ action: 'queryAll', command });
    const sendCommand = (clientKey, command, payload) => vscode.postMessage({ action: 'sendCommand', clientKey, command, payload });
    const generateReport = () => vscode.postMessage({ action: 'generateReport' });
    return (<div className="min-h-screen p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Monitor Command Center
          </h1>
          <p className="text-slate-400">Real-time system orchestration & visibility</p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => queryAll('getSystemInfo')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all duration-300">
            <lucide_react_1.RefreshCcw size={18}/> Refresh All
          </button>
          <button onClick={generateReport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all duration-300">
            <lucide_react_1.FileJson size={18}/> Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl"><lucide_react_1.Monitor /></div>
            <div>
              <p className="text-sm text-slate-400">Total Assets</p>
              <h3 className="text-3xl font-bold">{data.total}</h3>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl"><lucide_react_1.Activity /></div>
            <div>
              <p className="text-sm text-slate-400">Active Now</p>
              <h3 className="text-3xl font-bold text-emerald-400">{data.online}</h3>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/20 rounded-xl"><lucide_react_1.Power /></div>
            <div>
              <p className="text-sm text-slate-400">Offline</p>
              <h3 className="text-3xl font-bold text-rose-400">{data.offline}</h3>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content: Dashboard & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Client List (Dashboard) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <lucide_react_1.Globe className="text-blue-400"/> Managed Clients
          </h2>
          <framer_motion_1.AnimatePresence>
            {data.clients.length > 0 ? (data.clients.map((client) => (<framer_motion_1.motion.div key={client.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={() => setSelectedClient(client.key)} className={`cursor-pointer transition-all duration-300 ${selectedClient === client.key ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}>
                  <GlassCard className={selectedClient === client.key ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''}>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${client.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          <lucide_react_1.User size={24}/>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-blue-300">{client.username} <span className="text-slate-500 font-normal">@</span> {client.hostname}</h3>
                          <div className="flex gap-3 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><lucide_react_1.HardDrive size={14}/> {client.status === 'online' ? 'Active connection' : 'Offline'}</span>
                            <span className="flex items-center gap-1"><lucide_react_1.ShieldCheck size={14}/> {client.bbrainyActive ? 'BBrainy Active' : 'BBrainy Inactive'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium mb-1 ${client.status === 'online' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ● {client.status.toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-500">
                          Last seen: {new Date(client.lastSeen).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </framer_motion_1.motion.div>))) : (<GlassCard>
                <div className="text-center py-10 text-slate-500">
                  No managed clients detected. Waiting for connection...
                </div>
              </GlassCard>)}
          </framer_motion_1.AnimatePresence>
        </div>

        {/* Global & Specific Controls */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <lucide_react_1.ShieldCheck className="text-emerald-400"/> Command & Control
          </h2>
          
          <GlassCard>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Selected Node Actions</h3>
            {selectedClient ? (<div className="space-y-3">
                <button onClick={() => sendCommand(selectedClient, 'getSystemInfo')} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <span className="flex items-center gap-3"><lucide_react_1.RefreshCcw size={18}/> Update Info</span>
                </button>
                <button onClick={() => sendCommand(selectedClient, 'forceBBrainy')} className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 text-emerald-400">
                  <span className="flex items-center gap-3"><lucide_react_1.Power size={18}/> Activate BBrainy</span>
                </button>
                <button onClick={() => sendCommand(selectedClient, 'getWorkspace')} className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-blue-400">
                  <span className="flex items-center gap-3"><lucide_react_1.FolderOpen size={18}/> Inspect Workspace</span>
                </button>
                <button onClick={() => sendCommand(selectedClient, 'setAlarm', { intervalMs: 3600000 })} className="w-full flex items-center justify-between p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-colors border border-orange-500/20 text-orange-400">
                  <span className="flex items-center gap-3"><lucide_react_1.Bell size={18}/> Set Health Alert</span>
                </button>
              </div>) : (<div className="text-sm text-slate-500 py-4 italic">
                Select a client from the list to view specific controls
              </div>)}
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Bulk Operations</h3>
            <div className="space-y-3">
               <button onClick={() => queryAll('checkBBrainy')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                Scan Global BBrainy Status
              </button>
              <button onClick={() => queryAll('getSystemInfo')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                Force Fleet Refresh
              </button>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>);
};
exports.default = App;
//# sourceMappingURL=App.js.map