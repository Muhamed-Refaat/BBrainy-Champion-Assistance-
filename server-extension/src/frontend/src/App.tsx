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
  X,
  Key,
  Check,
  Timer
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
  status: 'sync' | 'offline';
  clientLabel: string;
  commandLog: Array<{
    id: string;
    command: string;
    status: 'queued' | 'sent' | 'executed' | 'error';
    timestamp: number;
    result?: any;
  }>;
  lastResponse?: {
    command: string;
    data: any;
    timestamp: number;
  };
  extensionStatus?: 'active' | 'inactive';
}

interface DashboardData {
  serverStatus: {
    running: boolean;
    serverId: string;
  };
  total: number;
  sync: number;
  offline: number;
  clients: Client[];
  backlogCount?: number;
  intervals?: {
    backlogPollMs: number;
    presenceCheckMs: number;
    syncScanMs: number;
    serverPresenceMs: number;
    clientPollMs: number;
  };
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
  <div className={`liquid-glass liquid-glass-glow rounded-xl p-4 ${className}`}>
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
        className="fixed inset-0 modal-backdrop flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-96 rounded-xl bg-modal border b-panel shadow-2xl p-5 space-y-4"
          style={{ background: 'var(--modal-bg)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold t-primary capitalize">{modal.command.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors t-muted bg-card-hover"
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {modal.fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-xs font-semibold t-secondary">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.label}
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg vsc-input transition-all text-sm resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg vsc-input transition-all text-sm"
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
                    className="w-full px-3 py-2 rounded-lg vsc-input transition-all text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border b-panel t-secondary transition-all font-medium text-sm bg-card-hover"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={disabled || !selectedClient}
              className="flex-1 px-4 py-2 rounded-lg border tint-blue transition-all font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const statusBadgeClass: Record<string, string> = {
  queued:   'tint-yellow',
  sent:     'tint-blue',
  executed: 'tint-green',
  error:    'tint-red',
};

const CommandQueueLog = ({ log, clientKey }: { log: Client['commandLog'], clientKey: string | null }) => {
  const pending = log.filter(e => e.status === 'queued' || e.status === 'sent');
  const clearAll = () => {
    if (clientKey) vscode.postMessage({ action: 'clearClientQueue', clientKey });
  };
  const cancel = (entryId: string) => {
    if (clientKey) vscode.postMessage({ action: 'cancelQueueEntry', clientKey, entryId });
  };

  if (!log || log.length === 0) {
    return (
      <div className="text-[9px] t-muted italic text-center py-2">No command history</div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] t-warn" style={{ color: pending.length > 0 ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>
          {pending.length > 0 ? `${pending.length} pending` : `${log.length} entries`}
        </span>
        <button
          onClick={clearAll}
          className="text-[8px] px-1.5 py-0.5 rounded border tint-red transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
        {[...log].reverse().map(entry => (
          <div key={entry.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg liquid-glass">
            <span className="text-[9px] t-secondary font-mono truncate flex-1">{entry.command}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded border font-semibold flex-shrink-0 ${statusBadgeClass[entry.status] || ''}`}>
              {entry.status}
            </span>
            {(entry.status === 'queued' || entry.status === 'sent') && (
              <button
                onClick={() => cancel(entry.id)}
                title="Cancel this command"
                className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded tint-red transition-colors"
              >
                <X size={9} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState<DashboardData>({ 
    serverStatus: { running: false, serverId: 'default' },
    total: 0, 
    sync: 0,
    offline: 0, 
    clients: [] 
  });
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState(false);
  const [keyInput, setKeyInput] = useState('');
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
  const startEditingKey = () => {
    setKeyInput(data.serverStatus.serverId);
    setEditingKey(true);
  };
  const saveServerKey = () => {
    const trimmed = keyInput.trim();
    if (trimmed && trimmed !== data.serverStatus.serverId) {
      vscode.postMessage({ action: 'changeServerKey', newKey: trimmed });
    }
    setEditingKey(false);
  };
  // Helpers for button disabled states
  const selectedClientData = selectedClient ? data.clients.find(c => c.key === selectedClient) : null;
  const isClientReachable = selectedClientData?.status === 'sync';


  return (
    <div className="min-h-screen p-4 t-primary overflow-x-hidden">
      {/* Header - Compact for Sidebar */}
      <div className="mb-5">
          <h1 className="text-lg font-extrabold tracking-tight mb-1" style={{ color: 'var(--text-link)' }}>
            Monitor: Command Center
          </h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${data.serverStatus.running ? 'pulse-dot' : ''}`}
              style={{ background: data.serverStatus.running ? 'var(--color-online)' : 'var(--color-offline)' }}
            ></span>
            <p className="text-[10px] t-muted font-medium">
              {data.serverStatus.running ? `Running · ${data.serverStatus.serverId}` : `Stopped [${data.serverStatus.serverId}]`}
            </p>
          </div>
          {/* Server Key Editor */}
          <div className="mt-2 flex items-center gap-1.5">
            <Key size={11} className="t-muted flex-shrink-0" />
            {editingKey ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveServerKey(); if (e.key === 'Escape') setEditingKey(false); }}
                  autoFocus
                  className="flex-1 px-2 py-0.5 rounded vsc-input text-[10px]"
                  placeholder="Server key..."
                />
                <button onClick={saveServerKey} className="p-0.5 rounded t-green transition-colors">
                  <Check size={12} />
                </button>
                <button onClick={() => setEditingKey(false)} className="p-0.5 rounded t-muted transition-colors">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={startEditingKey}
                className="text-[10px] t-muted hover:t-link transition-colors truncate"
                style={{ color: undefined }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-link)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                title="Click to change server key"
              >
                Key: {data.serverStatus.serverId}
              </button>
            )}
          </div>
      </div>

      {/* Global Controls */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          onClick={toggleServer}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-xs font-semibold ${
            data.serverStatus.running ? 'tint-red' : 'tint-green'
          }`}
        >
          <Power size={13} /> {data.serverStatus.running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={generateReport}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border tint-muted transition-all duration-200 text-xs"
        >
          <FileJson size={13} /> Report
        </button>
      </div>

      {/* Stats Summary - Stacked for Sidebar */}
      <div className="flex flex-col gap-2 mb-5">
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg tint-blue" style={{ display: 'inline-flex' }}><Monitor size={18} /></div>
            <div>
              <p className="text-[10px] t-muted uppercase tracking-wider">Total Assets</p>
              <h3 className="text-xl font-bold t-primary">{data.total}</h3>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-2">
          <GlassCard>
            <div className="flex flex-col items-center text-center">
              <RefreshCcw size={15} className="mb-1" style={{ color: '#f59e0b' }} />
              <p className="text-[9px] t-muted uppercase section-label">Active</p>
              <h3 className="text-lg font-bold" style={{ color: '#f59e0b' }}>{data.sync}</h3>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex flex-col items-center text-center">
              <Power size={15} className="mb-1" style={{ color: 'var(--color-offline)' }} />
              <p className="text-[9px] t-muted uppercase section-label">Offline</p>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-offline)' }}>{data.offline}</h3>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Sidebar Navigation & Controls */}
      <div className="space-y-6">
        
        {/* Managed Clients List */}
        <section>
          <h2 className="section-label mb-3 flex items-center gap-2">
            <Globe size={13} style={{ color: 'var(--text-link)' }} /> Managed Fleet
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
                      selectedClient === client.key ? 'scale-[1.01]' : 'hover:scale-[1.005]'
                    }`}
                  >
                    <GlassCard className={selectedClient === client.key ? 'card-selected' : ''}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: client.status === 'sync'
                              ? 'color-mix(in srgb, #f59e0b 15%, transparent)'
                              : 'color-mix(in srgb, var(--text-muted) 12%, transparent)',
                            color: client.status === 'sync'
                              ? '#f59e0b'
                              : 'var(--text-muted)'
                          }}
                        >
                          <User size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs truncate" style={{ color: 'var(--text-link)' }}>
                            {client.username} <span className="t-muted font-normal">@</span> {client.hostname}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[10px] t-muted">
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: client.status === 'sync' ? '#f59e0b' : 'var(--color-offline)' }}
                            ></span>
                            {client.status === 'sync' ? 'Sync' : client.bbrainyActive ? 'BBrainy Active' : 'Inactive'}
                          </div>
                          {client.extensionStatus === 'inactive' && (
                            <span className="text-[8px] tint-orange rounded px-1 mt-0.5 inline-block border">uninstalled</span>
                          )}
                        </div>
                        {(() => {
                          const pending = client.commandLog.filter(e => e.status === 'queued').length;
                          return pending > 0 ? (
                            <span
                              className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-auto"
                              style={{
                                background: 'color-mix(in srgb, #f59e0b 15%, transparent)',
                                color: '#f59e0b',
                                border: '1px solid color-mix(in srgb, #f59e0b 30%, transparent)'
                              }}
                            >
                              {pending} pending
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 t-muted text-xs border border-dashed b-divider rounded-xl">
                  Waiting for clients...
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Selected Client controls */}
        <section>
          <h2 className="section-label mb-3 flex items-center gap-2">
            <ShieldCheck size={13} style={{ color: data.serverStatus.running ? 'var(--color-online)' : 'var(--text-muted)' }} /> Control Center
          </h2>
          
          <GlassCard className={!data.serverStatus.running ? 'opacity-40' : ''}>
            {selectedClient && data.serverStatus.running ? (
              <div className="space-y-2">
                <p className="text-[10px] t-muted mb-2 truncate">Managing: <span className="t-secondary font-semibold">{data.clients.find(c => c.key === selectedClient)?.username}</span></p>

                {/* System Management */}
                <div className="pb-2" style={{ borderBottom: '1px solid var(--divider)' }}>
                  <p className="section-label mb-1.5">System</p>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getSystemInfo')}
                    className="w-full flex items-center p-2 rounded-lg liquid-glass bg-card-hover transition-colors border b-panel text-xs mb-1 disabled:cursor-not-allowed"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <span className="flex items-center gap-2 t-secondary"><RefreshCcw size={11} /> Refresh Node</span>
                  </button>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getWorkspace')}
                    className="w-full flex items-center p-2 rounded-lg liquid-glass transition-colors border b-panel text-xs disabled:cursor-not-allowed"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <span className="flex items-center gap-2 t-secondary"><FolderOpen size={11} /> Peek Directory</span>
                  </button>
                </div>

                {/* BBrainy Management */}
                <div className="py-2" style={{ borderBottom: '1px solid var(--divider)' }}>
                  <p className="section-label mb-1.5">BBrainy</p>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'forceBBrainy')}
                    className="w-full flex items-center p-2 rounded-lg border tint-green transition-colors text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Power size={11} /> Activate</span>
                  </button>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => {
                      sendCommand(selectedClient, 'checkBBrainy');
                      vscode.postMessage({ action: 'showBBrainyStatus', clientKey: selectedClient });
                    }}
                    className="w-full flex items-center p-2 rounded-lg border tint-green transition-colors text-xs disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Activity size={11} /> Check Status</span>
                  </button>
                </div>

                {/* Usage Analytics */}
                <div className="py-2" style={{ borderBottom: '1px solid var(--divider)' }}>
                  <p className="section-label mb-1.5">Analytics</p>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getUsageReport', { hours: 24 })}
                    className="w-full flex items-center p-2 rounded-lg border tint-blue transition-colors text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={11} /> 24h Report</span>
                  </button>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getUsageReport', { hours: 168 })}
                    className="w-full flex items-center p-2 rounded-lg border tint-blue transition-colors text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={11} /> 7d Report</span>
                  </button>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'getUsageReport', {})}
                    className="w-full flex items-center p-2 rounded-lg border tint-blue transition-colors text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={11} /> All Time</span>
                  </button>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => openModal('getUsageReport', [
                      { name: 'hours', label: 'Hours (less than 24)', type: 'number', value: '1' }
                    ])}
                    className="w-full flex items-center p-2 rounded-lg border tint-blue transition-colors text-xs disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><FileJson size={11} /> Custom</span>
                  </button>
                </div>

                {/* Notifications */}
                <div className="pt-2">
                  <p className="section-label mb-1.5">Notifications</p>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => openModal('setNotifier', [
                      { name: 'intervalMs', label: 'Interval (1-120 minutes)', type: 'number', value: '60' }
                    ])}
                    className="w-full flex items-center p-2 rounded-lg border tint-purple transition-colors text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Bell size={11} /> Set Reminder</span>
                  </button>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => sendCommand(selectedClient, 'closeNotifier')}
                    className="w-full flex items-center p-2 rounded-lg border tint-muted transition-colors text-xs mb-1 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Bell size={11} /> Close Reminder</span>
                  </button>
                  <button
                    disabled={!data.serverStatus.running}
                    onClick={() => openModal('displayReminderScreen', [
                      { name: 'title', label: 'Title', type: 'text', value: 'Important Message' },
                      { name: 'body', label: 'Message Body', type: 'textarea', value: 'This is your message content' }
                    ])}
                    className="w-full flex items-center p-2 rounded-lg border tint-orange transition-colors text-xs disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2 leading-none"><Bell size={11} /> Reminder Screen</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-[10px] t-muted py-4 italic text-center">
                {!data.serverStatus.running ? 'Start server to manage assets' : 'Select a node to authorize actions'}
              </div>
            )}
            
            {/* Response Display */}
            {selectedClient && data.serverStatus.running && data.clients.find(c => c.key === selectedClient)?.lastResponse && (
              <div className="mt-3 p-3 rounded-lg liquid-glass text-[10px]" style={{ borderColor: 'var(--border)' }}>
                <p className="section-label mb-2">
                  ↳ {data.clients.find(c => c.key === selectedClient)?.lastResponse?.command} Response
                </p>
                <div className="space-y-1 max-h-48 overflow-y-auto t-secondary font-mono">
                  <pre className="whitespace-pre-wrap break-words text-[9px]">
                    {JSON.stringify(data.clients.find(c => c.key === selectedClient)?.lastResponse?.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Command Queue Log */}
            {selectedClient && (
              <div className="mt-3 p-3 rounded-lg liquid-glass" style={{ borderColor: 'var(--border)' }}>
                <p className="section-label mb-2 flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: 'var(--accent-yellow)',
                      animation: 'pulse-dot 2s ease-in-out infinite'
                    }}
                  ></span>
                  Command Queue
                </p>
                <CommandQueueLog log={data.clients.find(c => c.key === selectedClient)?.commandLog ?? []} clientKey={selectedClient} />
              </div>
            )}
          </GlassCard>
        </section>

        {/* Fleet Operations */}
        <section className={!data.serverStatus.running ? 'opacity-40 pointer-events-none' : ''}>
          <h2 className="section-label mb-3">Global</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={!data.serverStatus.running}
              onClick={() => queryAll('checkBBrainy')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border tint-muted transition-all text-[10px] disabled:cursor-not-allowed"
            >
              Scan Fleet
            </button>
            <button
              disabled={!data.serverStatus.running}
              onClick={() => vscode.postMessage({ action: 'showAssets' })}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border tint-muted transition-all text-[10px] disabled:cursor-not-allowed"
            >
              Check Assets
            </button>
            <button
              onClick={() => vscode.postMessage({ action: 'viewBacklog' })}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border tint-yellow transition-all text-[10px]"
            >
              View Backlog{(data.backlogCount ?? 0) > 0 ? ` (${data.backlogCount})` : ''}
            </button>
            <button
              onClick={() => vscode.postMessage({ action: 'clearBacklog' })}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border tint-red transition-all text-[10px]"
            >
              Clear Backlog
            </button>
          </div>
        </section>

        {/* Sync Tuning — interval controls */}
        <section className={!data.serverStatus.running ? 'opacity-40 pointer-events-none' : ''}>
          <h2 className="section-label mb-3 flex items-center gap-2">
            <Timer size={13} style={{ color: 'var(--text-link)' }} /> Sync Tuning
          </h2>
          <GlassCard>
            {(() => {
              const iv = data.intervals ?? { backlogPollMs: 15000, presenceCheckMs: 30000, syncScanMs: 30000, serverPresenceMs: 30000, clientPollMs: 15000 };
              const presets = [
                { label: 'Fast (3s)', ms: 3000 },
                { label: 'Normal (15s)', ms: 15000 },
                { label: 'Relaxed (30s)', ms: 30000 },
                { label: 'Slow (60s)', ms: 60000 },
              ];
              const setServer = (key: string, ms: number) =>
                vscode.postMessage({ action: 'setServerIntervals', intervals: { [key]: ms } });
              const setClientOne = (ms: number) => {
                if (selectedClient) vscode.postMessage({ action: 'setClientPollInterval', clientKey: selectedClient, intervalMs: ms });
              };
              const setUpdateCheck = (ms: number) => {
                if (selectedClient) vscode.postMessage({ action: 'setClientUpdateCheckInterval', clientKey: selectedClient, intervalMs: ms });
              };
              const updatePresets = [
                { label: '1m', ms: 60000 },
                { label: '30m', ms: 1800000 },
                { label: '1h', ms: 3600000 },
                { label: '6h', ms: 21600000 },
              ];
              const row = (label: string, currentMs: number, onChange: (ms: number) => void) => (
                <div className="flex items-center justify-between gap-2 py-1.5" style={{ borderBottom: '1px solid var(--divider)' }}>
                  <span className="text-[9px] t-secondary font-semibold flex-shrink-0 w-24">{label}</span>
                  <span className="text-[9px] t-muted font-mono w-10 text-right flex-shrink-0">{(currentMs / 1000).toFixed(0)}s</span>
                  <div className="flex gap-1 flex-shrink-0">
                    {presets.map(p => (
                      <button
                        key={p.ms}
                        onClick={() => onChange(p.ms)}
                        className={`text-[7px] px-1.5 py-0.5 rounded border transition-colors ${currentMs === p.ms ? 'tint-blue' : 'tint-muted'}`}
                      >{p.label.split(' ')[0]}</button>
                    ))}
                  </div>
                </div>
              );
              return (
                <div className="space-y-0">
                  <p className="section-label mb-1.5">Server Timers</p>
                  {row('Backlog Poll', iv.backlogPollMs, ms => setServer('backlogPollMs', ms))}
                  {row('Presence Check', iv.presenceCheckMs, ms => setServer('presenceCheckMs', ms))}
                  {row('Sync Scan', iv.syncScanMs, ms => setServer('syncScanMs', ms))}
                  {selectedClient && (
                    <div className="pt-2 mt-1">
                      <p className="section-label mb-1.5">Selected Client</p>
                      {row('Poll Interval', iv.clientPollMs, setClientOne)}
                      <div className="flex items-center justify-between gap-2 py-1.5" style={{ borderBottom: '1px solid var(--divider)' }}>
                        <span className="text-[9px] t-secondary font-semibold flex-shrink-0 w-24">Update Check</span>
                        <span className="text-[9px] t-muted font-mono w-10 text-right flex-shrink-0">{((iv.updateCheckMs || 3600000) / 60000).toFixed(0)}m</span>
                        <div className="flex gap-1 flex-shrink-0">
                          {updatePresets.map(p => (
                            <button
                              key={p.ms}
                              onClick={() => setUpdateCheck(p.ms)}
                              className={`text-[7px] px-1.5 py-0.5 rounded border transition-colors ${(iv.updateCheckMs || 3600000) === p.ms ? 'tint-blue' : 'tint-muted'}`}
                            >{p.label}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </GlassCard>
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
