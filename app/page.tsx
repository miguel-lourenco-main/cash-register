import CashRegister from "@/components/cash-register"
import { getProducts } from "@/lib/products"

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getProducts()
  return <CashRegister products={products} />
}
