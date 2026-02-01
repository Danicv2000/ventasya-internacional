import { EnhancedCostCalculator } from "@/src/features/calculator/enhanced-cost-calculator"
import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/src/shared/ui/button"

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Package className="size-6 text-blue-600 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-blue-600/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EncargosYa
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
                Admin
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
                Inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl py-12 px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-bounce">
            <Package className="size-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calculadora de Costos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Herramienta avanzada para calcular precios con diferentes configuraciones.
            <span className="block mt-2 text-blue-600 font-semibold">
              ¡Obtén tu cotización al instante! ⚡
            </span>
          </p>
        </div>

        <EnhancedCostCalculator />
      </main>
    </div>
  )
}
