# RealityForge: Multi-Agent Market Simulation Engine

RealityForge is a production-grade simulation platform designed to validate business concepts using high-fidelity, multi-agent reasoning and Retrieval-Augmented Generation (RAG). The system enables entrepreneurs and product managers to stress-test ideas against diverse market personas before developing an MVP.

---

## Core Engineering Capabilities

The platform is architected to enterprise-level technical standards, focusing on reliability, observability, and advanced AI orchestration.

*   **Collaborative Multi-Agent Loop**: Employs a sophisticated reasoning chain where specialized agents (Customer, Competitor, Investor, Operations) engage in iterative debate and refinement across four distinct simulation phases: Launch, Adoption, Competition, and Scaling.
*   **Vectorized Knowledge Layer**: Utilizes PostgreSQL with the pgvector extension for high-performance semantic retrieval. This replaces traditional keyword search with sub-50ms vector similarity matching for high-context data retrieval.
*   **Intelligence Transparency**: Features a dedicated Evidence Sidebar within the dashboard. This interface component displays the specific market data points retrieved during the RAG process, ensuring all AI-generated assertions are grounded in verifiable context.
*   **Resilient Infrastructure**: Constructed with a full CI/CD pipeline, Docker containerization for both frontend and backend services, and a centralized monitoring system for real-time application health metrics.

---

## Technical Architecture: The Neural Agentic Loop

RealityForge leverages a modular architecture focused on high-precision simulations and context-aware reasoning.

1.  **Semantic Retrieval System**: Uses Anthropic's Claude 3.5 Sonnet to process unstructured data, which is then indexed within a vector database.
2.  **Context Augmentation**: For every user query, the system performs a Cosine Similarity search via pgvector to inject relevant market research into the agent's prompts.
3.  **Cross-Agent Collaboration**: Agents do not operate in isolation; each response is influenced by the preceding agent's analytical output and the global context, simulating a real-world stakeholder meeting.
4.  **Analytical Synthesis**: Post-simulation, a specialized engine aggregates the debate transcript into a structured report featuring SWOT analysis, friction assessments, and a 12-month projected roadmap.

---

## Technology Stack

### Backend Services
*   **Runtime**: Node.js 20 with Express
*   **AI Framework**: LangChain with Anthropic Claude 3.5 Sonnet
*   **Data Layer**: PostgreSQL 16 (pgvector) with Prisma 7 ORM
*   **Observability**: Winston logging and centralized metrics collection
*   **Documentation**: OpenAPI 3.0 / Swagger UI
*   **Security**: JWT (HS256), Helmet.js, and standardized rate limiting

### Frontend Application
*   **Architecture**: React 19 with TypeScript (Vite builds)
*   **Design System**: Custom CSS with TailwindCSS v4 integration
*   **Dynamics**: Framer Motion for component transitions and state changes
*   **State Management**: Zustand (with selective persistence)
*   **Communication**: Socket.io-client for real-time simulation streaming

---

## Getting Started

### Prerequisites
*   Node.js 20 or higher
*   Docker and Docker Compose
*   Anthropic API Access (Claude 3.5 Sonnet)

### Installation and Configuration

1.  **Clone the Repository**
    ```bash
    git clone [repository-url]
    cd realityforge
    ```

2.  **Environment Setup**
    Configure the backend environment by creating `backend/.env`:
    ```env
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realityforge
    ANTHROPIC_API_KEY=your_anthropic_api_key
    JWT_SECRET=your_secure_jwt_secret
    CORS_ORIGIN=http://localhost:5173
    ```

3.  **Database and Infrastructure**
    Initialize the containerized database and apply schema migrations:
    ```bash
    docker-compose up -d postgres
    cd backend
    npx prisma generate
    npx prisma migrate dev
    ```

4.  **Service Initialization**
    Launch the backend and frontend in separate terminals:
    ```bash
    # From /backend
    npm run dev

    # From /frontend
    npm run dev
    ```

---

## Technical Standards Compliance

This project adheres to professional software development best practices, including:
*   Standardized environment variable enforcement.
*   Centralized error handling and standardized API response formats.
*   Strict TypeScript typing for end-to-end data integrity.
*   Responsive, accessible UI/UX design following modern accessibility standards.
