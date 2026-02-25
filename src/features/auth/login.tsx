"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
// import { useI18n } from '@/src/shared/hooks/use-i18n';
import {
  ArrowLeft,
  ArrowRightIcon,
  BackpackIcon,
  EyeIcon,
  Lock,
  LockOpenIcon,
  User2Icon,
} from "lucide-react";

interface LoginProps {
  onLogin: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onSignUp?: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  error?: string;
  isLoading?: boolean;
  showSignUp?: boolean;
}

export default function Login({
  onLogin,
  onSignUp,
  error,
  isLoading,
  showSignUp = false,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (isSignUpMode && onSignUp) {
      if (password !== confirmPassword) {
        setLocalError("Las contraseñas no coinciden");
        return;
      }
      if (password.length < 6) {
        setLocalError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      const result = await onSignUp({ email, password });
      if (!result.success) {
        setLocalError(result.error || "Error desconocido");
      }
    } else {
      const result = await onLogin({ email, password });
      if (!result.success) {
        setLocalError(result.error || "Error desconocido");
      }
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setLocalError(null);
    setConfirmPassword("");
  };

  // const { t } = useI18n(); // Desactivado para evitar error de contexto

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white transition-colors duration-300">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        {/* Navigation Header */}
        <header className="flex items-center justify-between border-b border-solid border-slate-border px-10 py-4 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4 text-white">
            <div className="size-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                  fill="currentColor"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className=" text-gray-400 text-xl font-bold leading-tight tracking-[-0.015em]">
              VentasYa
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <Link
              href="/status"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Estado del sistema
            </Link>
            <Link href="/help">
              <Button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                <span className="truncate">Ayuda</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content Wrapper */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-[500px] flex flex-col items-center space-y-8">
            {/* Security Icon */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full"></div>
              <div className="relative flex items-center justify-center size-24 rounded-2xl bg-slate-input border border-slate-border text-primary shadow-2xl">
                <span className="!text-5xl">
                  <Lock className="h-15 w-15" />
                </span>
              </div>
            </div>

            {/* Login Title */}
            <div className="text-center space-y-2">
              <h1 className=" text-gray-500 tracking-tight text-[32px] md:text-[40px] font-bold leading-tight px-4">
                Iniciar Sesión
              </h1>
              <p className="text-slate-400 text-lg font-normal leading-normal px-4">
                Accede a tu cuenta
              </p>
            </div>

            {/* Login Card */}
            <div className="w-full bg-slate-input/60 backdrop-blur-xl border border-slate-border rounded-xl p-8 shadow-2xl">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium leading-none tracking-tight text-gray-500">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                      <User2Icon />
                    </span>
                    <input
                      className="form-input w-full rounded-lg text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-border bg-background-dark/50 focus:border-primary h-14 pl-12 pr-4 placeholder:text-slate-500 text-base font-normal transition-all"
                      placeholder="tu@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium leading-none tracking-tight text-gray-500">
                      Contraseña
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 text-xl">
                      <LockOpenIcon />
                    </span>
                    <input
                      className="form-input w-full rounded-lg text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-border bg-background-dark/50 focus:border-primary h-14 pl-12 pr-12 placeholder:text-slate-500 text-base font-normal transition-all"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-4 text-slate-400 hover:text-white transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined">
                        <EyeIcon />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 transition-all flex items-center justify-center gap-2"
                  type="submit"
                >
                  <span>Iniciar sesión</span>
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background-dark px-2 text-slate-500">
                    o
                  </span>
                </div>
              </div>

              {/* Secondary Actions */}
              <Button
                variant="outline"
                className="w-full h-14 px-4 py-2 text-sm  text-gray-500 font-bold"
                type="submit"
              >
                <span>Registrate ya</span>
              </Button>
              <div className="text-right pr-4 pt-4">
                <div className="inline-block">
                  <Link
                    href="/"
                    className="flex items-center text-xs text-primary hover:underline gap-1"
                  >
                    <span className="text-primary text-xl">
                      <ArrowLeft className="h-5 w-5" />
                    </span>
                    Ir al Inicio
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-slate-500 text-xs">
                © {new Date().getFullYear()} VentasYa
              </p>
              <div className="flex gap-4">
                <Link
                  href="/terms"
                  className="text-slate-500 hover:text-primary transition-colors text-xs underline"
                >
                  Términos
                </Link>
                <Link
                  href="/privacy"
                  className="text-slate-500 hover:text-primary transition-colors text-xs underline"
                >
                  Privacidad
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Decorative background elements */}
        <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent -z-10"></div>
        <div className="fixed -top-24 -right-24 size-96 bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        <div className="fixed top-1/2 left-0 -translate-x-1/2 size-80 bg-primary/5 blur-[100px] rounded-full -z-10"></div>
      </div>
    </div>
  );
}
