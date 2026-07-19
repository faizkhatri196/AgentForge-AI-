import React, { useState, useEffect, useRef } from 'react';

export default function DashboardView({
  simulationState,
  startSimulation,
  resetSimulation,
  logs,
  stats,
  activeNode
}) {
  const [prompt, setPrompt] = useState('Build an AI-powered Airbnb clone with vector search and instant booking.');
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Nodes for the flow rendering
  const nodes = [
    { id: 'ceo', name: 'CEO', icon: 'psychology', x: '10%' },
    { id: 'pm', name: 'PM', icon: 'assignment', x: '50%' },
    { id: 'frontend', name: 'Frontend', icon: 'code', x: '90%' }
  ];

  return (
    <div className="flex-1 flex flex-col gap-lg pt-md">
      {/* Simulation controller banner */}
      <div className="glass-panel p-md rounded-xl flex flex-col gap-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,210,255,0.05)] to-transparent pointer-events-none"></div>
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary pulse-dot"></span>
            Launch Autonomous Software Build
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Specify your project vision. The multi-agent operating system will assemble the team, wire workflows, generate repositories, run CI/CD, and deploy.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-sm">
          <input
            type="text"
            className="flex-1 bg-surface-container border border-white/10 rounded-lg px-4 py-2 font-mono-ui text-mono-ui text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={simulationState === 'running'}
            placeholder="What would you like to build today?"
          />
          {simulationState !== 'running' ? (
            <button 
              className="bg-gradient-to-r from-primary to-secondary-container text-on-primary px-lg py-sm rounded-lg font-label-sm text-label-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(165,231,255,0.3)] transition-all active:scale-95 cursor-pointer shrink-0" 
              onClick={() => startSimulation(prompt)}
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Build App
            </button>
          ) : (
            <button 
              className="bg-surface-container border border-error/30 hover:border-error/60 text-error px-lg py-sm rounded-lg font-label-sm text-label-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0" 
              onClick={resetSimulation}
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Reset Build
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg neon-gradient-text mb-xs">Control Room</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">System active and nominal. Monitoring all autonomous agents.</p>
        </div>
        <div className="flex gap-md">
          <div className="glass-panel px-md py-sm rounded-lg flex items-center gap-sm">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot"></div>
            <div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Projects</div>
              <div className="font-headline-md text-headline-md text-on-surface">{stats.activeProjects}</div>
            </div>
          </div>
          <div className="glass-panel px-md py-sm rounded-lg flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">smart_toy</span>
            <div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Running Agents</div>
              <div className="font-headline-md text-headline-md text-on-surface">{simulationState === 'running' ? '9' : '0'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg auto-rows-min">
        {/* Key Metrics Grid (Spans 4 cols on desktop) */}
        <section className="col-span-1 md:col-span-4 grid grid-cols-2 gap-sm">
          <div className="glass-panel p-md rounded-xl flex flex-col justify-between hover:border-white/20 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mb-sm text-xl">payments</span>
            <div className="font-headline-md text-headline-md text-on-surface">${stats.monthlyCost.toFixed(2)}</div>
            <div className="font-mono-ui text-mono-ui text-on-surface-variant">Monthly AI Cost</div>
          </div>
          <div className="glass-panel p-md rounded-xl flex flex-col justify-between hover:border-white/20 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mb-sm text-xl">data_usage</span>
            <div className="font-headline-md text-headline-md text-on-surface">{(stats.tokensUsed / 1000000).toFixed(1)}M</div>
            <div className="font-mono-ui text-mono-ui text-on-surface-variant">Token Usage</div>
          </div>
          <div className="glass-panel p-md rounded-xl flex flex-col justify-between hover:border-white/20 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mb-sm text-xl">rocket_launch</span>
            <div className="font-headline-md text-headline-md text-on-surface">{stats.deploymentSuccess}%</div>
            <div className="font-mono-ui text-mono-ui text-on-surface-variant">Deploy Success</div>
          </div>
          <div className="glass-panel p-md rounded-xl flex flex-col justify-between hover:border-white/20 transition-all">
            <span className="material-symbols-outlined text-primary mb-sm text-xl">monitor_heart</span>
            <div className="font-headline-md text-headline-md text-primary text-glow">100%</div>
            <div className="font-mono-ui text-mono-ui text-on-surface-variant">Gateway Health</div>
          </div>
        </section>

        {/* Live Agents list (Spans 8 cols on desktop) */}
        <section className="col-span-1 md:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col">
          <div className="p-md border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h2 className="font-headline-md text-headline-md text-on-surface">Live Agent Pipeline</h2>
            <span className="font-mono-ui text-mono-ui text-on-surface-variant">Active Instances</span>
          </div>
          <div className="flex-grow p-sm flex flex-col gap-sm overflow-y-auto max-h-[220px]">
            {/* CEO Card */}
            <div className="bg-white/5 rounded-lg p-md flex items-center justify-between border border-transparent hover:border-white/10 transition-colors">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center border border-secondary/20 relative">
                  <span className="material-symbols-outlined text-secondary">psychology</span>
                  {simulationState === 'running' && activeNode === 'ceo' && (
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface agent-pulse shadow-[0_0_10px_rgba(165,231,255,0.5)]"></div>
                  )}
                </div>
                <div>
                  <div className="font-body-lg text-body-lg font-medium text-on-surface">CEO Agent</div>
                  <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">task_alt</span> Spec routing
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full font-mono-ui text-mono-ui text-[11px] flex items-center gap-xs ${simulationState === 'running' && activeNode === 'ceo' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-white/5 text-on-surface-variant'}`}>
                {simulationState === 'running' && activeNode === 'ceo' ? '● Planning' : 'Idle'}
              </span>
            </div>

            {/* PM Card */}
            <div className="bg-white/5 rounded-lg p-md flex items-center justify-between border border-transparent hover:border-white/10 transition-colors">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center border border-primary/20 relative">
                  <span className="material-symbols-outlined text-primary">assignment</span>
                  {simulationState === 'running' && activeNode === 'pm' && (
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface agent-pulse shadow-[0_0_10px_rgba(165,231,255,0.5)]"></div>
                  )}
                </div>
                <div>
                  <div className="font-body-lg text-body-lg font-medium text-on-surface">Product Manager</div>
                  <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">assignment_turned_in</span> Specs drafted
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full font-mono-ui text-mono-ui text-[11px] flex items-center gap-xs ${simulationState === 'running' && activeNode === 'pm' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-white/5 text-on-surface-variant'}`}>
                {simulationState === 'running' && activeNode === 'pm' ? '● Designing' : 'Idle'}
              </span>
            </div>

            {/* Dev Card */}
            <div className="bg-white/5 rounded-lg p-md flex items-center justify-between border border-transparent hover:border-white/10 transition-colors">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center border border-tertiary/20 relative">
                  <span className="material-symbols-outlined text-tertiary">code</span>
                  {simulationState === 'running' && (activeNode === 'frontend' || activeNode === 'backend') && (
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface agent-pulse shadow-[0_0_10px_rgba(165,231,255,0.5)]"></div>
                  )}
                </div>
                <div>
                  <div className="font-body-lg text-body-lg font-medium text-on-surface">Software Engineer</div>
                  <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">code_blocks</span> React & FastAPI
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full font-mono-ui text-mono-ui text-[11px] flex items-center gap-xs ${simulationState === 'running' && (activeNode === 'frontend' || activeNode === 'backend') ? 'bg-secondary/10 border border-secondary/20 text-secondary' : 'bg-white/5 text-on-surface-variant'}`}>
                {simulationState === 'running' && (activeNode === 'frontend' || activeNode === 'backend') ? '● Coding' : 'Idle'}
              </span>
            </div>
          </div>
        </section>

        {/* Active Workflow (Spans 6 cols on desktop) */}
        <section className="col-span-1 md:col-span-6 glass-panel rounded-xl p-md flex flex-col">
          <div className="border-b border-white/5 pb-sm mb-md flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">Active Workflow</h2>
            <span className="font-mono-ui text-mono-ui text-on-surface-variant text-xs">Simulated Run</span>
          </div>
          <div className="flex-grow flex items-center justify-center py-lg relative min-h-[140px]">
            <div className="flex items-center gap-sm w-full max-w-md justify-between px-md">
              {nodes.map((n, idx) => {
                const isActive = simulationState === 'running' && (
                  (n.id === 'ceo' && activeNode === 'ceo') ||
                  (n.id === 'pm' && activeNode === 'pm') ||
                  (n.id === 'frontend' && (activeNode === 'frontend' || activeNode === 'backend' || activeNode === 'delivery'))
                );
                
                return (
                  <React.Fragment key={n.id}>
                    {idx > 0 && (
                      <div className="flex-grow h-px bg-gradient-to-r from-primary/50 to-secondary/30 relative">
                        <div className={`absolute w-1.5 h-1.5 rounded-full bg-white top-1/2 -translate-y-1/2 left-1/2 ${simulationState === 'running' ? 'pulse-dot' : ''}`}></div>
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-xs z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isActive 
                          ? 'bg-surface-container-highest border border-primary text-primary shadow-[0_0_15px_rgba(165,231,255,0.3)]' 
                          : 'bg-surface-container border border-white/10 text-on-surface-variant opacity-60'
                      }`}>
                        <span className="material-symbols-outlined">{n.icon}</span>
                      </div>
                      <span className="font-mono-ui text-mono-ui text-on-surface-variant text-[10px]">{n.name}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Activity Timeline (Spans 6 cols on desktop) */}
        <section className="col-span-1 md:col-span-6 glass-panel rounded-xl p-md flex flex-col">
          <div className="border-b border-white/5 pb-sm mb-md flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h2>
          </div>
          <div className="flex-grow flex flex-col gap-0 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10 z-0"></div>
            
            <div className="flex gap-md py-sm relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface border border-primary/30 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">commit</span>
              </div>
              <div>
                <div className="font-body-md text-body-md text-on-surface">Frontend Agent pushed commit <span className="font-mono-ui text-mono-ui text-primary">8f7d9a1</span></div>
                <div className="font-mono-ui text-mono-ui text-on-surface-variant mt-xs">2 mins ago</div>
              </div>
            </div>
            
            <div className="flex gap-md py-sm relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface border border-secondary/30 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-secondary text-sm">assignment_turned_in</span>
              </div>
              <div>
                <div className="font-body-md text-body-md text-on-surface">CEO Agent approved spec <span className="font-mono-ui text-mono-ui text-secondary">Q3-UI-Revamp</span></div>
                <div className="font-mono-ui text-mono-ui text-on-surface-variant mt-xs">15 mins ago</div>
              </div>
            </div>
            
            <div className="flex gap-md py-sm relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">cloud_upload</span>
              </div>
              <div>
                <div className="font-body-md text-body-md text-on-surface-variant">System auto-scaled gateway resources</div>
                <div className="font-mono-ui text-mono-ui text-on-surface-variant mt-xs">1 hour ago</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Terminal log panel */}
      <div className="glass-panel p-md rounded-xl flex flex-col gap-sm">
        <div className="flex justify-between items-center">
          <span className="font-headline-md text-sm text-on-surface">STDOUT Console Logs</span>
          <span className="font-mono-ui text-xs text-on-surface-variant">Nominal</span>
        </div>
        <div className="terminal-console h-[180px]">
          {logs.length === 0 ? (
            <div className="text-on-surface-variant/50 italic text-xs">
              System standby. Click 'Build App' to launch simulated developer sequence.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex gap-sm text-xs font-mono">
                <span className="text-on-surface-variant">[{log.time}]</span>
                <span className="text-primary font-bold">[{log.agent}]</span>
                <span className={log.type === 'error' ? 'text-error' : log.type === 'success' ? 'text-primary' : 'text-on-surface'}>
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div ref={terminalEndRef}></div>
        </div>
      </div>
    </div>
  );
}
