import { PrismaClient } from '@prisma/client'
import { config } from '../config'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Diagnostic log for production connectivity (without leaking credentials)
if (config.databaseUrl) {
  const maskedUrL = config.databaseUrl.replace(/:[^:@]+@/, ':***@')
  console.log(`[PRISMA] Initializing with datasource: ${maskedUrL.split('@')[1] || 'internal'}`)
} else {
  console.error('[PRISMA] CRITICAL ERROR: DATABASE_URL is missing from environment.')
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
