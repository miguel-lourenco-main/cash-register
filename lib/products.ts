import type { Product } from "./types"

// This is where you can define your list of products.
// In a real application, this data might come from a CMS or a database.
const PRODUCTS: Product[] = [
  { id: "tkt-001", name: "General Admission", price: 25.0 },
  { id: "tkt-002", name: "Child Admission (Under 12)", price: 15.0 },
  { id: "tkt-003", name: "Senior Admission (65+)", price: 20.0 },
  { id: "tkt-004", name: "VIP Experience", price: 75.0 },
  { id: "tkt-005", name: "Family Pass (2A, 2C)", price: 70.0 },
  { id: "tkt-006", name: "Student Pass", price: 18.0 },
  { id: "addon-001", name: "3D Glasses", price: 3.5 },
  { id: "addon-002", name: "Souvenir Program", price: 10.0 },
  { id: "addon-003", name: "Souvenir Program", price: 10.0 },
  { id: "addon-004", name: "Souvenir Program", price: 10.0 },
  { id: "addon-005", name: "Souvenir Program", price: 10.0 },
  { id: "addon-006", name: "Souvenir Program", price: 10.0 },
  { id: "addon-007", name: "Souvenir Program", price: 10.0 },
  { id: "addon-008", name: "Souvenir Program", price: 10.0 },
  { id: "addon-009", name: "Souvenir Program", price: 10.0 },
]

export const getProducts = (): Product[] => {
  return PRODUCTS
}
