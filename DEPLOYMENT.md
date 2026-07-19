# Full-Stack Deployment Guide: Vercel & Render

Follow this guide to deploy the AgentForge AI multi-agent platform. The **Vite React Frontend** will deploy to **Vercel**, and the **Express TypeScript Backend API** along with its database engines (Postgres, Redis, and Qdrant) will deploy to **Render**.

---

## Part 1: Deploy Databases & Services on Render

Render will host the backend server and its databases.

### 1. Provision PostgreSQL Database
1. Go to the [Render Dashboard](https://dashboard.render.com/) and click **New +** ➜ **PostgreSQL**.
2. Set the following fields:
   - **Name**: `agentforge-db`
   - **Database**: `agentforge`
   - **User**: `postgres`
3. Click **Create Database**.
4. Once active, copy the **Internal Database URL** (e.g., `postgresql://postgres:password@host/agentforge`).
   > *Note: Save this URL as your `DATABASE_URL` environment variable.*

### 2. Provision Redis Cache
1. Click **New +** ➜ **Redis**.
2. Set the following fields:
   - **Name**: `agentforge-redis`
3. Click **Create Redis**.
4. Once active, copy the **Internal Connection String** (e.g., `redis://host:port`).
   > *Note: Save this URL as your `REDIS_URL` environment variable.*

### 3. Deploy Qdrant Vector Database
1. Click **New +** ➜ **Web Service** or **Private Service** (Private Service is recommended to keep vectors secure).
2. Click **Deploy an image from a registry**.
3. Under **Image URL**, input the official Qdrant image:
   ```text
   qdrant/qdrant:latest
   ```
4. Set the following fields:
   - **Name**: `agentforge-qdrant`
5. Click **Create Service**.
6. Once active, note the connection URL. By default, Qdrant listens on port `6333`.
   - Internal URL: `http://agentforge-qdrant:6333`
   > *Note: Save this URL as your `QDRANT_URL` environment variable.*

---

## Part 2: Deploy the Backend API Server on Render

Now that Postgres, Redis, and Qdrant are active, we can deploy the Node.js API server.

1. Click **New +** ➜ **Web Service**.
2. Connect your GitHub repository: **`faizkhatri196/AgentForge-AI-`**.
3. Configure the following build settings:
   - **Name**: `agentforge-api`
   - **Root Directory**: `server` (This targets the `/server` folder specifically)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, click **Add Environment Variable** and enter:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | The backend API server listener port |
| `JWT_SECRET` | `your_custom_secure_secret_key` | Secret key for hashing user session JWT tokens |
| `DATABASE_URL` | *Your Internal PostgreSQL URL* | e.g. `postgresql://postgres:pass@host/agentforge` |
| `REDIS_URL` | *Your Internal Redis URL* | e.g. `redis://host:port` |
| `QDRANT_URL` | *Your Internal Qdrant URL* | e.g. `http://agentforge-qdrant:6333` |

5. Click **Create Web Service**. Render will install, run Prisma migrations, compile TypeScript files, and output a public URL (e.g., `https://agentforge-api.onrender.com`).
   > *Note: Save this backend URL to connect your frontend.*

---

## Part 3: Deploy the Frontend on Vercel

The frontend React client will run on Vercel's edge network and send requests to the Render backend.

1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New** ➜ **Project**.
2. Import your GitHub repository: **`faizkhatri196/AgentForge-AI-`**.
3. Configure the Project Settings:
   - **Framework Preset**: `Vite` (Vercel auto-detects this)
   - **Root Directory**: `./` (Leave as default root folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | *Your Render Backend Public URL* | e.g. `https://agentforge-api.onrender.com` |

5. Click **Deploy**. Vercel will bundle the CSS with Tailwind v4, optimize the JS assets, and output your live SaaS web app URL!
