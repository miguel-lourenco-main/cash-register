"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { StaggerGrid, StaggerItem } from "@/components/ui/motion"
import { cn } from "@/lib/utils"
import type { AppProduct } from "@/lib/types"

interface ProductsListProps {
  products: AppProduct[]
  onEdit: (product: AppProduct) => void
  justSavedId?: string | null
}

export function ProductsList({ products, onEdit, justSavedId }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-festa-border/40 p-gutter text-center text-festa-on-surface-variant">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <StaggerGrid className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-card-gap">
      {products.map((product) => (
        <StaggerItem key={product.id} className="h-full">
        <article
          className={cn(
            "group relative overflow-hidden lift-block flex h-full gap-4 rounded-lg border-2 border-festa-border bg-festa-paper p-4 shadow-block-sm",
            justSavedId === product.id && "animate-stamp ring-4 ring-festa-amber/60"
          )}
        >
          <div className="relative w-20 h-20 rounded-md border-2 border-festa-border overflow-hidden bg-festa-surface-high shrink-0">
            {product.imageUrl ? (
              <>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 mix-blend-multiply opacity-40",
                    product.category === "bebida" ? "bg-festa-festival-blue/20" : "bg-festa-amber/25"
                  )}
                />
              </>
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
              <span className="font-display font-bold text-festa-accent shrink-0 tabular-nums">
                {product.price.toFixed(2)}€
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-festa-on-surface-variant mt-1 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 gap-3">
              <Badge variant={product.category === "bebida" ? "info" : "warning"}>
                {product.category === "bebida" ? "Bebida" : "Comida"}
              </Badge>
              {/* Touch devices have no hover overlay — keep an inline Edit affordance. */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
                className="[@media(hover:hover)]:hidden"
              >
                <MaterialIcon name="edit" className="text-base" />
                Editar
              </Button>
            </div>
          </div>

          {/* Hover overlay (mouse/keyboard): mustard wash with the edit button on top.
              Hidden entirely on touch, where the inline button above is used instead. */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-festa-amber opacity-0 transition-opacity duration-200 [@media(hover:hover)]:flex group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <Button
              variant="default"
              size="sm"
              onClick={() => onEdit(product)}
              aria-label={`Editar ${product.name}`}
            >
              <MaterialIcon name="edit" className="text-base" />
              Editar
            </Button>
          </div>
        </article>
        </StaggerItem>
      ))}
    </StaggerGrid>
  )
}
