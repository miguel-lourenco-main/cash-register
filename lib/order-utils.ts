import type { AppOrderItem, Order } from "./types"

/** Price of one line, preferring the sale-time snapshot over the current product price. */
export function lineItemTotal(item: AppOrderItem): number {
  return (item.unitPrice ?? item.product.price) * item.quantity
}

/** Order total: stored snapshot when present, otherwise summed from line items. */
export function calculateOrderTotal(order: Order): number {
  if (order.total != null) return order.total
  return order.items.reduce((sum, item) => sum + lineItemTotal(item), 0)
}

/** Display format used across the app: "12.50€" */
export function formatEuro(value: number): string {
  return `${value.toFixed(2)}€`
}

/** Round to cents, avoiding float drift in tendered/change math. */
export function roundEuro(value: number): number {
  return Math.round(value * 100) / 100
}
