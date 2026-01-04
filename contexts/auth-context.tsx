"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Credenciales de administrador (en producción esto vendría de una base de datos)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "encargosya2024"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_authenticated")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      setIsLoading(false)
      return true
    } else {
      setError("Usuario o contraseña incorrectos")
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
    setError(null)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
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