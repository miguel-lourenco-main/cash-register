"use client"

import { useMemo } from "react"
import { RevenueChart } from "./revenue-chart"
import { TopProductsChart } from "./top-products-chart"
import { CategoryBreakdown } from "./category-breakdown"
import { OperatorRevenue } from "./operator-revenue"
import {
  revenueByCategory,
  revenueByHour,
  revenueByOperator,
  topProducts,
} from "@/lib/order-analytics"
import type { Order } from "@/lib/types"

export function AnalyticsSection({ orders }: { orders: Order[] }) {
  const hourly = useMemo(() => revenueByHour(orders), [orders])
  const products = useMemo(() => topProducts(orders), [orders])
  const categories = useMemo(() => revenueByCategory(orders), [orders])
  const operators = useMemo(() => revenueByOperator(orders), [orders])

  return (
    <section className="mb-margin-page grid grid-cols-1 md:grid-cols-2 gap-gutter">
      <RevenueChart data={hourly} />
      <TopProductsChart data={products} />
      <CategoryBreakdown data={categories} />
      <OperatorRevenue data={operators} />
    </section>
  )
}
