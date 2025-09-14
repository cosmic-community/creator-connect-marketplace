'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { AuthUser } from '@/types'
import { verifyToken } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const verifiedUser = verifyToken(token)
      if (verifiedUser) {
        setUser(verifiedUser)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('signup_email')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}