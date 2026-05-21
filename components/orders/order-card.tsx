"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import type { Order } from "@/lib/types"

interface OrderCardProps {
  order: Order
  onClick: () => void
}

function calculateOrderTotal(order: Order) {
  return order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
}

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

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card rounded-xl shadow-festa-card hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95 overflow-hidden border border-festa-outline-variant/30 flex flex-col h-full text-left w-full"
    >
      <div className="h-2 w-full bg-festa-primary-container" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold text-festa-on-surface-variant uppercase tracking-widest mb-1 block">
              {operatorLabel}
            </span>
            <h4 className="text-title-md text-festa-on-surface">#{order.id}</h4>
          </div>
          <span className="text-xs text-festa-on-surface-variant">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-festa-on-surface-variant text-sm mb-6">
          <MaterialIcon name="schedule" className="text-sm" />
          <span>{formatRelativeTime(order.createdAt)}</span>
        </div>
        <div className="mt-auto pt-6 border-t border-dashed border-festa-outline-variant flex justify-between items-center">
          <span className="text-festa-on-surface-variant text-label-xl">Total</span>
          <span className="text-headline-lg-mobile text-festa-primary-emphasis">
            {total.toFixed(2)}€
          </span>
        </div>
      </div>
    </button>
  )
}
