"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import { MotionPresence } from "@/components/ui/motion"
import { CartLineItem } from "@/components/cash-register/cart-line-item"
import type { AppOrderItem } from "@/lib/types"

interface CartPanelProps {
  items: AppOrderItem[]
  total: number
  itemCount: number
  isSubmitting: boolean
  highlightedIndex: number | null
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onConfirm: () => void
}

export function CartPanel({
  items,
  total,
  itemCount,
  isSubmitting,
  highlightedIndex,
  onUpdateQuantity,
  onRemove,
  onConfirm,
}: CartPanelProps) {
  return (
    <aside
      className="hidden lg:flex w-[380px] shrink-0 flex-col border-l border-festa-outline-variant/30 bg-card sticky top-0 self-start overflow-hidden"
      style={{ height: "calc(100dvh - var(--festa-top-bar-height))", maxHeight: "calc(100dvh - var(--festa-top-bar-height))" }}
    >
      <div className="h-20 border-b border-festa-outline-variant flex items-center px-6 bg-festa-surface-container-low shrink-0">
        <h2 className="text-title-md font-display font-bold text-festa-on-surface flex items-center gap-2">
          <MaterialIcon name="shopping_cart" filled className="text-festa-accent" />
          Pedido Atual
        </h2>
        <span
          key={itemCount}
          className="ml-auto bg-festa-primary-container text-festa-on-primary-container text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200"
        >
          {itemCount}
        </span>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar  p-6 min-h-0 relative">
        <MotionPresence
          show={items.length === 0}
          enterFrom="zoom-in-95"
          exitTo="zoom-out-95"
          className="absolute inset-0 flex flex-col items-center justify-center text-festa-on-surface-variant opacity-50 space-y-4 p-6"
        >
          <MaterialIcon name="shopping_basket" className="text-6xl" />
          <p className="text-body-lg">Pedido vazio</p>
          <p className="text-sm text-center">Clique num produto para adicionar</p>
        </MotionPresence>
        {items.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
            {items.map((item, index) => (
              <CartLineItem
                key={item.product.id}
                item={item}
                highlighted={highlightedIndex === index}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-festa-surface-container-lowest border-t border-festa-outline-variant space-y-4 shrink-0">
        <div className="flex justify-between items-end pt-2">
          <span className="text-title-md font-bold text-festa-on-surface">Total</span>
          <span className="text-price-display text-festa-primary-emphasis">{total.toFixed(2)}€</span>
        </div>
        <button
          type="button"
          disabled={isSubmitting || items.length === 0}
          onClick={onConfirm}
          className="w-full h-touch-target-min bg-festa-primary hover:bg-festa-primary-container text-festa-on-primary-container rounded-xl font-bold text-headline-lg-mobile shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <MaterialIcon name="check_circle" />
          {isSubmitting ? "A processar..." : "Confirmar Pedido"}
        </button>
      </div>
    </aside>
  )
}
