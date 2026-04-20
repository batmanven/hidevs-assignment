export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('At least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('One number')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function minLength(value: string, length: number): boolean {
  return value.trim().length >= length
}
