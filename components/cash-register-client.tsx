"use client"

import { useState, useEffect } from "react"
import CashRegister from "@/components/cash-register"
import { getProducts } from "@/lib/products"
import type { AppProduct } from "@/lib/types"

export default function CashRegisterClient() {
  const [products, setProducts] = useState<AppProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="py-6">Carregando produtos...</div>
  }

  return <CashRegister products={products} />
}
