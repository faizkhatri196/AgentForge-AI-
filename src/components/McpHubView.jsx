import React, { useState } from 'react';
import { TerminalIcon } from './Icons';

export default function McpHubView({ addLog }) {
  const [servers, setServers] = useState([
    { id: 'github', name: 'GitHub Integration', status: 'Connected', host: 'github.com', health: 99.9, calls: 4210, tools: ['create_repo', 'push_code', 'open_pr'] },
    { id: 'figma', name: 'Figma Canvas Reader', status: 'Connected', host: 'api.figma.com', health: 98.4, calls: 350, tools: ['get_file_nodes', 'extract_svgs'] },
    { id: 'browser', name: 'Puppeteer Sandbox', status: 'Connected', host: 'localhost:9222', health: 97.2, calls: 1420, tools: ['navigate_url', 'click_element', 'screenshot'] },
    { id: 'filesystem', name: 'Local FileIO Sandbox', status: 'Connected', host: '127.0.0.1:4002', health: 100, calls: 12480, tools: ['read_file', 'write_file', 'list_dir'] },
    { id: 'slack', name: 'Slack Hook Bot', status: 'Connected', host: 'slack.com/api', health: 99.6, calls: 110, tools: ['send_message', 'create_channel'] },
    { id: 'postgres', name: 'PostgreSQL DB Client', status: 'Disconnected', host: 'localhost:5432', health: 0, calls: 0, tools: ['run_query', 'get_tables'] },
    { id: 'redis', name: 'Redis Cache Proxy', status: 'Connected', host: 'localhost:6379', health: 99.9, calls: 8900, tools: ['get_key', 'set_key', 'expire_key'] },
    { id: 'docker', name: 'Docker Daemon API', status: 'Connected', host: '127.0.0.1:2375', health: 99.1, calls: 180, tools: ['run_container', 'list_containers'] },
    { id: 'terminal', name: 'Powershell Sandbox', status: 'Connected', host: 'localhost:4004', health: 99.5, calls: 520, tools: ['execute_cmd', 'get_env'] },
    { id: 'gdrive', name: 'Google Drive Sync', status: 'Disconnected', host: 'googleapis.com', health: 0, calls: 0, tools: ['download_file', 'upload_file'] }
  ]);

  const [activeServer, setActiveServer] = useState('github');

  const toggleConnection = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Connected' ? 'Disconnected' : 'Connected';
    addLog('MCP Hub', `${nextStatus === 'Connected' ? 'Connected to' : 'Disconnected from'} MCP Server: [${name}]`, nextStatus === 'Connected' ? 'success' : 'warning');
    
    setServers(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: nextStatus,
          health: nextStatus === 'Connected' ? 95 + Math.random() * 5 : 0
        };
      }
      return s;
    }));
  };

  const getActiveLogs = () => {
    const server = servers.find(s => s.id === activeServer);
    if (!server || server.status === 'Disconnected') {
      return [`[${new Date().toLocaleTimeString()}] Container offline. Connect server to start event stream.`];
    }
    return [
      `[${new Date().toLocaleTimeString()}] [${server.name}] Initialized host handshake at ${server.host}`,
      `[${new Date().toLocaleTimeString()}] [${server.name}] Registered ${server.tools.length} executable schemas.`,
      `[${new Date().toLocaleTimeString()}] [${server.name}] Operational health check: OK (${server.health}%)`,
      `[${new Date().toLocaleTimeString()}] [${server.name}] Idle loop listening for remote agent JSON-RPC.`,
    ];
  };

  return (
    <div className="view-content-wrapper">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Model Context Protocol (MCP) Hub</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '2px' }}>
          Configure connected sandbox hosts, system execution contexts, and secure API bridges for agent actions.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {servers.map((s) => {
          const isConnected = s.status === 'Connected';
          const isCurrentActive = activeServer === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setActiveServer(s.id)}
              className="glass-panel"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                border: isCurrentActive ? '1px solid var(--neon-purple)' : isConnected ? '1px solid var(--border-light)' : '1px solid rgba(255,255,255,0.03)',
                boxShadow: isCurrentActive ? '0 0 12px rgba(157, 0, 255, 0.15)' : 'none',
                opacity: isConnected ? 1 : 0.65
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</span>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: isConnected ? 'var(--neon-green)' : 'var(--text-muted)',
                  boxShadow: isConnected ? '0 0 8px var(--neon-green)' : 'none'
                }}></span>
              </div>

              {/* Server Host URI */}
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {s.host}
              </span>

              {/* Quick stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Health Check:</span>
                <span style={{ fontWeight: 600, color: isConnected ? 'var(--neon-green)' : 'var(--text-muted)' }}>
                  {isConnected ? `${s.health.toFixed(1)}%` : 'Offline'}
                </span>
              </div>

              {/* Tools tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                {s.tools.map((t, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.62rem',
                    background: 'rgba(157, 0, 255, 0.05)',
                    color: 'var(--neon-purple)',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>{t}</span>
                ))}
              </div>

              {/* Footer switch and connection toggle */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '8px',
                marginTop: '4px'
              }} onClick={(e) => e.stopPropagation()}>
                <span style={{ fontSize: '0.75rem', color: isConnected ? 'var(--neon-blue)' : 'var(--text-muted)' }}>
                  {isConnected ? `${s.calls} calls` : 'Standby'}
                </span>
                <button
                  onClick={() => toggleConnection(s.id, s.name, s.status)}
                  style={{
                    background: isConnected ? 'rgba(255, 0, 123, 0.1)' : 'rgba(57, 255, 20, 0.1)',
                    border: '1px solid transparent',
                    borderColor: isConnected ? 'rgba(255, 0, 123, 0.2)' : 'rgba(57, 255, 20, 0.2)',
                    color: isConnected ? 'var(--neon-pink)' : 'var(--neon-green)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal logs panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalIcon style={{ color: 'var(--neon-purple)', width: '18px', height: '18px' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Active Connection Console Logs</h3>
        </div>
        <div className="terminal-console" style={{ height: '120px', color: 'var(--text-sub)' }}>
          {getActiveLogs().map((l, idx) => (
            <div key={idx}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
