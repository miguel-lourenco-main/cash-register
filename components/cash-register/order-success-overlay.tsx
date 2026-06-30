"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { AnimatedNumber, MotionPresence } from "@/components/ui/motion"
import { BlockConfetti } from "@/components/ui/block-confetti"
import { formatEuro } from "@/lib/order-utils"
import { springs } from "@/lib/motion"

interface OrderSuccessOverlayProps {
  show: boolean
  orderId: string | null
  changeDue: number
  onNewOrder: () => void
}

const AUTO_DISMISS_MS = 6000

/** Full-screen confirmation shown after payment — auto-returns to the product grid. */
export function OrderSuccessOverlay({
  show,
  orderId,
  changeDue,
  onNewOrder,
}: OrderSuccessOverlayProps) {
  const reduce = useReducedMotion()
  const [displayChange, setDisplayChange] = useState(0)

  useEffect(() => {
    if (!show) return
    setDisplayChange(0)
    const raf = requestAnimationFrame(() => setDisplayChange(changeDue))
    const timer = window.setTimeout(onNewOrder, AUTO_DISMISS_MS)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [show, changeDue, onNewOrder])

  return (
    <MotionPresence
      show={show}
      enterFrom="zoom-in-95"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-festa-surface p-gutter overflow-hidden"
    >
      {/* Spotlight vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, transparent 0%, transparent 32%, color-mix(in srgb, var(--festa-ink) 24%, transparent) 100%)",
        }}
      />
      <BlockConfetti fire={show} originY={0.42} count={26} />

      <motion.div
        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-success text-white dark:text-festa-ink shadow-block"
        initial={reduce ? false : { scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...springs.snappy, delay: 0.05 }}
      >
        <MaterialIcon name="check" className="text-5xl" />
      </motion.div>

      <motion.div
        className="relative z-10 text-center"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.snappy, delay: 0.12 }}
      >
        <h2 className="text-headline-lg-mobile font-display text-festa-on-surface mb-1">
          Pedido confirmado
        </h2>
        {orderId && (
          <p className="text-sm text-festa-on-surface-variant">
            Pedido <span className="font-bold">#{orderId.slice(0, 8)}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-sm rounded-lg border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block-xl p-8 text-center"
        initial={reduce ? false : { scale: 0.6, rotate: -4, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.18 }}
      >
        <p className="text-label-xl mb-2">Troco a entregar</p>
        <AnimatedNumber
          value={displayChange}
          format={formatEuro}
          className="block font-display text-6xl font-bold tabular-nums tracking-tight"
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-3"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.snappy, delay: 0.3 }}
      >
        <Button variant="default" onClick={onNewOrder} className="h-16 px-10 text-xl gap-3">
          <MaterialIcon name="add_shopping_cart" className="text-2xl" />
          Novo Pedido
        </Button>
        <p className="text-xs text-festa-on-surface-variant">Fecha automaticamente em segundos…</p>
      </motion.div>
    </MotionPresence>
  )
}
