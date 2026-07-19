import { PrismaClient } from '@prisma/client';
import { AiGateway } from './gateway';
import { McpClient } from './mcp';
import { GuardrailService } from './guardrails';
import WebSocket from 'ws';

export class AgentOrchestrator {
  private static prisma = new PrismaClient();
  private static activeSockets: Set<WebSocket> = new Set();

  public static registerSocket(ws: WebSocket) {
    this.activeSockets.add(ws);
    ws.on('close', () => this.activeSockets.delete(ws));
  }

  private static broadcast(payload: any) {
    const data = JSON.stringify(payload);
    for (const socket of this.activeSockets) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    }
  }

  public static async executeProjectPipeline(projectId: string, organizationId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) throw new Error('Project not found');

      // Fetch org API keys
      const orgKeys = await this.prisma.apiKey.findMany({
        where: { organizationId }
      });

      const keysMap = orgKeys.reduce((acc, k) => {
        acc[k.provider] = k.keyEncrypted; // loaded decrypted/plain
        return acc;
      }, {} as Record<string, string>);

      // 1. Initialise Agents in Database
      const agentsList = ['CEO', 'PM', 'Architect', 'Engineer', 'QA', 'DevOps'];
      for (const role of agentsList) {
        await this.prisma.agent.create({
          data: {
            roleType: role,
            name: `${role} Agent`,
            systemPrompt: `You are the ${role} agent. Help execute the build for prompt: "${project.prompt}"`,
            model: 'gpt-4o',
            status: 'Idle',
            projectId: project.id
          }
        });
      }

      this.broadcastLog(project.id, 'System', 'Multi-Agent sandbox cluster initialised.', 'success');

      // 2. CEO Agent phase
      await this.runAgentStep(
        project.id,
        'CEO',
        'Deconstructing project requirements and scoping workflows.',
        keysMap.openai || keysMap.gemini || keysMap.groq || ''
      );

      // 3. Product Manager phase
      await this.runAgentStep(
        project.id,
        'PM',
        'Drafting product specs and task backlogs.',
        keysMap.openai || keysMap.gemini || keysMap.groq || ''
      );

      // 4. Engineering phase
      await this.runAgentStep(
        project.id,
        'Engineer',
        'Compiling React frontend code templates and FastAPI routing endpoints.',
        keysMap.openai || keysMap.gemini || keysMap.groq || ''
      );

      // 5. DevOps Workspace generation
      this.broadcastLog(project.id, 'DevOps', 'Assembling Dockerfile configurations.', 'info');
      await McpClient.executeTool({
        server: 'filesystem',
        tool: 'write_file',
        arguments: {
          filePath: 'Dockerfile',
          content: 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]'
        }
      });

      await McpClient.executeTool({
        server: 'filesystem',
        tool: 'write_file',
        arguments: {
          filePath: 'docker-compose.yml',
          content: 'version: "3.8"\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"'
        }
      });

      this.broadcastLog(project.id, 'DevOps', 'Deployment configurations generated in sandbox filesystem.', 'success');

      // Update project state
      await this.prisma.project.update({
        where: { id: project.id },
        data: { status: 'Complete', progress: 100 }
      });
      this.broadcast({ event: 'project_updated', projectId: project.id, status: 'Complete', progress: 100 });
      this.broadcastLog(project.id, 'System', 'SaaS project compile completed successfully!', 'success');

    } catch (err: any) {
      console.error('[ORCHESTRATOR ERROR]', err.message);
      this.broadcastLog(projectId, 'System', `Build aborted: ${err.message}`, 'error');
    }
  }

  private static async runAgentStep(projectId: string, role: string, taskDesc: string, apiKey: string) {
    this.broadcast({ event: 'agent_active', role, projectId });
    this.broadcastLog(projectId, role, `Active task: ${taskDesc}`, 'info');

    // Create database Task
    const task = await this.prisma.task.create({
      data: {
        title: taskDesc,
        status: 'Running',
        assignedRole: role,
        projectId
      }
    });

    const guardResult = GuardrailService.inspectPrompt(taskDesc);
    if (!guardResult.passed) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: { status: 'Failed' }
      });
      throw new Error(`Guardrails blocked task: ${guardResult.reason}`);
    }

    // Call AI Gateway
    const response = await AiGateway.execute({
      provider: 'openai',
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `You are the ${role} agent. Generate JSON specifications/code blocks for the task: "${taskDesc}"` },
        { role: 'user', content: taskDesc }
      ],
      apiKey: apiKey || 'mock_key' // uses gateway mock fallback if key is empty
    });

    // Update Agent metrics in DB
    const agent = await this.prisma.agent.findFirst({
      where: { projectId, roleType: role }
    });

    if (agent) {
      await this.prisma.agent.update({
        where: { id: agent.id },
        data: {
          tokensUsed: agent.tokensUsed + response.tokensUsed,
          cost: agent.cost + response.cost,
          latency: response.latency,
          status: 'Idle'
        }
      });
    }

    // Record agent-to-agent Message
    await this.prisma.message.create({
      data: {
        projectId,
        fromAgent: role,
        toAgent: 'Database',
        payload: JSON.stringify({ content: response.content })
      }
    });

    await this.prisma.task.update({
      where: { id: task.id },
      data: { status: 'Success' }
    });

    this.broadcastLog(projectId, role, `Task complete (Latency: ${response.latency}ms, Cost: $${response.cost.toFixed(4)})`, 'success');
  }

  private static async broadcastLog(projectId: string, agent: string, message: string, type: string) {
    // Write log to DB
    const log = await this.prisma.log.create({
      data: {
        projectId,
        agent,
        message,
        type
      }
    });

    // Broadcast to UI
    this.broadcast({
      event: 'log',
      log: {
        time: new Date(log.createdAt).toLocaleTimeString(),
        agent: log.agent,
        message: log.message,
        type: log.type
      }
    });
  }
}
