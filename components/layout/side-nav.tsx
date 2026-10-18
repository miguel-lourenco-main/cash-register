"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { BrandMark } from "@/components/layout/brand-mark"
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
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 lg:w-32 z-40 bg-festa-surface-low flex-col">
      {/* Top-left corner of the merged rail + top bar: holds the brand mark.
          No right/bottom border, so it flows into the top bar beside it; the nav's
          right border starts exactly where the bar's bottom border ends. */}
      <div className="flex h-[var(--festa-top-bar-height)] shrink-0 items-center justify-center">
        <BrandMark />
      </div>
      <nav className="flex flex-1 flex-col gap-4 w-full px-2 py-gutter border-r-2 border-festa-border">
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
    </aside>
  )
}
