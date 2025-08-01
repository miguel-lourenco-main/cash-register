import OrderList from "@/components/order-list"
import { getOrders } from "@/lib/actions"

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = await getOrders()
  return (
    <div className="py-6">
      <OrderList initialOrders={orders} />
    </div>
  )
}
