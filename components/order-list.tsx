"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Euro } from "lucide-react"

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const calculateTotalRevenue = () => {
    return initialOrders.reduce((total, order) => total + calculateOrderTotal(order), 0)
  }

  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Revenue Card */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Euro className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-xs text-muted-foreground">
                  {initialOrders.length} pedido{initialOrders.length !== 1 ? 's' : ''} confirmado{initialOrders.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-foreground">
                {calculateTotalRevenue().toFixed(2)}€
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Lista de todos os pedidos confirmados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialOrders.length > 0 ? (
                initialOrders
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((order) => (
                    <TableRow key={order.id} onClick={() => router.push(`/orders/${order.id}`)}>
                      <TableCell className="font-medium cursor-pointer">
                        #{order.id}
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                      <TableCell className="text-right">{calculateOrderTotal(order).toFixed(2)}€</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum pedido encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
