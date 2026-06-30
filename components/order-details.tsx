"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import { calculateOrderTotal, lineItemTotal } from "@/lib/order-utils"
import type { Order } from "@/lib/types"

interface OrderDetailsProps {
  order: Order
  onBack?: () => void
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const operatorLabel = order.registeredBy?.name ?? "Desconhecido"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-block border-2 border-festa-border overflow-hidden">
        <div className="p-6 border-b-2 border-festa-border bg-festa-surface-low">
          <h2 className="text-headline-lg-mobile font-display text-festa-on-surface">
            Detalhes do Pedido
          </h2>
          <p className="text-festa-on-surface-variant mt-1">
            Pedido #{order.id} — {new Date(order.createdAt).toLocaleString("pt-PT")}
          </p>
          <p className="text-sm text-festa-on-surface-variant mt-2 flex items-center gap-1">
            <MaterialIcon name="person" className="text-sm" />
            Registado por: <span className="font-bold text-festa-on-surface">{operatorLabel}</span>
          </p>
        </div>

        <div className="p-6 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between items-center py-3 border-b-2 border-festa-border/10 last:border-0"
            >
              <div>
                <p className="font-bold text-festa-on-surface">
                  {item.product.name}
                </p>
                <p className="text-sm text-festa-on-surface-variant">
                  {item.quantity} × {(item.unitPrice ?? item.product.price).toFixed(2)}€
                </p>
              </div>
              <span className="font-display font-bold text-festa-accent tabular-nums">
                {lineItemTotal(item).toFixed(2)}€
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 bg-festa-surface-low border-t-2 border-festa-border flex items-end justify-between gap-6">
          {/* Cash tendering fields are null on legacy orders created before payment tracking. */}
          {order.amountTendered != null ? (
            <div className="space-y-1 text-sm text-festa-on-surface-variant tabular-nums">
              <p>
                Entregue:{" "}
                <span className="font-bold text-festa-on-surface">
                  {order.amountTendered.toFixed(2)}€
                </span>
              </p>
              <p>
                Troco:{" "}
                <span className="font-bold text-festa-on-surface">
                  {(order.changeDue ?? 0).toFixed(2)}€
                </span>
              </p>
            </div>
          ) : (
            <div />
          )}
          <div className="text-right">
            <p className="text-festa-on-surface-variant text-label-xl mb-1">Total</p>
            <p className="text-price-display text-festa-primary-emphasis">
              {calculateOrderTotal(order).toFixed(2)}€
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
