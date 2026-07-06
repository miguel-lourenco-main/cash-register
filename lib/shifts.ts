import { supabase } from "./supabase"
import {
  isConnectionError,
  isKnownOffline,
  markOffline,
  markOnline,
  timeoutSignal,
} from "./db-status"
import { getDemoShiftSummary } from "./demo-store"
import { isLocalMode } from "./app-mode"

export interface ShiftTopItem {
  name: string
  quantity: number
}

export interface ShiftSummary {
  ordersCount: number
  revenue: number
  topItems: ShiftTopItem[]
  firstOrderAt: Date | null
  lastOrderAt: Date | null
}

interface ShiftOrderRow {
  id: string
  created_at: string | null
  total: number | null
  order_items: {
    quantity: number
    unit_price: number | null
    product: { id: string; name: string; price: number } | null
  }[]
}

/** Aggregate the operator's shift client-side — one query, festival-scale volumes. */
export async function getShiftSummary(shiftId: string): Promise<ShiftSummary | null> {
  if (isLocalMode() || isKnownOffline() || shiftId.startsWith("demo-shift-")) {
    return getDemoShiftSummary(shiftId)
  }
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `id, created_at, total,
         order_items ( quantity, unit_price, product:products ( id, name, price ) )`
      )
      .eq("shift_id", shiftId)
      .abortSignal(timeoutSignal())

    if (error || !data) {
      if (isConnectionError(error)) {
        markOffline()
        return getDemoShiftSummary(shiftId)
      }
      console.error("Failed to fetch shift summary:", error)
      return null
    }

    markOnline()

    const orders = data as unknown as ShiftOrderRow[]
    const quantitiesByProduct = new Map<string, ShiftTopItem>()
    let revenue = 0
    let firstOrderAt: Date | null = null
    let lastOrderAt: Date | null = null

    for (const order of orders) {
      let orderTotal = order.total != null ? Number(order.total) : null
      if (orderTotal == null) {
        orderTotal = order.order_items.reduce(
          (sum, item) =>
            sum + (item.unit_price ?? item.product?.price ?? 0) * item.quantity,
          0
        )
      }
      revenue += orderTotal

      if (order.created_at) {
        const createdAt = new Date(order.created_at)
        if (!firstOrderAt || createdAt < firstOrderAt) firstOrderAt = createdAt
        if (!lastOrderAt || createdAt > lastOrderAt) lastOrderAt = createdAt
      }

      for (const item of order.order_items) {
        if (!item.product) continue
        const existing = quantitiesByProduct.get(item.product.id)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          quantitiesByProduct.set(item.product.id, {
            name: item.product.name,
            quantity: item.quantity,
          })
        }
      }
    }

    const topItems = [...quantitiesByProduct.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    return {
      ordersCount: orders.length,
      revenue,
      topItems,
      firstOrderAt,
      lastOrderAt,
    }
  } catch (error) {
    if (isConnectionError(error)) {
      markOffline()
      return getDemoShiftSummary(shiftId)
    }
    console.error("Failed to fetch shift summary:", error)
    return null
  }
}
