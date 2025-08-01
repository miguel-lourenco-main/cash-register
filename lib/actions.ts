"use server"

import type { Order, AppOrderItem, OrderItemWithProduct } from "./types"
import { supabase } from "./supabase"

export async function createOrder(items: AppOrderItem[]): Promise<{ success: boolean; order?: Order }> {
  try {
    // Generate a unique order ID
    const orderId = Math.random().toString(36).substr(2, 9)
    
    // Create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ id: orderId }])
      .select()
      .single()

    if (orderError) {
      console.error("Failed to create order:", orderError)
      return { success: false }
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product.id,
      quantity: item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error("Failed to create order items:", itemsError)
      // Clean up the order if items failed to insert
      await supabase.from('orders').delete().eq('id', orderId)
      return { success: false }
    }

    const newOrder: Order = {
      id: orderData.id,
      items,
      createdAt: new Date()
    }

    return { success: true, order: newOrder }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false }
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error("Failed to fetch orders:", ordersError)
      return []
    }

    return ordersData.map(order => ({
      id: order.id,
      createdAt: new Date(order.created_at || ''),
      items: order.order_items.map((item: OrderItemWithProduct) => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          category: item.products.category
        },
        quantity: item.quantity
      }))
    }))
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', id)
      .single()

    if (orderError || !orderData) {
      console.error("Failed to fetch order:", orderError)
      return undefined
    }

    return {
      id: orderData.id,
      createdAt: new Date(orderData.created_at || ''),
      items: orderData.order_items.map((item: OrderItemWithProduct) => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          category: item.products.category
        },
        quantity: item.quantity
      }))
    }
  } catch (error) {
    console.error("Failed to fetch order:", error)
    return undefined
  }
}
