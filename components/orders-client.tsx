"use client"

import { useState, useEffect } from "react"
import OrderList from "@/components/order-list"
import { getOrders } from "@/lib/actions"
import type { Order } from "@/lib/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

/** Client boundary: fetches orders after mount for the history/analytics views. */
export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="py-6 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="sm" text="A carregar pedidos..." />
      </div>
    )
  }

  return <OrderList initialOrders={orders} />
}
