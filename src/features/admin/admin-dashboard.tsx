"use client"

import { useState, useEffect } from "react"
import { Card } from "@/src/shared/ui/card"
import { Button } from "@/src/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs"
import { Package, DollarSign, ShoppingCart, Clock, CheckCircle, Settings, Plus, Calculator, Truck, LogOut, User } from "lucide-react"
import { OrdersTable } from "@/src/features/orders/orders-table"
import { OrderDetailModal } from "@/src/features/orders/order-detail-modal"
import { CreateOrderModal } from "@/src/features/orders/create-order-modal"
import { CalculationSettings } from "@/src/features/calculator/calculation-settings"
import { ConsolidatedShipping } from "@/src/features/tracking/consolidated-shipping"
import { useAuth } from "@/src/core/contexts/auth-context"
import { toast } from "@/src/shared/hooks/use-toast"
import { supabase, isSupabaseConfigured } from "@/src/lib/supabase-client"
import Link from "next/link"

// Type for orders from Supabase
interface OrderFromDB {
  id: string
  order_number: string
  client_id: string | null
  manager_id: string | null
  status: string
  total_amount: number
  shipping_cost: number
  profit_margin: number
  currency: string
  items: any[]
  created_at: string
  updated_at: string
  admin_notes: string | null
  amount_paid: number
}

// Type for local order display (compatible with existing components)
interface LocalOrder {
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
  estimatedWeightLbs: number
  actualWeightLbs: number
  createdAt: Date
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<LocalOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<LocalOrder | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const { logout } = useAuth()

  // Fetch orders from Supabase
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    if (!supabase || !isSupabaseConfigured()) {
      toast.error('Supabase no está configurado')
      setLoading(false)
      return
    }
    
    try {
      // Fetch orders with client info
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        toast.error('Error al cargar pedidos')
        return
      }

      // Fetch all clients
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')

      // Create a map for quick client lookup
      const clientsMap = new Map((clientsData || []).map(c => [c.id, c]))

      // Transform data to local format
      const transformedOrders: LocalOrder[] = (ordersData || []).map((order: OrderFromDB) => {
        const client = order.client_id ? clientsMap.get(order.client_id) : null
        return {
          id: order.id,
          orderNumber: order.order_number,
          clientName: client?.full_name || 'Cliente',
          clientEmail: client?.email || 'cliente@email.com',
          productName: order.items?.[0]?.name || 'Producto',
          storeName: order.items?.[0]?.store || 'Otro',
          finalPriceCUP: (order.total_amount || 0) * (order.items?.[0]?.price || 1),
          firstPaymentCUP: (order.total_amount || 0) * 0.6,
          secondPaymentCUP: (order.total_amount || 0) * 0.4,
          status: order.status,
          paymentStatus: order.amount_paid > 0 ? 'partial' : 'pending',
          firstPaymentStatus: order.amount_paid > 0 ? 'paid' : 'pending',
          secondPaymentStatus: 'pending',
          estimatedWeightLbs: 2,
          actualWeightLbs: 2,
          createdAt: new Date(order.created_at),
        }
      })

      setOrders(transformedOrders)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.finalPriceCUP, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length

  const handleCreateOrder = (orderData: any) => {
    // Refresh orders list - the success toast is shown by create-order-modal
    fetchOrders()
  }

  // SOLUCIÓN: Función puente para manejar la diferencia de tipos entre OrdersTable y el estado local
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="size-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2">
              <User className="size-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Administrador</span>
            </div>
            <Link href="/">
              <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
                Ver Sitio
              </Button>
            </Link>
            <Button 
              onClick={logout}
              variant="outline" 
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              <LogOut className="size-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 space-y-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </div>
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="size-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-3xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="size-12 rounded-full bg-chart-1/10 flex items-center justify-center">
                <DollarSign className="size-6 text-chart-1" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">En Proceso</p>
                <p className="text-3xl font-bold">{pendingOrders}</p>
              </div>
              <div className="size-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <Clock className="size-6 text-chart-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Entregados</p>
                <p className="text-3xl font-bold">{deliveredOrders}</p>
              </div>
              <div className="size-12 rounded-full bg-chart-4/10 flex items-center justify-center">
                <CheckCircle className="size-6 text-chart-4" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="orders" className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold">Panel de Administración</h2>
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingCart className="size-4" />
                  Pedidos
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex items-center gap-2">
                  <Truck className="size-4" />
                  Envíos
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Calculator className="size-4" />
                  Config
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="orders" className="space-y-6">
              <Tabs defaultValue="all" className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl font-semibold">Gestión de Pedidos</h3>
                  <div className="flex items-center gap-4">
                    <TabsList>
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="pending">Pendientes</TabsTrigger>
                      <TabsTrigger value="in_transit">En Tránsito</TabsTrigger>
                      <TabsTrigger value="delivered">Entregados</TabsTrigger>
                    </TabsList>
                    <Button
                      onClick={() => setIsCreatingOrder(true)}
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <Plus className="size-4 mr-2" />
                      Crear Pedido
                    </Button>
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <OrdersTable orders={orders} onViewOrder={handleViewOrder} />
                  )}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  <OrdersTable
                    orders={orders.filter((o) => o.status === "pending" || o.status === "confirmed")}
                    onViewOrder={handleViewOrder}
                  />
                </TabsContent>

                <TabsContent value="in_transit" className="space-y-4">
                  <OrdersTable
                    orders={orders.filter((o) => o.status === "in_transit")}
                    onViewOrder={handleViewOrder}
                  />
                </TabsContent>

                <TabsContent value="delivered" className="space-y-4">
                  <OrdersTable orders={orders.filter((o) => o.status === "delivered")} onViewOrder={handleViewOrder} />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-6">
              <ConsolidatedShipping />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <CalculationSettings />
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

      {/* Create Order Modal */}
      <CreateOrderModal isOpen={isCreatingOrder} onClose={() => setIsCreatingOrder(false)} onSave={handleCreateOrder} />
    </div>
  )
}
