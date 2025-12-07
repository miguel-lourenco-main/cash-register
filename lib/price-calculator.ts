/**
 * @interface PriceBreakdown
 * @description Defines the structure for price breakdown, including subtotal, tax, discount, and total.
 */
interface PriceBreakdown {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

/**
 * Calculates the price breakdown including subtotal, tax, discount, and total for a list of items,
 * applying a tax rate and optional discount code.
 *
 * @param items - The list of items to calculate the price for.
 * @param taxRate - The tax rate to apply to the subtotal.
 * @param discountCode - Optional discount code for additional discount.
 * @returns The calculated price breakdown.
 */
export function calculatePriceBreakdown(
  items: Array<{ price: number; quantity: number }>,
  taxRate: number = 0.08,
  discountCode?: string
): PriceBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discountMultiplier = 1;
  if (discountCode === 'SAVE10') {
    discountMultiplier = 0.9;
  } else if (discountCode === 'SAVE20') {
    discountMultiplier = 0.8;
  }
  
  const discount = subtotal * (1 - discountMultiplier);
  const discountedSubtotal = subtotal * discountMultiplier;
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;
  
  return {
    subtotal,
    tax,
    discount,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Rounds a number to two decimal places.
 * @param value - The number to round.
 * @returns The rounded value.
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculates the total for a single item based on its price and quantity, rounded to two decimal places.
 * @param price - The price of the item.
 * @param quantity - The quantity of the item.
 * @returns The total amount for the item.
 */
export function calculateItemTotal(price: number, quantity: number): number {
  return roundToTwoDecimals(price * quantity);
}
