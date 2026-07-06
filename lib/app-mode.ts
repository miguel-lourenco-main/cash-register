/**
 * How the app talks to its storage.
 *
 *  - "local"  — single-device mode. Everything runs against the on-device store
 *               (localStorage, seeded from `demo-data`), with no backend and no
 *               network. This is the DEFAULT, so a fresh clone and the deployed
 *               site work with zero setup and no Supabase project.
 *  - "shared" — multi-device mode. Reads/writes go to the Supabase backend so
 *               several devices share one dataset, with an automatic fall back
 *               to the local store when the backend is unreachable.
 *
 * Chosen at build time via `NEXT_PUBLIC_APP_MODE` (inlined into the client
 * bundle). Anything other than "shared" — including unset — means local.
 *
 * The local/shared split is the app's storage seam: a future adapter (e.g.
 * Turso) slots in behind the same `isSharedMode()` branch the data modules use.
 */
export type AppMode = "local" | "shared"

export const APP_MODE: AppMode =
  process.env.NEXT_PUBLIC_APP_MODE === "shared" ? "shared" : "local"

export const isLocalMode = (): boolean => APP_MODE === "local"

export const isSharedMode = (): boolean => APP_MODE === "shared"
