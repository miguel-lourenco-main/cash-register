"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/types"

interface OrderDetailsProps {
  order: Order
  onBack?: () => void
}

export default function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const calculateTotal = () =>
    order.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )

  const operatorLabel = order.registeredBy?.name ?? "Desconhecido"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-festa-card border border-festa-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-festa-outline-variant bg-festa-surface-container-low">
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
              className="flex justify-between items-center py-3 border-b border-festa-surface-container-high last:border-0"
            >
              <div>
                <p className="font-bold text-festa-on-surface">
                  {item.product.name}
                </p>
                <p className="text-sm text-festa-on-surface-variant">
                  {item.quantity} × {item.product.price.toFixed(2)}€
                </p>
              </div>
              <span className="font-bold text-festa-accent">
                {(item.product.price * item.quantity).toFixed(2)}€
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 bg-festa-surface-container-low border-t border-festa-outline-variant flex justify-end">
          <div className="text-right">
            <p className="text-festa-on-surface-variant text-label-xl mb-1">Total</p>
            <p className="text-price-display text-festa-primary-emphasis">
              {calculateTotal().toFixed(2)}€
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
