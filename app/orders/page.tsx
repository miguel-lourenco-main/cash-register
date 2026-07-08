import OrdersClient from "@/components/orders-client"

// Enable static export
export const dynamic = 'force-static'

/** Order history and analytics — data loads client-side after static export. */
export default function OrdersPage() {
  return <OrdersClient />
}
