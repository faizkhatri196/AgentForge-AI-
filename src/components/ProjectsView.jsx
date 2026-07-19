import React, { useState } from 'react';
import { ProjectsIcon, PlusIcon } from './Icons';

export default function ProjectsView({ projects, setActiveProject, activeProject }) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="badge badge-active">Completed</span>;
      case 'In Progress': return <span className="badge badge-info pulse-glow-blue">In Progress</span>;
      case 'Failed': return <span className="badge badge-error">Failed</span>;
      default: return <span className="badge badge-paused">Planning</span>;
    }
  };

  return (
    <div className="view-content-wrapper">
      {/* Header Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Project Repositories</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '2px' }}>
            Manage active client pipelines, estimated costs, branches, and agent teams assigned.
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowNewModal(true)}
        >
          <PlusIcon />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px',
        marginTop: '8px'
      }}>
        {projects.map((proj) => {
          const isActive = proj.id === activeProject;
          return (
            <div 
              key={proj.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: isActive ? '1px solid var(--neon-blue)' : '1px solid var(--border-light)',
                boxShadow: isActive ? '0 0 20px rgba(0, 240, 255, 0.15)' : 'none',
                position: 'relative'
              }}
            >
              {/* Highlight Corner active tag */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  fontSize: '0.65rem',
                  color: 'var(--neon-blue)',
                  border: '1px solid var(--neon-blue)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>Active Focus</span>
              )}

              {/* Title & Client */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{proj.name}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Client: {proj.client}</span>
              </div>

              {/* Status & Priority Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {getStatusBadge(proj.status)}
                <span style={{
                  fontSize: '0.75rem',
                  color: proj.priority === 'Critical' ? 'var(--neon-pink)' : proj.priority === 'High' ? 'var(--neon-purple)' : 'var(--text-sub)',
                  fontWeight: 600
                }}>
                  Priority: {proj.priority}
                </span>
              </div>

              {/* Progress Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-sub)' }}>Compilation Progress</span>
                  <span style={{ fontWeight: 600, color: 'var(--neon-blue)' }}>{proj.progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${proj.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px var(--neon-blue-glow)',
                    transition: 'width 0.5s ease-in-out'
                  }}></div>
                </div>
              </div>

              {/* Details Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                padding: '12px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>AI Cost Estim.</span>
                  <span style={{ fontWeight: 600, color: 'var(--neon-pink)' }}>${proj.cost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Agents Allocated</span>
                  <span style={{ fontWeight: 600 }}>{proj.agents} active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GitHub Repository</span>
                  <span style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--neon-blue)', fontSize: '0.72rem' }}>
                    {proj.repo}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button 
                  className="btn-secondary"
                  disabled={isActive}
                  onClick={() => setActiveProject(proj.id)}
                  style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                >
                  {isActive ? 'Current Focus' : 'Switch Focus'}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => window.open(`https://github.com/${proj.repo}`, '_blank')}
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  Repo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Dialog Modal */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{
            padding: '24px',
            width: '400px',
            background: 'rgba(10, 8, 20, 0.95)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Initialize New Build</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>Project Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Uber Clone"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>Client Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Infinity Corp"
                value={newProjClient}
                onChange={(e) => setNewProjClient(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                className="btn-secondary"
                onClick={() => setShowNewModal(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  // Simply dismiss, mock adding behavior in wrapper
                  setShowNewModal(false);
                }}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
