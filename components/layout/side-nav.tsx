"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"
import { useOperator } from "@/lib/operator-provider"
import { getNavItemsForRole } from "@/lib/nav-items"

export function SideNav() {
  const pathname = usePathname()
  const { session } = useOperator()
  const items = getNavItemsForRole(session?.operatorRole)

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-24 lg:w-32 z-40 bg-festa-surface-container-low border-r-4 border-festa-primary-container flex-col items-center py-margin-page gap-gutter">
      <div className="font-display text-headline-lg-mobile font-bold text-festa-primary-emphasis mb-4">
        F
      </div>
      <nav className="flex flex-col gap-4 w-full px-2">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl py-4 transition-all active:scale-95",
                active
                  ? "bg-festa-primary-container text-festa-on-primary-container shadow-sm"
                  : "text-festa-on-surface-variant hover:bg-festa-surface-container-high"
              )}
            >
              <MaterialIcon
                name={item.icon}
                filled={active}
                className="mb-1 text-2xl"
              />
              <span className="text-label-xl">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-festa-primary-container flex items-center justify-center text-festa-on-primary-container font-bold text-sm border-2 border-festa-primary-container">
          {session?.operatorName?.charAt(0) ?? "?"}
        </div>
      </div>
    </aside>
  )
}
