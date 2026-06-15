"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface BlockConfettiProps {
  /** Each time this flips to true, a single burst launches. */
  fire: boolean
  /** Burst origin as a fraction of the canvas (0..1). */
  originX?: number
  originY?: number
  count?: number
  className?: string
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vrot: number
  size: number
  fill: string
}

const DURATION = 1500

/** On-brand celebration: rotated, ink-bordered "coin" blocks burst once and settle.
    Capped particle count, single rAF loop, cleans up on unmount. No-op if reduced motion. */
export function BlockConfetti({
  fire,
  originX = 0.5,
  originY = 0.42,
  count = 24,
  className,
}: BlockConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const wasFiring = useRef(false)

  useEffect(() => {
    if (!fire || wasFiring.current) {
      wasFiring.current = fire
      return
    }
    wasFiring.current = true

    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    const W = rect.width
    const H = rect.height
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const styles = getComputedStyle(document.documentElement)
    const palette = [
      styles.getPropertyValue("--festa-amber").trim() || "#ffb52e",
      styles.getPropertyValue("--festa-primary").trim() || "#7c2810",
      styles.getPropertyValue("--festa-festival-blue").trim() || "#005da7",
      styles.getPropertyValue("--festa-success-green").trim() || "#1b7339",
    ]
    const ink = styles.getPropertyValue("--festa-ink").trim() || "#1b130d"

    const ox = W * originX
    const oy = H * originY
    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (i % 3) * 0.3
      const speed = 4 + ((i * 37) % 70) / 10
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        rot: (i % 8) * 0.6,
        vrot: ((i % 5) - 2) * 0.08,
        size: 9 + ((i * 13) % 9),
        fill: palette[i % palette.length],
      }
    })

    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const elapsed = ts - start
      ctx.clearRect(0, 0, W, H)
      const fade = elapsed > DURATION * 0.55 ? Math.max(0, 1 - (elapsed - DURATION * 0.55) / (DURATION * 0.45)) : 1
      for (const p of particles) {
        p.vy += 0.22
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vrot
        ctx.save()
        ctx.globalAlpha = fade
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.fill
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.lineWidth = 2
        ctx.strokeStyle = ink
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }
      if (elapsed < DURATION) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        ctx.clearRect(0, 0, W, H)
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [fire, originX, originY, count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  )
}
