"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (orderData: any) => void
}

export function CreateOrderModal({ isOpen, onClose, onSave }: CreateOrderModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    productName: "",
    productUrl: "",
    storeName: "",
    productPriceUSD: "",
    productQuantity: 1,
    weightLbs: "",
    shippingAddress: "",
    shippingCity: "",
    notes: "",
  })

  const [exchangeRate, setExchangeRate] = useState("420")

  const [priceBreakdown, setPriceBreakdown] = useState<any>(null)

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (["productPriceUSD", "weightLbs", "productQuantity"].includes(field)) {
      setPriceBreakdown(null)
    }
  }

  const calculatePrice = () => {
    const productPrice = Number.parseFloat(formData.productPriceUSD)
    const quantity = formData.productQuantity
    const weight = Number.parseFloat(formData.weightLbs) || 0
    const subtotal = productPrice * quantity

    // Gastos fijos de envío: 25 USD por pedido completo
    const baseShipping = 25

    // Gastos variables: 4 USD por libra
    const weightShipping = weight * 4

    // Total de envío
    const totalShipping = baseShipping + weightShipping

    const totalCostUSD = subtotal + totalShipping
    const rate = Number.parseFloat(exchangeRate) || 420
    const totalCostCOP = totalCostUSD * rate

    // Comisión: 15% sobre el valor del producto
    const commissionPercentage = 15
    const commissionCOP = (subtotal * rate) * (commissionPercentage / 100)

    // Margen de seguridad: 5% sobre el valor del producto
    const profitMarginPercentage = 5
    const profitMarginCOP = (subtotal * rate) * (profitMarginPercentage / 100)

    const finalPriceCOP = totalCostCOP + commissionCOP + profitMarginCOP

    setPriceBreakdown({
      productPriceUSD: subtotal,
      weightLbs: weight,
      baseShippingUSD: baseShipping,
      weightShippingUSD: weightShipping,
      totalShippingUSD: totalShipping,
      totalCostUSD,
      exchangeRate: rate,
      totalCostCOP,
      commissionPercentage,
      commissionCOP,
      profitMarginPercentage,
      profitMarginCOP,
      finalPriceCOP,
    })
  }

  const handleSave = () => {
    const orderData = {
      ...formData,
      priceBreakdown,
      orderNumber: `ORD-${Date.now()}`,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
    }
    onSave(orderData)
    onClose()
    // Reset form
    setFormData({
      clientName: "",
      clientPhone: "",
      productName: "",
      productUrl: "",
      storeName: "",
      productPriceUSD: "",
      productQuantity: 1,
      weightLbs: "",
      shippingAddress: "",
      shippingCity: "",
      notes: "",
    })
    setPriceBreakdown(null)
  }

  const isFormValid =
    formData.clientName &&
    formData.clientPhone &&
    formData.productName &&
    formData.productPriceUSD &&
    formData.weightLbs

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Crear Nuevo Pedido</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
              <div className="space-y-2">
                <Label htmlFor="exchangeRate" className="text-base font-semibold">
                  Tasa de Cambio (USD a Pesos Cubanos) *
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">1 USD =</span>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.01"
                    value={exchangeRate}
                    onChange={(e) => {
                      setExchangeRate(e.target.value)
                      setPriceBreakdown(null)
                    }}
                    placeholder="420.00"
                    className="flex-1 font-semibold text-lg"
                  />
                  <span className="text-sm font-medium">Pesos Cubanos</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Actualiza la tasa de cambio actual del dólar a peso cubano
                </p>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información del Cliente</h3>

              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleChange("clientName", e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono *</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleChange("clientPhone", e.target.value)}
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Dirección</Label>
                <Input
                  id="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={(e) => handleChange("shippingAddress", e.target.value)}
                  placeholder="Calle 45 #12-34"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingCity">Ciudad</Label>
                <Input
                  id="shippingCity"
                  value={formData.shippingCity}
                  onChange={(e) => handleChange("shippingCity", e.target.value)}
                  placeholder="Bogotá"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información del Producto</h3>

              <div className="space-y-2">
                <Label htmlFor="productName">Nombre del Producto *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleChange("productName", e.target.value)}
                  placeholder="Vestido floral"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productUrl">URL del Producto</Label>
                <Input
                  id="productUrl"
                  value={formData.productUrl}
                  onChange={(e) => handleChange("productUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productPriceUSD">Precio USD *</Label>
                  <Input
                    id="productPriceUSD"
                    type="number"
                    step="0.01"
                    value={formData.productPriceUSD}
                    onChange={(e) => handleChange("productPriceUSD", e.target.value)}
                    placeholder="25.99"
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightLbs">Peso del Paquete (Libras) *</Label>
                <Input
                  id="weightLbs"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weightLbs}
                  onChange={(e) => handleChange("weightLbs", e.target.value)}
                  placeholder="2.5"
                />
                <p className="text-xs text-muted-foreground">
                  Envío: $25 USD fijo por pedido + $4 USD por libra total
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeName">Tienda (Opcional)</Label>
                <Select value={formData.storeName} onValueChange={(value) => handleChange("storeName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tienda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Temu">Temu</SelectItem>
                    <SelectItem value="Shein">Shein</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Detalles adicionales..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Price Calculation Section */}
          <div className="space-y-4">
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Cálculo de Precio</h3>

              <Button
                onClick={calculatePrice}
                disabled={!formData.productPriceUSD || !formData.weightLbs || !exchangeRate}
                className="w-full mb-4 bg-gradient-to-r from-primary to-accent"
              >
                <Calculator className="size-4 mr-2" />
                Calcular Precio
              </Button>

              {priceBreakdown && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Producto:</span>
                    <span>${priceBreakdown.productPriceUSD.toFixed(2)} USD</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío Base:</span>
                    <span>${priceBreakdown.baseShippingUSD.toFixed(2)} USD</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío por Peso ({priceBreakdown.weightLbs} lbs):</span>
                    <span>${priceBreakdown.weightShippingUSD.toFixed(2)} USD</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Envío:</span>
                    <span>${priceBreakdown.totalShippingUSD.toFixed(2)} USD</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total USD:</span>
                    <span className="font-semibold">${priceBreakdown.totalCostUSD.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm bg-muted px-3 py-2 rounded">
                    <span>Tasa de cambio:</span>
                    <span>{priceBreakdown.exchangeRate.toFixed(2)} Pesos Cubanos/USD</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Costo Pesos:</span>
                    <span>{priceBreakdown.totalCostCOP.toLocaleString("es-CU")} Pesos Cubanos</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comisión (15% sobre producto):</span>
                    <span>{priceBreakdown.commissionCOP.toLocaleString("es-CU")} Pesos Cubanos</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Margen (5% sobre producto):</span>
                    <span>{priceBreakdown.profitMarginCOP.toLocaleString("es-CU")} Pesos Cubanos</span>
                  </div>

                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-lg font-bold">Precio Final:</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {priceBreakdown.finalPriceCOP.toLocaleString("es-CU")} Pesos Cubanos
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        ${(priceBreakdown.finalPriceCOP / priceBreakdown.exchangeRate).toFixed(2)} USD
                      </div>
                      <Badge className="mt-1">Calculado</Badge>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Button
              onClick={handleSave}
              disabled={!isFormValid || !priceBreakdown}
              className="w-full bg-gradient-to-r from-chart-1 to-chart-2 hover:scale-105 transition-all"
              size="lg"
            >
              <Save className="size-4 mr-2" />
              Guardar Pedido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
