"use client"

import { useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { springs } from "@/lib/motion"
import { navItems } from "@/lib/nav-items"

function routeIndex(path: string): number {
  const i = navItems.findIndex((n) => n.href === path)
  return i === -1 ? 0 : i
}

/** Directional route transition — incoming page slides in from the side of travel. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const prevIndex = useRef(routeIndex(pathname))
  const currentIndex = routeIndex(pathname)
  const dir = currentIndex >= prevIndex.current ? 1 : -1
  prevIndex.current = currentIndex

  return (
    <motion.div
      key={pathname}
      className="flex flex-1 flex-col min-h-0"
      initial={{ opacity: 0, x: 28 * dir }}
      animate={{ opacity: 1, x: 0 }}
      transition={springs.snappy}
    >
      {children}
    </motion.div>
  )
}
