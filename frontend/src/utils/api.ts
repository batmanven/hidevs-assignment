import type { 
  CreateIdeaRequest, 
  CreateIdeaResponse, 
  Simulation, 
  SimulationResults,
  AuthRequest,
  AuthResponse,
  ApiError 
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiErrorClass extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new ApiErrorClass(
      error.message || `HTTP ${response.status}`,
      response.status,
      error.code
    )
  }
  return response.json()
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
  ideas: {
    create: async (data: CreateIdeaRequest): Promise<CreateIdeaResponse> => {
      const response = await fetch(`${API_BASE_URL}/ideas`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(data)
      })
      return handleResponse<CreateIdeaResponse>(response)
    }
  },

  simulations: {
    get: async (id: string): Promise<Simulation> => {
      const response = await fetch(`${API_BASE_URL}/simulations/${id}`, {
        headers: getAuthHeaders()
      })
      return handleResponse<Simulation>(response)
    },

    getResults: async (id: string): Promise<SimulationResults> => {
      const response = await fetch(`${API_BASE_URL}/simulations/${id}/results`, {
        headers: getAuthHeaders()
      })
      return handleResponse<SimulationResults>(response)
    },

    list: async (): Promise<Simulation[]> => {
      const response = await fetch(`${API_BASE_URL}/simulations`, {
        headers: getAuthHeaders()
      })
      return handleResponse<Simulation[]>(response)
    }
  },

  auth: {
    login: async (data: AuthRequest): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await handleResponse<AuthResponse>(response)
      localStorage.setItem('token', result.token)
      return result
    },

    register: async (data: AuthRequest): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await handleResponse<AuthResponse>(response)
      localStorage.setItem('token', result.token)
      return result
    },

    logout: (): void => {
      localStorage.removeItem('token')
    },

    getToken: (): string | null => {
      return localStorage.getItem('token')
    },

    isAuthenticated: (): boolean => {
      return !!localStorage.getItem('token')
    }
  }
}

export { ApiErrorClass }
