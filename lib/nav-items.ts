export type NavItem = {
  href: string
  label: string
  icon: string
  adminOnly?: boolean
}

export const navItems: NavItem[] = [
  { href: "/", label: "Caixa", icon: "point_of_sale" },
  { href: "/orders", label: "Pedidos", icon: "receipt_long" },
  { href: "/products", label: "Produtos", icon: "inventory_2", adminOnly: true },
]

/** Hide admin-only routes (product management) from non-admin operators. */
export function getNavItemsForRole(operatorRole?: string): NavItem[] {
  return navItems.filter((item) => !item.adminOnly || operatorRole === "admin")
}
