"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  description?: string
  className?: string
}

/** Three festa blocks printing in sequence — the on-brand loading rhythm. */
function BlockStamp({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const reduce = useReducedMotion()
  const box = { sm: "h-2.5 w-2.5", md: "h-4 w-4", lg: "h-6 w-6" }[size]
  const colors = ["bg-festa-amber", "bg-festa-primary dark:bg-festa-primary-emphasis", "bg-festa-festival-blue"]

  return (
    <div className="flex items-end gap-2" role="status" aria-label="A carregar">
      {colors.map((color, i) => (
        <motion.span
          key={i}
          className={cn(
            "rounded-[3px] border-2 border-festa-border shadow-block-sm",
            box,
            color
          )}
          initial={reduce ? false : { scale: 0.4, opacity: 0.3, rotate: -8 }}
          animate={
            reduce
              ? { opacity: 1 }
              : { scale: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3], rotate: [-8, 0, -8] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.16 }
          }
        />
      ))}
    </div>
  )
}

export function LoadingSpinner({
  size = "md",
  text = "Carregando...",
  description,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <BlockStamp size={size} />
      <div className="text-center">
        <h2 className="font-display text-lg font-bold text-foreground mb-1">{text}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

export { BlockStamp }
