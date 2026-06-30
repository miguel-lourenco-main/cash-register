import { calculateOrderTotal, lineItemTotal, roundEuro } from "./order-utils"
import type { Order } from "./types"

export interface HourBucket {
  hour: string
  revenue: number
  orders: number
}

export interface ProductStat {
  name: string
  quantity: number
  revenue: number
}

export interface CategoryStat {
  category: "comida" | "bebida"
  label: string
  revenue: number
}

export interface OperatorStat {
  operatorId: string
  name: string
  revenue: number
  orders: number
}

/** Revenue per hour across the event window, with empty hours filled for a continuous axis. */
export function revenueByHour(orders: Order[]): HourBucket[] {
  if (orders.length === 0) return []

  const buckets = new Map<number, { revenue: number; orders: number }>()
  for (const order of orders) {
    // Bucket by absolute hour (date + hour) so multi-day events don't collapse
    const hourStamp = Math.floor(order.createdAt.getTime() / 3_600_000)
    const bucket = buckets.get(hourStamp) ?? { revenue: 0, orders: 0 }
    bucket.revenue += calculateOrderTotal(order)
    bucket.orders += 1
    buckets.set(hourStamp, bucket)
  }

  const stamps = [...buckets.keys()]
  const min = Math.min(...stamps)
  const max = Math.max(...stamps)
  // Cap the fill window so a stray legacy order doesn't generate thousands of buckets
  const start = max - min > 72 ? min : min

  const result: HourBucket[] = []
  for (let stamp = start; stamp <= max; stamp++) {
    const bucket = buckets.get(stamp)
    const date = new Date(stamp * 3_600_000)
    result.push({
      hour: `${date.getHours()}h`,
      revenue: roundEuro(bucket?.revenue ?? 0),
      orders: bucket?.orders ?? 0,
    })
  }
  return result
}

/** Best sellers by quantity, with revenue for the tooltip. */
export function topProducts(orders: Order[], limit = 8): ProductStat[] {
  const stats = new Map<string, ProductStat>()
  for (const order of orders) {
    for (const item of order.items) {
      const existing = stats.get(item.product.id)
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += lineItemTotal(item)
      } else {
        stats.set(item.product.id, {
          name: item.product.name,
          quantity: item.quantity,
          revenue: lineItemTotal(item),
        })
      }
    }
  }
  return [...stats.values()]
    .map((s) => ({ ...s, revenue: roundEuro(s.revenue) }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}

/** Split revenue between food and drinks for the category breakdown chart. */
export function revenueByCategory(orders: Order[]): CategoryStat[] {
  const totals = { comida: 0, bebida: 0 }
  for (const order of orders) {
    for (const item of order.items) {
      totals[item.product.category] += lineItemTotal(item)
    }
  }
  return [
    { category: "comida" as const, label: "Comida", revenue: roundEuro(totals.comida) },
    { category: "bebida" as const, label: "Bebidas", revenue: roundEuro(totals.bebida) },
  ].filter((entry) => entry.revenue > 0)
}

/** Per-operator revenue and order count for the shift leaderboard. */
export function revenueByOperator(orders: Order[]): OperatorStat[] {
  const stats = new Map<string, OperatorStat>()
  for (const order of orders) {
    const id = order.registeredBy?.id ?? "unknown"
    const name = order.registeredBy?.name ?? "Desconhecido"
    const existing = stats.get(id)
    const total = calculateOrderTotal(order)
    if (existing) {
      existing.revenue += total
      existing.orders += 1
    } else {
      stats.set(id, { operatorId: id, name, revenue: total, orders: 1 })
    }
  }
  return [...stats.values()]
    .map((s) => ({ ...s, revenue: roundEuro(s.revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
}
