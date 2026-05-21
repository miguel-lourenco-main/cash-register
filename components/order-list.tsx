"use client"

import { useState } from "react"
import { StatsDashboard } from "@/components/orders/stats-dashboard"
import { OrderCard } from "@/components/orders/order-card"
import { OrderDetailPanel } from "@/components/orders/order-detail-panel"
import OrderDetails from "@/components/order-details"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import type { Order } from "@/lib/types"

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 12

  const sortedOrders = [...initialOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const currentOrders = sortedOrders.slice(startIndex, startIndex + ordersPerPage)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="min-h-screen">
      <StatsDashboard orders={initialOrders} />

      <div className="px-gutter md:px-margin-page pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-headline-lg-mobile md:text-headline-lg font-display text-festa-on-surface">
              Histórico de Pedidos
            </h3>
            <span className="px-3 py-1 bg-festa-surface-container-high rounded-full text-sm font-bold text-festa-on-surface-variant">
              {initialOrders.length} pedido{initialOrders.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {currentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-festa-on-surface-variant">
            <MaterialIcon name="receipt_long" className="text-6xl mb-4 opacity-50" />
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-card-gap">
            {currentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-festa-on-surface-variant">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <MaterialIcon name="chevron_left" className="w-4 h-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Próximo
                <MaterialIcon name="chevron_right" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop slide-over */}
      {selectedOrder && (
        <div className="hidden lg:block">
          <OrderDetailPanel
            order={selectedOrder}
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        </div>
      )}

      {/* Mobile full-page detail */}
      {selectedOrder && (
        <div className="lg:hidden fixed inset-0 z-50 bg-festa-surface overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="p-gutter pt-4">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="mb-4 flex items-center gap-2 text-festa-accent font-bold cursor-pointer"
            >
              <MaterialIcon name="arrow_back" />
              Voltar
            </button>
            <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
