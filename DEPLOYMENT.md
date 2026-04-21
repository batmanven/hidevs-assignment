# RealityForge Deployment Guide

RealityForge is engineered for high-fidelity simulation and rapid deployment. This guide covers the modernized architecture utilizing Google Gemini, Portable Vector Search, and the automated Render.com Blueprint.

---

## 🚀 1-Click Deployment (Render.com)

The easiest way to deploy the entire RealityForge stack (Database, Backend, and Frontend) is using the included **Render Blueprint**.

### Prerequisites
1. A [Render.com](https://render.com) account.
2. A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/)).

### Steps
1. Connect your GitHub repository to Render.
2. Render will automatically detect the `render.yaml` file and prompt you to create a **Blueprint Group**.
3. **Configure Environment Variables**:
   - `GEMINI_API_KEY`: Paste your Gemini API key.
   - `JWT_SECRET`: Render will generate a secure one for you automatically.
4. Click **Apply**.
5. Once the database is ready, Render will build and deploy the services.

---

## 🏗️ Technical Architecture

### 1. Portable Vector Search (RAG)
Unlike legacy AI pipelines, RealityForge **does not require the `pgvector` extension**. 
- We utilize an **In-Memory Cosine Similarity** engine.
- This ensures compatibility with any standard PostgreSQL instance (AWS RDS, Managed Render DB, etc.).

### 2. Multi-Agent Intelligence
The system is powered by **Gemini 2.0 Flash**. 
- Self-healing authentication restores ghost sessions after DB resets.
- Intelligent fallbacks provide high-fidelity mock data during API downtime.

---

## 🛠️ Manual Deployment Configuration (Non-Blueprint)

If you are deploying to a different provider (AWS, Railway, etc.), ensure the following variables are set:

### Backend Service
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (Major v16 recommended) |
| `GEMINI_API_KEY` | Google AI Studio Key |
| `JWT_SECRET` | Secure string for token signing |
| `NODE_ENV` | Set to `production` |
| `PORT` | Set to `3001` (or your preferred port) |

**Build Command**:
```bash
cd backend && npm install && npx prisma generate && npm run build
```

### Frontend (Static Site)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Your backend URL (e.g., `https://backend-api.com/api`) |

**Build Command**:
```bash
cd frontend && npm install && npm run build
```

---

## 🛡️ Health & Monitoring
- **Health Check**: `GET /health` (Returns `{"status":"ok"}`)
- **Simulation Stream**: Uses `Socket.io` (Ensure your provider supports WebSockets).
- **Prisma Studio**: `cd backend && npx prisma studio` (Local debugging only).

---

> [!IMPORTANT]
> **Production Reset**: If you reset your production database, the **Self-Healing Auth** will automatically restore active user sessions upon their next simulation attempt. No manual user migration is required.
