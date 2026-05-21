"use client"

import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export const MOTION_DURATION_MS = 250
/** Matches Collapsible `duration-300` for open/close callbacks */
export const COLLAPSIBLE_DURATION_MS = 300

interface CollapsibleProps {
  open: boolean
  children: ReactNode
  className?: string
  innerClassName?: string
}

/** Animates height using CSS grid (0fr → 1fr). Content stays mounted. */
export function Collapsible({
  open,
  children,
  className,
  innerClassName,
}: CollapsibleProps) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className
      )}
    >
      <div className={cn("min-h-0 overflow-hidden", innerClassName)}>
        <div
          className={cn(
            "transition-opacity duration-300 ease-out",
            open
              ? "opacity-100 h-full min-h-0 flex flex-col"
              : "opacity-0 pointer-events-none"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

interface MotionPresenceProps {
  show: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
  enterFrom?: string
  exitTo?: string
  durationMs?: number
}

/** Mount/unmount with fade + optional slide (tw-animate-css). */
export function MotionPresence({
  show,
  children,
  className,
  style,
  enterFrom = "slide-in-from-bottom-2",
  exitTo = "slide-out-to-bottom-2",
  durationMs = MOTION_DURATION_MS,
}: MotionPresenceProps) {
  const [mounted, setMounted] = useState(show)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setMounted(true)
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      return () => cancelAnimationFrame(frame)
    }
    setVisible(false)
    const timer = window.setTimeout(() => setMounted(false), durationMs)
    return () => window.clearTimeout(timer)
  }, [show, durationMs])

  if (!mounted) return null

  return (
    <div
      className={cn(
        visible
          ? cn("animate-in fade-in duration-300", enterFrom)
          : cn("animate-out fade-out duration-300", exitTo),
        className
      )}
      style={{ animationDuration: `${durationMs}ms`, ...style }}
    >
      {children}
    </div>
  )
}

interface FadeInProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  from?: string
  delayMs?: number
}

/** Enter animation on mount only. */
export function FadeIn({
  children,
  className,
  style,
  from = "slide-in-from-bottom-1",
  delayMs = 0,
}: FadeInProps) {
  return (
    <div
      className={cn("animate-in fade-in duration-300", from, className)}
      style={{
        ...style,
        ...(delayMs > 0 ? { animationDelay: `${delayMs}ms` } : {}),
      }}
    >
      {children}
    </div>
  )
}
