"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import type { Order } from "@/lib/types"

interface StatsDashboardProps {
  orders: Order[]
}

function calculateOrderTotal(order: Order) {
  return order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
}

interface StatCardProps {
  label: string
  value: string
  icon: string
  borderClass: string
  valueClass: string
  watermarkClass: string
}

function StatCard({
  label,
  value,
  icon,
  borderClass,
  valueClass,
  watermarkClass,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card p-6 md:p-8 rounded-xl shadow-festa-card border-l-[6px] min-h-[120px] md:min-h-[132px]",
        borderClass
      )}
    >
      <MaterialIcon
        name={icon}
        aria-hidden
        className={cn(
          "absolute -bottom-6 -left-4 text-[6.5rem] md:text-[7.5rem] leading-none pointer-events-none select-none",
          "opacity-[0.07] dark:opacity-[0.1]",
          watermarkClass
        )}
      />

      <div className="relative z-10 flex flex-col justify-center h-full">
        <p className="text-festa-on-surface-variant text-label-xl mb-2">{label}</p>
        <h2 className={cn("text-price-display", valueClass)}>{value}</h2>
      </div>
    </div>
  )
}

export function StatsDashboard({ orders }: StatsDashboardProps) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + calculateOrderTotal(order),
    0
  )
  const orderCount = orders.length
  const averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0

  return (
    <section className="mb-margin-page px-gutter md:px-margin-page pt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard
          label="Receita Total"
          value={`${totalRevenue.toFixed(2)}€`}
          icon="payments"
          borderClass="border-l-festa-primary-container"
          valueClass="text-festa-primary-emphasis"
          watermarkClass="text-festa-primary-container"
        />
        <StatCard
          label="Pedidos Realizados"
          value={String(orderCount)}
          icon="receipt_long"
          borderClass="border-l-festa-festival-blue"
          valueClass="text-festa-tertiary-emphasis"
          watermarkClass="text-festa-festival-blue"
        />
        <StatCard
          label="Ticket Médio"
          value={`${averageTicket.toFixed(2)}€`}
          icon="avg_time"
          borderClass="border-l-festa-success"
          valueClass="text-festa-success-emphasis"
          watermarkClass="text-festa-success"
        />
      </div>
    </section>
  )
}
