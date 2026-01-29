"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ShoppingCart, Sparkles, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TemuIcon, SheinIcon, AmazonIcon } from '@/components/platform-icons'

export function OrderForm() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    productUrl: "",
    productName: "",
    productQuantity: 1,
    storeName: "",
    clientNotes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In production, this would send to API
    console.log("[v0] Order request submitted:", formData)

    setTimeout(() => {
      alert("¡Solicitud enviada! Te contactaremos por WhatsApp con el PRIMER PAGO (producto + seguro) en breve.")

      // Reset form
      setFormData({
        clientName: "",
        clientPhone: "",
        productUrl: "",
        productName: "",
        productQuantity: 1,
        storeName: "",
        clientNotes: "",
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const isFormValid =
    formData.clientName && formData.clientPhone && formData.productUrl && formData.productName && formData.storeName

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8 hover:shadow-xl transition-shadow">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
              <ShoppingCart className="size-8 text-primary" />
              Solicitar Producto
            </h2>
            <p className="text-muted-foreground">Envíanos el enlace del producto y te cotizaremos el precio total</p>
          </div>

          <Alert className="border-primary/30 bg-primary/5">
            <Sparkles className="size-4" />
            <AlertDescription>
              <strong>💡 Nuevo Sistema de Pagos:</strong> Ahora pagas en 2 etapas: 
              <br />• <strong>1er Pago:</strong> Producto + seguro (al hacer el pedido)
              <br />• <strong>2do Pago:</strong> Envío real según peso (cuando llegue el paquete)
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Tu Información</h3>

              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre Completo *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleChange("clientName", e.target.value)}
                  placeholder="Juan Pérez"
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">WhatsApp *</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => handleChange("clientPhone", e.target.value)}
                  placeholder="+57 300 123 4567"
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Información del Producto</h3>

              <div className="space-y-2">
                <Label htmlFor="storeName">Tienda *</Label>
                <Select value={formData.storeName} onValueChange={(value) => handleChange("storeName", value)}>
                  <SelectTrigger id="storeName" className="focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Selecciona la tienda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Temu">
                      <div className="flex items-center gap-2">
                        <TemuIcon className="w-4 h-4" />
                        <span>Temu</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Shein">
                      <div className="flex items-center gap-2">
                        <SheinIcon className="w-4 h-4" />
                        <span>Shein</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Amazon">
                      <div className="flex items-center gap-2">
                        <AmazonIcon className="w-4 h-4" />
                        <span>Amazon</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productUrl">Enlace del Producto *</Label>
                <Input
                  id="productUrl"
                  type="url"
                  value={formData.productUrl}
                  onChange={(e) => handleChange("productUrl", e.target.value)}
                  placeholder="https://www.temu.com/..."
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">Copia y pega el enlace completo del producto</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Nombre del Producto *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleChange("productName", e.target.value)}
                  placeholder="Vestido de verano floral"
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productQuantity">Cantidad *</Label>
                <Input
                  id="productQuantity"
                  type="number"
                  min="1"
                  value={formData.productQuantity}
                  onChange={(e) => handleChange("productQuantity", Number.parseInt(e.target.value))}
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📦 Información Importante sobre el Peso</h4>
                <p className="text-sm text-blue-700 mb-2">
                  <strong>No necesitas saber el peso exacto ahora.</strong> Te cotizaremos con un peso estimado y el pago final se ajustará según el peso real cuando llegue el paquete.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>• <strong>1er Pago:</strong> Precio del producto + seguro (3%) + fee de plataforma</p>
                  <p>• <strong>2do Pago:</strong> Envío real ($10 base + $5.50 por libra real) + comisión</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientNotes">Detalles Adicionales (Talla, Color, etc.)</Label>
                <Textarea
                  id="clientNotes"
                  value={formData.clientNotes}
                  onChange={(e) => handleChange("clientNotes", e.target.value)}
                  placeholder="Ejemplo: Talla M, color azul..."
                  rows={3}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all"
              size="lg"
            >
              <Send className="size-5 mr-2" />
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
            </Button>

            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription className="text-sm">
                <strong>📱 Próximos pasos:</strong>
                <br />1. Te enviaremos el <strong>1er pago</strong> por WhatsApp (producto + seguro)
                <br />2. Una vez confirmado, compramos tu producto
                <br />3. Cuando llegue, te cobramos el <strong>2do pago</strong> (envío real según peso)
                <br />4. ¡Recibes tu producto! 🎉
              </AlertDescription>
            </Alert>
          </form>
        </div>
      </Card>
    </div>
  )
}
