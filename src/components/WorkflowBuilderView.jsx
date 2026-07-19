import React, { useState, useRef } from 'react';

export default function WorkflowBuilderView({ addLog }) {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'Start Trigger', label: 'Webhook / Manual', icon: 'play_arrow', x: 260, y: 30, color: 'var(--color-secondary)' },
    { id: '2', type: 'LLM Planner', label: 'GPT-4 Turbo', icon: 'psychology', x: 260, y: 130, color: 'var(--color-primary)' },
    { id: '3', type: 'GitHub Sync', label: 'Pull repo state', icon: 'code', x: 260, y: 230, color: 'var(--color-tertiary)' },
    { id: '4', type: 'Approval', label: 'Awaiting User', icon: 'gavel', x: 260, y: 330, color: 'var(--color-error)' },
    { id: '5', type: 'Deploy App', label: 'Vercel Production', icon: 'rocket_launch', x: 260, y: 430, color: 'var(--color-primary)' }
  ]);

  const [activeWorkflowNode, setActiveWorkflowNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Dragging logic
  const handleMouseDown = (e, node, idx) => {
    if (e.target.closest('button') || e.target.closest('.port')) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedNode(idx);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (draggedNode === null || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;

    const boundedX = Math.max(10, Math.min(x, canvasRect.width - 270));
    const boundedY = Math.max(10, Math.min(y, canvasRect.height - 85));

    setNodes(prev => prev.map((node, idx) => {
      if (idx === draggedNode) {
        return { ...node, x: boundedX, y: boundedY };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const runWorkflow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    addLog('Workflow Engine', 'Compiling visual pipeline graph...', 'info');

    const sequence = ['1', '2', '3', '4', '5'];
    for (let id of sequence) {
      setActiveWorkflowNode(id);
      const node = nodes.find(n => n.id === id);
      addLog('Workflow Engine', `Executing node [${node.type}] - ${node.label}`, 'info');
      await new Promise(r => setTimeout(r, 1200));
    }
    setActiveWorkflowNode(null);
    setIsRunning(false);
    addLog('Workflow Engine', 'Stitch workflow executed successfully.', 'success');
  };

  return (
    <div className="flex-1 flex flex-col gap-lg pt-md">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary pulse-dot"></span>
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">Active Workflow</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-white">Web App Deployment</h2>
        </div>
        <button 
          onClick={runWorkflow}
          disabled={isRunning}
          className="bg-gradient-to-r from-primary to-secondary-container text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm font-bold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(165,231,255,0.3)] transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          {isRunning ? 'Executing...' : 'Run Flows'}
        </button>
      </div>

      {/* Toolbox & Canvas */}
      <div className="flex flex-col lg:flex-row gap-lg flex-1 min-h-[500px]">
        {/* Toolbox list */}
        <div className="glass-panel p-md rounded-xl w-full lg:w-60 flex flex-col gap-sm h-fit">
          <span className="font-mono-ui text-xs text-on-surface-variant uppercase tracking-wider">Workspace Blocks</span>
          {['Condition', 'Database', 'API endpoint', 'Approval Gate', 'Docker Run'].map((t) => (
            <button
              key={t}
              onClick={() => {
                const id = (nodes.length + 1).toString();
                setNodes(prev => [...prev, {
                  id,
                  type: t,
                  label: 'Custom Config',
                  icon: 'settings',
                  x: 100 + Math.random() * 80,
                  y: 100 + Math.random() * 80,
                  color: 'var(--color-primary)'
                }]);
                addLog('Workflow Engine', `Added new block [${t}] to editor.`, 'info');
              }}
              className="bg-white/5 hover:bg-white/10 text-on-surface py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer w-full text-left"
            >
              <span className="material-symbols-outlined text-xs">add</span>
              {t}
            </button>
          ))}
        </div>

        {/* Draggable Node Editor Canvas */}
        <div 
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="glass-panel rounded-xl flex-1 relative min-h-[520px] overflow-hidden"
          style={{
            background: 'rgba(10, 10, 11, 0.85)',
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        >
          {/* SVG wires connection layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {nodes.map((node, idx) => {
              if (idx === nodes.length - 1) return null;
              const nextNode = nodes[idx + 1];
              
              // Center coords
              const fromX = node.x + 128;
              const fromY = node.y + 70; // Bottom port
              const toX = nextNode.x + 128;
              const toY = nextNode.y; // Top port

              const isFlowing = isRunning && activeWorkflowNode === node.id;

              return (
                <g key={idx}>
                  <path
                    d={`M ${fromX} ${fromY} C ${fromX} ${(fromY + toY) / 2}, ${toX} ${(fromY + toY) / 2}, ${toX} ${toY}`}
                    fill="none"
                    stroke={isFlowing ? 'url(#wire-grad)' : 'rgba(255,255,255,0.08)'}
                    strokeWidth={isFlowing ? '3' : '1.5'}
                    className={isFlowing ? 'connection-line' : ''}
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                </g>
              );
            })}
            <defs>
              <linearGradient id="wire-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Node Cards */}
          {nodes.map((node, idx) => {
            const isActive = activeWorkflowNode === node.id;
            const isErrorState = node.type === 'Approval';

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node, idx)}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  zIndex: 10,
                  cursor: draggedNode === idx ? 'grabbing' : 'grab'
                }}
                className={`glass-panel rounded-xl p-4 w-64 flex items-center gap-4 border ${
                  isActive 
                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(165,231,255,0.3)]' 
                    : isErrorState 
                      ? 'border-error/30 bg-error/5' 
                      : 'border-white/10'
                }`}
              >
                {/* Left logo circle */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border`}
                  style={{
                    backgroundColor: `rgba(255, 255, 255, 0.03)`,
                    borderColor: node.color,
                    color: node.color
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {node.icon}
                  </span>
                </div>

                {/* Node info labels */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-body-md text-body-md text-white font-medium truncate">{node.type}</h3>
                  <p className={`font-mono-ui text-mono-ui text-xs truncate ${isErrorState ? 'text-error/70' : 'text-on-surface-variant/70'}`}>
                    {node.label}
                  </p>
                </div>

                {/* Settings icon */}
                <button className="text-on-surface-variant/50 hover:text-white cursor-pointer">
                  <span className="material-symbols-outlined text-sm">settings</span>
                </button>

                {/* Input port dot */}
                {idx > 0 && (
                  <div className="port absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary"></div>
                )}

                {/* Output port dot */}
                {idx < nodes.length - 1 && (
                  <div className="port absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
