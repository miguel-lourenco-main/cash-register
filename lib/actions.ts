"use server"

import type { Order, OrderItem } from "./types"

// This is a simple in-memory store for demonstration purposes.
// In a real application, you would use a database like Supabase, Neon, or MongoDB.
const orders: Order[] = []

export async function createOrder(items: OrderItem[]): Promise<{ success: boolean; order?: Order }> {
  try {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items,
      createdAt: new Date(),
    }

    orders.push(newOrder)
    return { success: true, order: newOrder }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false }
  }
}

export async function getOrders(): Promise<Order[]> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  return JSON.parse(JSON.stringify(orders)) // Return a copy
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  return orders.find((order) => order.id === id)
}
