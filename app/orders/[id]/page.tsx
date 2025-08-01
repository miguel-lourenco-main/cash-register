import OrderDetails from "@/components/order-details"
import { getOrderById } from "@/lib/actions"
import { notFound } from "next/navigation"

// Allow dynamic parameters that aren't pre-generated
export const dynamicParams = true
// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return <OrderDetails order={order} />
}
