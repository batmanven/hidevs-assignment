import { Request, Response, NextFunction } from 'express'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || 'unknown'
    const now = Date.now()

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      }
      next()
      return
    }

    store[key].count++

    if (store[key].count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((store[key].resetTime - now) / 1000).toString())
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
      })
      return
    }

    next()
  }
}

export function resetRateLimit(ip: string): void {
  delete store[ip]
}

setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (now > store[key].resetTime) {
      delete store[key]
    }
  }
}, 60000)
