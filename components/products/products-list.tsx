"use client"

import Image from "next/image"
import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import type { AppProduct } from "@/lib/types"

interface ProductsListProps {
  products: AppProduct[]
  onEdit: (product: AppProduct) => void
}

export function ProductsList({ products, onEdit }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-festa-outline-variant/50 p-gutter text-center text-festa-on-surface-variant">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex gap-4 rounded-2xl border border-festa-outline-variant/30 bg-card p-4 shadow-festa-card"
        >
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-festa-surface-container-high shrink-0">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MaterialIcon
                  name={product.category === "bebida" ? "local_bar" : "restaurant"}
                  className="text-2xl text-festa-on-surface-variant"
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-festa-on-surface truncate">{product.name}</h3>
                <p className="text-sm text-festa-on-surface-variant truncate">
                  {product.id}
                </p>
              </div>
              <span className="font-extrabold text-festa-accent shrink-0">
                {product.price.toFixed(2)}€
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-festa-on-surface-variant mt-1 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 gap-3">
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                  product.category === "bebida"
                    ? "bg-festa-tertiary/10 text-festa-festival-blue"
                    : "bg-festa-primary-container/10 text-festa-accent"
                )}
              >
                {product.category === "bebida" ? "Bebida" : "Comida"}
              </span>
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-festa-surface-container-low text-festa-on-surface font-bold text-sm hover:bg-festa-surface-container-high active:scale-[0.98] transition-all"
              >
                <MaterialIcon name="edit" className="text-base" />
                Editar
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
