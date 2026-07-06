import { supabase } from "./supabase"
import { isLocalMode } from "./app-mode"

/**
 * Detects whether the Supabase backend is reachable. The hosted project
 * auto-pauses after a period of inactivity, which makes every query fail with
 * a network/timeout error. When that happens we flip into "demo mode" and serve
 * static data from `demo-store`, so the app stays interactive for experimenting.
 */

type Listener = (offline: boolean) => void

/** null = not yet determined, true = unreachable (demo mode), false = online. */
let offline: boolean | null = null
let probe: Promise<boolean> | null = null
const listeners = new Set<Listener>()

/** How long any single Supabase read may hang before we treat it as offline. */
export const DB_TIMEOUT_MS = 5000

/** True once we've confirmed the backend is unreachable this session. */
export function isKnownOffline(): boolean {
  return offline === true
}

/** Current known status, or null when still undetermined. */
export function getDbOffline(): boolean | null {
  return offline
}

function notify(): void {
  for (const listener of listeners) listener(offline === true)
}

export function subscribeDbStatus(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function markOffline(): void {
  if (offline !== true) {
    offline = true
    notify()
  }
}

export function markOnline(): void {
  if (offline !== false) {
    offline = false
    notify()
  }
}

/**
 * Classifies a thrown error or a Supabase error object as a "backend is
 * unreachable" error (paused project, DNS/network failure, our own timeout)
 * rather than a normal query/RLS/logic error.
 */
export function isConnectionError(error: unknown): boolean {
  if (!error) return false
  const message = (
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : String(error)
  ).toLowerCase()

  return (
    message.includes("fetch failed") ||
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network error") ||
    message.includes("load failed") ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("abort") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("econnreset") ||
    message.includes("503") ||
    message.includes("502") ||
    message.includes("504") ||
    message.includes("paused")
  )
}

/** AbortSignal that fires after `ms`, used to bound how long a query may hang. */
export function timeoutSignal(ms: number = DB_TIMEOUT_MS): AbortSignal {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}

/**
 * Lightweight one-shot probe of the backend. Reads a single public row with a
 * bounded timeout. Any error (or timeout) means the backend can't serve the app
 * → demo mode. Result is cached for the session; concurrent callers share it.
 */
export async function ensureDbStatus(): Promise<boolean> {
  // Local mode has no backend to probe — never touch the network.
  if (isLocalMode()) return false
  if (offline !== null) return offline
  if (!probe) {
    probe = (async () => {
      try {
        const { error } = await supabase
          .from("products")
          .select("id")
          .limit(1)
          .abortSignal(timeoutSignal())
        if (error) {
          markOffline()
        } else {
          markOnline()
        }
      } catch {
        markOffline()
      } finally {
        probe = null
      }
      return offline === true
    })()
  }
  return probe
}
