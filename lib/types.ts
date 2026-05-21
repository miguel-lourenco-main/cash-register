import type { Tables } from "./database.types"

export type Product = Tables<'products'>

export type OrderItem = Tables<'order_items'>

export type OrderRow = Tables<'orders'>

export type OrderItemWithProduct = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  created_at: string | null
  product: Product
}

export interface AppProduct {
  id: string
  name: string
  price: number
  category: 'comida' | 'bebida'
  imageUrl?: string | null
  description?: string | null
}

export interface AppOrderItem {
  product: AppProduct
  quantity: number
}

export interface OrderRegisteredBy {
  id: string
  name: string
}

export interface Order {
  id: string
  createdAt: Date
  items: AppOrderItem[]
  registeredBy?: OrderRegisteredBy | null
  shiftId?: string | null
}

export interface CreateOrderContext {
  operatorId: string
  shiftId: string
}
