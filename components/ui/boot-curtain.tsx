"use client"

import { motion, useReducedMotion } from "motion/react"
import { MaterialIcon } from "@/components/ui/material-icon"
import { BlockStamp } from "@/components/ui/loading-spinner"
import { springs } from "@/lib/motion"

/** Branded auth-gate loader — shown while the operator session resolves. */
export function BootCurtain() {
  const reduce = useReducedMotion()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-8 bg-festa-surface overflow-hidden px-6">
      <div
        aria-hidden
        className="festa-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--festa-amber) 50%, transparent), transparent 70%)",
          opacity: 0.35,
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={reduce ? false : { opacity: 0, scale: 0.7, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={springs.snappy}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-primary dark:bg-festa-primary-emphasis shadow-block-lg">
          <MaterialIcon name="storefront" filled className="text-4xl text-white dark:text-festa-ink" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-headline-lg font-display text-festa-primary-emphasis">FESTA POS</h1>
          <motion.span
            className="block h-2 rounded-sm border border-festa-border bg-festa-amber"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: 96 }}
            transition={{ ...springs.snappy, delay: 0.15 }}
          />
        </div>
      </motion.div>

      <div className="relative z-10">
        <BlockStamp size="sm" />
      </div>
    </div>
  )
}
