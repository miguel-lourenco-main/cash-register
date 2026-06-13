"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AdminAccessDenied } from "@/components/products/admin-access-denied"
import { ProductForm } from "@/components/products/product-form"
import { ProductsList } from "@/components/products/products-list"
import { useOperator } from "@/lib/operator-provider"
import { getProducts } from "@/lib/products"
import type { AppProduct } from "@/lib/types"

export default function ProductsAdminClient() {
  const { session } = useOperator()
  const [products, setProducts] = useState<AppProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AppProduct | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.operatorRole === "admin") {
      void loadProducts()
    } else {
      setLoading(false)
    }
  }, [session?.operatorRole, loadProducts])

  if (!session || session.operatorRole !== "admin") {
    return <AdminAccessDenied />
  }

  if (loading) {
    return (
      <div className="py-6 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="sm" text="A carregar produtos..." />
      </div>
    )
  }

  const handleSaved = (product: AppProduct) => {
    setProducts((current) => {
      const index = current.findIndex((item) => item.id === product.id)
      if (index === -1) {
        return [...current, product].sort((a, b) => a.name.localeCompare(b.name))
      }
      const next = [...current]
      next[index] = product
      return next.sort((a, b) => a.name.localeCompare(b.name))
    })
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleEdit = (product: AppProduct) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <div className="px-gutter md:px-margin-page py-gutter flex flex-col gap-gutter max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-headline-lg-mobile font-display font-bold text-festa-primary-emphasis">
            Gestão de produtos
          </h2>
          <p className="text-festa-on-surface-variant mt-1">
            Crie ou edite produtos e adicione fotos ao menu.
          </p>
        </div>
        {!showForm && (
          <Button
            variant="accent"
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
          >
            <MaterialIcon name="add" className="text-xl" />
            Novo produto
          </Button>
        )}
      </div>

      {showForm && session && (
        <ProductForm
          session={session}
          product={editingProduct}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      )}

      <ProductsList products={products} onEdit={handleEdit} />
    </div>
  )
}
