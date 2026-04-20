import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export interface Metrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  endpoints: Record<string, { count: number; avgTime: number }>
}

const metrics: Metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTime: 0,
  endpoints: {}
}

export function monitoringMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime
    const endpoint = `${req.method} ${req.path}`

    metrics.totalRequests++
    metrics.averageResponseTime = (metrics.averageResponseTime * (metrics.totalRequests - 1) + duration) / metrics.totalRequests

    if (!metrics.endpoints[endpoint]) {
      metrics.endpoints[endpoint] = { count: 0, avgTime: 0 }
    }

    const endpointMetrics = metrics.endpoints[endpoint]
    endpointMetrics.count++
    endpointMetrics.avgTime = (endpointMetrics.avgTime * (endpointMetrics.count - 1) + duration) / endpointMetrics.count

    if (res.statusCode >= 200 && res.statusCode < 400) {
      metrics.successfulRequests++
    } else {
      metrics.failedRequests++
    }

    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    })
  })

  next()
}

export function getMetrics(): Metrics {
  return { ...metrics }
}

export function resetMetrics(): void {
  metrics.totalRequests = 0
  metrics.successfulRequests = 0
  metrics.failedRequests = 0
  metrics.averageResponseTime = 0
  metrics.endpoints = {}
}
