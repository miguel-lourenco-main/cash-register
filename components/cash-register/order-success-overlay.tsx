"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { MotionPresence } from "@/components/ui/motion"
import { formatEuro } from "@/lib/order-utils"

interface OrderSuccessOverlayProps {
  show: boolean
  orderId: string | null
  changeDue: number
  onNewOrder: () => void
}

const AUTO_DISMISS_MS = 6000

/** Post-sale confirmation — auto-returns to cart so the next sale starts quickly. */
export function OrderSuccessOverlay({
  show,
  orderId,
  changeDue,
  onNewOrder,
}: OrderSuccessOverlayProps) {
  useEffect(() => {
    if (!show) return
    // Return to the product grid without requiring a tap between sales
    const timer = window.setTimeout(onNewOrder, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [show, onNewOrder])

  return (
    <MotionPresence
      show={show}
      enterFrom="zoom-in-95"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-festa-surface p-gutter"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-success text-white dark:text-festa-ink shadow-block">
        <MaterialIcon name="check" className="text-5xl" />
      </div>

      <div className="text-center">
        <h2 className="text-headline-lg-mobile font-display text-festa-on-surface mb-1">
          Pedido confirmado
        </h2>
        {orderId && (
          <p className="text-sm text-festa-on-surface-variant">
            Pedido <span className="font-bold">#{orderId.slice(0, 8)}</span>
          </p>
        )}
      </div>

      <div className="w-full max-w-sm rounded-lg border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block-lg p-8 text-center">
        <p className="text-label-xl mb-2">Troco a entregar</p>
        <p className="font-display text-6xl font-bold tabular-nums tracking-tight">
          {formatEuro(changeDue)}
        </p>
      </div>

      <Button variant="default" onClick={onNewOrder} className="h-16 px-10 text-xl gap-3">
        <MaterialIcon name="add_shopping_cart" className="text-2xl" />
        Novo Pedido
      </Button>
      <p className="text-xs text-festa-on-surface-variant">Fecha automaticamente em segundos…</p>
    </MotionPresence>
  )
}
