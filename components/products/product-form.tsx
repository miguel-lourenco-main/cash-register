"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import { slugifyProductName } from "@/lib/product-slug"
import {
  uploadProductImage,
  upsertProduct,
} from "@/lib/product-admin"
import type { OperatorSession } from "@/lib/operator-session"
import type { AppProduct } from "@/lib/types"
import {
  parseProductPrice,
  validateProductForm,
  type ProductCategory,
  type ProductFormErrors,
  type ProductFormValues,
} from "@/lib/validation-helpers"

interface ProductFormProps {
  session: OperatorSession
  product?: AppProduct | null
  onSaved: (product: AppProduct) => void
  onCancel: () => void
}

const emptyValues: ProductFormValues = {
  id: "",
  name: "",
  price: "",
  category: "bebida",
  description: "",
}

export function ProductForm({ session, product, onSaved, onCancel }: ProductFormProps) {
  const isEditing = Boolean(product)
  const [values, setValues] = useState<ProductFormValues>(() =>
    product
      ? {
          id: product.id,
          name: product.name,
          price: product.price.toFixed(2),
          category: product.category,
          description: product.description ?? "",
        }
      : emptyValues
  )
  const [idTouched, setIdTouched] = useState(isEditing)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl ?? null)
  const [removeImage, setRemoveImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({})

  // Auto-fill the slug from the name until the admin manually edits the id field.
  useEffect(() => {
    if (isEditing || idTouched) return
    setValues((current) => ({
      ...current,
      id: slugifyProductName(current.name),
    }))
  }, [values.name, isEditing, idTouched])

  useEffect(() => {
    if (!imageFile) return
    const objectUrl = URL.createObjectURL(imageFile)
    setImagePreview(objectUrl)
    setRemoveImage(false)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageFile])

  const categoryOptions = useMemo(
    () => [
      { value: "bebida" as const, label: "Bebida" },
      { value: "comida" as const, label: "Comida" },
    ],
    []
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const errors = validateProductForm(values)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setSubmitting(true)

    let imageUrl: string | null = removeImage ? null : product?.imageUrl ?? null

    if (imageFile) {
      const upload = await uploadProductImage(values.id.trim(), imageFile)
      if (upload.error) {
        setFieldErrors({ image: upload.error })
        setSubmitting(false)
        return
      }
      imageUrl = upload.url ?? null
    }

    const result = await upsertProduct({
      operatorId: session.operatorId,
      id: values.id.trim(),
      name: values.name.trim(),
      price: parseProductPrice(values.price),
      category: values.category,
      description: values.description.trim() || null,
      imageUrl,
    })

    setSubmitting(false)

    if (!result.success || !result.product) {
      toast.error("Erro", { description: result.error ?? "Não foi possível guardar." })
      return
    }

    toast.success(isEditing ? "Produto atualizado" : "Produto criado", {
      description: result.product.name,
    })
    onSaved(result.product)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border-2 border-festa-border bg-card shadow-block p-gutter flex flex-col gap-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title-md text-festa-on-surface">
          {isEditing ? "Editar produto" : "Novo produto"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 w-10 rounded-md flex items-center justify-center text-festa-on-surface-variant cursor-pointer hover:bg-festa-surface-high active:scale-95 transition-all"
          aria-label="Fechar formulário"
        >
          <MaterialIcon name="close" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nome" error={fieldErrors.name}>
          <input
            type="text"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            className={inputClassName(Boolean(fieldErrors.name))}
            placeholder="Ex: Cerveja"
            required
          />
        </Field>

        <Field label="Identificador" error={fieldErrors.id}>
          <input
            type="text"
            value={values.id}
            readOnly={isEditing}
            onChange={(event) => {
              setIdTouched(true)
              setValues((current) => ({ ...current, id: event.target.value }))
            }}
            className={cn(
              inputClassName(Boolean(fieldErrors.id)),
              isEditing && "opacity-70 cursor-not-allowed"
            )}
            placeholder="cerveja"
            required
          />
        </Field>

        <Field label="Preço (€)" error={fieldErrors.price}>
          <input
            type="text"
            inputMode="decimal"
            value={values.price}
            onChange={(event) =>
              setValues((current) => ({ ...current, price: event.target.value }))
            }
            className={inputClassName(Boolean(fieldErrors.price))}
            placeholder="1.00"
            required
          />
        </Field>

        <Field label="Categoria" error={fieldErrors.category}>
          <select
            value={values.category}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                category: event.target.value as ProductCategory,
              }))
            }
            className={inputClassName(Boolean(fieldErrors.category))}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Descrição">
        <textarea
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({ ...current, description: event.target.value }))
          }
          rows={2}
          className={cn(inputClassName(false), "resize-none min-h-[4.5rem]")}
          placeholder="Descrição opcional"
        />
      </Field>

      <Field label="Foto" error={fieldErrors.image}>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="relative w-28 h-28 rounded-md overflow-hidden bg-festa-surface-high border-2 border-dashed border-festa-border/50 shrink-0">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Pré-visualização"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MaterialIcon
                  name="image"
                  className="text-3xl text-festa-on-surface-variant"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 h-11 px-4 rounded-lg bg-festa-paper border-2 border-festa-border shadow-block-sm text-label-xl cursor-pointer hover:bg-festa-amber/20 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-colors">
              <MaterialIcon name="upload" className="text-lg" />
              Escolher foto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null
                  setImageFile(file)
                  event.target.value = ""
                }}
              />
            </label>
            {(imagePreview || product?.imageUrl) && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
                  setRemoveImage(true)
                }}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-festa-error text-sm font-bold cursor-pointer hover:bg-festa-error/10 active:scale-[0.98] transition-all"
              >
                <MaterialIcon name="delete" className="text-lg" />
                Remover foto
              </button>
            )}
            <p className="text-xs text-festa-on-surface-variant">
              JPEG, PNG ou WebP. Máximo 5 MB.
            </p>
          </div>
        </div>
      </Field>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? "A guardar..." : isEditing ? "Guardar alterações" : "Criar produto"}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-xl uppercase tracking-wider text-festa-on-surface-variant">
        {label}
      </span>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-sm text-festa-error font-bold" role="alert">
          <MaterialIcon name="warning" className="text-sm" />
          {error}
        </span>
      )}
    </label>
  )
}

function inputClassName(hasError: boolean) {
  return cn(
    "w-full h-12 px-4 rounded-lg bg-festa-paper border-2 text-festa-on-surface shadow-block-sm outline-none focus:ring-4 focus:ring-festa-amber/40",
    hasError
      ? "border-festa-error"
      : "border-festa-border focus:border-festa-amber"
  )
}
