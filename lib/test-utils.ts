export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const tax = itemTotal * 0.08;
    return sum + itemTotal + tax;
  }, 0);
}

export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function validateOrder(order: { items: unknown[]; customerId: string }): boolean {
  if (!order.customerId || order.customerId.trim() === '') {
    return false;
  }
  if (!order.items || order.items.length === 0) {
    return false;
  }
  return true;
}

export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
}

export function applyDiscount(total: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    return total;
  }
  const discountAmount = total * (discountPercent / 100);
  return Math.max(0, total - discountAmount);
}

