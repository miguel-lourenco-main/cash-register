"use client"

import { useEffect, type CSSProperties, type ReactNode } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react"
import { springs, STAGGER_S } from "@/lib/motion"
import { cn } from "@/lib/utils"

export const MOTION_DURATION_MS = 250
/** Matches Collapsible spring settle for open/close callbacks */
export const COLLAPSIBLE_DURATION_MS = 300

/** Interpret legacy tw-animate direction strings ("slide-in-from-bottom-4 zoom-in-95") as spring offsets. */
function offsetsFrom(direction?: string): Record<string, number> {
  if (!direction) return { opacity: 0, y: 8 }
  const target: Record<string, number> = { opacity: 0 }
  if (direction.includes("bottom")) target.y = 16
  if (direction.includes("top")) target.y = -16
  if (direction.includes("right")) target.x = 16
  if (direction.includes("left")) target.x = -16
  if (direction.includes("zoom")) target.scale = 0.95
  return target
}

interface CollapsibleProps {
  open: boolean
  children: ReactNode
  className?: string
  innerClassName?: string
  onAnimationComplete?: () => void
}

/** Spring-animated height (0 → auto). Content stays mounted. */
export function Collapsible({
  open,
  children,
  className,
  innerClassName,
  onAnimationComplete,
}: CollapsibleProps) {
  return (
    <motion.div
      className={cn("overflow-hidden", open ? "" : "pointer-events-none", className)}
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={springs.sheet}
      onAnimationComplete={onAnimationComplete}
      aria-hidden={!open}
    >
      <div className={cn("min-h-0 h-full flex flex-col", innerClassName)}>{children}</div>
    </motion.div>
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

/** Mount/unmount with spring fade + slide. Exit runs faster than enter. */
export function MotionPresence({
  show,
  children,
  className,
  style,
  enterFrom,
  exitTo,
}: MotionPresenceProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className={className}
          style={style}
          initial={offsetsFrom(enterFrom)}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ ...offsetsFrom(exitTo ?? enterFrom), transition: { duration: 0.16, ease: "easeIn" } }}
          transition={springs.snappy}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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
export function FadeIn({ children, className, style, from, delayMs = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={offsetsFrom(from)}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ ...springs.snappy, delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  )
}

interface PressScaleProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Tactile shrink while pressed. Wrap tappable cards/tiles (buttons already get the CSS offset press). */
export function PressScale({ children, className, style }: PressScaleProps) {
  return (
    <motion.div
      className={className}
      style={style}
      whileTap={{ scale: 0.96 }}
      transition={springs.press}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedNumberProps {
  value: number
  format?: (value: number) => string
  className?: string
}

/** Spring number ticker — totals, stats. Pair with tabular-nums to avoid jitter. */
export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion()
  const spring = useSpring(value, springs.gentle)
  const display = useTransform(spring, (v) => (format ? format(v) : Math.round(v).toString()))

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  if (reduceMotion) {
    return <span className={className}>{format ? format(value) : Math.round(value).toString()}</span>
  }
  return <motion.span className={className}>{display}</motion.span>
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_S } },
}

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.snappy },
}

interface StaggerGridProps {
  children: ReactNode
  className?: string
}

/** Staggered entrance container — re-key it to replay (e.g. on category switch). */
export function StaggerGrid({ children, className }: StaggerGridProps) {
  return (
    <motion.div className={className} variants={staggerContainer} initial="hidden" animate="show">
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: StaggerGridProps) {
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  )
}

interface SpringSheetProps {
  show: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
  onDismiss?: () => void
}

/** Bottom sheet: springs up from below; drag down to dismiss when onDismiss is given. */
export function SpringSheet({ show, children, className, style, onDismiss }: SpringSheetProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          style={style}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%", transition: { duration: 0.2, ease: "easeIn" } }}
          transition={springs.sheet}
          drag={onDismiss ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (onDismiss && (info.offset.y > 96 || info.velocity.y > 600)) onDismiss()
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface SpringPanelProps {
  show: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Side panel: springs in from the right edge. */
export function SpringPanel({ show, children, className, style }: SpringPanelProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          style={style}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%", transition: { duration: 0.2, ease: "easeIn" } }}
          transition={springs.sheet}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface CartPingProps {
  /** Re-ping whenever this value changes */
  trigger: string | number
  children: ReactNode
  className?: string
}

/** Scale ping on value change — cart count badges. */
export function CartPing({ trigger, children, className }: CartPingProps) {
  return (
    <motion.span
      key={String(trigger)}
      className={className}
      initial={{ scale: 1.3 }}
      animate={{ scale: 1 }}
      transition={springs.press}
    >
      {children}
    </motion.span>
  )
}
