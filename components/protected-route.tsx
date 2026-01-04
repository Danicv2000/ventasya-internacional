"use client"

import { useAuth } from "@/contexts/auth-context"
import { AdminLogin } from "@/components/admin-login"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, login, isLoading, error } = useAuth()

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLogin={login}
        error={error}
        isLoading={isLoading}
      />
    )
  }

  return <>{children}</>
}