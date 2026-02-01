import { ReportsSystem } from "@/src/features/common/reports-system"
import { Button } from "@/src/shared/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"


export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Package className="size-6" />
            <span className="text-xl font-bold">EncargosYa</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/calculadora">
              <Button variant="ghost">Calculadora</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ReportsSystem />
    </div>
  )
}
