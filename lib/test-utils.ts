
   * Calculates the total price of items including tax.
   * @returns {number} The total price after tax.
   
Calculates the total price of items including tax.
@returns {number} The total price after tax.
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const tax = itemTotal * 0.08;
    return sum + itemTotal + tax;
  }, 0);
}

   Formats a number into USD currency string.
@param {number} amount - The amount to format.
@returns {string} The formatted currency string.
   * Formats a number into USD currency string.
   * @param {number} amount - The numerical amount to format.
   * @returns {string} The formatted currency string.
   

export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  Validates an order object to ensure it has a customerId and items.
@param {object} order - The order object to validate.
@returns {boolean} True if valid, otherwise false.
  });
  return formatter.format(amount);

   * Validates an order object to ensure it has a customerId and items.
   * @param {object} order - The order object to validate.
   * @returns {boolean} True if the order is valid, false otherwise.
   
}

export function validateOrder(order: { items: unknown[]; customerId: string }): boolean {
  if (!order.customerId || order.customerId.trim() === '') {
    return false;
  Generates a unique order ID using the current timestamp and a random number.
@returns {string} The unique order ID.
  }
  if (!order.items || order.items.length === 0) {
    return false;
  
   * Generates a unique order ID using the current timestamp and a random number.
   * @returns {string} The generated order ID.
   
  }
  return true;
Applies a discount to a total price and ensures it is not negative.
@param {number} total - The original total price.
@param {number} discount - The discount to apply.
@returns {number} The total price after discount.
}

export function generateOrderId(): string {
  const timestamp = Date.now();
  
   * Applies a discount to a total price and ensures it is not negative.
   * @param {number} total - The original total price.
   * @param {number} discount - The discount amount to apply.
   * @returns {number} The new total price after discount.
   
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

