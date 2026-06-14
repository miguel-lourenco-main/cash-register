"use client"

import { useRef } from "react"
import Image from "next/image"
import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import type { AppProduct } from "@/lib/types"

interface ProductCardProps {
  product: AppProduct
  onAdd: (product: AppProduct, originRect?: DOMRect) => void
}

function CategoryPlaceholder({ category }: { category: AppProduct["category"] }) {
  const isBebida = category === "bebida"
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        isBebida ? "bg-festa-festival-blue/15" : "bg-festa-amber/20"
      )}
    >
      <MaterialIcon
        name={isBebida ? "local_bar" : "restaurant"}
        className={cn(
          "text-4xl lg:text-5xl",
          isBebida ? "text-festa-festival-blue" : "text-festa-accent"
        )}
      />
    </div>
  )
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const isBebida = product.category === "bebida"
  const chipRef = useRef<HTMLSpanElement>(null)

  return (
    <button
      type="button"
      onClick={() => onAdd(product, chipRef.current?.getBoundingClientRect())}
      className="group lift-block flex w-full h-full flex-col rounded-lg border-2 border-festa-border bg-festa-paper text-left shadow-block overflow-hidden cursor-pointer touch-manipulation focus-visible:ring-4 focus-visible:ring-festa-amber/60 outline-none active:translate-x-[2px] active:translate-y-[2px] active:!shadow-none"
    >
      <div className="relative w-full aspect-square border-b-2 border-festa-border bg-festa-surface-high overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <CategoryPlaceholder category={product.category} />
        )}
        {/* Screen-print duotone wash — warms on hover */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isBebida ? "bg-festa-festival-blue/15" : "bg-festa-amber/20"
          )}
        />
        {/* Add affordance — stamps in on hover */}
        <span
          aria-hidden
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block-sm opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none"
        >
          <MaterialIcon name="add" className="text-xl" />
        </span>
      </div>
      <div className="flex w-full flex-1 items-end justify-between gap-2 p-3">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-festa-on-surface leading-tight truncate text-base lg:text-lg">
            {product.name}
          </h3>
          {product.description && (
            <p className="hidden lg:block text-festa-on-surface-variant text-xs truncate mt-0.5">
              {product.description}
            </p>
          )}
        </div>
        <span
          ref={chipRef}
          className={cn(
            "shrink-0 rounded-md border-2 border-festa-border px-2.5 py-1 font-display text-lg font-bold tabular-nums",
            isBebida
              ? "bg-festa-festival-blue text-white dark:text-festa-ink"
              : "bg-festa-primary text-white dark:bg-festa-primary-emphasis dark:text-festa-ink"
          )}
        >
          {product.price.toFixed(2)}€
        </span>
      </div>
    </button>
  )
}
