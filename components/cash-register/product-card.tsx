"use client"

import Image from "next/image"
import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import type { AppProduct } from "@/lib/types"

interface ProductCardProps {
  product: AppProduct
  onAdd: (product: AppProduct) => void
}

function CategoryPlaceholder({ category }: { category: AppProduct["category"] }) {
  const isBebida = category === "bebida"
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        isBebida ? "bg-festa-tertiary/10" : "bg-festa-primary-container/10"
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

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      className={cn(
        "group flex flex-col bg-card text-left max-h-[15rem] active:scale-[0.97] transition-all hover:shadow-lg shadow-festa-card border border-festa-outline-variant/30 overflow-hidden",
        "rounded-2xl p-3 lg:rounded-xl lg:p-0",
        "lg:border-l-4",
        isBebida ? "lg:border-l-festa-festival-blue" : "lg:border-l-festa-primary-container"
      )}
    >
      <div
        className={cn(
          "w-full overflow-hidden relative bg-festa-surface-container-high",
          "aspect-square mb-3 rounded-xl lg:mb-0 lg:rounded-none"
        )}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <CategoryPlaceholder category={product.category} />
        )}
        <div
          className={cn(
            "absolute top-2 right-2 text-festa-on-primary-container px-3 py-1 rounded-full font-bold",
            isBebida ? "bg-festa-festival-blue" : "bg-festa-primary",
            "lg:block hidden"
          )}
        >
          {product.price.toFixed(2)}€
        </div>
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl lg:hidden pointer-events-none" />
      </div>
      <div className="px-1 lg:p-4">
        <h3 className="font-bold text-festa-on-surface leading-tight truncate text-body-lg lg:text-title-md mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="hidden lg:block text-festa-on-surface-variant text-sm truncate">
            {product.description}
          </p>
        )}
        <span className="text-title-md font-extrabold text-festa-accent lg:hidden">
          {product.price.toFixed(2)}€
        </span>
      </div>
    </button>
  )
}
