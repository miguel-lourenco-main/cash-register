import type {
  AppOrderItem,
  AppProduct,
  CreateOrderContext,
  Order,
  OrderPayment,
} from "./types"
import type { OperatorPublic } from "./operators"
import type { OperatorSession } from "./operator-session"
import type { ShiftSummary, ShiftTopItem } from "./shifts"
import { writeOperatorSession } from "./operator-session"
import {
  DEMO_OPERATORS,
  DEMO_PRODUCTS,
  DEMO_SAMPLE_ORDERS,
  toPublicOperator,
  type DemoOperator,
} from "./demo-data"

/**
 * In-browser demo backend used when Supabase is unreachable. Everything is
 * persisted to localStorage so that orders/products survive reloads and the
 * whole app stays coherent (create an order → it shows up in Pedidos and in the
 * shift summary). Nothing here ever touches the network.
 */

const PRODUCTS_KEY = "festa-demo-products"
const ORDERS_KEY = "festa-demo-orders"

interface StoredOrder {
  id: string
  createdAt: string
  registeredBy: { id: string; name: string } | null
  shiftId: string | null
  total: number | null
  amountTendered: number | null
  changeDue: number | null
  items: { product: AppProduct; quantity: number; unitPrice: number | null }[]
}

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  if (!hasStorage()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — demo data simply won't persist */
  }
}

function demoUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `demo-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`
}

// ----- Products -----------------------------------------------------------

export function getDemoProducts(): AppProduct[] {
  const stored = readJson<AppProduct[] | null>(PRODUCTS_KEY, null)
  if (stored && stored.length > 0) return stored
  return [...DEMO_PRODUCTS]
}

export function getDemoProductById(id: string): AppProduct | null {
  return getDemoProducts().find((product) => product.id === id) ?? null
}

export function upsertDemoProduct(input: {
  id: string
  name: string
  price: number
  category: "comida" | "bebida"
  description?: string | null
  imageUrl?: string | null
}): AppProduct {
  const product: AppProduct = {
    id: input.id,
    name: input.name,
    price: input.price,
    category: input.category,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
  }
  const products = getDemoProducts()
  const index = products.findIndex((item) => item.id === product.id)
  if (index === -1) {
    products.push(product)
  } else {
    products[index] = product
  }
  writeJson(PRODUCTS_KEY, products)
  return product
}

// ----- Orders -------------------------------------------------------------

function reviveOrder(stored: StoredOrder): Order {
  return {
    id: stored.id,
    createdAt: new Date(stored.createdAt),
    registeredBy: stored.registeredBy,
    shiftId: stored.shiftId,
    total: stored.total,
    amountTendered: stored.amountTendered,
    changeDue: stored.changeDue,
    items: stored.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  }
}

/** Builds the sample order history the first time demo mode runs. */
function buildSampleOrders(): StoredOrder[] {
  const now = Date.now()
  const productsById = new Map(getDemoProducts().map((p) => [p.id, p]))
  const operatorsById = new Map(DEMO_OPERATORS.map((o) => [o.id, o]))

  return DEMO_SAMPLE_ORDERS.map((sample) => {
    const items = sample.items
      .map((line) => {
        const product = productsById.get(line.productId)
        if (!product) return null
        return { product, quantity: line.quantity, unitPrice: product.price }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    const total = items.reduce(
      (sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity,
      0
    )
    const operator = operatorsById.get(sample.operatorId)

    return {
      id: sample.id,
      createdAt: new Date(now - sample.minutesAgo * 60_000).toISOString(),
      registeredBy: operator ? { id: operator.id, name: operator.name } : null,
      shiftId: "demo-shift-history",
      total,
      amountTendered: null,
      changeDue: null,
      items,
    }
  })
}

function readStoredOrders(): StoredOrder[] {
  const existing = readJson<StoredOrder[] | null>(ORDERS_KEY, null)
  if (existing) return existing
  const seeded = buildSampleOrders()
  writeJson(ORDERS_KEY, seeded)
  return seeded
}

export function getDemoOrders(): Order[] {
  return readStoredOrders()
    .map(reviveOrder)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getDemoOrderById(id: string): Order | undefined {
  const found = readStoredOrders().find((order) => order.id === id)
  return found ? reviveOrder(found) : undefined
}

export function createDemoOrder(
  items: AppOrderItem[],
  context: CreateOrderContext,
  payment: OrderPayment
): Order {
  const operator = DEMO_OPERATORS.find((op) => op.id === context.operatorId)
  const stored: StoredOrder = {
    id: demoUuid(),
    createdAt: new Date().toISOString(),
    registeredBy: operator
      ? { id: operator.id, name: operator.name }
      : { id: context.operatorId, name: "" },
    shiftId: context.shiftId,
    total: payment.total,
    amountTendered: payment.amountTendered,
    changeDue: payment.changeDue,
    items: items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.product.price,
    })),
  }

  const orders = readStoredOrders()
  orders.push(stored)
  writeJson(ORDERS_KEY, orders)
  return reviveOrder(stored)
}

// ----- Operators / shifts -------------------------------------------------

export function listDemoOperators(): OperatorPublic[] {
  return DEMO_OPERATORS.map(toPublicOperator)
}

function findDemoOperator(operatorId: string, pin: string): DemoOperator | null {
  const operator = DEMO_OPERATORS.find((op) => op.id === operatorId)
  if (!operator || operator.pin !== pin) return null
  return operator
}

/** Authenticates against the static operators and starts an in-memory shift. */
export function demoLoginWithPin(
  operatorId: string,
  pin: string
): { success: boolean; session?: OperatorSession; error?: string } {
  const operator = findDemoOperator(operatorId, pin)
  if (!operator) {
    return { success: false, error: "Nome ou PIN incorreto." }
  }

  const session: OperatorSession = {
    operatorId: operator.id,
    operatorName: operator.name,
    operatorRole: operator.role,
    shiftId: `demo-shift-${demoUuid()}`,
    shiftStartedAt: new Date().toISOString(),
  }
  writeOperatorSession(session)
  return { success: true, session }
}

/** Aggregates the demo orders placed during a given shift. */
export function getDemoShiftSummary(shiftId: string): ShiftSummary {
  const orders = readStoredOrders().filter((order) => order.shiftId === shiftId)

  const quantitiesByProduct = new Map<string, ShiftTopItem>()
  let revenue = 0
  let firstOrderAt: Date | null = null
  let lastOrderAt: Date | null = null

  for (const order of orders) {
    let orderTotal = order.total
    if (orderTotal == null) {
      orderTotal = order.items.reduce(
        (sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity,
        0
      )
    }
    revenue += orderTotal

    const createdAt = new Date(order.createdAt)
    if (!firstOrderAt || createdAt < firstOrderAt) firstOrderAt = createdAt
    if (!lastOrderAt || createdAt > lastOrderAt) lastOrderAt = createdAt

    for (const item of order.items) {
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
}
