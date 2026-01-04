"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calculator, RotateCcw, Sparkles, TrendingUp, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export function EnhancedCostCalculator() {
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
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleCalculate = async () => {
    setIsCalculating(true)
    setShowResult(false)
    
    // Simular cálculo con delay para mostrar animación
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const productPrice = Number.parseFloat(productPriceUSD)
    const qty = quantity
    const weight = Number.parseFloat(weightLbs) || 0
    const subtotal = productPrice * qty

    // Gastos fijos de envío: 25 USD por pedido (sin importar cantidad)
    const baseShipping = 25
    
    // Gastos variables: 4 USD por libra
    const weightShipping = weight * 4
    
    // Total de envío
    const totalShipping = baseShipping + weightShipping

    const platformFee = Number.parseFloat(customPlatformFee)

    const totalUSD = subtotal + totalShipping + platformFee
    const rate = Number.parseFloat(exchangeRate)
    const totalCOP = totalUSD * rate

    const commission = Number.parseFloat(commissionPercentage)
    const commissionCOP = (subtotal * rate) * (commission / 100)

    const margin = Number.parseFloat(profitMarginPercentage)
    const marginCOP = (subtotal * rate) * (margin / 100)

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

    setIsCalculating(false)
    setTimeout(() => setShowResult(true), 100)
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
    setShowResult(false)
  }

  const isValid = productPriceUSD && Number.parseFloat(productPriceUSD) > 0 && weightLbs && Number.parseFloat(weightLbs) > 0

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <Card className="p-8 space-y-6 bg-gradient-to-br from-white to-blue-50/50 border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse">
              <Calculator className="size-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Calculadora de Costos
            </h2>
            <p className="text-gray-600 mt-2">Ingresa los datos de tu producto</p>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-3 transform transition-all duration-300 hover:scale-105">
              <Label htmlFor="productPrice" className="text-lg font-semibold text-gray-700">
                💰 Precio del Producto (USD) *
              </Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                value={productPriceUSD}
                onChange={(e) => setProductPriceUSD(e.target.value)}
                placeholder="25.99"
                className="text-lg p-4 border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3 transform transition-all duration-300 hover:scale-105">
                <Label htmlFor="quantity" className="text-lg font-semibold text-gray-700">
                  📦 Cantidad
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  className="text-lg p-4 border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 rounded-xl"
                />
              </div>

              <div className="space-y-3 transform transition-all duration-300 hover:scale-105">
                <Label htmlFor="weight" className="text-lg font-semibold text-gray-700">
                  ⚖️ Peso (Libras) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  placeholder="2.5"
                  className="text-lg p-4 border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 rounded-xl"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <span><strong>Envío:</strong> $25 USD fijo por pedido + $4 USD por libra total</span>
              </p>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="pt-6 border-t-2 border-gray-200 space-y-4">
            <h3 className="font-bold text-lg text-gray-700 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Configuración Avanzada
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exchangeRate" className="font-semibold text-gray-700">Tasa de Cambio</Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.01"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission" className="font-semibold text-gray-700">Comisión (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  step="0.1"
                  value={commissionPercentage}
                  onChange={(e) => setCommissionPercentage(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              onClick={handleCalculate}
              disabled={!isValid || isCalculating}
              className="flex-1 text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculando...
                </>
              ) : (
                <>
                  <Calculator className="size-5 mr-2" />
                  Calcular Precio
                </>
              )}
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="px-6 py-6 border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="size-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <Card className="p-8 bg-gradient-to-br from-white to-green-50/50 border-2 border-green-100 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4 animate-pulse">
              <Sparkles className="size-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Resultado del Cálculo
            </h2>
          </div>

          {!result ? (
            <div className="text-center py-16 text-gray-500">
              <div className="animate-bounce mb-4">
                <Calculator className="size-16 mx-auto opacity-30" />
              </div>
              <p className="text-lg">Completa los datos para ver el cálculo</p>
            </div>
          ) : (
            <div className={`space-y-6 transition-all duration-700 ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* USD Breakdown */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-lg text-blue-800 mb-4 flex items-center gap-2">
                  <DollarSign className="size-5" />
                  Costos en USD
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="font-medium">Producto ({result.quantity}x):</span>
                    <span className="font-bold text-blue-700">${result.subtotalUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="font-medium">Envío Base:</span>
                    <span className="font-bold text-blue-700">${result.baseShippingUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="font-medium">Envío por Peso ({result.weightLbs} lbs):</span>
                    <span className="font-bold text-blue-700">${result.weightShippingUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-blue-100 rounded-lg px-4">
                    <span className="font-bold text-lg">Total USD:</span>
                    <span className="font-bold text-xl text-blue-800">${result.totalCostUSD.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 text-center border-2 border-purple-200">
                <p className="text-sm text-purple-700 mb-2">💱 Tasa de Cambio</p>
                <p className="text-2xl font-bold text-purple-800">
                  1 USD = ${result.exchangeRate.toFixed(2)} Pesos
                </p>
              </div>

              {/* Final Price */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-8 text-center border-2 border-green-200">
                <div className="mb-4">
                  <p className="text-lg font-semibold text-green-700 mb-2">💰 Precio Final</p>
                  <div className="text-4xl font-bold text-green-800 mb-2 animate-pulse">
                    ${result.finalPriceCOP.toLocaleString("es-CU")}
                  </div>
                  <Badge className="bg-green-600 text-white px-4 py-1 text-sm">
                    Pesos Cubanos
                  </Badge>
                </div>
                
                <div className="bg-white/70 rounded-lg p-4 mt-4">
                  <p className="text-sm text-green-700 mb-1">Equivalente en USD:</p>
                  <p className="text-2xl font-bold text-green-800">
                    ${(result.finalPriceCOP / result.exchangeRate).toFixed(2)} USD
                  </p>
                </div>
              </div>

              {/* Profit */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 border-2 border-yellow-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-yellow-800 flex items-center gap-2">
                      <TrendingUp className="size-5" />
                      Ganancia Total
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {((result.profitCOP / result.finalPriceCOP) * 100).toFixed(1)}% del precio final
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-800">
                      ${result.profitCOP.toLocaleString("es-CU")}
                    </div>
                    <p className="text-sm text-yellow-700">Pesos</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}