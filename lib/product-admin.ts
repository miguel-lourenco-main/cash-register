import { supabase } from "./supabase"
import type { AppProduct } from "./types"
import type { ProductCategory } from "./validation-helpers"

const PRODUCT_IMAGES_BUCKET = "product-images"
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

export interface UpsertProductInput {
  operatorId: string
  id: string
  name: string
  price: number
  category: ProductCategory
  description?: string | null
  imageUrl?: string | null
}

export interface ProductMutationResult {
  success: boolean
  product?: AppProduct
  error?: string
}

function mapRpcProduct(row: {
  id: string
  name: string
  price: number
  category: string
  description: string | null
  image_url: string | null
}): AppProduct {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category as ProductCategory,
    imageUrl: row.image_url,
    description: row.description,
  }
}

function mapProductError(error: { code?: string; message?: string }): string {
  if (error.code === "42501" || error.message?.includes("unauthorized")) {
    return "Acesso negado. Apenas administradores podem gerir produtos."
  }
  if (error.message?.includes("invalid_name")) {
    return "Nome do produto inválido."
  }
  if (error.message?.includes("invalid_price")) {
    return "Preço inválido."
  }
  if (error.message?.includes("invalid_id")) {
    return "Identificador do produto inválido."
  }
  if (error.code === "23505") {
    return "Já existe um produto com este identificador."
  }
  return error.message ?? "Não foi possível guardar o produto."
}

export async function upsertProduct(
  input: UpsertProductInput
): Promise<ProductMutationResult> {
  const { data, error } = await supabase.rpc("upsert_product", {
    p_operator_id: input.operatorId,
    p_id: input.id,
    p_name: input.name,
    p_price: input.price,
    p_category: input.category,
    p_description: input.description ?? null,
    p_image_url: input.imageUrl ?? null,
  })

  if (error) {
    console.error("upsert_product failed:", error)
    return { success: false, error: mapProductError(error) }
  }

  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    return { success: false, error: "Resposta vazia ao guardar produto." }
  }

  return { success: true, product: mapRpcProduct(row) }
}

export function validateProductImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Formato não suportado. Use JPEG, PNG ou WebP."
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "A imagem deve ter no máximo 5 MB."
  }
  return null
}

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<{ url?: string; error?: string }> {
  const validationError = validateProductImageFile(file)
  if (validationError) {
    return { error: validationError }
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${productId}/${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    })

  if (error) {
    console.error("uploadProductImage failed:", error)
    return { error: "Não foi possível carregar a imagem." }
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl }
}
