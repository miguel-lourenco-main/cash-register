import OrderDetails from "@/components/order-details"
import { getOrderById } from "@/lib/actions"
import { notFound } from "next/navigation"

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return <OrderDetails order={order} />
}
