import type { AppProduct } from "./types"
import { supabase } from "./supabase"

// Define the desired product order based on the CSV
const PRODUCT_ORDER = [
  'cerveja',
  'metro-cerveja-11-imperiais',
  'sidra',
  'vinho-copo',
  'jarra-vinho',
  'garrafa-vinho-monte-velho',
  'cerveja-sem-alcool',
  'agua-33cl',
  'agua-com-gas',
  'coca-cola-ice-tea-sumo',
  'ginja-copo-chocolate',
  'vinho-porto',
  'favaios',
  'licor-beirao',
  'shot',
  'caipirao',
  'porto-tonico',
  'whiskey',
  'whiskey-agua-pedras',
  'gin-tonico',
  'cafe-descafeinado',
  'batata-fritas',
  'bifanas',
  'pica-pau',
  'moelas',
  'gelado',
  'chupa-caramelo'
]

// This function now fetches products from Supabase and orders them according to PRODUCT_ORDER
export const getProducts = async (): Promise<AppProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  const products = data.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price
  }))

  // Sort products according to the predefined order
  const sortedProducts = products.sort((a, b) => {
    const indexA = PRODUCT_ORDER.indexOf(a.id)
    const indexB = PRODUCT_ORDER.indexOf(b.id)
    
    // If both products are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    
    // If only one is in the order array, prioritize it
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    // If neither is in the order array, maintain alphabetical order
    return a.name.localeCompare(b.name)
  })

  return sortedProducts
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
