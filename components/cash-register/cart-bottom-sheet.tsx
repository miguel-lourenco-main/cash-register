"use client"

import { useEffect, useState } from "react"
import { motion, useDragControls } from "motion/react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import {
  AnimatedNumber,
  CartPing,
  FadeIn,
  MotionPresence,
} from "@/components/ui/motion"
import { CartLineItem } from "@/components/cash-register/cart-line-item"
import { springs } from "@/lib/motion"
import type { AppOrderItem } from "@/lib/types"
import { cn } from "@/lib/utils"

/** Mobile cart peek / expandable sheet — drag down to dismiss into a FAB. */
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
  const dragControls = useDragControls()

  useEffect(() => {
    if (itemCount === 0) {
      setIsOpen(false)
      onDismissedChange(false)
    }
  }, [itemCount, onDismissedChange])

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
            data-cart-drop
            className="flex items-center gap-2 pl-4 pr-5 h-14 rounded-lg border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            aria-label="Abrir pedido atual"
          >
            <MaterialIcon name="shopping_cart" filled />
            <span className="font-bold tabular-nums">{itemCount}</span>
            <span className="font-display font-bold tabular-nums">{total.toFixed(2)}€</span>
          </button>
        </FadeIn>
      ) : (
        <motion.div
          key="cart-sheet"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springs.sheet}
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 80 || info.velocity.y > 600) {
              setIsOpen(false)
              onDismissedChange(true)
            }
          }}
          className="lg:hidden fixed left-0 right-0 z-30 flex flex-col min-h-0 overflow-hidden bg-card rounded-t-2xl border-2 border-b-0 border-festa-border shadow-block-up"
          style={{
            bottom: "var(--festa-bottom-nav-height)",
            maxHeight:
              "calc(100dvh - var(--festa-top-bar-height) - var(--festa-bottom-nav-height))",
          }}
        >
          <div
            className="flex flex-col px-gutter shrink-0 border-b-2 border-festa-border/15 touch-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-festa-border/30" aria-hidden />
            <button
              type="button"
              className="flex flex-1 items-center gap-3 py-3 min-w-0 cursor-pointer"
              onClick={() => setExpanded(!isOpen)}
              aria-expanded={isOpen}
            >
              <span data-cart-drop className="shrink-0">
                <CartPing
                  trigger={itemCount}
                  className="bg-festa-amber text-festa-ink border-2 border-festa-border w-10 h-10 rounded-md flex items-center justify-center font-display font-bold text-lg tabular-nums"
                >
                  {itemCount}
                </CartPing>
              </span>
              <div className="min-w-0 text-left">
                <p className="font-display text-title-md text-festa-on-surface leading-tight truncate">
                  Pedido Atual
                </p>
                <p className="text-sm text-festa-on-surface-variant">
                  {itemCount} {itemCount === 1 ? "item" : "itens"}
                </p>
              </div>
              <AnimatedNumber
                value={total}
                format={(v) => `${v.toFixed(2)}€`}
                className="ml-auto font-display text-2xl font-bold text-festa-accent tracking-tight shrink-0 tabular-nums"
              />
              <MaterialIcon
                name="expand_less"
                className={cn(
                  "text-festa-on-surface-variant shrink-0 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          </div>

          {/* Flex layout (not a height-auto collapse): the list is a bounded,
              scrollable region and the footer reserves its own space — so the
              checkout never hides the last items and the list stays scrollable
              to the end. The footer floats above the list with an upward shadow. */}
          <MotionPresence
            show={isOpen}
            enterFrom="slide-in-from-bottom-4"
            className="flex min-h-0 flex-1 flex-col"
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

            <div className="relative z-10 shrink-0 flex flex-col gap-4 px-gutter pb-4 pt-4 border-t-2 border-festa-border bg-festa-paper shadow-block-up">
              <div className="flex justify-between items-center py-1">
                <span className="text-label-xl text-festa-on-surface-variant">Total</span>
                <AnimatedNumber
                  value={total}
                  format={(v) => `${v.toFixed(2)}€`}
                  className="font-display text-3xl font-bold text-festa-on-surface tracking-tight tabular-nums"
                />
              </div>
              <Button
                variant="accent"
                disabled={isSubmitting}
                onClick={onConfirm}
                className="w-full h-16 text-xl gap-3"
              >
                {isSubmitting ? "A processar..." : "Confirmar Pedido"}
                <MaterialIcon name="check_circle" className="text-2xl" />
              </Button>
            </div>
          </MotionPresence>
        </motion.div>
      )}
    </MotionPresence>
  )
}
