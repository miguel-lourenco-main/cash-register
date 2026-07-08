import ProductsAdminClient from "@/components/products/products-admin-client"

// Enable static export
export const dynamic = "force-static"

/** Admin-only product management — access is enforced inside the client component. */
export default function ProductsPage() {
  return <ProductsAdminClient />
}
