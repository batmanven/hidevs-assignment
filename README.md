# RealityForge

A production-ready multi-agent, RAG-powered simulation engine that stress-tests startup ideas before you build them.

## Overview

RealityForge takes rough ideas and turns them into fully simulated realities with AI agents (customers, competitors, investors, operations), running simulations to provide real outcomes, failures, and decisions.

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS v4
- Socket.io-client
- Recharts
- React Router

### Backend
- Node.js 20 + Express
- TypeScript
- Socket.io
- Claude API (Anthropic)
- LangChain for agent orchestration
- Prisma ORM
- PostgreSQL 16

### Infrastructure
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Railway (deployment target)

## Features

### Core Features
- **Multi-Agent Simulation**: 4 AI agents (customer, competitor, investor, operations) with unique personas using LangChain
- **RAG-Powered Context**: Knowledge base with vector embeddings for semantic search
- **Real-Time Streaming**: WebSocket-based live simulation updates
- **Comprehensive Results**: Success probability, risk assessment, failure scenarios, timeline projection
- **JWT Authentication**: Secure user authentication and authorization
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation and sanitization
- **Monitoring**: Winston logging and performance metrics
- **API Documentation**: Swagger/OpenAPI documentation at `/api-docs`

### Advanced Features
- **Vector Embeddings**: Cosine similarity search using pgvector
- **Multi-Turn Conversations**: Agent dialogue history management
- **Streaming AI Responses**: Real-time text generation
- **Error Handling**: Comprehensive error middleware with custom error classes
- **Unit Testing**: Jest test suite for critical functions

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Anthropic API Key
- PostgreSQL 16

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hidev
```

2. Install dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

3. Set up environment variables
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/realityforge
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5174
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

4. Set up database
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

5. Start development servers
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

### Docker Deployment

```bash
docker-compose up -d
```

Access the application at:
- Frontend: http://localhost
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api-docs
- Health Check: http://localhost:3001/health
- Metrics: http://localhost:3001/metrics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user and get JWT token

### Ideas
- `POST /api/ideas` - Create a new idea (requires authentication)
- `GET /api/ideas/:id` - Get idea details (requires authentication)

### Simulations
- `POST /api/simulations/:id/start` - Start a simulation (requires authentication)
- `GET /api/simulations/:id/results` - Get simulation results (requires authentication)
- `GET /api/simulations/:id/status` - Get simulation status (requires authentication)

### System
- `GET /health` - Health check endpoint
- `GET /metrics` - Performance metrics
- `GET /api-docs` - Swagger API documentation

## WebSocket Events

### Client → Server
- `join_simulation` - Join a simulation room
- `leave_simulation` - Leave a simulation room

### Server → Client
- `simulation_started` - Simulation has started
- `agent_chunk` - Streaming text chunk from agent
- `agent_action` - Agent performed an action
- `simulation_progress` - Simulation progress update
- `simulation_completed` - Simulation completed with results
- `simulation_failed` - Simulation failed with error

## Project Structure

```
realityforge/
├── backend/
│   ├── src/
│   │   ├── services/     # Claude, RAG, Agent, Simulation, Embedding, Conversation, Stream services
│   │   ├── controllers/  # Auth controller
│   │   ├── routes/       # API routes (auth, idea, simulation)
│   │   ├── middleware/   # Auth, error, monitoring, rate limiting, validation
│   │   ├── config/       # Configuration and Swagger
│   │   ├── utils/        # Logger utility
│   │   └── index.ts      # Server entry point
│   ├── prisma/           # Database schema and migrations
│   ├── __tests__/        # Unit tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages (Login, IdeaInput, SimulationDashboard, ResultsPanel)
│   │   ├── components/   # Reusable components (LoadingSpinner, AnimatedCard, ProgressBar)
│   │   └── main.tsx
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/    # CI/CD pipelines
```

## How It Works

1. **User Authentication**: Users register/login with JWT tokens
2. **Idea Input**: User enters a startup idea
3. **Context Retrieval**: RAG system retrieves relevant market insights using vector embeddings
4. **Agent Spawning**: 4 AI agents are created with unique personas using LangChain
5. **Simulation**: Agents interact across multiple phases (launch, adoption, competition, scaling)
6. **Streaming**: Real-time updates via WebSocket
7. **Results Generation**: Claude AI analyzes interactions and generates comprehensive results
8. **Visualization**: Results displayed with charts, timelines, and actionable insights

## Testing

```bash
cd backend
npm test              # Run tests
npm run test:coverage  # Run tests with coverage
```

## Development

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npx prisma studio    # Open Prisma Studio
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DATABASE_URL | PostgreSQL connection string | Yes | - |
| ANTHROPIC_API_KEY | Anthropic Claude API key | Yes | - |
| PORT | Backend port | No | 3001 |
| NODE_ENV | Environment | No | development |
| CORS_ORIGIN | CORS origin | No | * |
| JWT_SECRET | JWT signing secret | Yes | - |
| JWT_EXPIRES_IN | JWT expiration | No | 7d |
| LOG_LEVEL | Logging level | No | info |

## License

MIT
