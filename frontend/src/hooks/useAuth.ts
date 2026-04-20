import { useCallback } from 'react'
import { useAuthStore } from '../stores'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const navigate = useNavigate()
  const {
    userId,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  } = useAuthStore()

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password)
      navigate('/')
    } catch {
      
    }
  }, [login, navigate])

  const handleRegister = useCallback(async (email: string, password: string) => {
    try {
      await register(email, password)
      navigate('/')
    } catch {
      
    }
  }, [register, navigate])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
  }, [logout, navigate])

  return {
    userId,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError
  }
}
