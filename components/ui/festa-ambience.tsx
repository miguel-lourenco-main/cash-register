"use client"

/**
 * Screen-print atmosphere: a fixed, non-interactive layer of warm ambient glow
 * + paper grain that sits behind all content. The block shadows share one static
 * light source via --sun-x / --sun-y (globals.css); cards lift interactively via
 * .lift-block rather than a costly always-on global shadow repaint.
 *
 * Render once near the root of a screen. Content must establish `relative z-10`
 * (or higher) so it paints above this z-0 layer.
 */
export function FestaAmbience() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Drifting amber sun-glow */}
      <div
        className="absolute -left-[10%] -top-[15%] h-[70vh] w-[70vh] rounded-full blur-[90px] motion-safe:animate-[festa-glow-drift_18s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--festa-amber) 60%, transparent), transparent 70%)",
          opacity: 0.4,
        }}
      />
      {/* Cooler counter-glow bottom-right for depth */}
      <div
        className="absolute -bottom-[20%] -right-[10%] h-[60vh] w-[60vh] rounded-full blur-[100px] motion-safe:animate-[festa-glow-drift_22s_ease-in-out_infinite_reverse]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--festa-primary) 45%, transparent), transparent 72%)",
          opacity: 0.18,
        }}
      />
      {/* Paper grain — multiplies onto the warm paper for a printed texture */}
      <div className="festa-grain absolute inset-0 opacity-[0.05] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
    </div>
  )
}
