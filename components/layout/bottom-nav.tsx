"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { MaterialIcon } from "@/components/ui/material-icon"
import { springs } from "@/lib/motion"
import { cn, tapHaptic } from "@/lib/utils"
import { useOperator } from "@/lib/operator-provider"
import { getNavItemsForRole, isNavItemActive } from "@/lib/nav-items"

export function BottomNav() {
  const pathname = usePathname()
  const { session } = useOperator()
  const items = getNavItemsForRole(session?.operatorRole)

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 bg-festa-surface border-t-2 border-festa-border"
      style={{ height: "var(--festa-bottom-nav-height)" }}
    >
      {items.map((item) => {
        const active = isNavItemActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => tapHaptic()}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-md px-4 py-2 min-w-0 min-h-12 cursor-pointer transition-[transform,background-color] duration-200 active:scale-95",
              active ? "text-festa-ink" : "text-festa-on-surface-variant"
            )}
          >
            {active && (
              <motion.span
                layoutId="bottomnav-active"
                transition={springs.snappy}
                className="absolute inset-0 rounded-md border-2 border-festa-border bg-festa-amber shadow-block-sm"
                aria-hidden
              />
            )}
            <MaterialIcon
              name={item.icon}
              filled={active}
              className="relative text-2xl mb-1"
            />
            <span className="relative text-xs font-bold uppercase tracking-wide truncate">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
