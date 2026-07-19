import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import Chatbot from './components/Chatbot';

// View Imports
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import AgentsView from './components/AgentsView';
import WorkflowBuilderView from './components/WorkflowBuilderView';
import AiGatewayView from './components/AiGatewayView';
import McpHubView from './components/McpHubView';
import MemoryCenterView from './components/MemoryCenterView';
import GuardrailsView from './components/GuardrailsView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import AnalyticsView from './components/AnalyticsView';
import GithubView from './components/GithubView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeProject, setActiveProject] = useState('airbnb');
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [selectedWorkspace, setSelectedWorkspace] = useState('dev');
  const [showNotifications, setShowNotifications] = useState(false);

  // Global Session Stats
  const [stats, setStats] = useState({
    activeProjects: 3,
    tokensUsed: 12480500,
    monthlyCost: 214.85,
    deploymentSuccess: 98.4,
    avgResponseTime: 410
  });

  // Projects list
  const [projects, setProjects] = useState([
    { id: 'airbnb', name: 'Airbnb Vector Clone', client: 'Alpha Ventures', status: 'In Progress', priority: 'High', progress: 45, cost: 74.20, agents: 9, repo: 'agentforge/airbnb-vector-clone' },
    { id: 'payment', name: 'Stripe Gateway Wrapper', client: 'Stripe Integration Team', status: 'Completed', priority: 'Critical', progress: 100, cost: 124.50, agents: 0, repo: 'agentforge/stripe-gateway-mcp' },
    { id: 'eval', name: 'LLM Benchmarking Suite', client: 'Internal Lab', status: 'Planning', priority: 'Low', progress: 10, cost: 16.15, agents: 1, repo: 'agentforge/llm-benchmark-eval' }
  ]);

  // AI Employees list
  const [agents, setAgents] = useState([
    { id: 'ceo', name: 'CEO Agent', role: 'Executive Architect', avatar: '👔', status: 'Working', model: 'Gemini 1.5 Pro', tools: ['Gateway', 'Memory'], memory: 92, latency: 120, tokens: 42000, color: 'var(--neon-blue)', task: 'Routing task pipelines and analyzing client prompts.' },
    { id: 'pm', name: 'PM Agent', role: 'Spec Writer', avatar: '📋', status: 'Working', model: 'Gemini 1.5 Pro', tools: ['Knowledge Base'], memory: 88, latency: 240, tokens: 18000, color: 'var(--neon-purple)', task: 'Drafting product requirements specifications.' },
    { id: 'designer', name: 'UI Designer', role: 'Figma Designer', avatar: '🎨', status: 'Working', model: 'GPT-4o', tools: ['Figma MCP'], memory: 94, latency: 380, tokens: 94000, color: 'var(--neon-pink)', task: 'Extracting CSS variables and grid structures.' },
    { id: 'frontend', name: 'Frontend Eng', role: 'React Developer', avatar: '💻', status: 'Working', model: 'Claude 3.5', tools: ['Filesystem', 'Browser'], memory: 85, latency: 430, tokens: 125000, color: 'var(--neon-blue)', task: 'Redesigning glassmorphism navbar UI components.' },
    { id: 'backend', name: 'Backend Eng', role: 'FastAPI Developer', avatar: '⚙️', status: 'Working', model: 'Claude 3.5', tools: ['Postgres', 'Redis'], memory: 91, latency: 510, tokens: 184000, color: 'var(--neon-purple)', task: 'Implementing OAuth JWT token authentication.' },
    { id: 'qa', name: 'QA Engineer', role: 'Unit Tester', avatar: '🧪', status: 'Working', model: 'Llama-3 70B', tools: ['Terminal'], memory: 78, latency: 190, tokens: 12000, color: 'var(--neon-green)', task: 'Validating response schemas against OpenAPI specs.' },
    { id: 'security', name: 'Security Cop', role: 'Guardrail Auditor', avatar: '🛡️', status: 'Working', model: 'Llama-3 70B', tools: ['Guardrails'], memory: 82, latency: 210, tokens: 8400, color: 'var(--neon-pink)', task: 'Scanning generated code for prompt injection vectors.' },
    { id: 'devops', name: 'DevOps Agent', role: 'Docker Engine', avatar: '🐳', status: 'Working', model: 'Gemini 1.5 Pro', tools: ['Docker API'], memory: 89, latency: 310, tokens: 24000, color: 'var(--neon-yellow)', task: 'Compiling Docker container recipes and pushing builds.' },
    { id: 'delivery', name: 'Client Delivery', role: 'Vercel Deployment', avatar: '🚀', status: 'Working', model: 'Gemini 1.5 Pro', tools: ['Browser'], memory: 80, latency: 150, tokens: 9200, color: 'var(--neon-green)', task: 'Syncing live environment variables and CDN routers.' }
  ]);

  // Session Logging
  const [logs, setLogs] = useState([]);
  const [simulationState, setSimulationState] = useState('idle'); // idle, running
  const [activeNode, setActiveNode] = useState(null); // current running node ID

  // Notification Queue
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Deployment completed successfully.', agent: 'DevOps', type: 'success', time: '10m ago', read: false },
    { id: '2', message: 'Backend Agent opened Pull Request #52.', agent: 'Backend Eng', type: 'info', time: '30m ago', read: false },
    { id: '3', message: 'QA found three bugs in user register validation schema.', agent: 'QA Engineer', type: 'warning', time: '1h ago', read: false }
  ]);

  const addLog = (agent, message, type = 'info') => {
    const timeStr = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time: timeStr, agent, message, type }]);
  };

  const triggerNotification = (message, agent, type = 'info') => {
    const timeStr = 'Just now';
    const newNotif = {
      id: Math.random().toString(),
      message,
      agent,
      type,
      time: timeStr,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Run the Multi-Agent Compiler Pipeline
  const startSimulation = async (prompt) => {
    if (simulationState === 'running') return;
    setSimulationState('running');
    setLogs([]);

    // CEO
    setActiveNode('ceo');
    addLog('CEO Agent', `Received design spec prompt: "${prompt}"`, 'info');
    addLog('CEO Agent', 'Assembling engineering team & mapping functional workspace topology.', 'info');
    triggerNotification('CEO Agent analyzed project request.', 'CEO Agent', 'info');
    await new Promise(r => setTimeout(r, 1400));

    // PM
    setActiveNode('pm');
    addLog('PM Agent', 'Compiling spec requirements from design guidelines.', 'info');
    addLog('PM Agent', 'Wrote database schemas and API specifications to knowledge base.', 'info');
    triggerNotification('PM drafted requirements specifications.', 'PM Agent', 'info');
    await new Promise(r => setTimeout(r, 1400));

    // Designer
    setActiveNode('designer');
    addLog('UI Designer', 'Pulling UI assets from Figma workspace.', 'info');
    addLog('UI Designer', 'Generated colors palette: dark background, neon blue, neon purple, glass card definitions.', 'info');
    triggerNotification('UI Designer exported Figma configurations.', 'UI Designer', 'info');
    await new Promise(r => setTimeout(r, 1400));

    // Dev (Parallel representation)
    setActiveNode('frontend');
    addLog('Frontend Eng', 'Writing React components. Created sidebar layout, navigation routing and glass panels.', 'info');
    await new Promise(r => setTimeout(r, 800));
    setActiveNode('backend');
    addLog('Backend Eng', 'Instantiated FastAPI backend container. Hooking routes to Postgres and Redis caches.', 'info');
    triggerNotification('Development: Frontend & Backend code compiled.', 'Backend Eng', 'info');
    await new Promise(r => setTimeout(r, 1400));

    // Audit (QA & Security)
    setActiveNode('qa');
    addLog('QA Engineer', 'Running Jest tests. All unit tests resolved clean (12/12).', 'success');
    await new Promise(r => setTimeout(r, 800));
    setActiveNode('security');
    addLog('Security Cop', 'Auditing repository files. Passed code sanitization check.', 'success');
    triggerNotification('QA & Security: Code validated and signed.', 'Security Cop', 'success');
    await new Promise(r => setTimeout(r, 1400));

    // DevOps
    setActiveNode('devops');
    addLog('DevOps Agent', 'Pushed commit to main branch: [feat: release-v1.4.0]', 'info');
    addLog('DevOps Agent', 'Building Docker images and triggering live environment webhooks.', 'info');
    await new Promise(r => setTimeout(r, 1400));

    // Delivery
    setActiveNode('delivery');
    addLog('Client Delivery', 'Deployment live on CDN host: https://agentforge-stage.vercel.app', 'success');
    triggerNotification('Deployment completed! App is now live.', 'Client Delivery', 'success');

    // Update active project progress
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject) {
        return { ...p, progress: 100, status: 'Completed', cost: p.cost + 4.80 };
      }
      return p;
    }));

    // Update stats counters
    setStats(prev => ({
      ...prev,
      tokensUsed: prev.tokensUsed + 1200500,
      monthlyCost: prev.monthlyCost + 4.80,
      deploymentSuccess: 98.7
    }));

    setActiveNode(null);
    setSimulationState('idle');
  };

  const resetSimulation = () => {
    setSimulationState('idle');
    setActiveNode(null);
    setLogs([]);
    addLog('System', 'Simulation reset. Ready for next instruction.', 'warning');
    
    // Reset progress
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject) {
        return { ...p, progress: 0, status: 'Planning' };
      }
      return p;
    }));
  };

  // Render view router based on currentTab state
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            simulationState={simulationState}
            startSimulation={startSimulation}
            resetSimulation={resetSimulation}
            logs={logs}
            stats={stats}
            activeNode={activeNode}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            setActiveProject={setActiveProject}
            activeProject={activeProject}
          />
        );
      case 'agents':
        return (
          <AgentsView
            agents={agents}
            setAgents={setAgents}
            addLog={addLog}
          />
        );
      case 'workflow':
        return <WorkflowBuilderView addLog={addLog} />;
      case 'gateway':
        return <AiGatewayView addLog={addLog} />;
      case 'mcp':
        return <McpHubView addLog={addLog} />;
      case 'memory':
        return <MemoryCenterView addLog={addLog} />;
      case 'guardrails':
        return <GuardrailsView addLog={addLog} />;
      case 'knowledge':
        return <KnowledgeBaseView addLog={addLog} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'github':
        return <GithubView addLog={addLog} />;
      case 'settings':
        return <SettingsView addLog={addLog} />;
      default:
        return <DashboardView simulationState={simulationState} startSimulation={startSimulation} resetSimulation={resetSimulation} logs={logs} stats={stats} activeNode={activeNode} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      {/* Sidebar collapsible panel */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main content framework */}
      <main className="main-content">
        {/* Global header bar */}
        <Header
          activeProject={activeProject}
          projects={projects}
          setActiveProject={setActiveProject}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
          toggleNotifications={() => setShowNotifications(!showNotifications)}
          unreadCount={unreadCount}
        />

        {/* View Layout wrapper */}
        {renderCurrentView()}

        {/* Sidebar Event notification feed */}
        <NotificationPanel
          isOpen={showNotifications}
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          onClear={() => setNotifications([])}
        />

        {/* Floating Copilot Chatbot */}
        <Chatbot />
      </main>
    </div>
  );
}
