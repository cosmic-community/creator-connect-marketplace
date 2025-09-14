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
    // Check for existing token on mount
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const verifiedUser = verifyToken(token)
        if (verifiedUser) {
          setUser(verifiedUser)
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Token verification error:', error)
        // Clean up invalid token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (token: string, userData: AuthUser) => {
    try {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error('Login storage error:', error)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('signup_email')
      setUser(null)
    } catch (error) {
      console.error('Logout storage error:', error)
      // Still clear the user state even if localStorage fails
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}