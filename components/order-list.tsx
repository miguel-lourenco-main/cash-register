"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Euro, ChevronLeft, ChevronRight } from "lucide-react"

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10
  
  // Sort orders by creation date (most recent first)
  const sortedOrders = initialOrders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage
  const currentOrders = sortedOrders.slice(startIndex, endIndex)
  
  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const calculateTotalRevenue = () => {
    return initialOrders.reduce((total, order) => total + calculateOrderTotal(order), 0)
  }

  const router = useRouter()

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

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
          <CardDescription>
            Lista de todos os pedidos confirmados. 
            {totalPages > 1 && (
              <span className="block mt-1 text-sm">
                Página {currentPage} de {totalPages} • Mostrando {startIndex + 1}-{Math.min(endIndex, sortedOrders.length)} de {sortedOrders.length} pedidos
              </span>
            )}
          </CardDescription>
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
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <TableRow key={order.id} onClick={() => router.push(`/orders?orderId=${order.id}`)}>
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
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1}-{Math.min(endIndex, sortedOrders.length)} de {sortedOrders.length} pedidos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1 px-3 py-1 text-sm">
                  <span className="font-medium">{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
