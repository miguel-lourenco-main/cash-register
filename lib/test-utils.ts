/**
 * Calculates the total price of items including a fixed tax rate.
 *
 * @param items - The list of items with price and quantity.
 * @returns The total price after tax.
 */
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  const TAX_RATE = 0.08;

  return items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const tax = itemTotal * TAX_RATE;
    return sum + itemTotal + tax;
  }, 0);
}

/**
 * Formats a number into a USD currency string.
 *
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

/**
 * Validates an order object to ensure it has a non-empty customerId and at least one item.
 *
 * @param order - The order object to validate.
 * @returns True if the order is valid, false otherwise.
 */
export function validateOrder(order: { items: unknown[]; customerId: string }): boolean {
  if (!order.customerId || order.customerId.trim() === '') {
    return false;
  }

  if (!order.items || order.items.length === 0) {
    return false;
  }

  return true;
}

/**
 * Generates a unique order ID using the current timestamp and a random number.
 *
 * @returns The generated order ID.
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
}

/**
 * Applies a discount to a total price and ensures it is not negative.
 *
 * @param total - The original total price.
 * @param discountPercent - The discount percentage to apply (0-100).
 * @returns The total price after discount.
 */
export function applyDiscount(total: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    return total;
  }

  const discountAmount = total * (discountPercent / 100);
  return Math.max(0, total - discountAmount);
}
