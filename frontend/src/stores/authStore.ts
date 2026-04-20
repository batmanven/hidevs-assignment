import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../utils/api'

interface AuthState {
  userId: string | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.auth.login({ email, password })
          set({ 
            userId: response.userId, 
            token: response.token, 
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Login failed', 
            isLoading: false 
          })
          throw err
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.auth.register({ email, password })
          set({ 
            userId: response.userId, 
            token: response.token, 
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Registration failed', 
            isLoading: false 
          })
          throw err
        }
      },

      logout: () => {
        api.auth.logout()
        set({ 
          userId: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        })
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        userId: state.userId, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
