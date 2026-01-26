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
  const [ordersInPackage, setOrdersInPackage] = useState("4") // Número estimado de pedidos por paquete

  const [priceBreakdown, setPriceBreakdown] = useState<any>(null)

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (["productPriceUSD", "weightLbs", "productQuantity"].includes(field)) {
      setPriceBreakdown(null)
    }
  }

  const handleOrdersInPackageChange = (value: string) => {
    setOrdersInPackage(value)
    setPriceBreakdown(null)
  }

  const calculatePrice = () => {
    const productPrice = Number.parseFloat(formData.productPriceUSD)
    const quantity = formData.productQuantity
    const weight = Number.parseFloat(formData.weightLbs) || 2.0 // Peso por defecto si no se especifica
    const subtotal = productPrice * quantity

    // Gastos fijos de envío consolidado: $10 USD dividido entre pedidos
    const ordersCount = Number.parseInt(ordersInPackage) || 4
    const baseShipping = 10 / ordersCount
    
    // Gastos variables: 5.5 USD por libra (incluye costo real + margen)
    const weightShipping = weight * 5.5
    
    // Costos operacionales
    const operationalCost = 5
    
    // Seguro del producto (3% del valor)
    const insuranceRate = 3
    const insuranceCost = (subtotal * insuranceRate) / 100
    
    // Fee de plataforma
    const platformFee = 2
    
    // Total de envío
    const totalShipping = baseShipping + weightShipping + operationalCost + insuranceCost

    const totalCostUSD = subtotal + totalShipping + platformFee
    const rate = Number.parseFloat(exchangeRate) || 420
    const totalCostCUP = totalCostUSD * rate

    // Comisión: 20% sobre el valor del producto
    const commissionPercentage = 20
    const commissionCUP = (subtotal * rate) * (commissionPercentage / 100)

    // Margen de ganancia: 15% sobre el valor del producto
    const profitMarginPercentage = 15
    const profitMarginCUP = (subtotal * rate) * (profitMarginPercentage / 100)

    const finalPriceCUP = totalCostCUP + commissionCUP + profitMarginCUP

    // Cálculo de pagos en 2 etapas
    const initialMargin = profitMarginCUP * 0.5 // 50% del margen en el primer pago
    const firstPaymentUSD = subtotal + insuranceCost + platformFee
    const firstPaymentCUP = (firstPaymentUSD * rate) + initialMargin
    
    const remainingMargin = profitMarginCUP * 0.5 // 50% restante del margen
    const secondPaymentUSD = totalShipping - insuranceCost // Ya incluido en primer pago
    const secondPaymentCUP = (secondPaymentUSD * rate) + remainingMargin + commissionCUP

    setPriceBreakdown({
      productPriceUSD: subtotal,
      weightLbs: weight,
      baseShippingUSD: baseShipping,
      weightShippingUSD: weightShipping,
      totalShippingUSD: totalShipping,
      operationalCost,
      insuranceCost,
      platformFee,
      totalCostUSD,
      exchangeRate: rate,
      totalCostCUP,
      commissionPercentage,
      commissionCUP,
      profitMarginPercentage,
      profitMarginCUP,
      finalPriceCUP,
      firstPaymentUSD,
      firstPaymentCUP,
      secondPaymentUSD,
      secondPaymentCUP,
    })
  }

  const handleSave = () => {
    const orderData = {
      ...formData,
      priceBreakdown,
      firstPaymentCUP: priceBreakdown?.firstPaymentCUP || 0,
      secondPaymentCUP: priceBreakdown?.secondPaymentCUP || 0,
      finalPriceCUP: priceBreakdown?.finalPriceCUP || 0,
      estimatedWeightLbs: Number.parseFloat(formData.weightLbs) || 2.0,
      orderNumber: `ORD-${Date.now()}`,
      status: "pending",
      paymentStatus: "pending",
      firstPaymentStatus: "pending",
      secondPaymentStatus: "pending",
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
    formData.productPriceUSD

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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exchangeRate" className="text-base font-semibold">
                    Tasa de Cambio (USD a CUP) *
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
                    <span className="text-sm font-medium">CUP</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ordersInPackage" className="text-base font-semibold">
                    Pedidos por Paquete *
                  </Label>
                  <Input
                    id="ordersInPackage"
                    type="number"
                    min="1"
                    max="10"
                    value={ordersInPackage}
                    onChange={(e) => handleOrdersInPackageChange(e.target.value)}
                    className="font-semibold text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Número estimado de pedidos que van juntos
                  </p>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  📦 Envío Consolidado: $10 USD ÷ {ordersInPackage} pedidos = ${(10 / Number.parseInt(ordersInPackage || "4")).toFixed(2)} USD por pedido
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Esto hace que productos baratos sean más accesibles para tus clientes
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📦 Nuevo Sistema de Pagos en 2 Etapas</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>🛒 1er Pago (Al crear pedido):</strong></p>
                <ul className="text-xs ml-4 space-y-1">
                  <li>• Precio del producto</li>
                  <li>• Seguro (3% del valor)</li>
                  <li>• Fee de plataforma ($2 USD)</li>
                  <li>• 50% del margen de ganancia</li>
                </ul>
                
                <p><strong>📦 2do Pago (Cuando llegue el paquete):</strong></p>
                <ul className="text-xs ml-4 space-y-1">
                  <li>• Envío consolidado (${(10 / Number.parseInt(ordersInPackage || "4")).toFixed(2)} + $5.50/lb real)</li>
                  <li>• Costos operacionales ($5 USD)</li>
                  <li>• Comisión (20%)</li>
                  <li>• 50% restante del margen</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightLbs">Peso Estimado (Libras) - Opcional</Label>
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
                ⚠️ Solo para estimación inicial. El 2do pago se calculará con el peso real.
              </p>

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
              <h3 className="font-semibold text-lg mb-4">💰 Sistema de Pagos en 2 Etapas</h3>

              <Button
                onClick={calculatePrice}
                disabled={!formData.productPriceUSD || !exchangeRate}
                className="w-full mb-4 bg-gradient-to-r from-primary to-accent"
              >
                <Calculator className="size-4 mr-2" />
                Calcular Pagos
              </Button>

              {priceBreakdown && (
                <div className="space-y-4">
                  {/* Primer Pago */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">🛒 Primer Pago (Al crear pedido)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Producto:</span>
                        <span>${priceBreakdown.productPriceUSD.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seguro (3%):</span>
                        <span>${priceBreakdown.insuranceCost.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fee Plataforma:</span>
                        <span>${priceBreakdown.platformFee.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between font-semibold text-blue-800 pt-2 border-t border-blue-300">
                        <span>Total 1er Pago:</span>
                        <span>${priceBreakdown.firstPaymentCUP.toLocaleString("es-CU")} CUP</span>
                      </div>
                    </div>
                  </div>

                  {/* Segundo Pago */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">📦 Segundo Pago (Al llegar paquete)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Envío Base Consolidado:</span>
                        <span>${priceBreakdown.baseShippingUSD.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Por Peso ({priceBreakdown.weightLbs} lbs):</span>
                        <span>${priceBreakdown.weightShippingUSD.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operacional:</span>
                        <span>${priceBreakdown.operationalCost.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comisión (20%):</span>
                        <span>${priceBreakdown.commissionCUP.toLocaleString("es-CU")} CUP</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-800 pt-2 border-t border-green-300">
                        <span>Total 2do Pago:</span>
                        <span>${priceBreakdown.secondPaymentCUP.toLocaleString("es-CU")} CUP</span>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        * Se recalculará con el peso real del paquete
                      </p>
                    </div>
                  </div>

                  {/* Total Final */}
                  <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">💰 Total Final:</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${(priceBreakdown.firstPaymentCUP + priceBreakdown.secondPaymentCUP).toLocaleString("es-CU")} CUP
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          ${((priceBreakdown.firstPaymentCUP + priceBreakdown.secondPaymentCUP) / priceBreakdown.exchangeRate).toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p><strong>📋 Proceso:</strong></p>
                    <p>1. Cliente paga el 1er monto al confirmar</p>
                    <p>2. Compramos y enviamos el producto</p>
                    <p>3. Al llegar, pesamos y cobramos el 2do monto real</p>
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
