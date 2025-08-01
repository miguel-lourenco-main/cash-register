import CashRegister from "@/components/cash-register"
import { getProducts } from "@/lib/products"

export default function Home() {
  const products = getProducts()
  return <CashRegister products={products} />
}
