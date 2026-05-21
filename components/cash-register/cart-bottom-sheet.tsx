"use client"

import { useEffect, useState } from "react"
import { MaterialIcon } from "@/components/ui/material-icon"
import {
  COLLAPSIBLE_DURATION_MS,
  Collapsible,
  FadeIn,
  MotionPresence,
} from "@/components/ui/motion"
import { CartLineItem } from "@/components/cash-register/cart-line-item"
import type { AppOrderItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CartBottomSheetProps {
  items: AppOrderItem[]
  total: number
  itemCount: number
  isSubmitting: boolean
  highlightedIndex: number | null
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onConfirm: () => void
  dismissed: boolean
  onDismissedChange: (dismissed: boolean) => void
  onExpandedChange?: (expanded: boolean) => void
}

export function CartBottomSheet({
  items,
  total,
  itemCount,
  isSubmitting,
  highlightedIndex,
  onUpdateQuantity,
  onRemove,
  onConfirm,
  dismissed,
  onDismissedChange,
  onExpandedChange,
}: CartBottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [footerReady, setFooterReady] = useState(false)

  useEffect(() => {
    if (itemCount === 0) {
      setIsOpen(false)
      onDismissedChange(false)
    }
  }, [itemCount, onDismissedChange])

  useEffect(() => {
    if (!isOpen) {
      setFooterReady(false)
      return
    }
    const timer = window.setTimeout(() => setFooterReady(true), COLLAPSIBLE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    onExpandedChange?.(isOpen && !dismissed && itemCount > 0)
  }, [isOpen, dismissed, itemCount, onExpandedChange])

  const setExpanded = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <MotionPresence show={itemCount > 0}>
      {dismissed ? (
        <FadeIn
          key="cart-fab"
          from="slide-in-from-bottom-4 zoom-in-95"
          className="lg:hidden fixed right-4 z-30"
          style={{ bottom: "calc(var(--festa-bottom-nav-height) + 0.75rem)" }}
        >
          <button
            type="button"
            onClick={() => onDismissedChange(false)}
            className="flex items-center gap-2 pl-4 pr-5 h-14 rounded-full bg-festa-primary-container text-festa-on-primary-container shadow-lg shadow-festa-primary-container/25 active:scale-95 transition-transform"
            aria-label="Abrir pedido atual"
          >
            <MaterialIcon name="shopping_cart" filled />
            <span className="font-bold">{itemCount}</span>
            <span className="font-bold">{total.toFixed(2)}€</span>
          </button>
        </FadeIn>
      ) : (
        <FadeIn
          key="cart-sheet"
          from="slide-in-from-bottom-4"
          className="lg:hidden fixed left-0 right-0 z-30 flex flex-col min-h-0 overflow-hidden bg-card rounded-t-[24px] shadow-festa-cart border-t border-festa-outline-variant/30 transition-layout"
          style={{
            bottom: "var(--festa-bottom-nav-height)",
            maxHeight:
              "calc(100dvh - var(--festa-top-bar-height) - var(--festa-bottom-nav-height))",
          }}
        >
          <div className="flex items-center justify-between px-gutter shrink-0 border-b border-festa-outline-variant/30 min-h-[var(--festa-cart-peek-height)]">
            <button
              type="button"
              className="flex flex-1 items-center gap-3 py-3 min-w-0"
              onClick={() => setExpanded(!isOpen)}
            >
              <div className="bg-festa-primary-container text-festa-on-primary-container w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-transform duration-300">
                {itemCount}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-title-md font-bold text-festa-on-surface leading-tight truncate">
                  Pedido Atual
                </p>
                <p className="text-sm text-festa-on-surface-variant">
                  {itemCount} {itemCount === 1 ? "item" : "itens"}
                </p>
              </div>
              <span className="ml-auto text-xl font-black text-festa-accent tracking-tight shrink-0 transition-opacity duration-300">
                {total.toFixed(2)}€
              </span>
              <MaterialIcon
                name="expand_less"
                className={cn(
                  "text-festa-on-surface-variant shrink-0 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          </div>

          <Collapsible
            open={isOpen}
            className={cn("min-h-0", isOpen && "flex-1")}
            innerClassName="flex min-h-0 flex-col overflow-hidden"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y no-scrollbar px-gutter py-2">
              {items.map((item, index) => (
                <CartLineItem
                  key={item.product.id}
                  item={item}
                  highlighted={highlightedIndex === index}
                  compact
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </Collapsible>

          {isOpen && (
            <div
              className={cn(
                "shrink-0 flex flex-col gap-4 px-gutter pb-4 pt-4 border-t border-festa-outline-variant/30 bg-card transition-opacity duration-200",
                footerReady ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <div className="flex justify-between items-center py-1">
                <span className="text-festa-on-surface-variant font-bold text-lg">Total</span>
                <span className="text-3xl font-black text-festa-on-surface tracking-tighter">
                  {total.toFixed(2)}€
                </span>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onConfirm}
                className="w-full h-16 bg-festa-primary-container text-festa-on-primary-container rounded-2xl font-bold text-xl shadow-lg shadow-festa-primary-container/30 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                Confirmar Pedido
                <MaterialIcon name="check_circle" className="text-2xl" />
              </button>
            </div>
          )}
        </FadeIn>
      )}
    </MotionPresence>
  )
}
