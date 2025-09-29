"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import OrderList from "@/components/order-list"
import OrderDetails from "@/components/order-details"
import { getOrders, getOrderById } from "@/lib/actions"
import type { Order } from "@/lib/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function OrdersClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [orders, setOrders] = useState<Order[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Fetch specific order when orderId changes
  useEffect(() => {
    if (orderId) {
      setLoading(true)
      const fetchOrder = async () => {
        try {
          const orderData = await getOrderById(orderId)
          setOrder(orderData || null)
        } catch (error) {
          console.error("Failed to fetch order:", error)
          setOrder(null)
        } finally {
          setLoading(false)
        }
      }

      fetchOrder()
    } else {
      setOrder(null)
      setLoading(false)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="py-6 flex items-center justify-center">
        <LoadingSpinner 
          size="sm"
          text="Carregando..."
        />
      </div>
    )
  }

  if (orderId && order) {
    return <OrderDetails order={order} />
  }

  if (orderId && !order) {
    return (
      <div className="py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Pedido não encontrado</h2>
          <p className="text-muted-foreground">O pedido que você está procurando não existe ou foi removido.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <OrderList initialOrders={orders} />
    </div>
  )
}
