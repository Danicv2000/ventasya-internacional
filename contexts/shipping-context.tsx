"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface Order {
  id: string
  productPriceUSD: number
  quantity: number
  weightLbs: number
  clientName: string
}

interface ShippingGroup {
  id: string
  orders: Order[]
  totalWeightLbs: number
  baseShippingPerOrder: number
  weightShippingTotal: number
  totalShippingUSD: number
}

interface ShippingContextType {
  currentGroup: ShippingGroup | null
  addOrderToGroup: (order: Order) => void
  removeOrderFromGroup: (orderId: string) => void
  calculateShippingForOrder: (orderId: string) => number
  createNewGroup: () => void
  getOrderShippingBreakdown: (orderId: string) => {
    baseShippingShare: number
    weightShipping: number
    totalShipping: number
  } | null
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined)

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [currentGroup, setCurrentGroup] = useState<ShippingGroup | null>(null)

  const createNewGroup = () => {
    const newGroup: ShippingGroup = {
      id: `group-${Date.now()}`,
      orders: [],
      totalWeightLbs: 0,
      baseShippingPerOrder: 0,
      weightShippingTotal: 0,
      totalShippingUSD: 0,
    }
    setCurrentGroup(newGroup)
  }

  const recalculateGroup = (group: ShippingGroup) => {
    const totalOrders = group.orders.length
    const totalWeight = group.orders.reduce((sum, order) => sum + order.weightLbs, 0)
    
    // $25 USD fijo dividido entre todos los pedidos
    const baseShippingPerOrder = totalOrders > 0 ? 25 / totalOrders : 0
    
    // $4 USD por libra total
    const weightShippingTotal = totalWeight * 4
    
    const totalShippingUSD = 25 + weightShippingTotal

    return {
      ...group,
      totalWeightLbs: totalWeight,
      baseShippingPerOrder,
      weightShippingTotal,
      totalShippingUSD,
    }
  }

  const addOrderToGroup = (order: Order) => {
    if (!currentGroup) {
      createNewGroup()
    }

    setCurrentGroup(prev => {
      if (!prev) return null
      
      const updatedGroup = {
        ...prev,
        orders: [...prev.orders, order]
      }
      
      return recalculateGroup(updatedGroup)
    })
  }

  const removeOrderFromGroup = (orderId: string) => {
    setCurrentGroup(prev => {
      if (!prev) return null
      
      const updatedGroup = {
        ...prev,
        orders: prev.orders.filter(order => order.id !== orderId)
      }
      
      return recalculateGroup(updatedGroup)
    })
  }

  const calculateShippingForOrder = (orderId: string): number => {
    if (!currentGroup) return 0
    
    const order = currentGroup.orders.find(o => o.id === orderId)
    if (!order) return 0

    // Parte proporcional del costo fijo + costo por peso individual
    const baseShippingShare = currentGroup.baseShippingPerOrder
    const weightShipping = order.weightLbs * 4
    
    return baseShippingShare + weightShipping
  }

  const getOrderShippingBreakdown = (orderId: string) => {
    if (!currentGroup) return null
    
    const order = currentGroup.orders.find(o => o.id === orderId)
    if (!order) return null

    const baseShippingShare = currentGroup.baseShippingPerOrder
    const weightShipping = order.weightLbs * 4
    const totalShipping = baseShippingShare + weightShipping

    return {
      baseShippingShare,
      weightShipping,
      totalShipping
    }
  }

  return (
    <ShippingContext.Provider value={{
      currentGroup,
      addOrderToGroup,
      removeOrderFromGroup,
      calculateShippingForOrder,
      createNewGroup,
      getOrderShippingBreakdown
    }}>
      {children}
    </ShippingContext.Provider>
  )
}

export function useShipping() {
  const context = useContext(ShippingContext)
  if (context === undefined) {
    throw new Error('useShipping must be used within a ShippingProvider')
  }
  return context
}