"use client"

import { useMemo, useState } from "react"
import { StatsDashboard } from "@/components/orders/stats-dashboard"
import { OrderCard } from "@/components/orders/order-card"
import { OrderDetailPanel } from "@/components/orders/order-detail-panel"
import {
  OrderFilters,
  defaultOrderFilters,
  type OrderFiltersState,
} from "@/components/orders/order-filters"
import { AnalyticsSection } from "@/components/orders/analytics/analytics-section"
import OrderDetails from "@/components/order-details"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { StaggerGrid, StaggerItem } from "@/components/ui/motion"
import { calculateOrderTotal } from "@/lib/order-utils"
import type { Order } from "@/lib/types"

/** Cutoff timestamp for preset period filters (null = no time bound). */
function periodStart(period: OrderFiltersState["period"]): Date | null {
  if (period === "last_hour") return new Date(Date.now() - 60 * 60 * 1000)
  if (period === "today") {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return start
  }
  return null
}

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<OrderFiltersState>(defaultOrderFilters)
  const ordersPerPage = 12

  // Distinct operators for the filter dropdown — derived from the loaded history.
  const operators = useMemo(() => {
    const byId = new Map<string, string>()
    for (const order of initialOrders) {
      if (order.registeredBy) byId.set(order.registeredBy.id, order.registeredBy.name)
    }
    return [...byId.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [initialOrders])

  // Stats, analytics, and the grid all consume this filtered+sorted slice.
  const filteredOrders = useMemo(() => {
    let result = initialOrders

    if (filters.operatorId) {
      result = result.filter((order) => order.registeredBy?.id === filters.operatorId)
    }

    if (filters.period === "custom") {
      const from = filters.from ? new Date(filters.from) : null
      const to = filters.to ? new Date(filters.to) : null
      result = result.filter(
        (order) =>
          (!from || order.createdAt >= from) && (!to || order.createdAt <= to)
      )
    } else {
      const start = periodStart(filters.period)
      if (start) result = result.filter((order) => order.createdAt >= start)
    }

    const sorted = [...result]
    switch (filters.sort) {
      case "time_asc":
        sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "amount_desc":
        sorted.sort((a, b) => calculateOrderTotal(b) - calculateOrderTotal(a))
        break
      case "amount_asc":
        sorted.sort((a, b) => calculateOrderTotal(a) - calculateOrderTotal(b))
        break
      default:
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
    return sorted
  }, [initialOrders, filters])

  const handleFiltersChange = (next: OrderFiltersState) => {
    setFilters(next)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="min-h-screen">
      <StatsDashboard orders={filteredOrders} />

      <div className="px-gutter md:px-margin-page pb-24 md:pb-8">
        <AnalyticsSection orders={filteredOrders} />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-headline-lg-mobile md:text-headline-lg font-display text-festa-on-surface">
              Histórico de Pedidos
            </h3>
            <Badge variant="secondary" className="text-sm">
              {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        <OrderFilters filters={filters} onChange={handleFiltersChange} operators={operators} />

        {currentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-festa-on-surface-variant">
            <MaterialIcon name="receipt_long" className="text-6xl mb-4 opacity-50" />
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <StaggerGrid
            key={currentPage}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-card-gap"
          >
            {currentOrders.map((order) => (
              <StaggerItem key={order.id} className="h-full">
                <OrderCard order={order} onClick={() => setSelectedOrder(order)} />
              </StaggerItem>
            ))}
          </StaggerGrid>
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
      <div className="hidden lg:block">
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>

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
