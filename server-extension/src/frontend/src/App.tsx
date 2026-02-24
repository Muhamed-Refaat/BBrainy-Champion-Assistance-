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
  FolderOpen,
  X
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
  lastResponse?: {
    command: string;
    data: any;
    timestamp: number;
  };
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

interface CommandModal {
  isOpen: boolean;
  command: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    value: string;
    options?: { label: string; value: string }[];
  }[];
}

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`liquid-glass liquid-glass-glow rounded-2xl p-6 ${className}`}>
    <div className="relative z-10">{children}</div>
  </div>
);

const ModalDialog = ({ 
  modal, 
  onClose, 
  onConfirm,
  selectedClient,
  disabled = false,
  setModal
}: { 
  modal: CommandModal, 
  onClose: () => void, 
  onConfirm: () => void,
  selectedClient: string | null,
  disabled?: boolean,
  setModal: (m: CommandModal) => void
}) => {
  if (!modal.isOpen) return null;

  const handleFieldChange = (fieldName: string, value: string) => {
    const newModal = { ...modal };
    const fieldIdx = newModal.fields.findIndex(f => f.name === fieldName);
    if (fieldIdx >= 0) {
      newModal.fields[fieldIdx].value = value;
    }
    setModal(newModal);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-96 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white capitalize">{modal.command.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {modal.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.label}
                    rows={6}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                  >
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.label}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white transition-all font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={disabled || !selectedClient}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 hover:text-blue-300 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [data, setData] = useState<DashboardData>({ 
    serverStatus: { running: false, port: 54321, serverId: 'uwb-01' },
    total: 0, 
    online: 0, 
    offline: 0, 
    clients: [] 
  });
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [modal, setModal] = useState<CommandModal>({
    isOpen: false,
    command: '',
    fields: []
  });

  const openModal = (command: string, fields: CommandModal['fields']) => {
    setModal({ isOpen: true, command, fields });
  };

  const closeModal = () => {
    setModal({ isOpen: false, command: '', fields: [] });
  };

  const sendCommandWithModal = () => {
    if (!selectedClient) return;
    
    const payload: any = {};
    modal.fields.forEach(field => {
      if (field.type === 'number' && field.value) {
        payload[field.name] = parseInt(field.value);
      } else if (field.value) {
        payload[field.name] = field.value;
      }
    });
    
    // Special handling for setNotifier - convert minutes to milliseconds with validation
    if (modal.command === 'setNotifier' && payload.intervalMs) {
      const minutes = payload.intervalMs;
      
      // Validate interval (1-120 minutes)
      if (minutes < 1) {
        vscode.postMessage({ action: 'showError', message: 'Interval must be at least 1 minute' });
        return;
      }
      
      if (minutes > 120) {
        vscode.postMessage({ action: 'showError', message: 'Interval cannot exceed 120 minutes' });
        return;
      }
      
      payload.intervalMs = minutes * 60000; // Convert minutes to milliseconds
    }
    
    sendCommand(selectedClient, modal.command, payload);
    closeModal();
  };

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
                <p className="text-[10px] text-slate-500 mb-3 truncate">Managing: {data.clients.find(c => c.key === selectedClient)?.username}</p>
                
                {/* System Management */}
                <div className="pb-2 border-b border-white/10">
                  <p className="text-[9px] text-slate-600 uppercase font-bold mb-2">System</p>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getSystemInfo')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 text-slate-300"><RefreshCcw size={12} /> Refresh Node</span>
                  </button>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getWorkspace')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 text-slate-300"><FolderOpen size={12} /> Peek Directory</span>
                  </button>
                </div>

                {/* BBrainy Management */}
                <div className="py-2 border-b border-white/10">
                  <p className="text-[9px] text-slate-600 uppercase font-bold mb-2">BBrainy</p>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'forceBBrainy')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 text-emerald-400 text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Power size={12} /> Activate</span>
                  </button>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => {
                      sendCommand(selectedClient, 'checkBBrainy');
                      vscode.postMessage({ action: 'showBBrainyStatus', clientKey: selectedClient });
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 text-emerald-400 text-xs disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Activity size={12} /> Check Status</span>
                  </button>
                </div>

                {/* Usage Analytics */}
                <div className="py-2 border-b border-white/10">
                  <p className="text-[9px] text-slate-600 uppercase font-bold mb-2">Analytics</p>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getUsageReport', { hours: 24 })}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-blue-400 text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={12} /> 24h Report</span>
                  </button>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getUsageReport', { hours: 168 })}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-blue-400 text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={12} /> 7d Report</span>
                  </button>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getUsageReport', {})}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-blue-400 text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={12} /> All Time</span>
                  </button>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => openModal('getUsageReport', [
                      { 
                        name: 'hours', 
                        label: 'Hours (less than 24)', 
                        type: 'number', 
                        value: '1' 
                      }
                    ])}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-blue-400 text-xs disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={12} /> Custom</span>
                  </button>
                </div>

                {/* Notifications */}
                <div className="pt-2">
                  <p className="text-[9px] text-slate-600 uppercase font-bold mb-2">Notifications</p>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => openModal('setNotifier', [
                      { 
                        name: 'intervalMs', 
                        label: 'Interval (1-120 minutes)', 
                        type: 'number', 
                        value: '60' 
                      }
                    ])}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors border border-purple-500/20 text-purple-400 text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Bell size={12} /> Set Reminder</span>
                  </button>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'closeNotifier')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 transition-colors border border-slate-500/20 text-slate-400 text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Bell size={12} /> Close Reminder</span>
                  </button>
                  <button 
                    disabled={!data.serverStatus.running}
                    onClick={() => openModal('displayReminderScreen', [
                      { 
                        name: 'title', 
                        label: 'Title', 
                        type: 'text', 
                        value: 'Important Message' 
                      },
                      { 
                        name: 'body', 
                        label: 'Message Body', 
                        type: 'textarea', 
                        value: 'This is your message content' 
                      }
                    ])}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-colors border border-orange-500/20 text-orange-400 text-xs disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Bell size={12} /> Reminder Screen</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 py-4 italic text-center">
                {!data.serverStatus.running ? 'Start server to manage assets' : 'Select a node to authorize actions'}
              </div>
            )}
            
            {/* Response Display */}
            {selectedClient && data.serverStatus.running && data.clients.find(c => c.key === selectedClient)?.lastResponse && (
              <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px]">
                <p className="text-slate-400 uppercase font-bold mb-2">
                  ↳ {data.clients.find(c => c.key === selectedClient)?.lastResponse?.command} Response
                </p>
                <div className="space-y-1 max-h-48 overflow-y-auto text-slate-300 font-mono">
                  <pre className="whitespace-pre-wrap break-words text-[9px]">
                    {JSON.stringify(data.clients.find(c => c.key === selectedClient)?.lastResponse?.data, null, 2)}
                  </pre>
                </div>
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
              onClick={() => vscode.postMessage({ action: 'showAssets' })}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-[10px] text-slate-400 disabled:cursor-not-allowed"
            >
              Check Assets
            </button>
          </div>
        </section>
      </div>

      <ModalDialog 
        modal={modal}
        onClose={closeModal}
        onConfirm={sendCommandWithModal}
        selectedClient={selectedClient}
        disabled={!data.serverStatus.running}
        setModal={setModal}
      />
    </div>
  );
};

export default App;
