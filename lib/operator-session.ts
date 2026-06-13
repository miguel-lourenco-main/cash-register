import { OPERATOR_SESSION_KEY } from "./design-tokens"

/** Active shift persisted in localStorage so a page refresh keeps the operator signed in. */
export interface OperatorSession {
  operatorId: string
  operatorName: string
  operatorRole: string
  shiftId: string
  shiftStartedAt: string
}

export function readOperatorSession(): OperatorSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(OPERATOR_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OperatorSession
  } catch {
    return null
  }
}

export function writeOperatorSession(session: OperatorSession): void {
  localStorage.setItem(OPERATOR_SESSION_KEY, JSON.stringify(session))
}

export function clearOperatorSession(): void {
  localStorage.removeItem(OPERATOR_SESSION_KEY)
}
