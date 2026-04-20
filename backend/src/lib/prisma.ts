import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { config } from '../config'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const pool = new Pool({ connectionString: config.databaseUrl })
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
