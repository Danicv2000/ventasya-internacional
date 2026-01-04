"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Save, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CalculationConfig {
  exchangeRate: number
  baseShippingUSD: number
  shippingPerLbUSD: number
  commissionPercentage: number
  marginPercentage: number
  taxPercentage: number
}

export function CalculationSettings() {
  const [config, setConfig] = useState<CalculationConfig>({
    exchangeRate: 420,
    baseShippingUSD: 25,
    shippingPerLbUSD: 4,
    commissionPercentage: 15,
    marginPercentage: 5,
    taxPercentage: 19,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [tempConfig, setTempConfig] = useState<CalculationConfig>(config)

  const handleEdit = () => {
    setTempConfig(config)
    setIsEditing(true)
  }

  const handleSave = () => {
    setConfig(tempConfig)
    setIsEditing(false)
    // Aquí se conectaría con el backend para guardar la configuración
    console.log("Configuración guardada:", tempConfig)
  }

  const handleCancel = () => {
    setTempConfig(config)
    setIsEditing(false)
  }

  const handleReset = () => {
    const defaultConfig: CalculationConfig = {
      exchangeRate: 420,
      baseShippingUSD: 25,
      shippingPerLbUSD: 4,
      commissionPercentage: 15,
      marginPercentage: 5,
      taxPercentage: 19,
    }
    setTempConfig(defaultConfig)
    if (!isEditing) {
      setConfig(defaultConfig)
    }
  }

  const currentConfig = isEditing ? tempConfig : config

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Configuración de Cálculos</h2>
        </div>
        <Badge variant="outline" className="bg-primary/10">
          Sistema de Costos
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Tipo de Cambio */}
        <div className="space-y-2">
          <Label htmlFor="exchangeRate">Tipo de Cambio (USD a Pesos)</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 USD =</span>
            <Input
              id="exchangeRate"
              type="number"
              step="0.01"
              value={currentConfig.exchangeRate}
              onChange={(e) => setTempConfig(prev => ({ ...prev, exchangeRate: Number.parseFloat(e.target.value) }))}
              disabled={!isEditing}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">Pesos</span>
          </div>
        </div>

        {/* Configuración de Envío */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">CONFIGURACIÓN DE ENVÍO</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseShipping">Costo Fijo por Pedido</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  id="baseShipping"
                  type="number"
                  step="0.01"
                  value={currentConfig.baseShippingUSD}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, baseShippingUSD: Number.parseFloat(e.target.value) }))}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Costo fijo sin importar la cantidad de productos
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingPerLb">Costo por Libra</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  id="shippingPerLb"
                  type="number"
                  step="0.01"
                  value={currentConfig.shippingPerLbUSD}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, shippingPerLbUSD: Number.parseFloat(e.target.value) }))}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">USD/lb</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Fórmula de envío:</strong> ${currentConfig.baseShippingUSD} fijo por pedido + (Peso total en libras × ${currentConfig.shippingPerLbUSD})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ejemplo: Pedido de 3 productos (5 libras total) = ${currentConfig.baseShippingUSD} + (5 × ${currentConfig.shippingPerLbUSD}) = ${currentConfig.baseShippingUSD + (5 * currentConfig.shippingPerLbUSD)} USD
            </p>
          </div>
        </div>

        {/* Configuración de Márgenes */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">MÁRGENES Y COMISIONES</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Comisión sobre Producto</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="commission"
                  type="number"
                  step="0.1"
                  value={currentConfig.commissionPercentage}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, commissionPercentage: Number.parseFloat(e.target.value) }))}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin">Margen de Seguridad</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="margin"
                  type="number"
                  step="0.1"
                  value={currentConfig.marginPercentage}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, marginPercentage: Number.parseFloat(e.target.value) }))}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax">IVA por Defecto</Label>
            <div className="flex items-center gap-2">
              <Input
                id="tax"
                type="number"
                step="0.1"
                value={currentConfig.taxPercentage}
                onChange={(e) => setTempConfig(prev => ({ ...prev, taxPercentage: Number.parseFloat(e.target.value) }))}
                disabled={!isEditing}
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> La comisión y el margen se calculan sobre el valor del producto únicamente, no sobre el total con envío.
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 pt-4 border-t">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} className="flex-1">
                <Settings className="size-4 mr-2" />
                Editar Configuración
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="size-4 mr-2" />
                Restaurar Valores por Defecto
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} className="flex-1">
                <Save className="size-4 mr-2" />
                Guardar Cambios
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}