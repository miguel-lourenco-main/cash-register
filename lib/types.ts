/** App-facing types — camelCase shapes used by UI; DB rows live in `database.types`. */
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
  unit_price: number | null
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
  /** Price snapshot at sale time; falls back to product.price for legacy rows */
  unitPrice?: number | null
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
  /** Order total snapshot at sale time (null on legacy rows) */
  total?: number | null
  amountTendered?: number | null
  changeDue?: number | null
}

export interface OrderPayment {
  total: number
  amountTendered: number
  changeDue: number
}

export interface CreateOrderContext {
  operatorId: string
  shiftId: string
}
