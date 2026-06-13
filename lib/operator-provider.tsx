"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  readOperatorSession,
  clearOperatorSession,
  type OperatorSession,
} from "./operator-session"
import {
  endShift,
  listActiveOperators,
  loginWithPin,
  type OperatorListError,
} from "./operators"
import type { OperatorPublic } from "./operators"
import { getShiftSummary, type ShiftSummary } from "./shifts"

export interface PendingLogout {
  /** null when the summary fetch failed — overlay shows an "end anyway" escape hatch */
  summary: ShiftSummary | null
  operatorName: string
  shiftStartedAt: string
}

interface OperatorContextValue {
  session: OperatorSession | null
  operators: OperatorPublic[]
  listError: OperatorListError | null
  listErrorMessage: string | null
  isLoading: boolean
  login: (operatorId: string, pin: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  pendingLogout: PendingLogout | null
  isPreparingLogout: boolean
  requestLogout: () => Promise<void>
  confirmLogout: () => Promise<void>
  cancelLogout: () => void
  refreshOperators: () => Promise<void>
}

const OperatorContext = createContext<OperatorContextValue | undefined>(undefined)

export function OperatorProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<OperatorSession | null>(null)
  const [operators, setOperators] = useState<OperatorPublic[]>([])
  const [listError, setListError] = useState<OperatorListError | null>(null)
  const [listErrorMessage, setListErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingLogout, setPendingLogout] = useState<PendingLogout | null>(null)
  const [isPreparingLogout, setIsPreparingLogout] = useState(false)

  const refreshOperators = useCallback(async () => {
    const result = await listActiveOperators()
    setOperators(result.operators)
    setListError(result.error ?? null)
    setListErrorMessage(result.errorMessage ?? null)
  }, [])

  useEffect(() => {
    setSession(readOperatorSession())
    refreshOperators().finally(() => setIsLoading(false))
  }, [refreshOperators])

  const login = useCallback(async (operatorId: string, pin: string) => {
    const result = await loginWithPin(operatorId, pin)
    if (result.success && result.session) {
      setSession(result.session)
      return { success: true }
    }
    return { success: false, error: result.error ?? "Erro ao iniciar sessão" }
  }, [])

  const logout = useCallback(async () => {
    const current = readOperatorSession()
    if (current?.shiftId) {
      await endShift(current.shiftId)
    }
    clearOperatorSession()
    setSession(null)
    setPendingLogout(null)
  }, [])

  // Fetch the summary BEFORE ending the shift — the shiftId is gone afterwards.
  const requestLogout = useCallback(async () => {
    const current = readOperatorSession()
    if (!current?.shiftId) {
      clearOperatorSession()
      setSession(null)
      return
    }
    setIsPreparingLogout(true)
    const summary = await getShiftSummary(current.shiftId)
    setIsPreparingLogout(false)
    setPendingLogout({
      summary,
      operatorName: current.operatorName,
      shiftStartedAt: current.shiftStartedAt,
    })
  }, [])

  const confirmLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const cancelLogout = useCallback(() => {
    setPendingLogout(null)
  }, [])

  return (
    <OperatorContext.Provider
      value={{
        session,
        operators,
        listError,
        listErrorMessage,
        isLoading,
        login,
        logout,
        pendingLogout,
        isPreparingLogout,
        requestLogout,
        confirmLogout,
        cancelLogout,
        refreshOperators,
      }}
    >
      {children}
    </OperatorContext.Provider>
  )
}

export function useOperator() {
  const ctx = useContext(OperatorContext)
  if (!ctx) {
    throw new Error("useOperator must be used within OperatorProvider")
  }
  return ctx
}
