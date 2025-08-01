import CashRegister from "@/components/cash-register"
import { getProducts } from "@/lib/products"

export default async function Home() {
  const products = await getProducts()
  return <CashRegister products={products} />
}
