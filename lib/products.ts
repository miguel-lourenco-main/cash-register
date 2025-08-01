import type { AppProduct } from "./types"
import { supabase } from "./supabase"

// This function now fetches products from Supabase
export const getProducts = async (): Promise<AppProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price
  }))
}

// Function to get a single product by ID
export const getProductById = async (id: string): Promise<AppProduct | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price
  }
}
