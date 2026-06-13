"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { StaggerGrid, StaggerItem } from "@/components/ui/motion"
import type { AppProduct } from "@/lib/types"

interface ProductsListProps {
  products: AppProduct[]
  onEdit: (product: AppProduct) => void
}

export function ProductsList({ products, onEdit }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-festa-border/40 p-gutter text-center text-festa-on-surface-variant">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <StaggerGrid className="grid grid-cols-1 lg:grid-cols-2 gap-card-gap">
      {products.map((product) => (
        <StaggerItem key={product.id} className="h-full">
        <article
          className="flex h-full gap-4 rounded-lg border-2 border-festa-border bg-festa-paper p-4 shadow-block-sm"
        >
          <div className="relative w-20 h-20 rounded-md border-2 border-festa-border overflow-hidden bg-festa-surface-high shrink-0">
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
              <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                <MaterialIcon name="edit" className="text-base" />
                Editar
              </Button>
            </div>
          </div>
        </article>
        </StaggerItem>
      ))}
    </StaggerGrid>
  )
}
