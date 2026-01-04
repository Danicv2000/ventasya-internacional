"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  clientName: string
  clientEmail: string
  productName: string
  storeName: string
  finalPriceCOP: number
  status: string
  paymentStatus: string
  createdAt: Date
}

interface OrdersTableProps {
  orders: Order[]
  onViewOrder: (order: Order) => void
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendiente", variant: "secondary" },
  confirmed: { label: "Confirmado", variant: "default" },
  purchased: { label: "Comprado", variant: "default" },
  in_transit: { label: "En Tránsito", variant: "default" },
  delivered: { label: "Entregado", variant: "outline" },
  cancelled: { label: "Cancelado", variant: "destructive" },
}

const paymentLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendiente", variant: "secondary" },
  partial: { label: "Parcial", variant: "outline" },
  paid: { label: "Pagado", variant: "default" },
}

export function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay pedidos en esta categoría</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Orden</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Producto</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tienda</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Precio</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Pago</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.createdAt.toLocaleDateString("es-CO")}</p>
                </div>
              </td>
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium">{order.clientName}</p>
                  <p className="text-xs text-muted-foreground">{order.clientEmail}</p>
                </div>
              </td>
              <td className="py-4 px-4 max-w-xs">
                <p className="truncate">{order.productName}</p>
              </td>
              <td className="py-4 px-4">
                <Badge variant="outline">{order.storeName}</Badge>
              </td>
              <td className="py-4 px-4 text-right font-medium">${order.finalPriceCOP.toLocaleString("es-CO")}</td>
              <td className="py-4 px-4">
                <Badge variant={statusLabels[order.status]?.variant || "secondary"}>
                  {statusLabels[order.status]?.label || order.status}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <Badge variant={paymentLabels[order.paymentStatus]?.variant || "secondary"}>
                  {paymentLabels[order.paymentStatus]?.label || order.paymentStatus}
                </Badge>
              </td>
              <td className="py-4 px-4 text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewOrder(order)}>
                  <Eye className="size-4 mr-1" />
                  Ver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
