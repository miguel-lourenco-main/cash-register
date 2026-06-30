import type { AppProduct } from "./types"
import type { OperatorPublic } from "./operators"

/**
 * Static seed data used when the Supabase backend is unreachable (paused
 * project). Mirrors supabase/seed.sql so the demo experience matches the real
 * catalog. Single source of truth for `demo-store`.
 */

/** Catalog in canonical display order (Bebidas first, then Comida). */
export const DEMO_PRODUCTS: AppProduct[] = [
  // Bebidas
  { id: "cerveja", name: "Cerveja", price: 1.0, category: "bebida", imageUrl: null, description: "Imperial de cerveja" },
  { id: "metro-cerveja-11-imperiais", name: "Metro de cerveja (11 imperiais)", price: 10.0, category: "bebida", imageUrl: null, description: "Metro com 11 imperiais" },
  { id: "sidra", name: "Sidra", price: 1.5, category: "bebida", imageUrl: null, description: "Copo de sidra" },
  { id: "vinho-copo", name: "Vinho (copo)", price: 0.5, category: "bebida", imageUrl: null, description: "Copo de vinho tinto ou branco" },
  { id: "jarra-vinho", name: "Jarra de Vinho", price: 4.5, category: "bebida", imageUrl: null, description: "Jarra de vinho para partilhar" },
  { id: "garrafa-vinho-monte-velho", name: "Garrafa de Vinho Monte Velho", price: 6.5, category: "bebida", imageUrl: null, description: "Garrafa de vinho Monte Velho" },
  { id: "cerveja-sem-alcool", name: "Cerveja s/ álcool", price: 1.5, category: "bebida", imageUrl: null, description: "Cerveja sem álcool" },
  { id: "agua-33cl", name: "Água 33cl", price: 0.8, category: "bebida", imageUrl: null, description: "Garrafa de água 33cl" },
  { id: "agua-com-gas", name: "Água c/ gás", price: 1.2, category: "bebida", imageUrl: null, description: "Água com gás" },
  { id: "coca-cola-ice-tea-sumo", name: "Coca-cola/ Ice Tea/ Sumo lata", price: 1.5, category: "bebida", imageUrl: null, description: "Refrigerante ou sumo em lata" },
  { id: "ginja-copo-chocolate", name: "Ginja em copo de chocolate", price: 1.2, category: "bebida", imageUrl: null, description: "Ginja servida num copo comestível de chocolate" },
  { id: "vinho-porto", name: "Vinho do Porto", price: 1.5, category: "bebida", imageUrl: null, description: "Copo de vinho do Porto" },
  { id: "favaios", name: "Favaios", price: 1.0, category: "bebida", imageUrl: null, description: "Copo de vinho moscatel de Favaios" },
  { id: "licor-beirao", name: "Licor Beirão", price: 3.0, category: "bebida", imageUrl: null, description: "Copo de Licor Beirão" },
  { id: "shot", name: "Shot", price: 1.5, category: "bebida", imageUrl: null, description: "Shot de licor à escolha" },
  { id: "caipirao", name: "Caipirão", price: 3.5, category: "bebida", imageUrl: null, description: "Caipirinha com Licor Beirão" },
  { id: "porto-tonico", name: "Porto tónico", price: 3.5, category: "bebida", imageUrl: null, description: "Vinho do Porto com tónico" },
  { id: "whiskey", name: "Whiskey", price: 3.0, category: "bebida", imageUrl: null, description: "Copo de whiskey" },
  { id: "whiskey-agua-pedras", name: "Whiskey c/ água das pedras", price: 3.5, category: "bebida", imageUrl: null, description: "Whiskey com água das pedras" },
  { id: "gin-tonico", name: "Gin tónico", price: 4.0, category: "bebida", imageUrl: null, description: "Gin com tónico" },
  { id: "cafe-descafeinado", name: "Café/ descafeínado", price: 0.8, category: "bebida", imageUrl: null, description: "Café ou descafeinado" },
  // Comida
  { id: "batata-fritas", name: "Batata Fritas", price: 2.4, category: "comida", imageUrl: null, description: "Porção de batatas fritas" },
  { id: "bifanas", name: "Bifanas", price: 3.0, category: "comida", imageUrl: null, description: "Bifana no pão" },
  { id: "pica-pau", name: "Pica pau", price: 5.0, category: "comida", imageUrl: null, description: "Prato de carne em cubos com molho" },
  { id: "moelas", name: "Moelas", price: 3.5, category: "comida", imageUrl: null, description: "Moelas de frango em molho picante" },
  { id: "gelado", name: "Gelado", price: 1.5, category: "comida", imageUrl: null, description: "Gelado individual" },
  { id: "chupa-caramelo", name: "Chupa, Caramelo", price: 0.5, category: "comida", imageUrl: null, description: "Chupa-chupa ou caramelo" },
]

export interface DemoOperator extends OperatorPublic {
  /** Demo-only plaintext PIN (the real backend stores a bcrypt hash). */
  pin: string
}

/** Operators with their demo PINs — matches the seed in the operators migration. */
export const DEMO_OPERATORS: DemoOperator[] = [
  { id: "demo-op-carlos", name: "Carlos R.", role: "vendedor", pin: "1234" },
  { id: "demo-op-maria", name: "Maria S.", role: "vendedor", pin: "1234" },
  { id: "demo-op-joao", name: "João P.", role: "vendedor", pin: "1234" },
  { id: "demo-op-ana", name: "Ana L.", role: "admin", pin: "5678" },
]

/** Public view of an operator (never exposes the PIN). */
export function toPublicOperator(operator: DemoOperator): OperatorPublic {
  return { id: operator.id, name: operator.name, role: operator.role }
}

/** A sample historical order, used to pre-populate the Pedidos page in demo mode. */
export interface DemoSampleOrder {
  id: string
  /** Minutes before "now" the order was placed. */
  minutesAgo: number
  operatorId: string
  items: { productId: string; quantity: number }[]
}

export const DEMO_SAMPLE_ORDERS: DemoSampleOrder[] = [
  {
    id: "demo-ord-001",
    minutesAgo: 120,
    operatorId: "demo-op-carlos",
    items: [
      { productId: "cerveja", quantity: 3 },
      { productId: "batata-fritas", quantity: 2 },
    ],
  },
  {
    id: "demo-ord-002",
    minutesAgo: 60,
    operatorId: "demo-op-maria",
    items: [
      { productId: "metro-cerveja-11-imperiais", quantity: 1 },
      { productId: "bifanas", quantity: 4 },
      { productId: "cafe-descafeinado", quantity: 2 },
    ],
  },
  {
    id: "demo-ord-003",
    minutesAgo: 30,
    operatorId: "demo-op-joao",
    items: [
      { productId: "gin-tonico", quantity: 2 },
      { productId: "pica-pau", quantity: 1 },
      { productId: "gelado", quantity: 3 },
    ],
  },
]
