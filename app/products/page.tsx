import ProductsAdminClient from "@/components/products/products-admin-client"

// Enable static export — product data is fetched client-side after admin auth.
export const dynamic = "force-static"

export default function ProductsPage() {
  return <ProductsAdminClient />
}
