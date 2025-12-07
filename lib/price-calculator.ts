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
 * @function calculatePriceBreakdown
 * @description Calculates the price breakdown including subtotal, tax, discount, and total for a list of items, applying a tax rate and optional discount code.
 * @param {Array} items - The list of items to calculate the price for.
 * @param {number} taxRate - The tax rate to apply to the subtotal.
 * @param {string} [discountCode] - Optional discount code for additional discount.
 * @returns {PriceBreakdown} The calculated price breakdown.
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
    /**
 * @function roundToTwoDecimals
 * @description Rounds a number to two decimal places.
 * @param {number} value - The number to round.
 * @returns {number} The rounded value.
 */
    subtotal,
    tax,
    discount,
    total: Math.round(total * 100) / 100,
  /**
 * @function calculateItemTotal
 * @description Calculates the total for a single item based on its price and quantity, rounded to two decimal places.
 * @param {number} price - The price of the item.
 * @param {number} quantity - The quantity of the item.
 * @returns {number} The total amount for the item.
 */
  };
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateItemTotal(price: number, quantity: number): number {
  return roundToTwoDecimals(price * quantity);
}

