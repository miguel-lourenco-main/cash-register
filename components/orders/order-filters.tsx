"use client"

import { MaterialIcon } from "@/components/ui/material-icon"
import { Collapsible } from "@/components/ui/motion"

export type OrderSort = "time_desc" | "time_asc" | "amount_desc" | "amount_asc"
export type OrderPeriod = "all" | "last_hour" | "today" | "custom"

export interface OrderFiltersState {
  operatorId: string | null
  period: OrderPeriod
  from: string
  to: string
  sort: OrderSort
}

export const defaultOrderFilters: OrderFiltersState = {
  operatorId: null,
  period: "all",
  from: "",
  to: "",
  sort: "time_desc",
}

/** Operator, period, and sort controls for the order history grid. */
interface OrderFiltersProps {
  filters: OrderFiltersState
  onChange: (filters: OrderFiltersState) => void
  operators: { id: string; name: string }[]
}

const selectClassName =
  "h-12 rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm px-3 pr-8 text-sm font-bold text-festa-on-surface appearance-none outline-none cursor-pointer focus:ring-4 focus:ring-festa-amber/40 focus:border-festa-amber"

function FilterSelect({
  label,
  icon,
  value,
  onChange,
  children,
}: {
  label: string
  icon: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <MaterialIcon
        name={icon}
        className="absolute left-3 text-festa-on-surface-variant pointer-events-none text-lg"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${selectClassName} pl-10`}
      >
        {children}
      </select>
      <MaterialIcon
        name="expand_more"
        className="absolute right-2 text-festa-on-surface-variant pointer-events-none text-lg"
      />
    </label>
  )
}

export function OrderFilters({ filters, onChange, operators }: OrderFiltersProps) {
  const update = (patch: Partial<OrderFiltersState>) => onChange({ ...filters, ...patch })
  const isFiltering =
    filters.operatorId !== null || filters.period !== "all" || filters.sort !== "time_desc"

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          label="Filtrar por operador"
          icon="person"
          value={filters.operatorId ?? ""}
          onChange={(v) => update({ operatorId: v || null })}
        >
          <option value="">Todos os operadores</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Filtrar por período"
          icon="schedule"
          value={filters.period}
          onChange={(v) => update({ period: v as OrderPeriod })}
        >
          <option value="all">Todo o período</option>
          <option value="last_hour">Última hora</option>
          <option value="today">Hoje</option>
          <option value="custom">Personalizado</option>
        </FilterSelect>

        <FilterSelect
          label="Ordenar"
          icon="sort"
          value={filters.sort}
          onChange={(v) => update({ sort: v as OrderSort })}
        >
          <option value="time_desc">Mais recentes</option>
          <option value="time_asc">Mais antigos</option>
          <option value="amount_desc">Maior valor</option>
          <option value="amount_asc">Menor valor</option>
        </FilterSelect>

        {isFiltering && (
          <button
            type="button"
            onClick={() => onChange(defaultOrderFilters)}
            className="inline-flex items-center gap-1.5 h-12 px-3 rounded-lg text-sm font-bold text-festa-error cursor-pointer hover:bg-festa-error/10"
          >
            <MaterialIcon name="filter_alt_off" className="text-lg" />
            Limpar
          </button>
        )}
      </div>

      <Collapsible open={filters.period === "custom"}>
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <label className="flex items-center gap-2 text-sm font-bold text-festa-on-surface-variant">
            De
            <input
              type="datetime-local"
              value={filters.from}
              onChange={(e) => update({ from: e.target.value })}
              className="h-12 rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm px-3 text-sm font-medium text-festa-on-surface outline-none focus:ring-4 focus:ring-festa-amber/40 focus:border-festa-amber"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-festa-on-surface-variant">
            Até
            <input
              type="datetime-local"
              value={filters.to}
              onChange={(e) => update({ to: e.target.value })}
              className="h-12 rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm px-3 text-sm font-medium text-festa-on-surface outline-none focus:ring-4 focus:ring-festa-amber/40 focus:border-festa-amber"
            />
          </label>
        </div>
      </Collapsible>
    </div>
  )
}
