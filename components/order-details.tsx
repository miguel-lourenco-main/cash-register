import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/types"

export default function OrderDetails({ order }: { order: Order }) {

  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            Order #{order.id} - Placed on {new Date(order.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
                <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end p-6">
          <div className="grid gap-2 text-right">
            <div className="font-semibold text-lg">Total</div>
            <div className="font-bold text-2xl">${calculateTotal().toFixed(2)}</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
