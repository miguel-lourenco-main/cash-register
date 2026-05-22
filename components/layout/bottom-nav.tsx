"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import { useOperator } from "@/lib/operator-provider"
import { getNavItemsForRole } from "@/lib/nav-items"

export function BottomNav() {
  const pathname = usePathname()
  const { session } = useOperator()
  const items = getNavItemsForRole(session?.operatorRole)

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 bg-festa-surface border-t border-festa-outline-variant/30 shadow-[0px_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ height: "var(--festa-bottom-nav-height)" }}
    >
      {items.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl px-4 py-2 active:scale-95 transition-all min-w-0",
              active ? "text-festa-accent" : "text-festa-on-surface-variant"
            )}
          >
            <MaterialIcon
              name={item.icon}
              filled={active}
              className="text-2xl mb-1"
            />
            <span className="text-xs font-bold truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
