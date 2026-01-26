"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Package, MapPin, DollarSign } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  clientName: string
  clientEmail: string
  productName: string
  storeName: string
  finalPriceCUP: number
  firstPaymentCUP: number
  secondPaymentCUP: number
  status: string
  paymentStatus: string
  firstPaymentStatus: string
  secondPaymentStatus: string
  createdAt: Date
  estimatedWeightLbs?: number
  actualWeightLbs?: number
}

interface OrderDetailModalProps {
  order: Order
  onClose: () => void
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [firstPaymentStatus, setFirstPaymentStatus] = useState(order.firstPaymentStatus || "pending")
  const [secondPaymentStatus, setSecondPaymentStatus] = useState(order.secondPaymentStatus || "pending")
  const [actualWeight, setActualWeight] = useState(order.actualWeightLbs?.toString() || "")
  const [adminNotes, setAdminNotes] = useState("")

  const handleSave = () => {
    console.log("[v0] Updating order:", { 
      orderId: order.id, 
      status, 
      paymentStatus, 
      firstPaymentStatus,
      secondPaymentStatus,
      actualWeight: actualWeight ? Number.parseFloat(actualWeight) : null,
      adminNotes 
    })
    // In production, this would call an API
    alert("Pedido actualizado exitosamente")
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles del Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-start justify-between pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">Número de Orden</p>
              <p className="text-2xl font-bold">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium">{order.createdAt.toLocaleDateString("es-CO")}</p>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="size-4" />
              Información del Cliente
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Nombre</p>
                <p className="font-medium">{order.clientName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{order.clientEmail}</p>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="size-4" />
              Información del Producto
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Producto</p>
                <p className="font-medium">{order.productName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tienda</p>
                <Badge variant="outline">{order.storeName}</Badge>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="size-4" />
              Sistema de Pagos en 2 Etapas
            </h3>
            <div className="space-y-3">
              {/* Primer Pago */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-800">🛒 Primer Pago (Producto)</span>
                  <span className="text-lg font-bold text-blue-800">
                    ${order.firstPaymentCUP?.toLocaleString("es-CU") || "0"} CUP
                  </span>
                </div>
                <p className="text-xs text-blue-600">Incluye: Producto + Seguro (3%) + Fee de plataforma</p>
              </div>

              {/* Segundo Pago */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-green-800">📦 Segundo Pago (Envío)</span>
                  <span className="text-lg font-bold text-green-800">
                    ${order.secondPaymentCUP?.toLocaleString("es-CU") || "Pendiente"} CUP
                  </span>
                </div>
                <div className="text-xs text-green-600 space-y-1">
                  <p>Peso estimado: {order.estimatedWeightLbs || "No especificado"} lbs</p>
                  <p>Peso real: {order.actualWeightLbs || "Pendiente"} lbs</p>
                  <p>Incluye: Envío real + Costos operacionales + Comisión</p>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">💰 Total Final</span>
                  <span className="text-xl font-bold text-gray-800">
                    ${((order.firstPaymentCUP || 0) + (order.secondPaymentCUP || 0)).toLocaleString("es-CU")} CUP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Updates */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Actualizar Estado</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado del Pedido</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="purchased">Comprado</SelectItem>
                    <SelectItem value="in_transit">En Tránsito</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Peso Real (libras)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(e.target.value)}
                  placeholder="Ej: 2.5"
                />
                <p className="text-xs text-muted-foreground">
                  Actualiza cuando recibas el paquete para calcular el 2do pago
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado 1er Pago</Label>
                <Select value={firstPaymentStatus} onValueChange={setFirstPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado 2do Pago</Label>
                <Select value={secondPaymentStatus} onValueChange={setSecondPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notas Administrativas</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Agregar notas internas sobre este pedido..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              Guardar Cambios
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
