import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { AgentOrchestrator } from './services/orchestrator';
import { RagService } from './services/rag';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'agentforge_obsidian_key';

app.use(cors());
app.use(express.json());

// Setup Multer for RAG uploads
const upload = multer({ storage: multer.memoryStorage() });

// WebSocket connection routing
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws) => {
  console.log('[WEBSOCKET] Client connected.');
  AgentOrchestrator.registerSocket(ws);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.event === 'trigger_build') {
        AgentOrchestrator.executeProjectPipeline(data.projectId, data.organizationId);
      }
    } catch (e) {
      console.warn('Socket message parse failed.');
    }
  });
});

// Middleware for JWT Authentication
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Access token invalid or expired' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name }
    });
    
    // Auto-create default Organization
    const org = await prisma.organization.create({
      data: { name: `${name}'s Org` }
    });

    await prisma.member.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: 'Owner'
      }
    });

    res.status(201).json({ success: true, userId: user.id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const membership = await prisma.member.findFirst({ where: { userId: user.id } });
    const token = jwt.sign({ userId: user.id, orgId: membership?.organizationId }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, orgId: membership?.organizationId } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- PROJECTS & WORKFLOW ACTIONS ---
app.post('/api/projects', authenticateToken, async (req: any, res) => {
  try {
    const { name, prompt } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        prompt,
        organizationId: req.user.orgId
      }
    });
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/projects', authenticateToken, async (req: any, res) => {
  const projects = await prisma.project.findMany({
    where: { organizationId: req.user.orgId }
  });
  res.json(projects);
});

// --- AI GATEWAY CREDENTIALS ---
app.post('/api/gateway/keys', authenticateToken, async (req: any, res) => {
  try {
    const { provider, key } = req.body;
    const apiKey = await prisma.apiKey.upsert({
      where: {
        organizationId_provider: {
          organizationId: req.user.orgId,
          provider
        }
      },
      update: { keyEncrypted: key },
      create: {
        provider,
        keyEncrypted: key,
        organizationId: req.user.orgId
      }
    });
    res.json({ success: true, provider: apiKey.provider });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- RAG ENDPOINTS ---
app.post('/api/rag/upload', authenticateToken, upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { projectId } = req.body;
    
    // Find organization key for embeddings (try openai, then gemini)
    let apiKeyRecord = await prisma.apiKey.findFirst({
      where: { organizationId: req.user.orgId, provider: 'openai' }
    });
    if (!apiKeyRecord) {
      apiKeyRecord = await prisma.apiKey.findFirst({
        where: { organizationId: req.user.orgId, provider: 'gemini' }
      });
    }

    const chunks = await RagService.processDocument(
      req.file.originalname,
      req.file.buffer,
      projectId,
      apiKeyRecord?.keyEncrypted || ''
    );

    res.json({ success: true, chunksProcessed: chunks });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/rag/query', authenticateToken, async (req: any, res) => {
  try {
    const { query, projectId } = req.body;
    
    // Find organization key for embeddings (try openai, then gemini)
    let apiKeyRecord = await prisma.apiKey.findFirst({
      where: { organizationId: req.user.orgId, provider: 'openai' }
    });
    if (!apiKeyRecord) {
      apiKeyRecord = await prisma.apiKey.findFirst({
        where: { organizationId: req.user.orgId, provider: 'gemini' }
      });
    }

    const results = await RagService.queryContext(
      query,
      projectId,
      apiKeyRecord?.keyEncrypted || ''
    );

    res.json(results);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server & Qdrant initialization
server.listen(PORT, async () => {
  console.log(`[AGENTFORGE SERVER] Active and listening on port: ${PORT}`);
  await RagService.initializeQdrant();
});
