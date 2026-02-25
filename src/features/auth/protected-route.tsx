"use client"

import { useAuth } from "@/src/core/contexts/auth-context"
import Login from "./login"


interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, login, signUp, isLoading, error } = useAuth()

  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={login}
        onSignUp={signUp}
        error={error || undefined}
        isLoading={isLoading}
        showSignUp={true}
      />
    )
  }

  return <>{children}</>
}