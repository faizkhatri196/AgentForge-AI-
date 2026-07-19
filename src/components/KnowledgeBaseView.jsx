import React, { useState } from 'react';
import { PlusIcon } from './Icons';

export default function KnowledgeBaseView({ addLog }) {
  const [sources, setSources] = useState([
    { id: '1', name: 'OpenAPI Schema Specs', type: 'JSON Schema', size: '142 KB', status: 'Indexed', tokens: 42000, path: '/docs/api-spec.json' },
    { id: '2', name: 'Product Spec Wiki', type: 'Notion Sync', size: '12 Pages', status: 'Indexed', tokens: 84000, path: 'notion.so/agentforge/specs' },
    { id: '3', name: 'React UI Guideline docs', type: 'Local Directory', size: '3.4 MB', status: 'Indexing', tokens: 12000, path: '/src/components/guidelines.md' },
    { id: '4', name: 'FastAPI Backend Readme', type: 'GitHub Webhook', size: '2 KB', status: 'Indexed', tokens: 500, path: 'github.com/agentforge/backend' }
  ]);

  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState('Local File');

  const addSource = (e) => {
    e.preventDefault();
    if (!newSourceName) return;

    const newSrc = {
      id: (sources.length + 1).toString(),
      name: newSourceName,
      type: newSourceType,
      size: '12 KB',
      status: 'Indexed',
      tokens: 1500 + Math.floor(Math.random() * 5000),
      path: `/src/docs/${newSourceName.toLowerCase().replace(/\s+/g, '-')}`
    };

    setSources(prev => [...prev, newSrc]);
    addLog('Knowledge Base', `Successfully ingested semantic source: [${newSourceName}]`, 'success');
    setNewSourceName('');
  };

  return (
    <div className="view-content-wrapper">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Cognitive Knowledge Base</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '2px' }}>
          Ingest static documentation files, connect Notion/GitHub wikis, and manage vector indices used in agent semantic searches.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '20px'
      }}>
        {/* Source List */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Active Knowledge Sources</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sources.map((src) => (
              <div 
                key={src.id}
                className="glass-panel"
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{src.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {src.path} • {src.type}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neon-blue)' }}>
                      {(src.tokens / 1000).toFixed(1)}k tokens
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{src.size}</span>
                  </div>
                  <span className={`badge ${src.status === 'Indexed' ? 'badge-active' : 'badge-paused'}`}>
                    {src.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Source Form */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Ingest New Resource</h3>
          
          <form onSubmit={addSource} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>Source Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Stripe API Specs"
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>Source Type</label>
              <select
                className="input-field"
                value={newSourceType}
                onChange={(e) => setNewSourceType(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <option value="Local File">Local Markdown / PDF Document</option>
                <option value="GitHub Webhook">GitHub Repository Webhook</option>
                <option value="Notion Sync">Notion Page Sync</option>
                <option value="JSON Schema">REST Endpoint URL</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }}>
              <PlusIcon />
              Ingest Document
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
