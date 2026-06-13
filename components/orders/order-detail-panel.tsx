"use client"

import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { SpringPanel } from "@/components/ui/motion"
import { calculateOrderTotal, lineItemTotal } from "@/lib/order-utils"
import type { Order } from "@/lib/types"

interface OrderDetailPanelProps {
  order: Order | null
  onClose: () => void
}

export function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  return (
    <>
      <AnimatePresence>
        {order && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>
      <SpringPanel
        show={Boolean(order)}
        className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-card z-50 border-l-2 border-festa-border shadow-block-left flex flex-col"
      >
        {order && (
          <div className="p-6 md:p-8 h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-headline-lg-mobile font-display text-festa-on-surface">
                Detalhes do Pedido
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar detalhes"
                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm cursor-pointer hover:bg-festa-surface-high active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <MaterialIcon name="close" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-festa-surface-low border-2 border-festa-border mb-6 shrink-0">
              <div className="w-12 h-12 bg-festa-amber border-2 border-festa-border rounded-md flex items-center justify-center text-festa-ink shrink-0">
                <MaterialIcon name="receipt" filled />
              </div>
              <div className="min-w-0">
                <h4 className="text-title-md font-display truncate">#{order.id}</h4>
                <p className="text-festa-on-surface-variant text-sm">
                  {new Date(order.createdAt).toLocaleString("pt-PT")} · Registado por:{" "}
                  {order.registeredBy?.name ?? "Desconhecido"}
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
                    <p className="text-xs text-festa-on-surface-variant tabular-nums">
                      {(item.unitPrice ?? item.product.price).toFixed(2)}€ / un.
                    </p>
                  </div>
                  <span className="text-label-xl shrink-0 text-festa-on-surface tabular-nums">
                    {lineItemTotal(item).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t-2 border-festa-border shrink-0">
              {order.amountTendered != null && (
                <div className="mb-4 space-y-1 text-sm text-festa-on-surface-variant">
                  <div className="flex justify-between tabular-nums">
                    <span>Valor entregue</span>
                    <span className="font-bold text-festa-on-surface">
                      {order.amountTendered.toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between tabular-nums">
                    <span>Troco</span>
                    <span className="font-bold text-festa-on-surface">
                      {(order.changeDue ?? 0).toFixed(2)}€
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-end mb-4">
                <span className="text-headline-lg-mobile font-display">Total</span>
                <span className="text-price-display text-festa-primary-emphasis">
                  {calculateOrderTotal(order).toFixed(2)}€
                </span>
              </div>
              <Button variant="outline" onClick={onClose} className="w-full h-12">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </SpringPanel>
    </>
  )
}
