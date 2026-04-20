import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import swaggerUi from 'swagger-ui-express'
import { config } from './config'
import ideaRoutes from './routes/idea.routes'
import simulationRoutes, { setSocketIO } from './routes/simulation.routes'
import authRoutes from './routes/auth.routes'
import { initializeKnowledgeBase } from './services/rag.service'
import { swaggerSpec } from './config/swagger'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import { monitoringMiddleware, getMetrics } from './middleware/monitoring.middleware'
import { rateLimit } from './middleware/rateLimit.middleware'
import { sanitizeInput } from './middleware/validation.middleware'
import { loadEnvVars } from './utils/envValidation'

const app = express()
const httpServer = createServer(app)

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST']
  }
})

setSocketIO(io)

loadEnvVars()

app.use(helmet())
app.use(cors({
  origin: config.corsOrigin
}))
app.use(express.json())
app.use(sanitizeInput)
app.use(morgan('dev'))
app.use(monitoringMiddleware)

app.use('/api/ideas', rateLimit(100, 60000), ideaRoutes)
app.use('/api/simulations', rateLimit(50, 60000), simulationRoutes)
app.use('/api/auth', rateLimit(10, 60000), authRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

app.get('/metrics', (req, res) => {
  res.json(getMetrics())
})

app.use(notFoundHandler)
app.use(errorHandler)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join_simulation', (simulationId: string) => {
    socket.join(simulationId)
    console.log(`Client ${socket.id} joined simulation ${simulationId}`)
  })

  socket.on('leave_simulation', (simulationId: string) => {
    socket.leave(simulationId)
    console.log(`Client ${socket.id} left simulation ${simulationId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

export { io }

async function startServer() {
  try {
    await initializeKnowledgeBase()
    console.log('Knowledge base initialized')

    httpServer.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
      console.log(`Environment: ${config.nodeEnv}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
