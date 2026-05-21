"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type ProductCategory = "bebida" | "comida"

interface CategoryTabsProps {
  active: ProductCategory
  onChange: (category: ProductCategory) => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const bebidaRef = useRef<HTMLButtonElement>(null)
  const comidaRef = useRef<HTMLButtonElement>(null)
  const [indicator, setIndicator] = useState({ width: 0, left: 0 })

  useEffect(() => {
    const btn = active === "bebida" ? bebidaRef.current : comidaRef.current
    if (btn?.parentElement) {
      setIndicator({
        width: btn.offsetWidth,
        left: btn.offsetLeft,
      })
    }
  }, [active])

  return (
    <nav className="sticky top-touch-target-min md:top-20 z-20 bg-festa-surface px-gutter pt-4 pb-2">
      <div className="flex gap-6 md:gap-8 border-b border-festa-outline-variant relative">
        <button
          ref={bebidaRef}
          type="button"
          onClick={() => onChange("bebida")}
          className={cn(
            "pb-3 px-1 text-title-md transition-colors relative",
            active === "bebida"
              ? "text-festa-accent font-bold"
              : "text-festa-on-surface-variant font-semibold"
          )}
        >
          Bebidas
        </button>
        <button
          ref={comidaRef}
          type="button"
          onClick={() => onChange("comida")}
          className={cn(
            "pb-3 px-1 text-title-md transition-colors relative",
            active === "comida"
              ? "text-festa-accent font-bold"
              : "text-festa-on-surface-variant font-semibold"
          )}
        >
          Comida
        </button>
        <div
          className="absolute bottom-0 h-1 bg-festa-primary-container transition-all duration-300 ease-out rounded-full"
          style={{ width: indicator.width, left: indicator.left }}
        />
      </div>
    </nav>
  )
}
