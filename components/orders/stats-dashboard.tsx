"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import { AnimatedNumber, StaggerGrid, StaggerItem } from "@/components/ui/motion"
import { cn } from "@/lib/utils"
import { calculateOrderTotal } from "@/lib/order-utils"
import type { Order } from "@/lib/types"

interface StatsDashboardProps {
  orders: Order[]
}

interface StatCardProps {
  label: string
  value: number
  format: (value: number) => string
  icon: string
  stripClass: string
  valueClass: string
  watermarkClass: string
}

function StatCard({
  label,
  value,
  format,
  icon,
  stripClass,
  valueClass,
  watermarkClass,
}: StatCardProps) {
  return (
    <div className="lift-block relative overflow-hidden bg-card rounded-lg border-2 border-festa-border shadow-block min-h-[120px] md:min-h-[132px] flex flex-col">
      <div className={cn("h-2 w-full border-b-2 border-festa-border", stripClass)} aria-hidden />
      <div className="relative flex-1 p-6 md:p-8">
        <MaterialIcon
          name={icon}
          aria-hidden
          className={cn(
            "absolute -bottom-6 -left-4 text-[6.5rem] md:text-[7.5rem] leading-none pointer-events-none select-none",
            "opacity-[0.08] dark:opacity-[0.12]",
            watermarkClass
          )}
        />
        <div className="relative z-10 flex flex-col justify-center h-full">
          <p className="text-festa-on-surface-variant text-label-xl mb-2">{label}</p>
          <AnimatedNumber
            value={value}
            format={format}
            className={cn("text-price-display", valueClass)}
          />
        </div>
      </div>
    </div>
  )
}

/** KPI cards at the top of Pedidos — totals reflect the currently filtered set. */
export function StatsDashboard({ orders }: StatsDashboardProps) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + calculateOrderTotal(order),
    0
  )
  const orderCount = orders.length
  const averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0

  return (
    <section className="mb-margin-page px-gutter md:px-margin-page pt-6">
      <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StaggerItem>
          <StatCard
            label="Receita Total"
            value={totalRevenue}
            format={(v) => `${v.toFixed(2)}€`}
            icon="payments"
            stripClass="bg-festa-primary dark:bg-festa-primary-emphasis"
            valueClass="text-festa-primary-emphasis"
            watermarkClass="text-festa-primary-container"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Pedidos Realizados"
            value={orderCount}
            format={(v) => String(Math.round(v))}
            icon="receipt_long"
            stripClass="bg-festa-festival-blue"
            valueClass="text-festa-tertiary-emphasis"
            watermarkClass="text-festa-festival-blue"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Ticket Médio"
            value={averageTicket}
            format={(v) => `${v.toFixed(2)}€`}
            icon="avg_time"
            stripClass="bg-festa-success"
            valueClass="text-festa-success-emphasis"
            watermarkClass="text-festa-success"
          />
        </StaggerItem>
      </StaggerGrid>
    </section>
  )
}
