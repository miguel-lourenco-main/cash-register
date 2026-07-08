"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import { calculateOrderTotal } from "@/lib/order-utils"
import type { Order } from "@/lib/types"

interface OrderCardProps {
  order: Order
  onClick: () => void
}

/** Human-readable relative time for the order grid (Portuguese). */
function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "Agora"
  if (diffMin < 60) return `Há ${diffMin} minuto${diffMin !== 1 ? "s" : ""}`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours !== 1 ? "s" : ""}`
  return date.toLocaleString("pt-PT")
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const total = calculateOrderTotal(order)
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const operatorLabel = order.registeredBy?.name ?? "Desconhecido"
  // Pulse the timestamp for two minutes after checkout — easy to spot fresh sales.
  const isFresh = Date.now() - order.createdAt.getTime() < 120000

  return (
    <button
      type="button"
      onClick={onClick}
      className="lift-block bg-card rounded-lg border-2 border-festa-border shadow-block-sm overflow-hidden flex flex-col h-full text-left w-full cursor-pointer touch-manipulation hover:bg-festa-amber/10 focus-visible:ring-4 focus-visible:ring-festa-amber/60 outline-none active:translate-x-[2px] active:translate-y-[2px] active:!shadow-none"
    >
      <div className="h-2 w-full bg-festa-primary dark:bg-festa-primary-emphasis border-b-2 border-festa-border" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold text-festa-on-surface-variant uppercase tracking-widest mb-1 block">
              {operatorLabel}
            </span>
            <h4 className="font-display text-title-md text-festa-on-surface">#{order.id}</h4>
          </div>
          <span className="text-xs font-bold text-festa-on-surface-variant tabular-nums">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-festa-on-surface-variant text-sm mb-6">
          {isFresh ? (
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-festa-success-emphasis opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-festa-success-emphasis" />
            </span>
          ) : (
            <MaterialIcon name="schedule" className="text-sm" />
          )}
          <span className={isFresh ? "font-bold text-festa-success-emphasis" : undefined}>
            {formatRelativeTime(order.createdAt)}
          </span>
        </div>
        <div className="mt-auto pt-6 border-t-2 border-dashed border-festa-border/30 flex justify-between items-center">
          <span className="text-festa-on-surface-variant text-label-xl">Total</span>
          <span className="text-headline-lg-mobile text-festa-primary-emphasis tabular-nums">
            {total.toFixed(2)}€
          </span>
        </div>
      </div>
    </button>
  )
}
