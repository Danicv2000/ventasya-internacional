import { OrderForm } from "@/src/features/orders/order-form"
import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/src/shared/ui/button"

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Package className="size-6" />
            <span className="text-xl font-bold">EncargosYa</span>
          </Link>
          <Link href="/">
            <Button variant="ghost">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl py-12 px-4">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-balance">Crear Nuevo Pedido</h1>
          <p className="text-muted-foreground text-lg">
            Completa el formulario y te mostraremos el precio final al instante
          </p>
        </div>

        <OrderForm />
      </main>
    </div>
  )
}
