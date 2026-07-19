import React, { useState } from 'react';
import { TerminalIcon, PlayIcon, GithubIcon } from './Icons';

export default function GithubView({ addLog }) {
  const [pipelineState, setPipelineState] = useState('standby'); // standby, running, completed
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [pipelineStep, setPipelineStep] = useState(null); // lint, test, security, deploy

  const commits = [
    { sha: '8f7d9a1', msg: 'Merge branch "auth-redesign" into main', author: 'CEO Agent', date: '10m ago' },
    { sha: '6b2a4c1', msg: 'feat: add jwt user session handling', author: 'Backend Eng', date: '30m ago' },
    { sha: 'c4d5e6f', msg: 'style: design glassmorphism details', author: 'UI Designer', date: '1h ago' },
    { sha: 'a1b2c3d', msg: 'fix: align navbar responsive grid', author: 'Frontend Eng', date: '2h ago' }
  ];

  const runPipeline = async () => {
    if (pipelineState === 'running') return;
    setPipelineState('running');
    setPipelineLogs([]);

    const log = (msg) => {
      setPipelineLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    setPipelineStep('lint');
    log('CI/CD pipeline started for branch: [main]...');
    log('Step 1: Running ESLint and Oxlint syntax check...');
    await new Promise(r => setTimeout(r, 800));
    log('ESLint: No errors found. Lint check passed.');
    
    setPipelineStep('test');
    log('Step 2: Spinning up Jest & React Testing Library...');
    await new Promise(r => setTimeout(r, 1000));
    log('Ran 12 unit tests: 12/12 passed (100% success).');

    setPipelineStep('security');
    log('Step 3: Triggering Guardrail SAST security audit...');
    await new Promise(r => setTimeout(r, 900));
    log('PII detection scan: Clean. No private credentials leaked.');
    log('Prompt Injection validation: Passed.');

    setPipelineStep('deploy');
    log('Step 4: Compiling package & deploying build assets to Vercel CDN...');
    await new Promise(r => setTimeout(r, 1200));
    log('Vercel Deploy: SUCCESS.');
    log('Deployment URL: https://agentforge-stage.vercel.app');

    setPipelineStep(null);
    setPipelineState('completed');
    addLog('DevOps Agent', 'CI/CD Pipeline run successful. Project live on Vercel.', 'success');
  };

  return (
    <div className="view-content-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>GitHub & CI/CD Pipelines</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '2px' }}>
            Inspect automated PR commits, code reviews, and trigger cloud deployment triggers.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={runPipeline}
          disabled={pipelineState === 'running'}
        >
          <PlayIcon />
          {pipelineState === 'running' ? 'Running CI/CD...' : 'Trigger Pipeline'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr',
        gap: '20px'
      }}>
        {/* Left Side: Repos & Commits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active branch / repository */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Repo Target</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GithubIcon style={{ color: 'var(--neon-blue)', width: '22px', height: '22px' }} />
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>agentforge/airbnb-clone-v2</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Branch: main • Commit: 8f7d9a1</span>
              </div>
            </div>
          </div>

          {/* Commits List */}
          <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Recent Commits</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {commits.map((c, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  paddingBottom: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{c.msg}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>By {c.author} • {c.date}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neon-blue)' }}>
                    {c.sha}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: CI/CD Pipeline Console */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>CI/CD Pipeline Simulator</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Runs automated code quality validation and deployment routines.</p>
          </div>

          {/* Pipeline flow visual */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            position: 'relative'
          }}>
            {/* Horizontal connection line */}
            <div style={{
              position: 'absolute',
              top: '25px', left: '40px', right: '40px',
              height: '2px', backgroundColor: 'var(--border-light)',
              zIndex: 1
            }}></div>

            {[
              { step: 'lint', name: 'Linting' },
              { step: 'test', name: 'Testing' },
              { step: 'security', name: 'Security' },
              { step: 'deploy', name: 'Deploy' }
            ].map((s, idx) => {
              const isCurrent = pipelineStep === s.step;
              const isPassed = pipelineState === 'completed' || 
                (pipelineStep === 'test' && s.step === 'lint') ||
                (pipelineStep === 'security' && (s.step === 'lint' || s.step === 'test')) ||
                (pipelineStep === 'deploy' && s.step !== 'deploy');

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isPassed ? 'var(--neon-green)' : isCurrent ? 'var(--neon-blue)' : 'rgba(5, 3, 10, 0.9)',
                    border: `1.5px solid ${isCurrent ? 'var(--neon-blue)' : isPassed ? 'var(--neon-green)' : 'var(--border-medium)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: isPassed ? '#030206' : 'var(--text-main)',
                    boxShadow: isCurrent ? '0 0 10px var(--neon-blue)' : isPassed ? '0 0 10px rgba(57, 255, 20, 0.3)' : 'none',
                    fontWeight: 600,
                    transition: 'var(--transition-smooth)'
                  }}>
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: isCurrent ? 'var(--neon-blue)' : isPassed ? 'var(--neon-green)' : 'var(--text-muted)',
                    fontWeight: 500
                  }}>{s.name}</span>
                </div>
              );
            })}
          </div>

          {/* Code compiling terminal console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TerminalIcon style={{ color: 'var(--neon-green)', width: '16px', height: '16px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pipeline Output STDOUT</span>
            </div>
            <div className="terminal-console" style={{ flex: 1, height: '180px' }}>
              {pipelineLogs.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Standby. Trigger the pipeline via the button above to view deployment output.
                </div>
              ) : (
                pipelineLogs.map((l, idx) => (
                  <div key={idx}>{l}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
