"use client"

import { useState } from "react"
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { Card } from "@/src/shared/ui/card"
import { Button } from "@/src/shared/ui/button"
import { Badge } from "@/src/shared/ui/badge"
import { Label } from "@/src/shared/ui/label"
import { Input } from "@/src/shared/ui/input"

interface AdminLoginProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  onSignUp?: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  error?: string
  isLoading?: boolean
  showSignUp?: boolean
}

export function AdminLogin({ onLogin, onSignUp, error, isLoading, showSignUp = false }: AdminLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    
    if (isSignUpMode && onSignUp) {
      if (password !== confirmPassword) {
        setLocalError("Las contraseñas no coinciden")
        return
      }
      if (password.length < 6) {
        setLocalError("La contraseña debe tener al menos 6 caracteres")
        return
      }
      const result = await onSignUp({ email, password })
      if (!result.success) {
        setLocalError(result.error || 'Error desconocido')
      }
    } else {
      const result = await onLogin({ email, password })
      if (!result.success) {
        setLocalError(result.error || 'Error desconocido')
      }
    }
  }

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode)
    setLocalError(null)
    setConfirmPassword("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-bounce" />
      </div>

      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg border-2 border-blue-200 shadow-2xl relative z-10">
        {/* Botón de regreso al sitio */}
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-xl"
            >
              <ArrowLeft className="size-4 mr-2" />
              Volver al Sitio
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse shadow-lg">
            <Shield className="size-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {isSignUpMode ? "Crear Cuenta" : "Panel de Administración"}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {isSignUpMode 
              ? "Crea una cuenta para acceder al panel de administración" 
              : "Ingresa tus credenciales para acceder"
            }
          </p>

          <Badge className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200">
            <Lock className="size-4 mr-2" />
            🔒 Acceso Restringido
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <User className="size-5 text-blue-600" />
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              required
              className="text-lg p-4 border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="size-5 text-blue-600" />
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUpMode ? "Crea una contraseña" : "Ingresa tu contraseña"}
                required
                minLength={isSignUpMode ? 6 : undefined}
                className="text-lg p-4 pr-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 rounded-xl"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-blue-50"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-gray-500" />
                ) : (
                  <Eye className="size-5 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-shake">
              <AlertCircle className="size-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error || localError}</p>
            </div>
          )}

          {isSignUpMode && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="size-5 text-blue-600" />
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu contraseña"
                  required
                  className="text-lg p-4 pr-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 rounded-xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-blue-50"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 text-gray-500" />
                  ) : (
                    <Eye className="size-5 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email || !password || (isSignUpMode && password !== confirmPassword)}
            className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                {isSignUpMode ? "Creando cuenta..." : "Verificando..."}
              </>
            ) : (
              <>
                <Shield className="size-5 mr-3" />
                {isSignUpMode ? "📝 Crear Cuenta" : "🔓 Iniciar Sesión"}
              </>
            )}
          </Button>
        </form>

        {showSignUp && (
          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              {isSignUpMode 
                ? "¿Ya tienes cuenta? Inicia sesión" 
                : "¿No tienes cuenta? Regístrate"
              }
            </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Shield className="size-4" />
              ℹ️ Información de Acceso
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Solo administradores autorizados</p>
              <p>• Sistema de autenticación seguro con Supabase</p>
              <p>• Acceso monitoreado y registrado</p>
            </div>
          </div>

          {/* Botón adicional para clientes */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Home className="size-4" />
              👥 ¿Eres Cliente?
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Si llegaste aquí por error, puedes regresar al sitio principal para hacer tu pedido.
            </p>
            <Link href="/" className="block">
              <Button 
                variant="outline" 
                className="w-full border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-colors"
              >
                <Home className="size-4 mr-2" />
                🏠 Ir al Sitio Principal
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}