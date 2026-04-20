import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

export interface ValidationSchema {
  [key: string]: {
    required?: boolean
    type?: 'string' | 'number' | 'email' | 'boolean'
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    sanitize?: boolean
  }
}

export function validateBody(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = []

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field]

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`)
        continue
      }

      if (value === undefined || value === null) continue

      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`)
      }

      if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`${field} must be a number`)
      }

      if (rules.type === 'email' && !validator.isEmail(value)) {
        errors.push(`${field} must be a valid email`)
      }

      if (rules.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${field} must be a boolean`)
      }

      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`)
      }

      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`)
      }

      if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`)
      }

      if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`)
      }

      if (rules.sanitize && typeof value === 'string') {
        req.body[field] = validator.escape(value)
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: 'Validation failed', details: errors })
      return
    }

    next()
  }
}

export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = validator.escape(req.body[key])
      }
    }
  }
  next()
}
