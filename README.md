# AgentForge AI - Multi-Agent Enterprise OS

AgentForge AI is a production-ready, full-stack SaaS platform designed to build, manage, and monitor autonomous software companies powered by multi-agent developer teams. The application integrates a centralized failover AI Gateway, Model Context Protocol (MCP) tool integrations, vector RAG database pipelines, and real-time WebSocket log streaming.

---

## 📂 Repository Directory Structure

```
├── Dockerfile                  # Frontend multi-stage build configuration
├── docker-compose.yml          # Local container stack (Postgres, Redis, Qdrant, API, Frontend)
├── package.json                # Frontend React-Vite package configurations
├── vite.config.js              # Vite bundler with Tailwind CSS v4 compiler plugin
├── index.html                  # Main client-side landing container
├── README.md                   # Platform documentation
├── src/                        # React Frontend Client Source
│   ├── App.jsx                 # Core router, simulation states, and WS connectors
│   ├── main.jsx                # React app mount bootstrap
│   ├── index.css               # Global stylesheet with custom @theme color configurations
│   ├── components/             # Reusable UI dashboard panels & widgets
│   │   ├── Sidebar.jsx         # 12-item platform side navigation
│   │   ├── Header.jsx          # Project switcher and provider gateway selector
│   │   ├── Chatbot.jsx         # Floating AI Copilot chat drawer (groq local fallback)
│   │   ├── DashboardView.jsx   # Control Room bento metrics grid & active canvas
│   │   ├── AgentsView.jsx      # Active roster telemetry, latency and memory cards
│   │   ├── AiGatewayView.jsx   # Providers bento grid, fallback chains, and spend charts
│   │   ├── WorkflowBuilder.jsx # Node-based drag-and-drop wire graph builder
│   │   ├── MemoryCenter.jsx    # Vector Search similarity score sliders and Knowledge Graphs
│   │   ├── GuardrailsView.jsx  # Safety core gauge, approvals queue, and prompt scanner
│   │   └── ...                 # View components
│   └── services/
│       └── api.js              # REST client and WebSocket listeners
└── server/                     # Node.js TypeScript Backend API Server
    ├── Dockerfile              # Backend Node environment builder
    ├── package.json            # Server package configurations & dependencies
    ├── tsconfig.json           # TypeScript configuration
    ├── prisma/
    │   └── schema.prisma       # Prisma PostgreSQL database relational mappings
    └── src/
        ├── server.ts           # Bootstraps HTTP endpoints and WebSockets
        └── services/
            ├── gateway.ts      # Failover AI Gateway (10 providers: OpenAI, Claude, Gemini, DeepSeek...)
            ├── orchestrator.ts # Event-driven multi-agent task execution and DB logger
            ├── mcp.ts          # JSON-RPC Model Context Protocol tool executor
            ├── rag.ts          # PDF/Doc chunking text splitter and Qdrant indexer
            └── guardrails.ts   # PII masker, secret scanner, and jailbreak detection
```

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19 (Vite)
* **Styling Engine**: Tailwind CSS v4 (Official `@tailwindcss/vite` plugin)
* **Icons**: Google Material Symbols Outlined
* **Backend Server**: Node.js, Express (TypeScript)
* **Real-time Comms**: WebSockets (`ws`)
* **Relational Database**: PostgreSQL (Prisma ORM)
* **Caching & Message Queue**: Redis
* **Vector Database (RAG)**: Qdrant
* **HTTP Client**: Axios

---

## ⚙️ Environment Configuration

Create a `.env` file inside `/server` with the following variables:

```env
# Server Port Configuration
PORT=5000

# JSON Web Token secret key
JWT_SECRET=agentforge_secure_obsidian_key

# PostgreSQL Connection String (used by Prisma)
DATABASE_URL="postgresql://postgres:faiz_secure_password@localhost:5432/agentforge?schema=public"

# Redis Cache URL
REDIS_URL="redis://localhost:6379"

# Qdrant Vector DB Host URL
QDRANT_URL="http://localhost:6333"

# Optional global Fallback API Keys (normally loaded per-org in Settings DB)
OPENAI_API_KEY=""
GITHUB_TOKEN=""
```

---

## 🚀 Local Deployment Guide

You can run the application locally using Docker Compose, or by manually running the front and back services.

### Method 1: Using Docker Compose (Recommended)

Make sure you have [Docker](https://www.docker.com/) and Docker Compose installed.

1. Clone the repository and navigate to the root directory.
2. Spin up the entire multi-service container stack:
   ```bash
   docker-compose up --build
   ```
3. Once running:
   - **Frontend Dashboard**: Access at `http://localhost:5173`
   - **Backend API Server**: Listening at `http://localhost:5000`
   - **Qdrant DB GUI**: Inspect vectors at `http://localhost:6333/dashboard`

---

### Method 2: Manual Manual Run (Development)

Ensure you have **Node.js v20+** and **PostgreSQL** running locally.

#### Step 1: Initialize Database & Server
1. Navigate to `/server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Generate the Prisma Client and execute database migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Boot the server in development mode:
   ```bash
   npm run dev
   ```

#### Step 2: Initialize Frontend Client
1. Open a new terminal in the project root folder.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite hot-reloading dev server:
   ```bash
   npm run dev
   ```
4. Access the portal locally at `http://localhost:5173/`.

---

## 🌐 Public Production Cloud Deployment

### 1. Backend Server Deployment (Render / Railway / Heroku)
1. Link your GitHub repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Create a new **Web Service** targeting the `/server` directory.
3. Configure your Build and Start scripts:
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
4. Set the required **Environment Variables** (`DATABASE_URL`, `REDIS_URL`, `QDRANT_URL`, `JWT_SECRET`) to point to your production database instances.

### 2. Frontend Client Deployment (Vercel / Netlify)
1. Link your GitHub repository to [Vercel](https://vercel.com).
2. Create a new **Project** targeting the root folder.
3. Vercel automatically detects the Vite template and will build the project.
4. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
5. Click **Deploy**. Vercel will output a secure public URL (HTTPS).
