"use client"

import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { AnimatedNumber, CartPing, MotionPresence } from "@/components/ui/motion"
import { formatEuro, roundEuro } from "@/lib/order-utils"
import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface PaymentOverlayProps {
  show: boolean
  total: number
  isSubmitting: boolean
  onConfirm: (amountTendered: number) => void
  onCancel: () => void
}

const QUICK_AMOUNTS = [5, 10, 20, 50]

/** Full-screen cash tendering step — quick bills, exact, and free-form entry. */
export function PaymentOverlay({
  show,
  total,
  isSubmitting,
  onConfirm,
  onCancel,
}: PaymentOverlayProps) {
  const [tendered, setTendered] = useState(0)
  // Raw text backing the free-form amount input, kept in sync with `tendered`.
  const [raw, setRaw] = useState("")
  const [ghost, setGhost] = useState<{ id: number; amount: number } | null>(null)
  const ghostId = useRef(0)
  const wasPaid = useRef(false)

  // Fresh tendered amount each time the overlay opens
  useEffect(() => {
    if (show) {
      setTendered(0)
      setRaw("")
      wasPaid.current = false
    }
  }, [show])

  const change = roundEuro(tendered - total)
  const paid = tendered >= total
  const canConfirm = paid && !isSubmitting
  const ratio = total > 0 ? Math.min(tendered / total, 1) : 1

  // Haptic + latch when crossing into "fully paid"
  useEffect(() => {
    if (paid && !wasPaid.current && tendered > 0) {
      wasPaid.current = true
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(12)
    } else if (!paid) {
      wasPaid.current = false
    }
  }, [paid, tendered])

  // Single source of truth: set both the numeric total and its text mirror.
  const applyTendered = (value: number) => {
    const rounded = roundEuro(Math.max(value, 0))
    setTendered(rounded)
    setRaw(rounded === 0 ? "" : String(rounded))
  }

  const addAmount = (amount: number) => {
    applyTendered(tendered + amount)
    setGhost({ id: ++ghostId.current, amount })
  }

  // Free-form entry for amounts that aren't round bills or the exact total
  // (e.g. the client hands over 13.50€ in mixed notes and coins).
  const handleRawChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Accept comma or dot as decimal separator, keep digits + a single separator.
    const cleaned = event.target.value.replace(",", ".").replace(/[^0-9.]/g, "")
    const [whole, ...rest] = cleaned.split(".")
    const normalized = rest.length > 0 ? `${whole}.${rest.join("")}` : whole
    setRaw(normalized)
    const parsed = Number.parseFloat(normalized)
    setTendered(Number.isFinite(parsed) ? roundEuro(parsed) : 0)
  }

  return (
    <MotionPresence
      show={show}
      enterFrom="slide-in-from-bottom-4"
      className="fixed inset-0 z-50 flex flex-col bg-festa-surface overflow-y-auto no-scrollbar"
    >
      <div className="flex w-full max-w-lg mx-auto flex-1 flex-col gap-5 p-gutter py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-lg-mobile font-display text-festa-on-surface">Pagamento</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Cancelar pagamento"
            className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm cursor-pointer hover:bg-festa-surface-high active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        {/* Total a pagar */}
        <div className="rounded-lg border-2 border-festa-border bg-festa-paper shadow-block p-6 text-center">
          <p className="text-label-xl text-festa-on-surface-variant mb-1">Total a pagar</p>
          <p className="text-price-display text-festa-primary-emphasis">{formatEuro(total)}</p>
        </div>

        {/* Valor entregue */}
        <div className="rounded-lg border-2 border-festa-border bg-festa-paper shadow-block p-6">
          <div className="relative flex items-end justify-between mb-3">
            <p className="text-label-xl text-festa-on-surface-variant pb-1.5">Valor entregue</p>
            <div className="relative">
              <AnimatedNumber
                value={tendered}
                format={formatEuro}
                className="font-display text-3xl font-bold text-festa-on-surface tabular-nums"
              />
              <AnimatePresence>
                {ghost && (
                  <motion.span
                    key={ghost.id}
                    className="absolute right-0 -top-1 font-display text-lg font-bold text-festa-success-emphasis tabular-nums pointer-events-none"
                    initial={{ y: 4, opacity: 0, scale: 0.8 }}
                    animate={{ y: -26, opacity: [0, 1, 0], scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    onAnimationComplete={() => setGhost(null)}
                  >
                    +{ghost.amount}€
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Live fill meter — total → tendered */}
          <div className="h-3 w-full rounded-full border-2 border-festa-border bg-festa-surface-low overflow-hidden mb-4">
            <motion.div
              className="h-full"
              style={{
                background: paid
                  ? "var(--festa-success-green)"
                  : "linear-gradient(90deg, var(--festa-primary), var(--festa-amber))",
              }}
              animate={{ width: `${ratio * 100}%` }}
              transition={springs.snappy}
            />
          </div>

          {/* Free-form amount — for values that aren't round bills or exact */}
          <label className="mb-3 block">
            <span className="sr-only">Introduzir valor entregue</span>
            <div className="relative">
              <input
                value={raw}
                onChange={handleRawChange}
                inputMode="decimal"
                type="text"
                placeholder="Outro valor"
                disabled={isSubmitting}
                aria-label="Introduzir valor entregue"
                className="h-14 w-full rounded-lg border-2 border-festa-border bg-festa-surface-high pl-4 pr-9 font-display text-xl font-bold tabular-nums shadow-block-sm outline-none transition-colors focus:border-festa-primary disabled:opacity-50"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-display text-xl font-bold text-festa-on-surface-variant">
                €
              </span>
            </div>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {QUICK_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => addAmount(amount)}
                disabled={isSubmitting}
                className="h-14 rounded-lg border-2 border-festa-border bg-festa-surface-high font-display text-xl font-bold shadow-block-sm cursor-pointer transition-colors duration-150 hover:bg-festa-amber/30 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 tabular-nums"
              >
                +{amount}€
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => applyTendered(total)}
              disabled={isSubmitting}
              className="h-12 rounded-lg border-2 border-festa-border bg-festa-festival-blue text-white dark:text-festa-ink font-bold uppercase tracking-wide text-sm shadow-block-sm cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
            >
              Exato
            </button>
            <button
              type="button"
              onClick={() => applyTendered(0)}
              disabled={isSubmitting || tendered === 0}
              className="h-12 rounded-lg border-2 border-festa-border bg-festa-paper font-bold uppercase tracking-wide text-sm shadow-block-sm cursor-pointer hover:bg-festa-surface-high active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:shadow-none"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Troco */}
        <div
          className={cn(
            "rounded-lg border-2 border-festa-border p-6 text-center transition-colors duration-300",
            change >= 0 ? "bg-festa-success/15" : "bg-festa-surface-low"
          )}
        >
          <p className="text-label-xl text-festa-on-surface-variant mb-1">
            {change >= 0 ? "Troco" : "Em falta"}
          </p>
          <CartPing trigger={change >= 0 ? "troco" : "falta"}>
            <AnimatedNumber
              value={Math.abs(change)}
              format={formatEuro}
              className={cn(
                "block font-display text-4xl font-bold tabular-nums",
                change >= 0 ? "text-festa-success-emphasis" : "text-festa-error"
              )}
            />
          </CartPing>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="accent"
            disabled={!canConfirm}
            onClick={() => onConfirm(roundEuro(tendered))}
            className="w-full h-16 text-xl gap-3"
          >
            <MaterialIcon name="point_of_sale" className="text-2xl" />
            {isSubmitting ? "A processar..." : "Confirmar Pagamento"}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting} className="w-full">
            Voltar ao pedido
          </Button>
        </div>
      </div>
    </MotionPresence>
  )
}
