import React, { useState } from 'react';

export default function SettingsView({ addLog }) {
  const [activeTab, setActiveTab] = useState('keys');
  const [keys, setKeys] = useState(() => {
    const saved = localStorage.getItem('agentforge_keys');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        // Fallback to empty defaults
      }
    }
    return {
      gemini: '',
      groq: '',
      langsmith: '',
      mongodb: ''
    };
  });

  const [simConfig, setSimConfig] = useState({
    speed: 'Normal',
    verbose: true,
    autoApprove: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleKeyChange = (provider, val) => {
    setKeys(prev => ({ ...prev, [provider]: val }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    await new Promise(r => setTimeout(r, 600));

    // Save to browser localStorage privately
    localStorage.setItem('agentforge_keys', JSON.stringify(keys));

    setIsSaving(false);
    setSaveSuccess(true);
    addLog('System Config', 'Saved global settings and refreshed environment variables.', 'success');

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="view-content-wrapper bg-background text-on-surface">
      {/* Header */}
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface">Workspace Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Configure API credentials, toggle simulation speeds, and manage database connection URI strings.
        </p>
      </div>

      {/* Grid container with responsive breakpoints */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-lg items-start">
        {/* Left tabs column */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-sm bg-white/[0.01] border border-white/10">
          {[
            { id: 'keys', label: 'AI & DB Keys' },
            { id: 'sim', label: 'Simulation Engine' },
            { id: 'system', label: 'System Custom' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-primary-container/20 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,210,255,0.15)]' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Forms config panel */}
        <form onSubmit={saveSettings} className="glass-panel rounded-xl p-lg flex flex-col gap-md border border-white/10 bg-white/[0.02]">
          {activeTab === 'keys' && (
            <div className="flex flex-col gap-md">
              <h3 className="font-headline-md text-base text-on-surface">API & Database Credentials</h3>
              
              <div className="flex flex-col gap-xs">
                <label className="font-mono-ui text-xs text-on-surface-variant">GOOGLE GEMINI API KEY</label>
                <input
                  type="password"
                  className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  value={keys.gemini}
                  onChange={(e) => handleKeyChange('gemini', e.target.value)}
                  placeholder="Paste Gemini token here..."
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-mono-ui text-xs text-on-surface-variant">GROQ API KEY</label>
                <input
                  type="password"
                  className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  value={keys.groq}
                  onChange={(e) => handleKeyChange('groq', e.target.value)}
                  placeholder="Paste Groq token here..."
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-mono-ui text-xs text-on-surface-variant">LANGSMITH TRACKING KEY</label>
                <input
                  type="password"
                  className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  value={keys.langsmith}
                  onChange={(e) => handleKeyChange('langsmith', e.target.value)}
                  placeholder="Paste Langsmith token here..."
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-mono-ui text-xs text-on-surface-variant">MONGODB CONNECTION STRING</label>
                <input
                  type="text"
                  className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-on-surface focus:outline-none focus:border-primary"
                  value={keys.mongodb}
                  onChange={(e) => handleKeyChange('mongodb', e.target.value)}
                  placeholder="mongodb+srv://..."
                />
              </div>
            </div>
          )}

          {activeTab === 'sim' && (
            <div className="flex flex-col gap-md">
              <h3 className="font-headline-md text-base text-on-surface">Simulation Engine Parameters</h3>

              <div className="flex flex-col gap-xs">
                <label className="font-mono-ui text-xs text-on-surface-variant">EXECUTION SPEED CYCLES</label>
                <select 
                  className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none cursor-pointer"
                  value={simConfig.speed}
                  onChange={(e) => setSimConfig(prev => ({ ...prev, speed: e.target.value }))}
                >
                  <option value="Fast">Fast (600ms cycles)</option>
                  <option value="Normal">Normal (1200ms cycles)</option>
                  <option value="Thorough">Thorough (2000ms cycles)</option>
                </select>
              </div>

              <div className="flex items-center gap-sm mt-sm">
                <input
                  type="checkbox"
                  id="chk-verbose"
                  checked={simConfig.verbose}
                  onChange={(e) => setSimConfig(prev => ({ ...prev, verbose: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="chk-verbose" className="text-sm text-on-surface cursor-pointer select-none">
                  Enable Verbose Log STDOUT stream
                </label>
              </div>

              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="chk-approve"
                  checked={simConfig.autoApprove}
                  onChange={(e) => setSimConfig(prev => ({ ...prev, autoApprove: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="chk-approve" className="text-sm text-on-surface cursor-pointer select-none">
                  Bypass Human Approval Gates (Auto-approve actions)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="flex flex-col gap-md">
              <h3 className="font-headline-md text-base text-on-surface">System Customization</h3>
              <p className="font-body-md text-xs text-on-surface-variant">Manage interface variables and layout states.</p>
              <div className="flex flex-col sm:flex-row gap-sm mt-xs">
                <button 
                  type="button" 
                  onClick={() => addLog('System Config', 'Cleared cached assets and local storage.', 'warning')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer flex-1"
                >
                  Clear Cache
                </button>
                <button 
                  type="button" 
                  onClick={() => addLog('System Config', 'Restored default settings configuration.', 'info')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer flex-1"
                >
                  Restore Defaults
                </button>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex justify-between items-center border-t border-white/5 pt-md mt-md">
            <div>
              {saveSuccess && (
                <span className="text-xs text-[#4ade80] font-semibold flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Configurations Saved Successfully!
                </span>
              )}
            </div>
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-container text-on-primary px-lg py-2 rounded-lg font-bold text-xs cursor-pointer disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
