"use client"

import { motion, useReducedMotion } from "motion/react"
import { ChartCard, ChartEmptyState } from "./chart-card"
import { formatEuro } from "@/lib/order-utils"
import { springs, STAGGER_S } from "@/lib/motion"
import type { OperatorStat } from "@/lib/order-analytics"

/** Ranked list with proportional bars — more legible than a chart for a handful of operators. */
export function OperatorRevenue({ data }: { data: OperatorStat[] }) {
  const reduce = useReducedMotion()
  const max = data.length > 0 ? Math.max(...data.map((entry) => entry.revenue)) : 0

  return (
    <ChartCard title="Receita por operador" icon="group">
      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <ul className="space-y-3">
          {data.map((entry, index) => (
            <li key={entry.operatorId}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 border-festa-border bg-festa-surface-high font-display text-[11px] font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-festa-on-surface truncate">
                    {entry.name}
                  </span>
                  <span className="text-xs text-festa-on-surface-variant shrink-0 tabular-nums">
                    {entry.orders} pedido{entry.orders !== 1 ? "s" : ""}
                  </span>
                </span>
                <span className="font-display font-bold text-festa-on-surface tabular-nums shrink-0">
                  {formatEuro(entry.revenue)}
                </span>
              </div>
              <div className="h-3 rounded-sm border border-festa-border/40 bg-festa-surface-low overflow-hidden">
                <motion.div
                  className="h-full bg-festa-festival-blue"
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: max > 0 ? `${(entry.revenue / max) * 100}%` : "0%" }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ ...springs.snappy, delay: index * STAGGER_S }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  )
}
