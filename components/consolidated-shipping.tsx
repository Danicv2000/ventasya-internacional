"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useShipping } from "@/contexts/shipping-context"
import { Package, Plus, Trash2, Users, Search } from "lucide-react"

// Mock data - En producción vendría de la API
const existingOrders = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    clientName: "María González",
    clientEmail: "maria@example.com",
    productName: "Vestido de verano floral",
    productPriceUSD: 25.99,
    quantity: 1,
    weightLbs: 0.8,
    status: "confirmed",
    isInShippingGroup: false
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    clientName: "Carlos Rodríguez",
    clientEmail: "carlos@example.com",
    productName: "Audífonos Bluetooth",
    productPriceUSD: 45.00,
    quantity: 1,
    weightLbs: 1.2,
    status: "confirmed",
    isInShippingGroup: false
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    clientName: "Ana Martínez",
    clientEmail: "ana@example.com",
    productName: "Reloj inteligente",
    productPriceUSD: 89.99,
    quantity: 1,
    weightLbs: 0.5,
    status: "confirmed",
    isInShippingGroup: false
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    clientName: "Luis Hernández",
    clientEmail: "luis@example.com",
    productName: "Zapatillas deportivas",
    productPriceUSD: 65.00,
    quantity: 1,
    weightLbs: 2.1,
    status: "confirmed",
    isInShippingGroup: false
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    clientName: "María González",
    clientEmail: "maria@example.com",
    productName: "Bolso de mano",
    productPriceUSD: 32.50,
    quantity: 1,
    weightLbs: 0.6,
    status: "confirmed",
    isInShippingGroup: false
  }
]

// SOLUCIÓN: Interfaz que define las propiedades que TypeScript reclama faltan
interface OrderWithDetails {
  id: string;
  clientName: string;
  productPriceUSD: number;
  quantity: number;
  weightLbs: number;
  orderNumber: string;
  productName: string;
}

export function ConsolidatedShipping() {
  const { currentGroup, addOrderToGroup, removeOrderFromGroup, createNewGroup } = useShipping()
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [availableOrders, setAvailableOrders] = useState(existingOrders)

  const handleAddExistingOrder = () => {
    const selectedOrder = availableOrders.find(order => order.id === selectedOrderId)
    if (!selectedOrder) return

    const orderForGroup = {
      id: selectedOrder.id,
      clientName: selectedOrder.clientName,
      productPriceUSD: selectedOrder.productPriceUSD,
      quantity: selectedOrder.quantity,
      weightLbs: selectedOrder.weightLbs,
      orderNumber: selectedOrder.orderNumber,
      productName: selectedOrder.productName
    }

    addOrderToGroup(orderForGroup)
    
    // Marcar como agregado al grupo
    setAvailableOrders(prev => 
      prev.map(order => 
        order.id === selectedOrderId 
          ? { ...order, isInShippingGroup: true }
          : order
      )
    )
    
    setSelectedOrderId("")
  }

  const handleRemoveOrder = (orderId: string) => {
    removeOrderFromGroup(orderId)
    
    // Marcar como disponible nuevamente
    setAvailableOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, isInShippingGroup: false }
          : order
      )
    )
  }

  const calculateOrderTotal = (order: any) => {
    const productTotal = order.productPriceUSD * order.quantity
    const baseShippingShare = currentGroup?.baseShippingPerOrder || 0
    const weightShipping = order.weightLbs * 4
    const shippingTotal = baseShippingShare + weightShipping
    
    // Comisión y margen sobre el producto
    const exchangeRate = 420
    const productTotalCOP = productTotal * exchangeRate
    const commission = productTotalCOP * 0.15
    const margin = productTotalCOP * 0.05
    
    const totalUSD = productTotal + shippingTotal
    const totalCOP = (totalUSD * exchangeRate) + commission + margin
    
    return {
      productTotal,
      baseShippingShare,
      weightShipping,
      shippingTotal,
      totalUSD,
      totalCOP,
      commission,
      margin
    }
  }

  // Filtrar pedidos disponibles (confirmados y no en grupo)
  const availableOrdersForSelection = availableOrders.filter(
    order => order.status === "confirmed" && !order.isInShippingGroup
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Package className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Envío Consolidado
              </h2>
              <p className="text-gray-600">Agrupa pedidos para ahorrar en envío</p>
            </div>
          </div>
          <Button 
            onClick={createNewGroup} 
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Plus className="size-4 mr-2" />
            Nuevo Grupo
          </Button>
        </div>

        {currentGroup && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-3xl font-bold text-blue-700 animate-pulse">{currentGroup.orders.length}</div>
              <div className="text-sm text-blue-600 font-medium">📦 Pedidos</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-3xl font-bold text-green-700 animate-pulse">{currentGroup.totalWeightLbs.toFixed(1)}</div>
              <div className="text-sm text-green-600 font-medium">⚖️ Libras Total</div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-3xl font-bold text-purple-700 animate-pulse">${currentGroup.baseShippingPerOrder.toFixed(2)}</div>
              <div className="text-sm text-purple-600 font-medium">💰 Por Pedido</div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-3xl font-bold text-orange-700 animate-pulse">${currentGroup.totalShippingUSD.toFixed(2)}</div>
              <div className="text-sm text-orange-600 font-medium">🚚 Envío Total</div>
            </div>
          </div>
        )}
      </Card>

      {/* Add Existing Order */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Search className="size-4" />
          Agregar Pedido Existente al Grupo
        </h3>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Seleccionar Pedido</label>
            <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
              <SelectTrigger>
                <SelectValue placeholder="Buscar por cliente o número de pedido..." />
              </SelectTrigger>
              <SelectContent>
                {availableOrdersForSelection.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    <div className="flex flex-col">
                      <div className="font-medium">{order.orderNumber} - {order.clientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.productName} • ${order.productPriceUSD} • {order.weightLbs} lbs
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddExistingOrder}
            disabled={!selectedOrderId}
          >
            <Plus className="size-4 mr-2" />
            Agregar al Grupo
          </Button>
        </div>

        {availableOrdersForSelection.length === 0 && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            No hay pedidos confirmados disponibles para agregar al grupo
          </div>
        )}
      </Card>

      {/* Orders List */}
      {currentGroup && currentGroup.orders.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="size-4" />
            Pedidos en el Grupo ({currentGroup.orders.length})
          </h3>
          
          <div className="space-y-4">
            {currentGroup.orders.map((order) => {
              // SOLUCIÓN APLICADA AQUÍ: Casting a OrderWithDetails para satisfacer a TypeScript
              const typedOrder = order as OrderWithDetails;
              const totals = calculateOrderTotal(typedOrder)
              
              return (
                <div key={typedOrder.id} className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{typedOrder.clientName}</h4>
                        <Badge variant="outline">{typedOrder.orderNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {typedOrder.productName} • {typedOrder.quantity}x • {typedOrder.weightLbs} lbs
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRemoveOrder(typedOrder.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Producto:</span>
                        <span>${totals.productTotal.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Envío Base (compartido):</span>
                        <span>${totals.baseShippingShare.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Envío por Peso:</span>
                        <span>${totals.weightShipping.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total USD:</span>
                        <span>${totals.totalUSD.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Comisión (15%):</span>
                        <span>{totals.commission.toLocaleString("es-CU")} Pesos Cubanos</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margen (5%):</span>
                        <span>{totals.margin.toLocaleString("es-CU")} Pesos Cubanos</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1 text-primary">
                        <span>TOTAL FINAL:</span>
                        <span>{totals.totalCOP.toLocaleString("es-CU")} Pesos Cubanos</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h4 className="font-semibold mb-2">Resumen del Envío Consolidado</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Costo fijo total:</span>
                <div className="font-bold">$25.00 USD</div>
                <div className="text-xs text-muted-foreground">
                  ${currentGroup.baseShippingPerOrder.toFixed(2)} por pedido
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Costo por peso:</span>
                <div className="font-bold">${currentGroup.weightShippingTotal.toFixed(2)} USD</div>
                <div className="text-xs text-muted-foreground">
                  {currentGroup.totalWeightLbs.toFixed(1)} lbs × $4
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total envío:</span>
                <div className="font-bold text-primary">${currentGroup.totalShippingUSD.toFixed(2)} USD</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
