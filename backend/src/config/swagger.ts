import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RealityForge API',
      version: '1.0.0',
      description: 'Multi-agent AI simulation system for startup ideas',
      contact: {
        name: 'RealityForge Team',
        email: 'support@realityforge.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.realityforge.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Idea: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            userId: {
              type: 'string',
              format: 'uuid'
            },
            description: {
              type: 'string'
            },
            structuredData: {
              type: 'object'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Simulation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            ideaId: {
              type: 'string',
              format: 'uuid'
            },
            status: {
              type: 'string',
              enum: ['pending', 'running', 'completed', 'failed']
            },
            results: {
              type: 'object'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            completedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            },
            status: {
              type: 'string'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Ideas',
        description: 'Business idea management'
      },
      {
        name: 'Simulations',
        description: 'AI simulation operations'
      },
      {
        name: 'Health',
        description: 'System health checks'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
}

export const swaggerSpec = swaggerJsdoc(options)
