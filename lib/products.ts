/** Product catalog reads — sorted to match the seeded menu order in `seed-products`. */
import type { AppProduct } from "./types"
import { BEBIDAS, COMIDA } from "./seed-products"
import { supabase } from "./supabase"
import {
  isConnectionError,
  isKnownOffline,
  markOffline,
  markOnline,
  timeoutSignal,
} from "./db-status"
import { getDemoProductById, getDemoProducts } from "./demo-store"
import { isLocalMode } from "./app-mode"

export const getProducts = async (): Promise<AppProduct[]> => {
  if (isLocalMode() || isKnownOffline()) return getDemoProducts()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .abortSignal(timeoutSignal())

  if (error) {
    if (isConnectionError(error)) {
      markOffline()
      return getDemoProducts()
    }
    console.error('Error fetching products:', error)
    return []
  }

  markOnline()

  const products = data.map(product => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    category: product.category as 'comida' | 'bebida',
    imageUrl: product.image_url ?? null,
    description: product.description ?? null,
  }))

  // Bebidas first (seed order), then comida, then any admin-added items by name.
  const sortedProducts = products.sort((a, b) => {
    const indexA = BEBIDAS.indexOf(a.id)
    const indexB = BEBIDAS.indexOf(b.id)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    const indexAComida = COMIDA.indexOf(a.id)
    const indexBComida = COMIDA.indexOf(b.id)

    if (indexAComida !== -1 && indexBComida !== -1) {
      return indexAComida - indexBComida
    }

    if (indexA !== -1) return -1
    if (indexB !== -1) return -1
    if (indexAComida !== -1) return 1
    if (indexBComida !== -1) return 1

    return a.name.localeCompare(b.name)
  })

  return sortedProducts
}

export const getProductById = async (id: string): Promise<AppProduct | null> => {
  if (isLocalMode() || isKnownOffline()) return getDemoProductById(id)

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .abortSignal(timeoutSignal())
    .single()

  if (error) {
    if (isConnectionError(error)) {
      markOffline()
      return getDemoProductById(id)
    }
    console.error('Error fetching product:', error)
    return null
  }

  markOnline()

  return {
    id: data.id,
    name: data.name,
    price: Number(data.price),
    category: data.category as 'comida' | 'bebida',
    imageUrl: data.image_url ?? null,
    description: data.description ?? null,
  }
}
