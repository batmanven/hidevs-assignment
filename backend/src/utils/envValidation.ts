import { config } from '../config'

const requiredEnvVars: string[] = [
  'DATABASE_URL',
  'ANTHROPIC_API_KEY',
  'JWT_SECRET'
]

const optionalEnvVars: Record<string, any> = {
  PORT: 3001,
  NODE_ENV: 'development',
  CORS_ORIGIN: '*',
  JWT_EXPIRES_IN: '7d',
  LOG_LEVEL: 'info'
}

export function validateEnvVars(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  return {
    valid: missing.length === 0,
    missing
  }
}

export function getConfig(): Record<string, any> {
  const validation = validateEnvVars()

  if (!validation.valid) {
    throw new Error(`Missing required environment variables: ${validation.missing.join(', ')}`)
  }

  return {
    ...config,
    ...optionalEnvVars
  }
}

export function loadEnvVars(): void {
  const validation = validateEnvVars()

  if (!validation.valid) {
    console.warn(`Warning: Missing environment variables: ${validation.missing.join(', ')}`)
  }

  for (const [key, defaultValue] of Object.entries(optionalEnvVars)) {
    if (!process.env[key] && defaultValue !== undefined) {
      process.env[key] = String(defaultValue)
    }
  }
}
