# Production Deployment Guide: Vercel & Render

Follow this step-by-step guide to deploy AgentForge AI. 

We use a decoupled architecture:
1. **Frontend**: Vite React application deployed to **Vercel** (Free).
2. **Backend**: Express TypeScript server deployed to **Render** (Free Web Service).
3. **Database**: MongoDB Atlas (Free Cluster) mapped via Prisma.
4. **Cache & Websocket Adapter**: Redis instance on **Render** (Free).
5. **Vector Database**: **None needed** (Migrated completely to MongoDB Atlas for free, in-database document chunk indexing and local cosine similarity search!).

---

## Part 1: Database & Cache Provisioning

### 1. MongoDB Atlas Setup (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/) and create a free tier Shared Cluster.
2. In **Database Security** -> **Database Access**, create a user.
3. In **Security** -> **Network Access**, click **Add IP Address** and select **Allow Access From Anywhere** (`0.0.0.0/0`) so Render's dynamic IPs can connect.
4. Go to your cluster, click **Connect** -> **Drivers** (Node.js), and copy the connection string. Your target connection string format is:
   ```text
   mongodb+srv://<db_user>:<db_password>@<cluster_url>/agentforge?retryWrites=true&w=majority
   ```
   *(Note: This is your `DATABASE_URL` environment variable)*

### 2. Redis Cache Setup on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Redis**.
3. Set the following:
   - **Name**: `agentforge-redis`
   - **Region**: Same region as your backend server
   - **Plan**: Free
4. Click **Create Redis**.
5. Once created, copy the **Internal Connection String** or **External Connection String**:
   - Internal Redis URL looks like: `redis://<host>:<port>`
   *(Note: This is your `REDIS_URL` environment variable)*

---

## Part 2: Deploy Backend API Server on Render

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your repo: `faizkhatri196/AgentForge-AI-`.
4. Configure the service settings:
   - **Name**: `agentforge-backend`
   - **Region**: Choose the closest region (e.g., Oregon or Singapore)
   - **Branch**: `main`
   - **Root Directory**: `server` *(CRITICAL: Make sure this is set to `server` to target the Express backend)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
5. Scroll down and click **Advanced** -> **Add Environment Variable**. Add the following environment variables:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PORT` | `10000` | Port for Render backend service (default is usually 10000) |
| `JWT_SECRET` | `your_jwt_secret_key` | Hashing secret for JWT user authentication |
| `DATABASE_URL` | `mongodb+srv://<db_user>:<db_password>@<cluster_url>/agentforge?retryWrites=true&w=majority` | Connection URI to MongoDB Atlas cluster |
| `REDIS_URL` | `redis://<host>:<port>` | Connection URI to Render Redis cache |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Gemini developer token for LLM and vector embeddings |
| `GROQ_API_KEY` | `your_groq_api_key` | Groq developer key for super-fast model processing |
| `LANGSMITH_API_KEY` | `your_langsmith_api_key` | Langsmith observability tracing key |

6. Click **Create Web Service**. 
7. Render will build the environment, push the database schema indexes automatically to MongoDB, compile the TypeScript backend, and deploy it.
8. Copy the public URL generated at the top (e.g. `https://agentforge-backend.onrender.com`).
   *(Note: This is your API server URL, which you will use for the frontend setup)*

---

## Part 3: Deploy Frontend on Vercel

1. Open the [Vercel Dashboard](https://vercel.com/) and click **Add New** -> **Project**.
2. Import the GitHub repository: `faizkhatri196/AgentForge-AI-`.
3. Configure the following project settings:
   - **Framework Preset**: `Vite` (Auto-detected)
   - **Root Directory**: `./` (Leave as default, i.e., root of the repository)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | *Your Render Backend Public URL* | e.g. `https://agentforge-backend.onrender.com` |

5. Click **Deploy**. Vercel will install the React app, compile UI assets, and give you a public URL (e.g., `https://agentforge-ai.vercel.app`).
6. Access your deployed AgentForge AI app, log in (or create an account), configure API keys, and run your autonomous development agents!
