export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 10 && cleaned.length <= 15
}

/** Luhn check — validates card number checksum, not issuer or expiry. */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, "")
  if (!/^\d+$/.test(cleaned)) {
    return false
  }

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export type ProductCategory = "comida" | "bebida"

export interface ProductFormValues {
  id: string
  name: string
  price: string
  category: ProductCategory
  description: string
}

export interface ProductFormErrors {
  id?: string
  name?: string
  price?: string
  category?: string
  image?: string
}

/** Client-side guard before the admin RPC; mirrors SQL upsert_product constraints. */
export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {}

  const id = values.id.trim()
  if (!id) {
    errors.id = "Identificador obrigatório."
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    errors.id = "Use apenas letras minúsculas, números e hífens."
  }

  if (!values.name.trim()) {
    errors.name = "Nome obrigatório."
  }

  const price = Number.parseFloat(values.price.replace(",", "."))
  if (Number.isNaN(price) || price < 0) {
    errors.price = "Preço inválido."
  }

  if (values.category !== "comida" && values.category !== "bebida") {
    errors.category = "Categoria inválida."
  }

  return errors
}

export function parseProductPrice(price: string): number {
  return Number.parseFloat(price.replace(",", "."))
}
