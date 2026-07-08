"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CategoryTabs, type ProductCategory } from "@/components/cash-register/category-tabs"
import { ProductCard } from "@/components/cash-register/product-card"
import { StaggerGrid, StaggerItem } from "@/components/ui/motion"
import { CartPanel } from "@/components/cash-register/cart-panel"
import { CartBottomSheet } from "@/components/cash-register/cart-bottom-sheet"
import { PaymentOverlay } from "@/components/cash-register/payment-overlay"
import { OrderSuccessOverlay } from "@/components/cash-register/order-success-overlay"
import { ProductSearch } from "@/components/cash-register/product-search"
import { useFlyToCart } from "@/components/cash-register/fly-to-cart"
import { Portal } from "@/components/ui/portal"
import { MaterialIcon } from "@/components/ui/material-icon"
import type { AppProduct, AppOrderItem } from "@/lib/types"
import { createOrder } from "@/lib/actions"
import { roundEuro } from "@/lib/order-utils"
import { useOperator } from "@/lib/operator-provider"

type CheckoutStep = "cart" | "payment" | "success"

/** Lowercase + strip diacritics so "cafe" matches "Café" */
function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

/** Three-step checkout: build cart → collect cash → confirm and show troco. */
export default function CashRegister({ products }: { products: AppProduct[] }) {
  const [orderItems, setOrderItems] = useState<AppOrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("bebida")
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [mobileCartDismissed, setMobileCartDismissed] = useState(false)
  const [mobileCartExpanded, setMobileCartExpanded] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart")
  const [completedOrder, setCompletedOrder] = useState<{ id: string; changeDue: number } | null>(
    null
  )
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { session } = useOperator()
  const { flyToCart, flyLayer, clearFlyToCart } = useFlyToCart()

  // A non-empty search looks across BOTH categories — operators shouldn't have to guess the tab
  const normalizedQuery = normalizeText(searchQuery.trim())
  const filteredProducts = normalizedQuery
    ? products.filter((p) => normalizeText(p.name).includes(normalizedQuery))
    : products.filter((p) => p.category === activeCategory)

  const handleAddToOrder = (product: AppProduct, originRect?: DOMRect) => {
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
    if (originRect) flyToCart(originRect, `${product.price.toFixed(2)}€`, product.category)
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

  const handleOpenPayment = () => {
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

    setCheckoutStep("payment")
  }

  const handleConfirmPayment = async (amountTendered: number) => {
    if (!session || isSubmitting || checkoutStep !== "payment") return

    const total = roundEuro(calculateTotal())
    const changeDue = roundEuro(amountTendered - total)

    setIsSubmitting(true)
    const result = await createOrder(
      orderItems,
      { operatorId: session.operatorId, shiftId: session.shiftId },
      { total, amountTendered, changeDue }
    )
    setIsSubmitting(false)

    if (result.success && result.order) {
      setCompletedOrder({ id: result.order.id, changeDue })
      setCheckoutStep("success")
      setOrderItems([])
      router.refresh()
    } else {
      toast.error("Erro", {
        description: "Houve um problema ao confirmar o pedido. Tente novamente.",
      })
    }
  }

  const handleNewOrder = useCallback(() => {
    setCheckoutStep("cart")
    setCompletedOrder(null)
  }, [])

  useEffect(() => {
    if (orderItems.length > 0) {
      setHighlightedIndex(orderItems.length - 1)
      const t = setTimeout(() => setHighlightedIndex(null), 600)
      return () => clearTimeout(t)
    }
  }, [orderItems.length])

  // Drop any in-flight fly-to-cart tokens when leaving the cart step,
  // so they don't paint over the payment/success overlays.
  useEffect(() => {
    if (checkoutStep !== "cart") clearFlyToCart()
  }, [checkoutStep, clearFlyToCart])

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
    <div className="flex flex-1 flex-col lg:flex-row min-h-0 lg:flex-none lg:h-[calc(100dvh_-_var(--festa-top-bar-height))] lg:overflow-hidden">
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <div className="sticky top-0 left-0 z-20 bg-festa-surface flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-gutter pt-4 pb-3">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          <ProductSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div
          className={cn(
            "flex-1 min-h-0 overflow-y-auto no-scrollbar px-gutter pt-6 transition-layout",
            mobileCartExpanded && "overflow-hidden touch-none lg:overflow-y-auto lg:touch-auto",
            showMobileCartPeek
              ? "pb-[calc(var(--festa-bottom-nav-height)+var(--festa-cart-peek-height)+1rem)]"
              : "pb-[calc(var(--festa-bottom-nav-height)+1.5rem)]",
            "lg:pb-6"
          )}
        >
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-festa-on-surface-variant">
              <MaterialIcon name="search_off" className="text-6xl mb-4 opacity-50" />
              <p className="font-bold">Nenhum produto encontrado</p>
              {normalizedQuery && (
                <p className="text-sm mt-1">Tente outro termo de pesquisa.</p>
              )}
            </div>
          ) : (
            <StaggerGrid
              key={activeCategory}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-card-gap"
            >
              {filteredProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} onAdd={handleAddToOrder} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
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
        onConfirm={handleOpenPayment}
      />

      <CartBottomSheet
        items={orderItems}
        total={calculateTotal()}
        itemCount={itemCount}
        isSubmitting={isSubmitting}
        highlightedIndex={highlightedIndex}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromOrder}
        onConfirm={handleOpenPayment}
        dismissed={mobileCartDismissed}
        onDismissedChange={handleMobileCartDismissedChange}
        onExpandedChange={setMobileCartExpanded}
      />

      <Portal>
        <PaymentOverlay
          show={checkoutStep === "payment"}
          total={roundEuro(calculateTotal())}
          isSubmitting={isSubmitting}
          onConfirm={handleConfirmPayment}
          onCancel={() => setCheckoutStep("cart")}
        />

        <OrderSuccessOverlay
          show={checkoutStep === "success"}
          orderId={completedOrder?.id ?? null}
          changeDue={completedOrder?.changeDue ?? 0}
          onNewOrder={handleNewOrder}
        />

        {flyLayer}
      </Portal>
    </div>
  )
}
