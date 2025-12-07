export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateProductData(product: {
  name?: unknown;
  price?: unknown;
  category?: unknown;
}): boolean {
  if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
    return false;
  }
  
  if (typeof product.price !== 'number' || product.price <= 0) {
    return false;
  }
  
  if (product.category && typeof product.category !== 'string') {
    return false;
  }
  
  return true;
}

