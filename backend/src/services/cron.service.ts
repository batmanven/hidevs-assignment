import cron from 'node-cron'
import { prisma } from '../lib/prisma'

/**
 * RealityForge Cron Ecosystem
 * Handles automated system hygiene, intelligence audits, and performance snapshots.
 */

/**
 * GHOST BUSTER JOB
 * Runs every hour to clean up stalled simulations (stuck in 'running' for > 1 hour).
 */
export const startGhostBuster = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Initiating Ghost Buster sequence...')
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    try {
      const result = await prisma.simulation.updateMany({
        where: {
          status: 'running',
          createdAt: { lt: oneHourAgo }
        },
        data: {
          status: 'failed'
        }
      })

      if (result.count > 0) {
        console.log(`[CRON] Ghost Buster: Neutralized ${result.count} stalled simulations.`)
      }
    } catch (error) {
      console.error('[CRON] Ghost Buster sequence failed:', error)
    }
  })
}

/**
 * INTELLIGENCE INTEGRITY AUDIT
 * Runs daily at midnight to ensure the Portable RAG layer is seeded and synchronized.
 */
export const startIntelligenceAudit = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Commencing Intelligence Integrity Audit...')
    try {
      const count = await prisma.embedding.count()
      if (count < 14) {
        console.warn(`[CRON] AUDIT_ALERT: Intelligence Base is undersized (${count}/14). Re-link neural core suggested.`)
      } else {
        console.log(`[CRON] Audit successful: ${count} intelligence points verified.`)
      }
    } catch (error) {
      console.error('[CRON] Intelligence Audit failed:', error)
    }
  })
}

/**
 * NEURAL PERFORMANCE SNAPSHOT
 * Runs every 6 hours to log high-level system usage metrics.
 */
export const startPerformanceSnapshot = () => {
  cron.schedule('0 */6 * * *', async () => {
    console.log('[CRON] Capturing Neural Performance Snapshot...')
    try {
      const [totalSims, failedSims, userCount] = await Promise.all([
        prisma.simulation.count(),
        prisma.simulation.count({ where: { status: 'failed' } }),
        prisma.user.count()
      ])

      const healthRatio = totalSims > 0 ? ((totalSims - failedSims) / totalSims) * 100 : 100

      console.log('--- PERFORMANCE SNAPSHOT ---')
      console.log(`Total Simulations: ${totalSims}`)
      console.log(`System Health Ratio: ${healthRatio.toFixed(2)}%`)
      console.log(`Active Neural Links (Users): ${userCount}`)
      console.log('----------------------------')
    } catch (error) {
      console.error('[CRON] Performance Snapshot failed:', error)
    }
  })
}

/**
 * Initializes all RealityForge Cron Jobs.
 */
export const initCronJobs = () => {
  console.log('[CRON] Initializing RealityForge Cron Ecosystem...')
  startGhostBuster()
  startIntelligenceAudit()
  startPerformanceSnapshot()
}
