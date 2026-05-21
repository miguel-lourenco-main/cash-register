"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import type { Order } from "@/lib/types"

interface OrderDetailPanelProps {
  order: Order
  open: boolean
  onClose: () => void
}

function calculateTotal(order: Order) {
  return order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
}

export function OrderDetailPanel({ order, open, onClose }: OrderDetailPanelProps) {
  const total = calculateTotal(order)
  const operatorLabel = order.registeredBy?.name ?? "Desconhecido"

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 hidden lg:block transition-opacity duration-300 ease-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-card shadow-2xl z-50 transition-transform duration-300 ease-out border-l border-festa-outline-variant flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 md:p-8 h-full flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-headline-lg-mobile font-display text-festa-on-surface">
              Detalhes do Pedido
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-festa-surface-container-high transition-colors"
            >
              <MaterialIcon name="close" />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-festa-surface-container-low border border-festa-outline-variant mb-6 shrink-0">
            <div className="w-12 h-12 bg-festa-primary-container rounded-lg flex items-center justify-center text-festa-on-primary-container">
              <MaterialIcon name="receipt" />
            </div>
            <div>
              <h4 className="text-title-md font-display">#{order.id}</h4>
              <p className="text-festa-on-surface-variant text-sm">
                {new Date(order.createdAt).toLocaleString("pt-PT")} · Registado por: {operatorLabel}
              </p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar space-y-4 min-h-0">
            {order.items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center gap-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-festa-on-surface">
                    {item.quantity}x {item.product.name}
                  </p>
                  <p className="text-xs text-festa-on-surface-variant">
                    {item.product.price.toFixed(2)}€ / un.
                  </p>
                </div>
                <span className="text-label-xl shrink-0 text-festa-on-surface">
                  {(item.product.price * item.quantity).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t-2 border-festa-outline-variant shrink-0">
            <div className="flex justify-between items-end mb-4">
              <span className="text-headline-lg-mobile font-display">Total</span>
              <span className="text-price-display text-festa-primary-emphasis">
                {total.toFixed(2)}€
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 border border-festa-outline rounded-xl text-label-xl font-bold text-festa-on-surface hover:bg-festa-surface-container-high transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
