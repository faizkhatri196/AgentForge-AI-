import React from 'react';

export default function Header({
  activeProject,
  projects,
  setActiveProject,
  selectedProvider,
  setSelectedProvider,
  selectedWorkspace,
  setSelectedWorkspace,
  toggleNotifications,
  unreadCount
}) {
  const providers = [
    { id: 'auto', name: 'Auto Gateway' },
    { id: 'gemini', name: 'Gemini 1.5 Pro' },
    { id: 'openai', name: 'GPT-4o' },
    { id: 'anthropic', name: 'Claude 3.5' }
  ];

  const workspaces = [
    { id: 'dev', name: 'Dev Workspace' },
    { id: 'prod', name: 'Prod Cluster' }
  ];

  return (
    <header className="bg-surface/80 backdrop-blur-xl w-full top-0 sticky border-b border-white/10 shadow-2xl shadow-black/40 flex justify-between items-center px-md py-sm z-50 h-[70px]">
      {/* Brand logo & workspace select */}
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">workspaces</span>
          </div>
          <span className="font-display-lg-mobile text-display-lg-mobile font-bold tracking-tighter text-on-surface hidden md:block">
            AgentForge
          </span>
        </div>

        <div className="hidden lg:block h-6 w-px bg-white/10"></div>

        {/* Project Switcher */}
        <div className="flex flex-col select-none">
          <select
            value={activeProject}
            onChange={(e) => setActiveProject(e.target.value)}
            className="bg-transparent border-none text-primary font-semibold text-sm outline-none cursor-pointer pr-4"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id} className="bg-background text-on-surface">
                {proj.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI gateway selector & notifications */}
      <div className="flex items-center gap-lg">
        {/* Workspace select */}
        <select
          value={selectedWorkspace}
          onChange={(e) => setSelectedWorkspace(e.target.value)}
          className="hidden sm:block bg-transparent border-none text-on-surface text-xs font-medium outline-none cursor-pointer"
        >
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id} className="bg-background text-on-surface">
              {ws.name}
            </option>
          ))}
        </select>

        {/* AI Provider selector */}
        <div className="hidden md:flex items-center gap-xs">
          <span className="text-xs text-on-surface-variant font-mono-ui">Gateway:</span>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg text-xs font-semibold px-2 py-1 text-on-surface focus:outline-none"
          >
            {providers.map((prov) => (
              <option key={prov.id} value={prov.id} className="bg-background text-on-surface">
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notification bell */}
        <button
          onClick={toggleNotifications}
          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-white/5 transition-colors active:scale-95 duration-200 relative cursor-pointer"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 bg-error text-on-error text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(255,180,171,0.5)]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
