"use client"

import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { AnimatedNumber, CartPing, MotionPresence } from "@/components/ui/motion"
import { CartLineItem } from "@/components/cash-register/cart-line-item"
import { springs } from "@/lib/motion"
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
      className="hidden lg:flex w-[380px] shrink-0 flex-col border-l-2 border-festa-border bg-card sticky top-0 self-start overflow-hidden"
      style={{ height: "calc(100dvh - var(--festa-top-bar-height))", maxHeight: "calc(100dvh - var(--festa-top-bar-height))" }}
    >
      <div className="h-20 border-b-2 border-festa-border flex items-center px-6 bg-festa-amber shrink-0">
        <h2 className="font-display text-title-md uppercase text-festa-ink flex items-center gap-2">
          <MaterialIcon name="shopping_cart" filled />
          Pedido Atual
        </h2>
        <CartPing
          trigger={itemCount}
          className="ml-auto bg-festa-ink text-festa-surface text-sm font-bold w-8 h-8 rounded-md flex items-center justify-center tabular-nums"
        >
          {itemCount}
        </CartPing>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar p-6 min-h-0 relative">
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
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
                  transition={springs.snappy}
                >
                  <CartLineItem
                    item={item}
                    highlighted={highlightedIndex === index}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="p-6 bg-festa-paper border-t-2 border-festa-border space-y-4 shrink-0">
        <div className="flex justify-between items-end pt-2">
          <span className="text-label-xl text-festa-on-surface-variant pb-2">Total</span>
          <AnimatedNumber
            value={total}
            format={(v) => `${v.toFixed(2)}€`}
            className="text-price-display text-festa-primary-emphasis"
          />
        </div>
        <Button
          variant="accent"
          disabled={isSubmitting || items.length === 0}
          onClick={onConfirm}
          className="w-full h-16 text-xl gap-3"
        >
          <MaterialIcon name="check_circle" className="text-2xl" />
          {isSubmitting ? "A processar..." : "Confirmar Pedido"}
        </Button>
      </div>
    </aside>
  )
}
