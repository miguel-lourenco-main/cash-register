"use client"

import { useReducedMotion } from "motion/react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartCard, ChartEmptyState, chartAxisTick, chartTooltipStyle } from "./chart-card"
import type { ProductStat } from "@/lib/order-analytics"

export function TopProductsChart({ data }: { data: ProductStat[] }) {
  const reduce = useReducedMotion()
  return (
    <ChartCard title="Mais vendidos" icon="trophy">
      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div
          style={{ height: Math.max(192, data.length * 36) }}
          role="img"
          aria-label="Gráfico dos produtos mais vendidos"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" tick={chartAxisTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={chartAxisTick}
                tickLine={false}
                axisLine={false}
                width={96}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                cursor={{ fill: "var(--chart-grid)", opacity: 0.4 }}
                formatter={(value, name, entry) => {
                  const revenue = (entry?.payload as ProductStat | undefined)?.revenue
                  return [
                    `${value} un.${revenue != null ? ` · ${revenue.toFixed(2)}€` : ""}`,
                    "Vendidos",
                  ]
                }}
              />
              <Bar
                dataKey="quantity"
                fill="var(--chart-3)"
                stroke="var(--festa-border)"
                strokeWidth={1.5}
                radius={[0, 4, 4, 0]}
                isAnimationActive={!reduce}
                animationBegin={150}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  )
}
