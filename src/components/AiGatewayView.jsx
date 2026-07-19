import React, { useState } from 'react';

export default function AiGatewayView({ addLog }) {
  const [selectedGateway, setSelectedGateway] = useState('auto');
  const [failoverMock, setFailoverMock] = useState(true);

  // Active providers list matching Stitch HTML
  const providers = [
    { id: 'openai', name: 'OpenAI', icon: 'token', status: 'Online', badgeClass: 'bg-[#10b981] agent-pulse', latency: '24ms', cost: '$0.005', glowClass: 'bg-primary/10' },
    { id: 'anthropic', name: 'Anthropic', icon: 'psychology', status: 'Online', badgeClass: 'bg-[#10b981] agent-pulse', latency: '32ms', cost: '$0.003', glowClass: 'bg-secondary/10' },
    { id: 'gemini', name: 'Google Gemini', icon: 'language', status: 'Standby', badgeClass: 'bg-tertiary-fixed-dim', latency: '--', cost: '$0.001', glowClass: 'bg-white/5' },
    { id: 'groq', name: 'Groq', icon: 'bolt', status: failoverMock ? 'Rate Limited' : 'Online', badgeClass: failoverMock ? 'bg-error' : 'bg-[#10b981] agent-pulse', latency: '8ms', cost: '$0.002', glowClass: 'bg-error/10' }
  ];

  const handleAddProvider = () => {
    addLog('AI Gateway', 'Initiating new API provider validation handshake...', 'info');
    setTimeout(() => {
      addLog('AI Gateway', 'Handshake successful. Added provider [Llama Local] on standby.', 'success');
    }, 1000);
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto flex flex-col gap-lg pt-md">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">AI Gateway</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage provider connections and routing logic.</p>
        </div>
        <div className="flex gap-md w-full md:w-auto">
          <button 
            onClick={() => {
              setFailoverMock(!failoverMock);
              addLog('AI Gateway', `Switched routing policy to: ${failoverMock ? 'Latency-first' : 'Cost-first'}.`, 'warning');
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded border border-white/10 hover:border-white/30 text-on-surface font-label-sm text-label-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Routing Policy: {failoverMock ? 'Performance' : 'Cost-Saving'}
          </button>
          <button 
            onClick={handleAddProvider}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-primary/20 to-secondary-container/50 border border-primary/30 text-primary glow-effect font-label-sm text-label-sm transition-all hover:brightness-110 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Provider
          </button>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Active Providers (Spans 8) */}
        <div className="col-span-1 md:col-span-8 space-y-md">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Providers</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {providers.map((p) => (
              <div 
                key={p.id}
                className="glass-card rounded-lg p-md relative overflow-hidden group hover:border-primary/50 border border-white/10 transition-colors bg-white/[0.02] backdrop-blur-md"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${p.glowClass} rounded-bl-full blur-2xl pointer-events-none`}></div>
                
                <div className="flex justify-between items-start mb-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-white/10">
                      <span className={`material-symbols-outlined ${p.id === 'anthropic' ? 'text-secondary' : p.id === 'groq' ? 'text-error' : 'text-primary'}`}>{p.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-body-lg font-semibold text-on-surface">{p.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`w-2 h-2 rounded-full ${p.badgeClass}`}></div>
                        <span className={`font-mono-ui text-mono-ui ${p.status === 'Rate Limited' ? 'text-error' : 'text-on-surface-variant'}`}>{p.status}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-sm mt-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Latency</p>
                    <p className="font-mono-ui text-mono-ui text-on-surface">{p.latency}</p>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Cost / 1k</p>
                    <p className="font-mono-ui text-mono-ui text-on-surface">{p.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fallback Chains Section */}
          <div className="glass-card rounded-lg p-md mt-lg border border-white/10 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-md pb-2 border-b border-white/5">
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Fallback Chains</h3>
              <span className="px-2 py-1 bg-primary/10 text-primary font-mono-ui text-[10px] rounded border border-primary/20">Auto-Routing Active</span>
            </div>
            
            <div className="space-y-4">
              {/* Chain 1 */}
              <div className="flex items-center gap-3 w-full">
                <div className="px-3 py-2 bg-surface-container rounded border border-white/10 flex-1 text-center font-body-md text-body-md text-on-surface relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  GPT-4o
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
                <div className="px-3 py-2 bg-surface-container rounded border border-white/10 flex-1 text-center font-body-md text-body-md text-on-surface">
                  Claude 3.5 Sonnet
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
                <div className="px-3 py-2 bg-surface-container/50 rounded border border-white/5 flex-1 text-center font-body-md text-body-md text-on-surface-variant border-dashed">
                  Gemini Pro
                </div>
              </div>

              {/* Chain 2 */}
              <div className="flex items-center gap-3 w-full">
                <div className="px-3 py-2 bg-surface-container rounded border border-error/30 flex-1 text-center font-body-md text-body-md text-on-surface relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></div>
                  Groq Llama 3
                </div>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
                <div className="px-3 py-2 bg-primary/10 rounded border border-primary/30 flex-1 text-center font-body-md text-body-md text-primary glow-effect">
                  GPT-3.5 Turbo (Local Fallback)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Tracking & Recent Requests (Spans 4) */}
        <div className="col-span-1 md:col-span-4 space-y-md">
          {/* Token Spend Chart */}
          <div className="glass-card rounded-lg p-md border border-white/10 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-sm">Token Spend (7 Days)</h3>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="font-headline-md text-display-lg-mobile text-on-surface font-bold text-2xl">$142.50</span>
              <span className="font-mono-ui text-mono-ui text-[#10b981] mb-1">+12%</span>
            </div>

            {/* Simulated Chart Container */}
            <div className="h-32 w-full border-b border-l border-white/10 relative flex items-end px-1 pb-1 gap-1">
              <div className="w-full bg-primary/20 h-[30%] rounded-t hover:bg-primary/40 transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10 border border-white/10">$12</div>
              </div>
              <div className="w-full bg-primary/30 h-[45%] rounded-t hover:bg-primary/50 transition-colors"></div>
              <div className="w-full bg-primary/40 h-[25%] rounded-t hover:bg-primary/60 transition-colors"></div>
              <div className="w-full bg-primary/50 h-[60%] rounded-t hover:bg-primary/70 transition-colors"></div>
              <div className="w-full bg-primary/60 h-[80%] rounded-t hover:bg-primary/80 transition-colors"></div>
              <div className="w-full bg-primary/70 h-[50%] rounded-t hover:bg-primary/90 transition-colors"></div>
              <div className="w-full bg-primary h-[90%] rounded-t glow-effect relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10 border border-primary/30 text-primary">$45</div>
              </div>
            </div>
            
            <div className="flex justify-between mt-2 font-mono-ui text-[10px] text-on-surface-variant">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="glass-card rounded-lg p-0 overflow-hidden flex flex-col h-[320px] border border-white/10 bg-white/[0.02]">
            <div className="p-md border-b border-white/5 bg-white/[0.01]">
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Recent Requests</h3>
            </div>
            
            <div className="overflow-y-auto flex-1 p-md space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#10b981]">check_circle</span>
                  <div>
                    <p className="font-body-md text-body-md text-on-surface leading-tight">GPT-4o</p>
                    <p className="font-mono-ui text-[10px] text-on-surface-variant">req_8f7d9a</p>
                  </div>
                </div>
                <span className="font-mono-ui text-mono-ui text-on-surface-variant">1.2s</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#10b981]">check_circle</span>
                  <div>
                    <p className="font-body-md text-body-md text-on-surface leading-tight">Claude 3.5</p>
                    <p className="font-mono-ui text-[10px] text-on-surface-variant">req_2b4c1x</p>
                  </div>
                </div>
                <span className="font-mono-ui text-mono-ui text-on-surface-variant">0.8s</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-error">cancel</span>
                  <div>
                    <p className="font-body-md text-body-md text-error leading-tight text-glow">Groq Llama 3</p>
                    <p className="font-mono-ui text-[10px] text-on-surface-variant">req_9p0m2n (HTTP 429)</p>
                  </div>
                </div>
                <span className="font-mono-ui text-mono-ui text-on-surface-variant">--</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">swap_horiz</span>
                  <div>
                    <p className="font-body-md text-body-md text-primary leading-tight">GPT-3.5 (Fallback)</p>
                    <p className="font-mono-ui text-[10px] text-on-surface-variant">req_9p0m2n_fb</p>
                  </div>
                </div>
                <span className="font-mono-ui text-mono-ui text-on-surface-variant">0.4s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
