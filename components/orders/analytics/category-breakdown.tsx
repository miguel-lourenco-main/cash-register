"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartCard, ChartEmptyState, chartTooltipStyle } from "./chart-card"
import { formatEuro } from "@/lib/order-utils"
import type { CategoryStat } from "@/lib/order-analytics"

const CATEGORY_COLORS: Record<CategoryStat["category"], string> = {
  bebida: "var(--chart-2)",
  comida: "var(--chart-1)",
}

export function CategoryBreakdown({ data }: { data: CategoryStat[] }) {
  const total = data.reduce((sum, entry) => sum + entry.revenue, 0)

  return (
    <ChartCard title="Receita por categoria" icon="pie_chart">
      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div className="flex items-center gap-4">
          <div className="h-48 flex-1 min-w-0" role="img" aria-label="Receita por categoria">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => [formatEuro(Number(value)), "Receita"]}
                />
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="label"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={3}
                  stroke="var(--festa-border)"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-3 shrink-0">
            {data.map((entry) => (
              <li key={entry.category} className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-sm border-2 border-festa-border"
                  style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
                  aria-hidden
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-festa-on-surface-variant">
                    {entry.label}
                  </p>
                  <p className="font-display font-bold text-festa-on-surface tabular-nums">
                    {formatEuro(entry.revenue)}
                    {total > 0 && (
                      <span className="ml-1 text-xs text-festa-on-surface-variant">
                        ({Math.round((entry.revenue / total) * 100)}%)
                      </span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  )
}
