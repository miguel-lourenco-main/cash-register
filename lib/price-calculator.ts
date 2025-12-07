interface PriceBreakdown {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

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

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateItemTotal(price: number, quantity: number): number {
  return roundToTwoDecimals(price * quantity);
}

