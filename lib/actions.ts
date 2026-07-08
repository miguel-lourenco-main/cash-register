/**
 * Order persistence layer. Shared mode writes to Supabase; local mode and
 * unreachable backends transparently fall back to `demo-store`.
 */
import type { Order, AppOrderItem, OrderItemWithProduct, CreateOrderContext, OrderPayment } from "./types"
import { supabase } from "./supabase"
import {
  isConnectionError,
  isKnownOffline,
  markOffline,
  markOnline,
  timeoutSignal,
} from "./db-status"
import { createDemoOrder, getDemoOrderById, getDemoOrders } from "./demo-store"
import { isLocalMode } from "./app-mode"

/** Persists a sale and its line items; rolls back the order row if items fail. */
export async function createOrder(
  items: AppOrderItem[],
  context: CreateOrderContext,
  payment: OrderPayment
): Promise<{ success: boolean; order?: Order }> {
  if (isLocalMode() || isKnownOffline()) {
    return { success: true, order: createDemoOrder(items, context, payment) }
  }
  try {
    const orderId = crypto.randomUUID()

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        id: orderId,
        registered_by: context.operatorId,
        shift_id: context.shiftId,
        total: payment.total,
        amount_tendered: payment.amountTendered,
        change_due: payment.changeDue,
      }])
      .select()
      .single()

    if (orderError) {
      if (isConnectionError(orderError)) {
        markOffline()
        return { success: true, order: createDemoOrder(items, context, payment) }
      }
      console.error("Failed to create order:", orderError)
      return { success: false }
    }

    markOnline()

    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error("Failed to create order items:", itemsError)
      await supabase.from('orders').delete().eq('id', orderId)
      return { success: false }
    }

    const newOrder: Order = {
      id: orderData.id,
      items: items.map((item) => ({ ...item, unitPrice: item.product.price })),
      createdAt: new Date(orderData.created_at || ''),
      registeredBy: {
        id: context.operatorId,
        name: '',
      },
      shiftId: context.shiftId,
      total: payment.total,
      amountTendered: payment.amountTendered,
      changeDue: payment.changeDue,
    }

    return { success: true, order: newOrder }
  } catch (error) {
    if (isConnectionError(error)) {
      markOffline()
      return { success: true, order: createDemoOrder(items, context, payment) }
    }
    console.error("Failed to create order:", error)
    return { success: false }
  }
}

/** Supabase may embed the join as `operator` or `operators` depending on the query. */
function resolveOperator(
  order: Record<string, unknown>
): { id: string; name: string } | null {
  const op =
    order.operator ??
    order.operators
  if (!op || typeof op !== "object") return null
  const row = op as { id?: string; name?: string }
  if (!row.id || !row.name) return null
  return { id: row.id, name: row.name }
}

function mapOrderRow(order: {
  id: string
  created_at: string | null
  registered_by: string | null
  shift_id: string | null
  total?: number | null
  amount_tendered?: number | null
  change_due?: number | null
  order_items: OrderItemWithProduct[]
  [key: string]: unknown
}): Order {
  const operator = resolveOperator(order)
  return {
    id: order.id,
    createdAt: new Date(order.created_at || ''),
    registeredBy: operator,
    shiftId: order.shift_id,
    total: order.total != null ? Number(order.total) : null,
    amountTendered: order.amount_tendered != null ? Number(order.amount_tendered) : null,
    changeDue: order.change_due != null ? Number(order.change_due) : null,
    items: order.order_items.map((item: OrderItemWithProduct) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        category: item.product.category as 'comida' | 'bebida',
        imageUrl: item.product.image_url ?? null,
        description: item.product.description ?? null,
      },
      quantity: item.quantity,
      unitPrice: item.unit_price != null ? Number(item.unit_price) : null,
    }))
  }
}

export async function getOrders(): Promise<Order[]> {
  if (isLocalMode() || isKnownOffline()) return getDemoOrders()
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        operator:operators (id, name)
      `)
      .order('created_at', { ascending: false })
      .abortSignal(timeoutSignal())

    if (ordersError) {
      if (isConnectionError(ordersError)) {
        markOffline()
        return getDemoOrders()
      }
      console.error("Failed to fetch orders:", ordersError)
      return []
    }

    markOnline()
    return ordersData.map(mapOrderRow)
  } catch (error) {
    if (isConnectionError(error)) {
      markOffline()
      return getDemoOrders()
    }
    console.error("Failed to fetch orders:", error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (isLocalMode() || isKnownOffline()) return getDemoOrderById(id)
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        operator:operators (id, name)
      `)
      .eq('id', id)
      .abortSignal(timeoutSignal())
      .single()

    if (orderError || !orderData) {
      if (isConnectionError(orderError)) {
        markOffline()
        return getDemoOrderById(id)
      }
      console.error("Failed to fetch order:", orderError)
      return undefined
    }

    markOnline()
    return mapOrderRow(orderData)
  } catch (error) {
    if (isConnectionError(error)) {
      markOffline()
      return getDemoOrderById(id)
    }
    console.error("Failed to fetch order:", error)
    return undefined
  }
}
