/**
 * Validates if a given string is a properly formatted email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if the given phone number string has between 10 and 15 digits.
 * @param {string} phoneNumber - The phone number string to check.
 * @returns {boolean} True if the phone number is valid, otherwise false.
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Validates a credit card number using the Luhn algorithm.
 * @param {string} cardNumber - The credit card number to validate.
 * @returns {boolean} True if the credit card number is valid, otherwise false.
 */
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
  /**
 * Validates a product object ensuring it has a proper name, a valid price, and optionally, a valid category.
 * @param {Object} product - The product object to validate.
 * @param {string} product.name - The name of the product.
 * @param {number} product.price - The price of the product.
 * @param {string} [product.category] - The optional category of the product.
 * @returns {boolean} True if the product data is valid, otherwise false.
 */
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

