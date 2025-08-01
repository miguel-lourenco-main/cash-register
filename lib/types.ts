import type { Tables } from "./database.types"

export type Product = Tables<'products'>

export type OrderItem = Tables<'order_items'>

export type OrderRow = Tables<'orders'>

// Type for OrderItem with joined product data from Supabase queries
export type OrderItemWithProduct = OrderItem & {
  products: Product
}

// Application-level types
export interface AppProduct {
  id: string
  name: string
  price: number
}

export interface AppOrderItem {
  product: AppProduct
  quantity: number
}

export interface Order {
  id: string
  createdAt: Date
  items: AppOrderItem[]
}
