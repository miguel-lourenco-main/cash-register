"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import type { AppOrderItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CartLineItemProps {
  item: AppOrderItem
  highlighted?: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  compact?: boolean
}

export function CartLineItem({
  item,
  highlighted,
  onUpdateQuantity,
  onRemove,
  compact,
}: CartLineItemProps) {
  const { product, quantity } = item

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between py-4 border-b border-festa-surface-container-high animate-in fade-in duration-200",
          highlighted &&
            "bg-festa-primary-container/5 border-l-4 border-l-festa-primary-container transition-colors duration-500"
        )}
      >
        <div className="flex-1 pr-4">
          <h4 className="text-body-lg font-bold text-festa-on-surface leading-tight">
            {product.name}
          </h4>
          <p className="text-festa-on-surface-variant font-medium mt-0.5">
            {product.price.toFixed(2)}€ por un.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-festa-surface-container-high active:scale-90"
          >
            <MaterialIcon name="remove" className="font-bold" />
          </button>
          <span className="text-xl font-black w-6 text-center text-festa-on-surface">{quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-festa-surface-container-high active:scale-90"
          >
            <MaterialIcon name="add" className="font-bold" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 bg-festa-surface-container-low rounded-xl group animate-in fade-in slide-in-from-right-2 duration-300",
        highlighted &&
          "ring-2 ring-festa-primary-container/30 transition-shadow duration-500"
      )}
    >
      <div className="flex-grow min-w-0">
        <h4 className="text-label-xl text-festa-on-surface truncate">{product.name}</h4>
        <p className="text-festa-accent font-bold">
          {(product.price * quantity).toFixed(2)}€
        </p>
      </div>
      <div className="flex items-center bg-card rounded-lg border border-festa-outline-variant shrink-0">
        <button
          type="button"
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-festa-surface-container-high rounded-l-lg"
        >
          <MaterialIcon name="remove" className="text-sm" />
        </button>
        <span className="w-8 text-center font-bold text-sm text-festa-on-surface">{quantity}</span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-festa-surface-container-high rounded-r-lg"
        >
          <MaterialIcon name="add" className="text-sm" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onRemove(product.id)}
        className="text-festa-on-surface-variant hover:text-festa-error opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
      >
        <MaterialIcon name="delete" />
      </button>
    </div>
  )
}
