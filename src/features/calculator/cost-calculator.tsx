"use client"

import { useState } from "react"
import { Calculator, RotateCcw, Sparkles } from "lucide-react"
import { Card } from "@/src/shared/ui/card"
import { Label } from "@/src/shared/ui/label"
import { Input } from "@/src/shared/ui/input"
import { Switch } from "@/src/shared/ui/switch"
import { Button } from "@/src/shared/ui/button"
import { Badge } from "@/src/shared/ui/badge"


interface CalculationResult {
  productPriceUSD: number
  quantity: number
  subtotalUSD: number
  weightLbs: number
  baseShippingUSD: number
  weightShippingUSD: number
  totalShippingUSD: number
  platformFeeUSD: number
  totalCostUSD: number
  exchangeRate: number
  totalCostCOP: number
  commissionPercentage: number
  commissionCOP: number
  profitMarginPercentage: number
  profitMarginCOP: number
  subtotalBeforeTaxCOP: number
  taxPercentage: number
  taxCOP: number
  finalPriceCOP: number
  profitCOP: number
}

export function CostCalculator() {
  const [productPriceUSD, setProductPriceUSD] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [weightLbs, setWeightLbs] = useState("")
  const [exchangeRate, setExchangeRate] = useState("420")
  const [commissionPercentage, setCommissionPercentage] = useState("15")
  const [profitMarginPercentage, setProfitMarginPercentage] = useState("5")
  const [customPlatformFee, setCustomPlatformFee] = useState("0")
  const [includeTax, setIncludeTax] = useState(false)
  const [taxPercentage, setTaxPercentage] = useState("19")

  const [result, setResult] = useState<CalculationResult | null>(null)

  const handleCalculate = () => {
    const productPrice = Number.parseFloat(productPriceUSD)
    const qty = quantity
    const weight = Number.parseFloat(weightLbs) || 0
    const subtotal = productPrice * qty

    // Gastos fijos de envío: 25 USD por pedido (sin importar cantidad)
    const baseShipping = 25
    
    // Gastos variables: 5.5 USD por libra (incluye costo real + margen)
    const weightShipping = weight * 5.5
    
    // Total de envío
    const totalShipping = baseShipping + weightShipping

    const platformFee = Number.parseFloat(customPlatformFee)

    const totalUSD = subtotal + totalShipping + platformFee
    const rate = Number.parseFloat(exchangeRate)
    const totalCOP = totalUSD * rate

    const commission = Number.parseFloat(commissionPercentage)
    const commissionCOP = (subtotal * rate) * (commission / 100) // Comisión sobre el valor del producto

    const margin = Number.parseFloat(profitMarginPercentage)
    const marginCOP = (subtotal * rate) * (margin / 100) // Margen sobre el valor del producto

    const subtotalBeforeTax = totalCOP + commissionCOP + marginCOP

    let tax = 0
    let taxCOP = 0
    if (includeTax) {
      tax = Number.parseFloat(taxPercentage)
      taxCOP = subtotalBeforeTax * (tax / 100)
    }

    const finalPrice = subtotalBeforeTax + taxCOP
    const profit = commissionCOP + marginCOP

    setResult({
      productPriceUSD: productPrice,
      quantity: qty,
      subtotalUSD: subtotal,
      weightLbs: weight,
      baseShippingUSD: baseShipping,
      weightShippingUSD: weightShipping,
      totalShippingUSD: totalShipping,
      platformFeeUSD: platformFee,
      totalCostUSD: totalUSD,
      exchangeRate: rate,
      totalCostCOP: totalCOP,
      commissionPercentage: commission,
      commissionCOP,
      profitMarginPercentage: margin,
      profitMarginCOP: marginCOP,
      subtotalBeforeTaxCOP: subtotalBeforeTax,
      taxPercentage: tax,
      taxCOP,
      finalPriceCOP: finalPrice,
      profitCOP: profit,
    })
  }

  const handleReset = () => {
    setProductPriceUSD("")
    setQuantity(1)
    setWeightLbs("")
    setExchangeRate("420")
    setCommissionPercentage("15")
    setProfitMarginPercentage("5")
    setCustomPlatformFee("0")
    setIncludeTax(false)
    setTaxPercentage("19")
    setResult(null)
  }

  const isValid = productPriceUSD && Number.parseFloat(productPriceUSD) > 0 && weightLbs && Number.parseFloat(weightLbs) > 0

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="p-6 space-y-6 hover:shadow-xl transition-shadow">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            Parámetros de Cálculo
          </h2>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productPrice">Precio del Producto (USD) *</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                value={productPriceUSD}
                onChange={(e) => setProductPriceUSD(e.target.value)}
                placeholder="25.99"
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso del Paquete (Libras) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                placeholder="2.5"
                className="focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Envío: $25 USD fijo por pedido + $4 USD por libra total
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="pt-4 border-t space-y-4">
          <h3 className="font-semibold">Configuración Avanzada</h3>

          <div className="space-y-2">
            <Label htmlFor="exchangeRate">Tasa de Cambio (USD a Pesos)</Label>
            <Input
              id="exchangeRate"
              type="number"
              step="0.01"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Comisión (% sobre producto)</Label>
              <Input
                id="commission"
                type="number"
                step="0.1"
                value={commissionPercentage}
                onChange={(e) => setCommissionPercentage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin">Margen de Seguridad (% sobre producto)</Label>
              <Input
                id="margin"
                type="number"
                step="0.1"
                value={profitMarginPercentage}
                onChange={(e) => setProfitMarginPercentage(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformFee">Tarifa Plataforma (USD)</Label>
            <Input
              id="platformFee"
              type="number"
              step="0.01"
              value={customPlatformFee}
              onChange={(e) => setCustomPlatformFee(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <Label htmlFor="includeTax">Incluir IVA</Label>
              <p className="text-xs text-muted-foreground">Agregar impuesto al precio final</p>
            </div>
            <Switch id="includeTax" checked={includeTax} onCheckedChange={setIncludeTax} />
          </div>

          {includeTax && (
            <div className="space-y-2">
              <Label htmlFor="taxPercentage">IVA (%)</Label>
              <Input
                id="taxPercentage"
                type="number"
                step="0.1"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleCalculate}
            disabled={!isValid}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all"
          >
            <Calculator className="size-4 mr-2" />
            Calcular
          </Button>
          <Button onClick={handleReset} variant="outline" className="hover:bg-primary/5 bg-transparent">
            <RotateCcw className="size-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      <Card className="p-6 sticky top-20 hover:shadow-xl transition-shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Resultado del Cálculo
        </h2>

        {!result ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calculator className="size-12 mx-auto mb-4 opacity-20" />
            <p>Ingresa el precio del producto y el peso del paquete para calcular los costos</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* USD Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">Costos en USD</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Producto ({result.quantity}x):</span>
                  <span className="font-medium">${result.subtotalUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío Base (fijo por pedido):</span>
                  <span className="font-medium">${result.baseShippingUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío por Peso ({result.weightLbs} lbs):</span>
                  <span className="font-medium">${result.weightShippingUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Envío:</span>
                  <span className="font-medium">${result.totalShippingUSD.toFixed(2)}</span>
                </div>
                {result.platformFeeUSD > 0 && (
                  <div className="flex justify-between">
                    <span>Tarifa Plataforma:</span>
                    <span className="font-medium">${result.platformFeeUSD.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total USD:</span>
                  <span>${result.totalCostUSD.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Exchange Rate */}
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Tasa de Cambio</p>
              <p className="text-lg font-bold">1 USD = ${result.exchangeRate.toFixed(2)} Pesos</p>
            </div>

            {/* COP Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">Costos en Pesos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Costo Base:</span>
                  <span className="font-medium">${result.totalCostCOP.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-chart-1">
                  <span>Comisión ({result.commissionPercentage}% sobre producto):</span>
                  <span className="font-medium">+${result.commissionCOP.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-chart-2">
                  <span>Margen ({result.profitMarginPercentage}% sobre producto):</span>
                  <span className="font-medium">+${result.profitMarginCOP.toLocaleString("es-CO")}</span>
                </div>

                {includeTax && result.taxCOP > 0 && (
                  <>
                    <div className="flex justify-between pt-2 border-t">
                      <span>Subtotal:</span>
                      <span className="font-medium">${result.subtotalBeforeTaxCOP.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between text-chart-3">
                      <span>IVA ({result.taxPercentage}%):</span>
                      <span className="font-medium">+${result.taxCOP.toLocaleString("es-CO")}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Final Price */}
            <div className="pt-4 border-t">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Precio Final:</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">${result.finalPriceCOP.toLocaleString("es-CO")}</div>
                    <Badge variant="secondary" className="mt-1 bg-gradient-to-r from-primary/20 to-accent/20">
                      Pesos
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-muted/30 rounded-lg p-3">
                  <span className="text-sm font-medium">Equivalente en USD:</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${(result.finalPriceCOP / result.exchangeRate).toFixed(2)}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      USD
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-chart-1/10 rounded-lg p-3 border border-chart-1/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ganancia Total:</span>
                  <span className="text-lg font-bold text-chart-1">
                    ${result.profitCOP.toLocaleString("es-CO")} Pesos
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((result.profitCOP / result.finalPriceCOP) * 100).toFixed(1)}% del precio final
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
