import React, { useState } from 'react';
import { CloseIcon } from './Icons';

export default function AgentsView({ agents, setAgents, addLog }) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [search, setSearch] = useState('');

  const toggleAgentStatus = (id) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === 'Working' ? 'Paused' : 'Working';
        addLog(agent.name, `${newStatus === 'Paused' ? 'PAUSED' : 'RESUMED'} execution containers.`, newStatus === 'Paused' ? 'warning' : 'success');
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  const restartAgent = (id, name) => {
    addLog(name, `Restarted Docker cognitive loop and flushed short-term memory block.`, 'warning');
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        return { ...agent, latency: 120 + Math.floor(Math.random() * 200), memory: 0 };
      }
      return agent;
    }));
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto flex flex-col gap-lg pt-md">
      {/* Header section with search & filter controls */}
      <div className="flex flex-col md:flex-row gap-md justify-between items-start md:items-center">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Active Roster</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and monitor your deployed AI engineering team.</p>
        </div>
        <div className="w-full md:w-auto flex gap-sm">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">search</span>
            <input 
              className="w-full bg-surface-container border border-white/10 rounded-lg pl-10 pr-4 py-2 font-mono-ui text-mono-ui text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50" 
              placeholder="Search agents..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-surface-container border border-white/10 hover:border-white/30 text-on-surface px-4 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-2 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="bg-gradient-to-r from-primary to-secondary-container text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm font-bold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(165,231,255,0.3)] transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Deploy</span>
          </button>
        </div>
      </div>

      {/* Grid of Agent cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-md md:gap-lg">
        {filteredAgents.map((agent) => {
          const isWorking = agent.status === 'Working';
          return (
            <div 
              key={agent.id} 
              className="glass-panel rounded-xl overflow-hidden flex flex-col relative group p-md gap-md border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(165,231,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Card Header row */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-primary text-[28px]">{agent.id === 'ceo' ? 'psychology' : agent.id === 'pm' ? 'assignment' : 'code'}</span>
                    {isWorking && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#4ade80] rounded-full border-2 border-surface agent-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-label-sm text-label-sm text-on-surface uppercase font-bold tracking-wider mb-1">{agent.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono-ui text-mono-ui ${isWorking ? 'text-[#4ade80]' : 'text-on-surface-variant'}`}>{agent.status}</span>
                      <span className="text-on-surface-variant/30 text-xs">•</span>
                      <span className="font-mono-ui text-mono-ui text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span> {agent.latency}ms
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              {/* Card Body details */}
              <div className="flex-1 flex flex-col gap-xs text-sm">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-white/5">
                  <span className="text-on-surface-variant font-mono-ui text-xs uppercase tracking-wider">Current Task</span>
                  <span className="col-span-2 text-on-surface font-medium">{agent.task}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-white/5">
                  <span className="text-on-surface-variant font-mono-ui text-xs uppercase tracking-wider">Model Target</span>
                  <span className="col-span-2 text-on-surface font-medium">{agent.model}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-white/5">
                  <span className="text-on-surface-variant font-mono-ui text-xs uppercase tracking-wider">Memory Allocation</span>
                  <span className="col-span-2 text-on-surface font-medium">{agent.memory}% Buffer</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-on-surface-variant font-mono-ui text-xs uppercase tracking-wider">Token Count</span>
                  <span className="col-span-2 text-on-surface font-medium">{(agent.tokens / 1000).toFixed(1)}k tokens</span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-sm border-t border-white/5 pt-md">
                <button 
                  onClick={() => toggleAgentStatus(agent.id)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-on-surface px-3 py-2 rounded-lg font-label-sm text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">{isWorking ? 'pause' : 'play_arrow'}</span>
                  {isWorking ? 'Pause' : 'Resume'}
                </button>
                <button 
                  onClick={() => restartAgent(agent.id, agent.name)}
                  className="bg-white/5 hover:bg-white/10 text-on-surface p-2 rounded-lg transition-all cursor-pointer"
                  title="Flushes local short-term caching"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
                <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg font-label-sm text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Popup Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-300 flex items-center justify-center p-md">
          <div className="glass-panel-heavy rounded-xl p-lg w-full max-w-lg bg-surface flex flex-col gap-md max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-lg text-white">{selectedAgent.name} Context Drawer</h3>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-on-surface-variant hover:text-white cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>
            
            <div className="flex flex-col gap-sm text-sm">
              <span className="text-on-surface-variant font-mono-ui uppercase tracking-wider text-xs">Prompt Context System Instructions</span>
              <div className="bg-black/40 border border-white/10 rounded-lg p-md font-mono text-xs text-on-surface-variant leading-relaxed">
                You are the {selectedAgent.name} agent operating on the AgentForge OS platform. You have write privileges to the code library, and read/write privileges to short-term memory clusters. Under extreme load, fallback models will activate. Maintain low execution latency.
              </div>
            </div>

            <div className="flex flex-col gap-sm text-sm">
              <span className="text-on-surface-variant font-mono-ui uppercase tracking-wider text-xs">Runtime logs</span>
              <div className="terminal-console h-[120px] text-xs">
                <div>[{new Date().toLocaleTimeString()}] [HANDSHAKE] Synced with container host.</div>
                <div>[{new Date().toLocaleTimeString()}] [TELEMETRY] Latency {selectedAgent.latency}ms.</div>
                <div>[{new Date().toLocaleTimeString()}] [SCHEMA] Tools loaded: {selectedAgent.tools.join(', ')}</div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedAgent(null)}
              className="bg-primary hover:bg-primary-container text-on-primary px-lg py-sm rounded-lg font-bold align-self-end mt-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
