export interface Product {
  id: string
  name: string
  price: number
}

export interface OrderItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  createdAt: Date
}
