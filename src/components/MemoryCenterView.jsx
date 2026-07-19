import React, { useState } from 'react';

export default function MemoryCenterView({ addLog }) {
  const [activeTab, setActiveTab] = useState('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.75);
  const [vectorResults, setVectorResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // SVG Knowledge Graph node coordinates
  const graphNodes = [
    { id: '1', label: 'User Persona', x: 200, y: 150, color: 'var(--color-primary)' },
    { id: '2', label: 'OAuth Gateway', x: 380, y: 80, color: 'var(--color-secondary)' },
    { id: '3', label: 'User Table Schema', x: 380, y: 220, color: 'var(--color-primary-container)' },
    { id: '4', label: 'Airbnb API Endpoint', x: 560, y: 80, color: 'var(--color-secondary-container)' },
    { id: '5', label: 'Vector Sync Index', x: 560, y: 220, color: 'var(--color-tertiary)' },
    { id: '6', label: 'Client Front UI', x: 720, y: 150, color: 'var(--color-primary)' }
  ];

  const graphLinks = [
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '4' },
    { source: '3', target: '5' },
    { source: '4', target: '6' },
    { source: '5', target: '6' }
  ];

  const handleSemanticSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setVectorResults([]);

    await new Promise(r => setTimeout(r, 800));

    // Simulated vector embeddings search based on similarity threshold
    const allResults = [
      { doc: `db/schema.sql: CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255)...)`, score: 0.94, category: 'Database Schema' },
      { doc: `api/v1/auth.py: def login_user(credentials): verify_jwt_token(credentials)...`, score: 0.89, category: 'API Controller' },
      { doc: `components/Navbar.jsx: export default function Navbar() { const { user } = useAuth()...`, score: 0.81, category: 'UI Component' },
      { doc: `scripts/seed.js: const seedDb = () => { generateFakeUsers(100)... }`, score: 0.72, category: 'Dev Utility' }
    ];

    const filtered = allResults.filter(r => r.score >= parseFloat(similarityThreshold));
    setVectorResults(filtered);
    setIsSearching(false);
    addLog('Qdrant Vector DB', `Semantic query matches for [${searchQuery}] above ${similarityThreshold} threshold.`, 'success');
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto flex flex-col gap-lg pt-md">
      {/* Header Title */}
      <header className="flex justify-between items-center w-full pb-sm border-b border-white/10">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Cognitive Memory Center</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Inspect agent short-term working context, long-term semantic graphs, and search vector embeddings.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-xs border-b border-white/5">
        <button 
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'graph' 
              ? 'glass-panel border-primary/30 text-primary glow-effect flex items-center gap-2' 
              : 'glass-panel text-on-surface-variant border-white/5 hover:border-white/20'
          }`}
        >
          {activeTab === 'graph' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
          Graph View
        </button>
        <button 
          onClick={() => setActiveTab('vector')}
          className={`px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'vector' 
              ? 'glass-panel border-primary/30 text-primary glow-effect flex items-center gap-2' 
              : 'glass-panel text-on-surface-variant border-white/5 hover:border-white/20'
          }`}
        >
          {activeTab === 'vector' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
          Vector Search
        </button>
      </div>

      {/* Content panel */}
      {activeTab === 'graph' && (
        <div className="glass-panel rounded-xl p-md flex flex-col gap-4">
          <div>
            <h3 className="font-headline-md text-base text-on-surface">Active Agent Entity Knowledge Graph</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Nodes represent semantic concepts loaded into the model context window. Links show functional relationships.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg border border-white/10 h-[320px] flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 850 280">
              {/* Wire connections */}
              {graphLinks.map((link, idx) => {
                const s = graphNodes.find(n => n.id === link.source);
                const t = graphNodes.find(n => n.id === link.target);
                return (
                  <line
                    key={idx}
                    x1={s.x} y1={s.y}
                    x2={t.x} y2={t.y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Node elements */}
              {graphNodes.map((n) => (
                <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                  <circle
                    r="8"
                    fill={n.color}
                    className="agent-pulse"
                    style={{
                      transformBox: 'fill-box',
                      transformOrigin: 'center'
                    }}
                  />
                  <text
                    y="-16"
                    textAnchor="middle"
                    fill="var(--color-on-surface)"
                    className="font-mono-ui text-[11px] font-semibold"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'vector' && (
        <div className="glass-panel rounded-xl p-md flex flex-col gap-md">
          <div>
            <h3 className="font-headline-md text-base text-on-surface">Qdrant Vector Database Sandbox</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Perform semantic cosine-similarity query vector matches against compiled repository files.
            </p>
          </div>

          <form onSubmit={handleSemanticSearch} className="flex flex-col sm:flex-row gap-sm">
            <input
              type="text"
              className="flex-1 bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts like 'authentication flow' or 'database queries'..."
            />
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-container text-on-primary px-lg py-sm rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
              disabled={isSearching}
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Semantic Search
            </button>
          </form>

          {/* Slider range control */}
          <div className="flex flex-col gap-sm p-sm bg-white/5 rounded-lg border border-white/5">
            <div className="flex justify-between items-center text-xs font-mono-ui text-on-surface-variant">
              <span>Similarity Score Threshold</span>
              <span className="text-primary font-bold">{similarityThreshold}</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="0.95" 
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(e.target.value)}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
            />
          </div>

          {isSearching && (
            <div className="flex flex-col gap-sm">
              <div className="h-10 bg-white/5 animate-pulse rounded-lg border border-white/5"></div>
              <div className="h-10 bg-white/5 animate-pulse rounded-lg border border-white/5"></div>
            </div>
          )}

          {!isSearching && vectorResults.length > 0 && (
            <div className="flex flex-col gap-sm">
              {vectorResults.map((r, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-lg p-md flex justify-between items-center">
                  <div className="flex flex-col gap-xs min-w-0 max-w-[80%]">
                    <span className="text-secondary font-mono-ui text-[10px] uppercase tracking-wider">{r.category}</span>
                    <span className="font-mono text-xs text-on-surface truncate">{r.doc}</span>
                  </div>
                  <span className="bg-primary/10 text-primary border border-primary/20 rounded font-mono-ui text-xs px-2 py-1 font-bold">
                    {(r.score * 100).toFixed(0)}% Match
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
