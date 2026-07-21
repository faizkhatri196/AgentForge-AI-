# AgentForge AI - Multi-Agent Enterprise OS

AgentForge AI is a production-ready, full-stack SaaS platform designed to build, manage, and monitor autonomous software companies powered by multi-agent developer teams. The application integrates a centralized failover AI Gateway, Model Context Protocol (MCP) tool integrations, a built-in cost-free vector RAG search pipeline, and real-time WebSocket log streaming.

---

## 📂 Repository Directory Structure

```
├── Dockerfile                  # Frontend multi-stage build configuration
├── docker-compose.yml          # Local container stack (MongoDB, Redis, API, Frontend)
├── package.json                # Frontend React-Vite package configurations
├── vite.config.js              # Vite bundler with Tailwind CSS v4 compiler plugin
├── index.html                  # Main client-side landing container
├── README.md                   # Platform overview and local setup
├── DEPLOYMENT.md               # Step-by-step Render & Vercel deployment guide
├── src/                        # React Frontend Client Source
│   ├── App.jsx                 # Core router, simulation states, and WS connectors
│   ├── main.jsx                # React app mount bootstrap
│   ├── index.css               # Global stylesheet with custom theme color configurations
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
    │   └── schema.prisma       # Prisma MongoDB database relational mappings
    └── src/
        ├── server.ts           # Bootstraps HTTP endpoints and WebSockets
        └── services/
            ├── gateway.ts      # Failover AI Gateway (10 providers: OpenAI, Claude, Gemini, DeepSeek...)
            ├── orchestrator.ts # Event-driven multi-agent task execution and DB logger
            ├── mcp.ts          # JSON-RPC Model Context Protocol tool executor
            ├── rag.ts          # PDF/Doc chunking text splitter and MongoDB vector indexer (with Cosine Similarity)
            └── guardrails.ts   # PII masker, secret scanner, and jailbreak detection
```

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19 (Vite)
* **Styling Engine**: Tailwind CSS v4 (Official `@tailwindcss/vite` plugin)
* **Icons**: Google Material Symbols Outlined
* **Backend Server**: Node.js, Express (TypeScript)
* **Real-time Comms**: WebSockets (`ws`)
* **Primary Database**: MongoDB (via Prisma ORM)
* **Caching & Message Queue**: Redis
* **Vector Database (RAG)**: MongoDB Atlas (in-database storage with JS-based in-memory Cosine Similarity matching - 100% Free!)
* **HTTP Client**: Axios

---

## ⚙️ Local Environment Configuration

Create a `.env` file inside `/server` with the following variables:

```env
# Server Port Configuration
PORT=5000

# JSON Web Token secret key (used for hashing sessions)
JWT_SECRET=your_jwt_secret_key

# MongoDB Connection String (Atlas or Local)
DATABASE_URL="mongodb+srv://<db_user>:<db_password>@<cluster_url>/agentforge?retryWrites=true&w=majority"

# Redis Cache URL
REDIS_URL="redis://localhost:6379"

# Optional global Fallback API Keys (normally loaded per-org in Settings DB)
GEMINI_API_KEY="your_gemini_api_key"
GROQ_API_KEY="your_groq_api_key"
LANGSMITH_API_KEY="your_langsmith_api_key"
```

---

## 🚀 Local Run Guide

You can run the application locally using Docker Compose, or manually in separate terminals.

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

---

### Method 2: Manual Run (Development Mode)

Ensure you have **Node.js v20+** installed.

#### Step 1: Initialize Database & Server
1. Navigate to `/server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Synchronize database indexes and generate Prisma Client:
   ```bash
   npx prisma db push
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

For deploying the stack live to production:
- The **Vite React Frontend** builds and deploys to **Vercel**.
- The **Express Node.js Backend** and **Redis** cache deploy to **Render**.

Please see [DEPLOYMENT.md](file:///c:/Users/Infinity/OneDrive/Desktop/MultiAgnet/DEPLOYMENT.md) for full step-by-step production setup instructions, environment variable tables, and deployment build settings.
