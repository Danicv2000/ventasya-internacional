"use client"

import { useState } from "react"
import { Card } from "@/src/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"
import { Button } from "@/src/shared/ui/button"
import { BarChart, TrendingUp, DollarSign, Package, Download } from "lucide-react"
import { Badge } from "@/src/shared/ui/badge"
import { TemuIcon, SheinIcon, AmazonIcon } from '@/src/features/common/platform-icons'

// Mock data for reports
const monthlyData = [
  { month: "Ene", orders: 12, revenue: 2450000, profit: 612500 },
  { month: "Feb", orders: 15, revenue: 3120000, profit: 780000 },
  { month: "Mar", orders: 18, revenue: 3850000, profit: 962500 },
  { month: "Abr", orders: 14, revenue: 2980000, profit: 745000 },
  { month: "May", orders: 22, revenue: 4650000, profit: 1162500 },
  { month: "Jun", orders: 25, revenue: 5340000, profit: 1335000 },
]

const storeData = [
  { store: "Temu", orders: 45, revenue: 8950000, percentage: 40 },
  { store: "Shein", orders: 38, revenue: 7540000, percentage: 34 },
  { store: "Amazon", orders: 23, revenue: 5920000, percentage: 26 },
]

const statusData = [
  { status: "Entregados", count: 68, percentage: 64 },
  { status: "En Tránsito", count: 22, percentage: 21 },
  { status: "Pendientes", count: 16, percentage: 15 },
]

export function ReportsSystem() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0)
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0)
  const totalProfit = monthlyData.reduce((sum, m) => sum + m.profit, 0)
  const avgOrderValue = totalRevenue / totalOrders

  const handleExport = () => {
    console.log("[v0] Exporting report for period:", selectedPeriod)
    alert("Reporte exportado exitosamente")
  }

  return (
    <main className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reportes Financieros</h1>
          <p className="text-muted-foreground">Análisis detallado de tu negocio</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="size-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="size-5 text-primary" />
            </div>
            <Badge variant="outline" className="text-chart-4">
              +12%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Total Pedidos</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="size-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <DollarSign className="size-5 text-chart-1" />
            </div>
            <Badge variant="outline" className="text-chart-4">
              +18%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Ingresos</p>
          <p className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="size-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <TrendingUp className="size-5 text-chart-2" />
            </div>
            <Badge variant="outline" className="text-chart-4">
              +15%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Ganancia</p>
          <p className="text-2xl font-bold">${(totalProfit / 1000000).toFixed(1)}M</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="size-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <BarChart className="size-5 text-chart-3" />
            </div>
            <Badge variant="outline" className="text-chart-4">
              +8%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Ticket Promedio</p>
          <p className="text-2xl font-bold">${(avgOrderValue / 1000).toFixed(0)}K</p>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monthly">Análisis Mensual</TabsTrigger>
          <TabsTrigger value="stores">Por Tienda</TabsTrigger>
          <TabsTrigger value="status">Por Estado</TabsTrigger>
        </TabsList>

        {/* Monthly Analysis */}
        <TabsContent value="monthly" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Rendimiento Mensual</h3>
            <div className="space-y-4">
              {monthlyData.map((data) => {
                const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue))
                const barWidth = (data.revenue / maxRevenue) * 100

                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <div className="text-right">
                        <span className="font-semibold">${(data.revenue / 1000000).toFixed(2)}M</span>
                        <span className="text-muted-foreground ml-2">({data.orders} pedidos)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen de Ganancias</h3>
              <div className="space-y-3">
                {monthlyData.slice(-3).map((data) => (
                  <div key={data.month} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{data.month}</p>
                      <p className="text-xs text-muted-foreground">{data.orders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-chart-1">${(data.profit / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">
                        {((data.profit / data.revenue) * 100).toFixed(1)}% margen
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tendencias</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-chart-4/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Mejor Mes</p>
                    <p className="text-xs text-muted-foreground">Junio 2024</p>
                  </div>
                  <Badge className="bg-chart-4 text-white">25 pedidos</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-chart-1/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Mayor Ingreso</p>
                    <p className="text-xs text-muted-foreground">Junio 2024</p>
                  </div>
                  <Badge className="bg-chart-1 text-white">$5.34M</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-chart-2/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Crecimiento Promedio</p>
                    <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
                  </div>
                  <Badge className="bg-chart-2 text-white">+15%</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Store Analysis */}
        <TabsContent value="stores" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Análisis por Tienda</h3>
            <div className="space-y-6">
              {storeData.map((data) => (
                <div key={data.store} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{data.store}</p>
                      <p className="text-sm text-muted-foreground">{data.orders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">${(data.revenue / 1000000).toFixed(2)}M</p>
                      <Badge variant="secondary">{data.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full transition-all"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-4">
            {storeData.map((data) => (
              <Card key={data.store} className="p-6 text-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {data.store === 'Temu' && <TemuIcon className="w-8 h-8" />}
                  {data.store === 'Shein' && <SheinIcon className="w-8 h-8" />}
                  {data.store === 'Amazon' && <AmazonIcon className="w-8 h-8" />}
                </div>
                <h4 className="font-bold text-xl mb-1">{data.store}</h4>
                <p className="text-sm text-muted-foreground mb-3">{data.orders} pedidos totales</p>
                <div className="text-2xl font-bold text-primary">${(data.revenue / 1000000).toFixed(2)}M</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Promedio: ${(data.revenue / data.orders / 1000).toFixed(0)}K por pedido
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Status Analysis */}
        <TabsContent value="status" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Estado de Pedidos</h3>
            <div className="space-y-4">
              {statusData.map((data) => {
                const colors = {
                  Entregados: "bg-chart-4",
                  "En Tránsito": "bg-chart-2",
                  Pendientes: "bg-chart-3",
                }
                const color = colors[data.status as keyof typeof colors]

                return (
                  <div key={data.status} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{data.status}</span>
                        <span className="text-sm text-muted-foreground">
                          {data.count} ({data.percentage}%)
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all`}
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            {statusData.map((data) => (
              <Card key={data.status} className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">{data.status}</p>
                <p className="text-4xl font-bold mb-2">{data.count}</p>
                <Badge variant="secondary">{data.percentage}% del total</Badge>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
