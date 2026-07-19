import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const menuItems = [
    { id: 'dashboard', name: 'Control Room', icon: 'dashboard_customize' },
    { id: 'projects', name: 'Projects', icon: 'folder' },
    { id: 'agents', name: 'Agents Roster', icon: 'smart_toy' },
    { id: 'workflow', name: 'Workflow Flows', icon: 'account_tree' },
    { id: 'gateway', name: 'AI Gateway', icon: 'router' },
    { id: 'mcp', name: 'MCP Hub', icon: 'dns' },
    { id: 'memory', name: 'Memory Center', icon: 'database' },
    { id: 'guardrails', name: 'Guardrails', icon: 'gavel' },
    { id: 'knowledge', name: 'Knowledge Base', icon: 'menu_book' },
    { id: 'analytics', name: 'Analytics', icon: 'analytics' },
    { id: 'github', name: 'GitHub Sync', icon: 'code' },
    { id: 'settings', name: 'Settings', icon: 'settings' }
  ];

  return (
    <nav className="hidden md:flex flex-col w-64 gap-sm pt-md border-r border-white/10 h-screen sticky top-0 shrink-0 px-md bg-surface-container-lowest/50 overflow-y-auto no-scrollbar pb-lg">
      {menuItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`w-full flex items-center gap-md px-md py-2.5 rounded-lg transition-all active:scale-95 duration-200 cursor-pointer ${
              isActive 
                ? 'bg-primary-container/20 text-primary ring-1 ring-primary/30 font-bold relative' 
                : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
            }`}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3/4 bg-primary rounded-r-full"></div>
            )}
            <span className={`material-symbols-outlined text-xl ${isActive ? 'fill text-primary' : 'text-on-surface-variant'}`}>
              {item.icon}
            </span>
            <span className="font-label-sm text-xs">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
