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

export function getNavItemsForRole(operatorRole?: string): NavItem[] {
  return navItems.filter((item) => !item.adminOnly || operatorRole === "admin")
}

/** Drop any trailing slash except on the root path. */
function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path
}

/**
 * Whether a nav item is active for the current pathname.
 *
 * Robust to trailing slashes and nested routes: GitLab Pages serves
 * directory-backed routes with a trailing slash (e.g. `/products/`), so an
 * exact `pathname === href` check silently fails in production and leaves the
 * item unhighlighted. Root (`/`) matches exactly; other items also match their
 * sub-routes (e.g. `/orders/123` → `/orders`).
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  const current = normalizePath(pathname)
  const target = normalizePath(href)
  if (target === "/") return current === "/"
  return current === target || current.startsWith(target + "/")
}
