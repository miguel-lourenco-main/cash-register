import type { AppProduct } from "./types"
import { supabase } from "./supabase"

const BEBIDAS = [
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
]

const COMIDA = [
  'batata-fritas',
  'bifanas',
  'pica-pau',
  'moelas',
  'gelado',
  'chupa-caramelo'
]

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
    price: Number(product.price),
    category: product.category as 'comida' | 'bebida',
    imageUrl: product.image_url ?? null,
    description: product.description ?? null,
  }))

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
    price: Number(data.price),
    category: data.category as 'comida' | 'bebida',
    imageUrl: data.image_url ?? null,
    description: data.description ?? null,
  }
}
