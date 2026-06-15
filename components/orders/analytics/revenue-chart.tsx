"use client"

import { useReducedMotion } from "motion/react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartCard, ChartEmptyState, chartAxisTick, chartTooltipStyle } from "./chart-card"
import type { HourBucket } from "@/lib/order-analytics"

export function RevenueChart({ data }: { data: HourBucket[] }) {
  const reduce = useReducedMotion()
  return (
    <ChartCard title="Receita por hora" icon="schedule">
      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div className="h-48" role="img" aria-label="Gráfico de receita por hora">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="hour" tick={chartAxisTick} tickLine={false} axisLine={false} />
              <YAxis
                tick={chartAxisTick}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}€`}
                width={56}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value, name) =>
                  name === "revenue"
                    ? [`${Number(value).toFixed(2)}€`, "Receita"]
                    : [String(value), "Pedidos"]
                }
                labelFormatter={(label) => `Às ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--chart-1)"
                strokeWidth={3}
                fill="url(#revenue-fill)"
                isAnimationActive={!reduce}
                animationDuration={950}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  )
}
