"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { AnimatedNumber, MotionPresence } from "@/components/ui/motion"
import { formatEuro, roundEuro } from "@/lib/order-utils"
import { cn } from "@/lib/utils"

interface PaymentOverlayProps {
  show: boolean
  total: number
  isSubmitting: boolean
  onConfirm: (amountTendered: number) => void
  onCancel: () => void
}

const QUICK_AMOUNTS = [5, 10, 20, 50]

export function PaymentOverlay({
  show,
  total,
  isSubmitting,
  onConfirm,
  onCancel,
}: PaymentOverlayProps) {
  const [tendered, setTendered] = useState(0)

  // Fresh tendered amount each time the overlay opens
  useEffect(() => {
    if (show) setTendered(0)
  }, [show])

  const change = roundEuro(tendered - total)
  const canConfirm = tendered >= total && !isSubmitting

  const addAmount = (amount: number) => setTendered((t) => roundEuro(t + amount))

  return (
    <MotionPresence
      show={show}
      enterFrom="slide-in-from-bottom-4"
      className="fixed inset-0 z-50 flex flex-col bg-festa-surface overflow-y-auto no-scrollbar"
    >
      <div className="flex w-full max-w-lg mx-auto flex-1 flex-col gap-6 p-gutter py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-lg-mobile font-display text-festa-on-surface">
            Pagamento
          </h2>
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
          <div className="flex items-end justify-between mb-4">
            <p className="text-label-xl text-festa-on-surface-variant pb-1.5">Valor entregue</p>
            <AnimatedNumber
              value={tendered}
              format={formatEuro}
              className="font-display text-3xl font-bold text-festa-on-surface tabular-nums"
            />
          </div>

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
              onClick={() => setTendered(roundEuro(total))}
              disabled={isSubmitting}
              className="h-12 rounded-lg border-2 border-festa-border bg-festa-festival-blue text-white dark:text-festa-ink font-bold uppercase tracking-wide text-sm shadow-block-sm cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
            >
              Exato
            </button>
            <button
              type="button"
              onClick={() => setTendered(0)}
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
            "rounded-lg border-2 border-festa-border p-6 text-center transition-colors duration-200",
            change >= 0 ? "bg-festa-success/15" : "bg-festa-surface-low"
          )}
        >
          <p className="text-label-xl text-festa-on-surface-variant mb-1">
            {change >= 0 ? "Troco" : "Em falta"}
          </p>
          <AnimatedNumber
            value={Math.abs(change)}
            format={formatEuro}
            className={cn(
              "font-display text-4xl font-bold tabular-nums",
              change >= 0 ? "text-festa-success-emphasis" : "text-festa-error"
            )}
          />
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
