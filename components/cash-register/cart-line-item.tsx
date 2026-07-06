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

function StepperButton({
  icon,
  label,
  onClick,
  className,
}: {
  icon: string
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center justify-center cursor-pointer touch-manipulation transition-colors duration-200 hover:bg-festa-amber/30 active:bg-festa-amber/50",
        className
      )}
    >
      <MaterialIcon name={icon} className="font-bold" />
    </button>
  )
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
          "flex items-center justify-between py-4 border-b-2 border-festa-border/10 transition-colors duration-500",
          highlighted && "bg-festa-amber/15"
        )}
      >
        <div className="flex-1 pr-4 min-w-0">
          <h4 className="text-body-lg font-bold text-festa-on-surface leading-tight truncate">
            {product.name}
          </h4>
          <p className="text-festa-on-surface-variant font-medium mt-0.5 tabular-nums">
            {product.price.toFixed(2)}€ por un.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StepperButton
            icon="remove"
            label={`Remover um ${product.name}`}
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="w-12 h-12 rounded-md border-2 border-festa-border bg-festa-paper shadow-block-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          />
          <span className="text-xl font-display font-bold w-7 text-center text-festa-on-surface tabular-nums">
            {quantity}
          </span>
          <StepperButton
            icon="add"
            label={`Adicionar um ${product.name}`}
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="w-12 h-12 rounded-md border-2 border-festa-border bg-festa-paper shadow-block-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "lift-block flex items-center gap-3 p-3 rounded-lg border-2 bg-festa-paper group transition-colors duration-500",
        highlighted ? "border-festa-amber bg-festa-amber/15" : "border-festa-border/20"
      )}
    >
      <div className="flex-grow min-w-0">
        <h4 className="font-bold text-sm text-festa-on-surface truncate">{product.name}</h4>
        <p className="font-display text-festa-accent font-bold tabular-nums">
          {(product.price * quantity).toFixed(2)}€
        </p>
      </div>
      <div className="flex items-center rounded-md border-2 border-festa-border bg-festa-paper overflow-hidden shrink-0">
        <StepperButton
          icon="remove"
          label={`Remover um ${product.name}`}
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          className="w-11 h-11"
        />
        <span className="w-8 text-center font-bold text-sm text-festa-on-surface tabular-nums border-x-2 border-festa-border/30 py-2.5">
          {quantity}
        </span>
        <StepperButton
          icon="add"
          label={`Adicionar um ${product.name}`}
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          className="w-11 h-11"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(product.id)}
        aria-label={`Remover ${product.name} do pedido`}
        className="flex h-11 w-9 items-center justify-center text-festa-on-surface-variant hover:text-festa-error cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 transition-opacity shrink-0"
      >
        <MaterialIcon name="delete" />
      </button>
    </div>
  )
}
