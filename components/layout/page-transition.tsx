"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { springs } from "@/lib/motion"

/** Enter-only page transition keyed on the route — no exit phase (App Router unmounts immediately). */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      className="flex flex-1 flex-col min-h-0"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
    >
      {children}
    </motion.div>
  )
}
