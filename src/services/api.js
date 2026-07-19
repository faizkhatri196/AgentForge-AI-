const API_BASE = 'http://localhost:5000/api';
const WS_BASE = 'ws://localhost:5000';

export class ApiService {
  private static token: string | null = localStorage.getItem('agentforge_token');
  public static isOnline = false;

  public static setToken(token: string) {
    this.token = token;
    localStorage.setItem('agentforge_token', token);
  }

  public static getToken(): string | null {
    return this.token;
  }

  public static logout() {
    this.token = null;
    localStorage.removeItem('agentforge_token');
    localStorage.removeItem('agentforge_user');
  }

  public static async checkServerHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'test' })
      });
      // If it doesn't fail on network, server is online
      this.isOnline = res.status !== 404;
      return this.isOnline;
    } catch (e) {
      this.isOnline = false;
      return false;
    }
  }

  public static async register(email: string, password: string, name: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }

  public static async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    this.setToken(data.token);
    localStorage.setItem('agentforge_user', JSON.stringify(data.user));
    return data;
  }

  public static async getProjects() {
    if (!this.token) return [];
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    if (!res.ok) return [];
    return res.json();
  }

  public static async createProject(name: string, prompt: string) {
    if (!this.token) throw new Error('Auth required');
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ name, prompt })
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  }

  public static async saveProviderKey(provider: string, key: string) {
    if (!this.token) throw new Error('Auth required');
    const res = await fetch(`${API_BASE}/gateway/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ provider, key })
    });
    if (!res.ok) throw new Error('Failed to save API key');
    return res.json();
  }

  public static async uploadRagFile(projectId: string, file: File) {
    if (!this.token) throw new Error('Auth required');
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/rag/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });
    if (!res.ok) throw new Error('RAG document upload failed');
    return res.json();
  }

  public static connectLogsSocket(
    projectId: string,
    organizationId: string,
    onLog: (log: any) => void,
    onAgentActive: (role: string) => void
  ): WebSocket {
    const ws = new WebSocket(WS_BASE);
    
    ws.onopen = () => {
      console.log('[WS] Connected to live pipeline stream.');
      ws.send(JSON.stringify({
        event: 'trigger_build',
        projectId,
        organizationId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'log') {
          onLog(data.log);
        } else if (data.event === 'agent_active') {
          onAgentActive(data.role);
        }
      } catch (e) {
        console.warn('[WS] Event parse error:', e);
      }
    };

    return ws;
  }
}
