"use client";

import Login from "@/src/features/auth/login";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/src/core/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, signUp, isLoading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await login(credentials);
      
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Error de autenticación");
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Error de autenticación";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (credentials: {
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signUp(credentials);
      
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Error de registro");
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Error de registro";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Login
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      error={error || authError || undefined}
      isLoading={isSubmitting}
      showSignUp={true}
    />
  );
}
