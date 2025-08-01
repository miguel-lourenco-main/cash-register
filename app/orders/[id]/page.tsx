import OrderDetails from "@/components/order-details"
import { getOrderById } from "@/lib/actions"
import { notFound } from "next/navigation"

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

  return <OrderDetails order={order} />
}
