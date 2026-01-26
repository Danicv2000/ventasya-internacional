"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Target } from "lucide-react"

interface ProfitabilityAdvisorProps {
  productPriceUSD: number
  totalProfitCUP: number
  profitMarginPercentage: number
  exchangeRate: number
  totalCostUSD: number
}

export function ProfitabilityAdvisor({ 
  productPriceUSD, 
  totalProfitCUP, 
  profitMarginPercentage, 
  exchangeRate,
  totalCostUSD 
}: ProfitabilityAdvisorProps) {
  
  const profitUSD = totalProfitCUP / exchangeRate
  const profitPercentageOfTotal = (profitUSD / totalCostUSD) * 100
  
  const getRecommendations = () => {
    const recommendations = []
    
    // Análisis de rentabilidad
    if (profitPercentageOfTotal < 15) {
      recommendations.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Margen Bajo",
        message: "Tu margen de ganancia es menor al 15%. Considera aumentar la comisión o el margen.",
        action: "Aumenta la comisión al 25% o el margen al 20%"
      })
    } else if (profitPercentageOfTotal > 30) {
      recommendations.push({
        type: "success",
        icon: CheckCircle,
        title: "Excelente Rentabilidad",
        message: "Tu margen es muy bueno. Puedes ser competitivo reduciendo ligeramente los precios.",
        action: "Considera reducir 2-3% para ser más competitivo"
      })
    } else {
      recommendations.push({
        type: "good",
        icon: TrendingUp,
        title: "Rentabilidad Saludable",
        message: "Tu margen está en un rango óptimo para el mercado cubano.",
        action: "Mantén esta estructura de precios"
      })
    }
    
    // Análisis por valor del producto
    if (productPriceUSD < 20) {
      recommendations.push({
        type: "info",
        icon: Target,
        title: "Producto de Bajo Valor",
        message: "Para productos baratos, considera aumentar el fee fijo de plataforma.",
        action: "Aumenta el fee a $3-5 USD para productos < $20"
      })
    } else if (productPriceUSD > 100) {
      recommendations.push({
        type: "info",
        icon: DollarSign,
        title: "Producto de Alto Valor",
        message: "Para productos caros, puedes reducir el porcentaje de comisión.",
        action: "Reduce la comisión al 15-18% para productos > $100"
      })
    }
    
    // Análisis de competitividad
    const totalMarkup = profitPercentageOfTotal
    if (totalMarkup > 35) {
      recommendations.push({
        type: "warning",
        icon: TrendingDown,
        title: "Precio Poco Competitivo",
        message: "Tu markup total es muy alto. Los clientes podrían buscar alternativas.",
        action: "Reduce costos operacionales o márgenes"
      })
    }
    
    return recommendations
  }
  
  const recommendations = getRecommendations()
  
  const getStatusColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-100 border-green-300 text-green-800"
      case "good": return "bg-blue-100 border-blue-300 text-blue-800"
      case "warning": return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "info": return "bg-purple-100 border-purple-300 text-purple-800"
      default: return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }
  
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <TrendingUp className="size-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Asesor de Rentabilidad
        </h3>
        <p className="text-gray-600 mt-2">Análisis y recomendaciones para tu negocio</p>
      </div>
      
      {/* Métricas Clave */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 rounded-lg p-4 text-center border border-indigo-200">
          <p className="text-sm text-indigo-600 font-medium">Ganancia Total</p>
          <p className="text-2xl font-bold text-indigo-800">${profitUSD.toFixed(2)} USD</p>
          <p className="text-xs text-gray-500">${totalProfitCUP.toLocaleString("es-CU")} CUP</p>
        </div>
        <div className="bg-white/70 rounded-lg p-4 text-center border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Margen Total</p>
          <p className="text-2xl font-bold text-purple-800">{profitPercentageOfTotal.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Del costo total</p>
        </div>
      </div>
      
      {/* Recomendaciones */}
      <div className="space-y-4">
        <h4 className="font-bold text-lg text-indigo-800 mb-3">📊 Recomendaciones:</h4>
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon
          return (
            <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(rec.type)}`}>
              <div className="flex items-start gap-3">
                <IconComponent className="size-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-1">{rec.title}</h5>
                  <p className="text-sm mb-2">{rec.message}</p>
                  <div className="bg-white/50 rounded p-2 text-xs">
                    <strong>Acción sugerida:</strong> {rec.action}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Consejos Generales */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
        <h5 className="font-bold text-green-800 mb-2">💡 Consejos para Maximizar Rentabilidad:</h5>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Ajusta precios según la tasa de cambio del dólar</li>
          <li>• Ofrece descuentos por volumen para pedidos grandes</li>
          <li>• Considera un fee mínimo para productos muy baratos</li>
          <li>• Revisa tus márgenes mensualmente según la competencia</li>
          <li>• Mantén transparencia total con los clientes sobre costos</li>
        </ul>
      </div>
    </Card>
  )
}