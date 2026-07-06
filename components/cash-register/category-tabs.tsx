"use client"

import { motion } from "motion/react"
import { MaterialIcon } from "@/components/ui/material-icon"
import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ProductCategory = "bebida" | "comida"

interface CategoryTabsProps {
  active: ProductCategory
  onChange: (category: ProductCategory) => void
}

const tabs: { value: ProductCategory; label: string; icon: string }[] = [
  { value: "bebida", label: "Bebidas", icon: "local_bar" },
  { value: "comida", label: "Comida", icon: "restaurant" },
]

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <nav className="shrink-0">
      <div className="inline-flex gap-1 rounded-lg border-2 border-festa-border bg-festa-paper p-1 shadow-block-sm">
        {tabs.map((tab) => {
          const isActive = active === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={cn(
                "lift-block relative flex h-12 items-center gap-2 rounded-md px-5 md:px-6 font-display text-base font-bold uppercase tracking-wide cursor-pointer",
                isActive
                  ? "text-festa-ink"
                  : "text-festa-on-surface-variant hover:bg-festa-surface-high"
              )}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.span
                  layoutId="category-tab-pill"
                  transition={springs.snappy}
                  className="absolute inset-0 rounded-md bg-festa-amber border-2 border-festa-border"
                  aria-hidden
                />
              )}
              <MaterialIcon name={tab.icon} filled={isActive} className="relative text-xl" />
              <span className="relative">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
