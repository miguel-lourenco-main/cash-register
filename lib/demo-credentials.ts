import { DEMO_OPERATORS } from "./demo-data"
import { isLocalMode } from "./app-mode"

/**
 * Whether the login screen should surface the demo account codes so someone
 * without a real PIN can still sign in.
 *
 * The only codes we ever show are the NON-SECRET demo PINs that already ship in
 * `demo-data.ts` (and the operators migration seed). A real operator's PIN is a
 * bcrypt hash on the server and is never sent to the browser — it literally
 * cannot be displayed, so cloning and deploying this app can never leak one.
 *
 * We reveal the demo codes when any of these hold:
 *   - the app is in local mode (the default) — the local store IS the demo
 *     accounts, so anyone should be able to sign straight in; or
 *   - the app is in demo mode (shared mode with Supabase paused/unreachable) —
 *     so a fresh clone is immediately usable with no setup; or
 *   - `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "true"` — force them on even in a
 *     connected shared deploy (e.g. for a demo).
 */
export function shouldShowDemoCredentials(demoMode: boolean): boolean {
  return (
    isLocalMode() ||
    demoMode ||
    process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "true"
  )
}

/** Human-friendly label for the role(s) a given code unlocks. */
const ROLE_LABELS: Record<string, string> = {
  vendedor: "Vendedores",
  admin: "Admin",
}

export interface DemoCredentialHint {
  /** Label for the account(s) that share this PIN, e.g. "Vendedores". */
  label: string
  /** The demo PIN to display. */
  pin: string
}

/**
 * The demo PINs grouped by the role(s) they unlock, deduped so the vendedores
 * that all share "1234" collapse into a single hint. Derived from
 * `DEMO_OPERATORS` so this list can never drift from the actual demo login.
 */
export const DEMO_CREDENTIAL_HINTS: DemoCredentialHint[] = (() => {
  const rolesByPin = new Map<string, Set<string>>()
  for (const op of DEMO_OPERATORS) {
    const roles = rolesByPin.get(op.pin) ?? new Set<string>()
    roles.add(op.role)
    rolesByPin.set(op.pin, roles)
  }
  return Array.from(rolesByPin.entries()).map(([pin, roles]) => ({
    pin,
    label: Array.from(roles)
      .map((role) => ROLE_LABELS[role] ?? role)
      .join(" · "),
  }))
})()
