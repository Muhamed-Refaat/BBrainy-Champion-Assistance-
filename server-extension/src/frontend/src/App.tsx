import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  RefreshCcw, 
  FileJson, 
  ShieldCheck, 
  User, 
  Globe, 
  HardDrive, 
  Activity,
  Power,
  Bell,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

interface Client {
  key: string;
  hostname: string;
  username: string;
  workspace: string;
  bbrainyActive: boolean;
  lastSeen: number;
  status: 'online' | 'offline';
}

interface DashboardData {
  serverStatus: {
    running: boolean;
    port: number;
    serverId: string;
  };
  total: number;
  online: number;
  offline: number;
  clients: Client[];
}

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`liquid-glass liquid-glass-glow rounded-2xl p-6 ${className}`}>
    <div className="relative z-10">{children}</div>
  </div>
);

const App = () => {
  const [data, setData] = useState<DashboardData>({ 
    serverStatus: { running: false, port: 54321, serverId: 'uwb-01' },
    total: 0, 
    online: 0, 
    offline: 0, 
    clients: [] 
  });
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'update') {
        setData(message.data);
      }
    });
  }, []);

  const queryAll = (command: string) => vscode.postMessage({ action: 'queryAll', command });
  const sendCommand = (clientKey: string, command: string, payload?: any) => 
    vscode.postMessage({ action: 'sendCommand', clientKey, command, payload });
  const generateReport = () => vscode.postMessage({ action: 'generateReport' });
  const toggleServer = () => {
    if (data.serverStatus.running) {
      vscode.postMessage({ action: 'stopServer' });
    } else {
      vscode.postMessage({ action: 'startServer' });
    }
  };

  return (
    <div className="min-h-screen p-4 text-white overflow-x-hidden">
      {/* Header - Compact for Sidebar */}
      <div className="mb-6">
          <h1 className="text-xl font-extrabold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Monitor Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${data.serverStatus.running ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <p className="text-[10px] text-slate-400 font-medium">
              {data.serverStatus.running ? `Online: ${data.serverStatus.serverId} on ${data.serverStatus.port}` : `Standalone [${data.serverStatus.serverId}]`}
            </p>
          </div>
      </div>

      {/* Global Controls */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button 
          onClick={toggleServer}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 text-xs font-semibold ${
            data.serverStatus.running 
              ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400' 
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
          }`}
        >
          <Power size={14} /> {data.serverStatus.running ? 'Stop' : 'Start'}
        </button>
        <button 
          onClick={generateReport}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-slate-300 transition-all duration-300 text-xs"
        >
          <FileJson size={14} /> Report
        </button>
      </div>

      {/* Stats Summary - Stacked for Sidebar */}
      <div className="flex flex-col gap-3 mb-6">
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Monitor size={20} /></div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Assets</p>
              <h3 className="text-xl font-bold">{data.total}</h3>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
          <GlassCard>
            <div className="flex flex-col items-center text-center p-1">
              <Activity size={16} className="text-emerald-400 mb-1" />
              <p className="text-[10px] text-slate-500 uppercase">Online</p>
              <h3 className="text-lg font-bold text-emerald-400">{data.online}</h3>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex flex-col items-center text-center p-1">
              <Power size={16} className="text-rose-400 mb-1" />
              <p className="text-[10px] text-slate-500 uppercase">Offline</p>
              <h3 className="text-lg font-bold text-rose-400">{data.offline}</h3>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Sidebar Navigation & Controls */}
      <div className="space-y-6">
        
        {/* Managed Clients List */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
            <Globe size={14} className="text-blue-400" /> Managed Fleet
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {data.clients.length > 0 ? (
                data.clients.map((client) => (
                  <motion.div
                    key={client.key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedClient(client.key)}
                    className={`cursor-pointer transition-all ${
                      selectedClient === client.key ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <GlassCard className={selectedClient === client.key ? 'ring-2 ring-blue-500/50 bg-blue-500/10' : ''}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          client.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs truncate text-blue-300">
                            {client.username} <span className="text-slate-500 font-normal">@</span> {client.hostname}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                             <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                             {client.bbrainyActive ? 'BBrainy Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-white/10 rounded-xl">
                  Waiting for clients...
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

      {/* Selected Client controls */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
            <ShieldCheck size={14} className={`text-emerald-400 ${!data.serverStatus.running ? 'opacity-50' : ''}`} /> Control Center
          </h2>
          
          <GlassCard className={!data.serverStatus.running ? 'opacity-50' : ''}>
            {selectedClient && data.serverStatus.running ? (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 mb-2 truncate">Managing: {data.clients.find(c => c.key === selectedClient)?.username}</p>
                <button 
                  disabled={!data.serverStatus.running}
                  onClick={() => sendCommand(selectedClient, 'getSystemInfo')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2 text-slate-300 tracking-tight leading-none"><RefreshCcw size={14} /> Refresh Node</span>
                </button>
                <button 
                  disabled={!data.serverStatus.running}
                  onClick={() => sendCommand(selectedClient, 'forceBBrainy')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 text-emerald-400 text-xs disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2 tracking-tight leading-none"><Power size={14} /> Wake BBrainy</span>
                </button>
                <button 
                  disabled={!data.serverStatus.running}
                  onClick={() => sendCommand(selectedClient, 'getWorkspace')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-blue-400 text-xs disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2 tracking-tight leading-none"><FolderOpen size={14} /> Peek Directory</span>
                </button>
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 py-2 italic text-center">
                {!data.serverStatus.running ? 'Start server to manage assets' : 'Select a node to authorize actions'}
              </div>
            )}
          </GlassCard>
        </section>

        {/* Fleet Operations */}
        <section className={!data.serverStatus.running ? 'opacity-50 pointer-events-none' : ''}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Global</h2>
          <div className="grid grid-cols-2 gap-2">
             <button 
              disabled={!data.serverStatus.running}
              onClick={() => queryAll('checkBBrainy')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-[10px] text-slate-400 disabled:cursor-not-allowed"
            >
              Scan Fleet
            </button>
            <button 
              disabled={!data.serverStatus.running}
              onClick={() => queryAll('getSystemInfo')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-[10px] text-slate-400 disabled:cursor-not-allowed"
            >
              Check Assets
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
