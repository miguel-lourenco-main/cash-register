"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export type FlyVariant = "bebida" | "comida"

type Flyer = {
  id: number
  label: string
  variant: FlyVariant
  from: { x: number; y: number; w: number; h: number }
  to: { x: number; y: number }
}

type Ring = { id: number; x: number; y: number }

/** Center of whichever cart drop-target ([data-cart-drop]) is currently visible. */
function resolveCartTarget(): { x: number; y: number } | null {
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-drop]"))
  const visible = targets.find((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && el.offsetParent !== null
  })
  if (!visible) return null
  const r = visible.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

/**
 * Fly-to-cart: clone a product's price chip and arc it into the cart badge,
 * then pulse a shockwave ring on landing. Returns an imperative trigger plus
 * the layer to render once inside the register. No-op under reduced motion.
 */
export function useFlyToCart() {
  const reduce = useReducedMotion()
  const [flyers, setFlyers] = useState<Flyer[]>([])
  const [rings, setRings] = useState<Ring[]>([])
  const idRef = useRef(0)

  const spawn = useCallback((originRect: DOMRect, label: string, variant: FlyVariant) => {
    const to = resolveCartTarget()
    if (!to) return
    const id = ++idRef.current
    setFlyers((f) => [
      ...f,
      {
        id,
        label,
        variant,
        from: { x: originRect.left, y: originRect.top, w: originRect.width, h: originRect.height },
        to,
      },
    ])
  }, [])

  const flyToCart = useCallback(
    (originRect: DOMRect, label: string, variant: FlyVariant) => {
      if (reduce) return
      // On the first add (mobile), the cart sheet/peek mounts this same frame —
      // if no target exists yet, defer resolution one frame so it can be found.
      if (resolveCartTarget()) spawn(originRect, label, variant)
      else requestAnimationFrame(() => spawn(originRect, label, variant))
    },
    [reduce, spawn]
  )

  /** Drop any in-flight tokens/rings — call when leaving the cart step. */
  const clearFlyToCart = useCallback(() => {
    setFlyers([])
    setRings([])
  }, [])

  const land = useCallback((flyer: Flyer) => {
    setFlyers((f) => f.filter((x) => x.id !== flyer.id))
    setRings((r) => [...r, { id: flyer.id, x: flyer.to.x, y: flyer.to.y }])
  }, [])

  const flyLayer = (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {flyers.map((flyer) => {
          const dx = flyer.to.x - (flyer.from.x + flyer.from.w / 2)
          const dy = flyer.to.y - (flyer.from.y + flyer.from.h / 2)
          // Lift into an arc: peak ~70px above the straight-line midpoint.
          const midY = dy * 0.45 - 70
          return (
            <motion.div
              key={flyer.id}
              className={cn(
                "absolute flex items-center justify-center rounded-md border-2 border-festa-border font-display text-sm font-bold tabular-nums shadow-block-sm",
                flyer.variant === "bebida"
                  ? "bg-festa-festival-blue text-white dark:text-festa-ink"
                  : "bg-festa-primary text-white dark:bg-festa-primary-emphasis dark:text-festa-ink"
              )}
              initial={{ x: flyer.from.x, y: flyer.from.y, opacity: 1, scale: 1, rotate: 0 }}
              style={{ left: 0, top: 0, width: flyer.from.w, height: flyer.from.h }}
              animate={{
                x: [flyer.from.x, flyer.from.x + dx * 0.55, flyer.from.x + dx],
                y: [flyer.from.y, flyer.from.y + midY, flyer.from.y + dy],
                scale: [1, 0.82, 0.32],
                opacity: [1, 1, 0.55],
                rotate: [0, -8, 10],
              }}
              transition={{ duration: 0.52, ease: [0.4, 0, 0.5, 1], times: [0, 0.55, 1] }}
              onAnimationComplete={() => land(flyer)}
            >
              {flyer.label}
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {rings.map((ring) => (
          <motion.span
            key={`ring-${ring.id}`}
            className="absolute h-10 w-10 rounded-full border-2 border-festa-amber"
            style={{ left: ring.x - 20, top: ring.y - 20 }}
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            onAnimationComplete={() => setRings((r) => r.filter((x) => x.id !== ring.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  )

  return { flyToCart, flyLayer, clearFlyToCart }
}
