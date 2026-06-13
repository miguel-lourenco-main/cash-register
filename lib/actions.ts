import type { Order, AppOrderItem, OrderItemWithProduct, CreateOrderContext, OrderPayment } from "./types"
import { supabase } from "./supabase"

export async function createOrder(
  items: AppOrderItem[],
  context: CreateOrderContext,
  payment: OrderPayment
): Promise<{ success: boolean; order?: Order }> {
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
      console.error("Failed to create order:", orderError)
      return { success: false }
    }

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
    console.error("Failed to create order:", error)
    return { success: false }
  }
}

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

    if (ordersError) {
      console.error("Failed to fetch orders:", ordersError)
      return []
    }

    return ordersData.map(mapOrderRow)
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
          product:products (*)
        ),
        operator:operators (id, name)
      `)
      .eq('id', id)
      .single()

    if (orderError || !orderData) {
      console.error("Failed to fetch order:", orderError)
      return undefined
    }

    return mapOrderRow(orderData)
  } catch (error) {
    console.error("Failed to fetch order:", error)
    return undefined
  }
}
