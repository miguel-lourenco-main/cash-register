"use client"

import type { ReactNode } from "react"
import { MaterialIcon } from "@/components/ui/material-icon"

/** Shared recharts styling, driven by the chart CSS vars (dark-mode safe). */
export const chartTooltipStyle: React.CSSProperties = {
  backgroundColor: "var(--chart-tooltip-bg)",
  border: "2px solid var(--festa-border)",
  borderRadius: "8px",
  boxShadow: "2px 2px 0 0 var(--shadow-color)",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--festa-on-surface)",
}

export const chartAxisTick = {
  fill: "var(--festa-on-surface-variant)",
  fontSize: 11,
  fontWeight: 700,
}

interface ChartCardProps {
  title: string
  icon: string
  children: ReactNode
}

export function ChartCard({ title, icon, children }: ChartCardProps) {
  return (
    <section className="rounded-lg border-2 border-festa-border bg-card shadow-block p-5 flex flex-col gap-4 min-w-0">
      <h4 className="flex items-center gap-2 text-label-xl text-festa-on-surface-variant">
        <MaterialIcon name={icon} className="text-lg text-festa-accent" />
        {title}
      </h4>
      {children}
    </section>
  )
}

export function ChartEmptyState() {
  return (
    <div className="flex h-48 flex-col items-center justify-center text-festa-on-surface-variant">
      <MaterialIcon name="bar_chart" className="text-4xl mb-2 opacity-50" />
      <p className="text-sm font-bold">Ainda sem dados</p>
    </div>
  )
}
