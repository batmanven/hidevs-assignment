# RealityForge 

A production-ready **Multi-Agent Simulation Engine** powered by RAG (Retrieval-Augmented Generation) that stress-tests startup ideas against realistic market constraints before a single line of product code is written.

---

## ⚡ "Peak" Engineering Upgrades
This project has been architected to "Peak" technical standards, going beyond a standard MVP:

- **Collaborative Multi-Agent Loop**: Agents don't just talk in order; they now explicitly reference, debate, and refine each other's points across 4 separate simulation phases (Launch, Adoption, Competition, Scaling).
- **Professional-Grade RAG (PGVector)**: Migrated from inefficient in-memory search to **PostgreSQL vector similarity search** (`vector <=> query`) for enterprise-scale semantic retrieval.
- **Intelligence Evidence UI**: A dedicated "RAG Evidence" sidebar in the dashboard that shows the exact market data points retrieved to support every agent response, providing transparency and trust.
- **Premium Aesthetics**: Fully responsive Glassmorphism UI built with **Tailwind CSS v4** and **Framer Motion** for a state-of-the-art user experience.
- **Production-Ready Infra**: Complete CI/CD via GitHub Actions, Docker containerization, Swagger/OpenAPI documentation, and real-time monitoring metrics.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript (Vite)
- **Styling**: TailwindCSS v4 + Glassmorphism Design System
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Real-time**: Socket.io-client

### Backend
- **Runtime**: Node.js 20 + Express
- **AI Orchestration**: LangChain + Anthropic Claude 3.5 Sonnet
- **Database/ORM**: PostgreSQL 16 (with PGVector) + Prisma 7
- **Documentation**: Swagger UI / OpenAPI 3.0
- **Security**: JWT (HS256) + Helmet + Rate Limiting

---

## 🏗️ Architecture: The Neural Agentic Loop

RealityForge uses a modular architecture designed for high-fidelity simulations:

1. **Semantic Knowledge Layer**: Uses Anthropic's reasoning capabilities to ingest unstructured market data and store it in a vector database for context-aware retrieval.
2. **Context-Augmented Retrieval**: When a user inputs an idea, the system retrieves the top-K relevant market facts using Cosine Similarity via `pgvector`.
3. **Multi-Persona Simulation**: 4 distinct agents (Customer, Competitor, Investor, Operations) are spawned. They use a **Collaborative Loop** where each agent's "thinking" is influenced by both the RAG context and the previous agents' rebuttals.
4. **Synthesis Engine**: A final synthesis step aggregates the transcript into organized SWOT analysis, risk assessments, and a 12-month projected timeline.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Anthropic API Key (Claude 3.5 Sonnet)

### Installation

1. **Clone & Install**
```bash
git clone <repository-url>
cd realityforge
cd backend && npm install
cd ../frontend && npm install
```

2. **Environment Configuration**
Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realityforge
ANTHROPIC_API_KEY=your_claude_key
JWT_SECRET=peak_secret_key
CORS_ORIGIN=http://localhost:5173
```

3. **Database Setup (Vector Support)**
```bash
# Ensure Docker is running for pgvector support
docker-compose up -d postgres
cd backend
npx prisma generate
npx prisma migrate dev
```

4. **Launch Dev Environment**
```bash
# Backend
MIT
