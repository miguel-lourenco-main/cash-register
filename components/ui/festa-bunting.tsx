"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

const FLAG_COLORS = [
  "var(--festa-primary)",
  "var(--festa-amber)",
  "var(--festa-festival-blue)",
  "var(--festa-primary-container)",
  "var(--festa-success-green)",
]

/** Festival bunting — a strung row of triangle flags that sways gently. Decorative. */
export function FestaBunting({ count = 16, className }: { count?: number; className?: string }) {
  const reduce = useReducedMotion()
  const flags = Array.from({ length: count }, (_, i) => i)

  return (
    <div aria-hidden className={cn("w-full overflow-hidden", className)}>
      <motion.div
        className="flex w-full origin-top items-start justify-center border-t-2 border-festa-border"
        style={{ transformOrigin: "top center" }}
        animate={reduce ? undefined : { rotate: [-1.2, 1.2, -1.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {flags.map((i) => (
          <span
            key={i}
            className="block shrink-0"
            style={{
              width: 0,
              height: 0,
              borderLeft: "13px solid transparent",
              borderRight: "13px solid transparent",
              borderTop: `${20 + (i % 3) * 3}px solid ${FLAG_COLORS[i % FLAG_COLORS.length]}`,
              marginInline: "3px",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
