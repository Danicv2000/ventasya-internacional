"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from '@/lib/supabase-client'
import { Session, User } from '@supabase/supabase-js'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  session: Session | null
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  signUp: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Debug logging function
const logDebug = (message: string, data?: any) => {
  console.log(`[AUTH DEBUG] ${new Date().toISOString()} - ${message}`, data || '')
}

logDebug('AuthContext module loaded')

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  logDebug('AuthProvider initialized')

  // Handle auth state changes
  useEffect(() => {
    logDebug('Setting up auth state listener')
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logDebug(`Auth state changed: ${event}`, {
          event,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          expiresAt: session?.expires_at
        })
        
        setSession(session)
        setUser(session?.user ?? null)
        setIsAuthenticated(!!session)
        
        if (event === 'SIGNED_IN') {
          logDebug('User signed in successfully')
        } else if (event === 'SIGNED_OUT') {
          logDebug('User signed out')
        } else if (event === 'TOKEN_REFRESHED') {
          logDebug('Session token refreshed')
        }
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      logDebug('Initial session check result:', {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      })
      setSession(session)
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session)
    })

    return () => {
      logDebug('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const login = async (credentials: { email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    logDebug('Attempting login', { email: credentials.email })
    
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      logDebug('Login attempt result:', {
        success: !error,
        userId: data.user?.id,
        userEmail: data.user?.email,
        error: error?.message
      })

      if (error) {
        const errorMessage = error.message || 'Error desconocido al iniciar sesión'
        setError(errorMessage)
        setIsLoading(false)
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        setUser(data.user)
        setSession(data.session)
        setIsAuthenticated(true)
        logDebug('Login successful', { userId: data.user.id })
      }

      setIsLoading(false)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado'
      logDebug('Login exception:', err)
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  const logout = async (): Promise<void> => {
    logDebug('Attempting logout')
    
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signOut()
      
      logDebug('Logout result:', { error: error?.message })
      
      if (error) {
        setError(error.message)
      } else {
        setUser(null)
        setSession(null)
        setIsAuthenticated(false)
        logDebug('Logout successful')
      }
    } catch (err) {
      logDebug('Logout exception:', err)
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (credentials: { email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    logDebug('Attempting sign up', { email: credentials.email })
    
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      })

      logDebug('Sign up result:', {
        success: !error,
        userId: data.user?.id,
        userEmail: data.user?.email,
        error: error?.message
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        setUser(data.user)
        setSession(data.session)
        setIsAuthenticated(!!data.session)
        logDebug('Sign up successful', { userId: data.user.id })
      }

      setIsLoading(false)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado'
      logDebug('Sign up exception:', err)
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      session,
      login,
      logout,
      signUp,
      isLoading,
      error
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