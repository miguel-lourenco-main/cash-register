"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CategoryTabs, type ProductCategory } from "@/components/cash-register/category-tabs"
import { ProductCard } from "@/components/cash-register/product-card"
import { CartPanel } from "@/components/cash-register/cart-panel"
import { CartBottomSheet } from "@/components/cash-register/cart-bottom-sheet"
import type { AppProduct, AppOrderItem } from "@/lib/types"
import { createOrder } from "@/lib/actions"
import { useOperator } from "@/lib/operator-provider"

export default function CashRegister({ products }: { products: AppProduct[] }) {
  const [orderItems, setOrderItems] = useState<AppOrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("bebida")
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [mobileCartDismissed, setMobileCartDismissed] = useState(false)
  const [mobileCartExpanded, setMobileCartExpanded] = useState(false)
  const router = useRouter()
  const { session } = useOperator()

  const filteredProducts = products.filter((p) => p.category === activeCategory)

  const handleAddToOrder = (product: AppProduct) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { product, quantity: 1 }]
    })
    setMobileCartDismissed(false)
    setHighlightedIndex(orderItems.length)
    setTimeout(() => setHighlightedIndex(null), 600)
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromOrder(productId)
    } else {
      setOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const handleRemoveFromOrder = (productId: string) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const calculateTotal = () =>
    orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleConfirmOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Pedido Vazio", {
        description: "Por favor adicione itens ao pedido antes de confirmar.",
      })
      return
    }

    if (!session) {
      toast.error("Sessão expirada", {
        description: "Inicie o turno novamente.",
      })
      return
    }

    setIsSubmitting(true)
    const result = await createOrder(orderItems, {
      operatorId: session.operatorId,
      shiftId: session.shiftId,
    })
    setIsSubmitting(false)

    if (result.success && result.order) {
      toast.success("Pedido Confirmado!", {
        description: `Pedido #${result.order.id} foi criado com sucesso.`,
      })
      setOrderItems([])
      router.refresh()
    } else {
      toast.error("Erro", {
        description: "Houve um problema ao confirmar o pedido.",
      })
    }
  }

  useEffect(() => {
    if (orderItems.length > 0) {
      setHighlightedIndex(orderItems.length - 1)
      const t = setTimeout(() => setHighlightedIndex(null), 600)
      return () => clearTimeout(t)
    }
  }, [orderItems.length])

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-festa-on-surface-variant px-gutter">
        <p className="text-center">
          Nenhum produto encontrado. É possível que a base de dados esteja em pausa. Contacte o
          administrador.
        </p>
      </div>
    )
  }

  const showMobileCartPeek = itemCount > 0 && !mobileCartDismissed

  const handleMobileCartDismissedChange = useCallback((dismissed: boolean) => {
    setMobileCartDismissed(dismissed)
  }, [])

  return (
    <div className="flex flex-1 flex-col lg:flex-row min-h-0">
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

        <div
          className={cn(
            "flex-1 overflow-y-auto no-scrollbar px-gutter pt-6 transition-layout",
            mobileCartExpanded && "overflow-hidden touch-none lg:overflow-y-auto lg:touch-auto",
            showMobileCartPeek
              ? "pb-[calc(var(--festa-bottom-nav-height)+var(--festa-cart-peek-height)+1rem)]"
              : "pb-[calc(var(--festa-bottom-nav-height)+1.5rem)]",
            "lg:pb-6"
          )}
        >
          <div
            key={activeCategory}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-card-gap animate-in fade-in duration-300"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddToOrder}
              />
            ))}
          </div>
        </div>
      </div>

      <CartPanel
        items={orderItems}
        total={calculateTotal()}
        itemCount={itemCount}
        isSubmitting={isSubmitting}
        highlightedIndex={highlightedIndex}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromOrder}
        onConfirm={handleConfirmOrder}
      />

      <CartBottomSheet
        items={orderItems}
        total={calculateTotal()}
        itemCount={itemCount}
        isSubmitting={isSubmitting}
        highlightedIndex={highlightedIndex}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromOrder}
        onConfirm={handleConfirmOrder}
        dismissed={mobileCartDismissed}
        onDismissedChange={handleMobileCartDismissedChange}
        onExpandedChange={setMobileCartExpanded}
      />
    </div>
  )
}
