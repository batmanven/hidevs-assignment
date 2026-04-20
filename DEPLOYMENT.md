# Deployment Guide

## Production Deployment

### Prerequisites
- Docker and Docker Compose
- PostgreSQL 16 with pgvector extension
- Anthropic API Key
- Domain name (optional)

### Environment Variables

Create a production `.env` file:

```env
DATABASE_URL=postgresql://user:password@postgres:5432/realityforge
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

### Docker Deployment

1. Build the images:
```bash
docker-compose build
```

2. Start the services:
```bash
docker-compose up -d
```

3. Run database migrations:
```bash
docker-compose exec backend npx prisma migrate deploy
```

4. Initialize the knowledge base:
```bash
docker-compose exec backend npm run seed:kb
```

### Railway Deployment

1. Create a Railway account
2. Connect your GitHub repository
3. Add the following services:
   - PostgreSQL (with pgvector)
   - Backend (Node.js)
   - Frontend (Static)

4. Configure environment variables in Railway dashboard

5. Deploy

### AWS Deployment

#### Using ECS

1. Create an ECR repository
2. Push Docker images
3. Create ECS task definitions
4. Set up load balancer
5. Configure RDS PostgreSQL with pgvector

#### Using Elastic Beanstalk

1. Create Elastic Beanstalk application
2. Configure environment variables
3. Deploy Docker containers

### Monitoring

- Health check: `GET /health`
- Metrics: `GET /metrics`
- Logs: Check `/logs` directory
- API Docs: `GET /api-docs`

### Scaling

- Use horizontal pod autoscaling (Kubernetes)
- Configure database connection pooling
- Implement Redis for distributed caching
- Use CDN for static assets

### Security

- Use HTTPS in production
- Configure firewall rules
- Enable database SSL
- Rotate secrets regularly
- Use environment-specific API keys

### Backup

- Database backups: Daily automated backups
- Enable point-in-time recovery
- Backup configuration files
- Document deployment state
