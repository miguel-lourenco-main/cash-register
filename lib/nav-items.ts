export type NavItem = {
  href: string
  label: string
  icon: string
  adminOnly?: boolean
}

/** Primary navigation — admin-only routes are hidden for non-admin operators. */
export const navItems: NavItem[] = [
  { href: "/", label: "Caixa", icon: "point_of_sale" },
  { href: "/orders", label: "Pedidos", icon: "receipt_long" },
  { href: "/products", label: "Produtos", icon: "inventory_2", adminOnly: true },
]

export function getNavItemsForRole(operatorRole?: string): NavItem[] {
  return navItems.filter((item) => !item.adminOnly || operatorRole === "admin")
}
