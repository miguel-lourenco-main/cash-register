"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { MaterialIcon } from "@/components/ui/material-icon"
import { springs } from "@/lib/motion"
import { cn, tapHaptic } from "@/lib/utils"
import { useOperator } from "@/lib/operator-provider"
import { getNavItemsForRole, isNavItemActive } from "@/lib/nav-items"

export function SideNav() {
  const pathname = usePathname()
  const { session } = useOperator()
  const items = getNavItemsForRole(session?.operatorRole)

  return (
    <aside className="hidden md:flex fixed left-0 top-[var(--festa-top-bar-height)] bottom-0 w-24 lg:w-32 z-40 bg-festa-surface-low border-r-2 border-festa-border flex-col items-center py-gutter gap-gutter">
      <nav className="flex flex-col gap-4 w-full px-2">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => tapHaptic()}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-md py-4 cursor-pointer transition-[transform,background-color] duration-200 active:scale-95",
                active
                  ? "text-festa-ink"
                  : "text-festa-on-surface-variant hover:bg-festa-surface-high"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidenav-active"
                  transition={springs.snappy}
                  className="absolute inset-0 rounded-md border-2 border-festa-border bg-festa-amber shadow-block-sm"
                  aria-hidden
                />
              )}
              <MaterialIcon
                name={item.icon}
                filled={active}
                className="relative mb-1 text-2xl"
              />
              <span className="relative text-label-xl">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-sm border-2 border-festa-border bg-festa-amber flex items-center justify-center text-festa-ink font-display font-bold text-sm">
          {session?.operatorName?.charAt(0) ?? "?"}
        </div>
      </div>
    </aside>
  )
}
