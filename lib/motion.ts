/** Shared motion vocabulary — one rhythm for the whole app. */

export const springs = {
  /** Instant tactile feedback (~120ms feel) — presses, pings */
  press: { type: "spring", stiffness: 700, damping: 30 } as const,
  /** Cards, tabs, list items (~200ms feel) */
  snappy: { type: "spring", stiffness: 500, damping: 34 } as const,
  /** Sheets, panels, collapsibles (~300ms feel) */
  sheet: { type: "spring", stiffness: 380, damping: 36, mass: 0.9 } as const,
  /** Numbers, stats — soft settle */
  gentle: { type: "spring", stiffness: 260, damping: 28 } as const,
}

/** Per-item delay for staggered grid/list entrances */
export const STAGGER_S = 0.035
