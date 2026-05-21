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

interface OperatorContextValue {
  session: OperatorSession | null
  operators: OperatorPublic[]
  listError: OperatorListError | null
  listErrorMessage: string | null
  isLoading: boolean
  login: (operatorId: string, pin: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshOperators: () => Promise<void>
}

const OperatorContext = createContext<OperatorContextValue | undefined>(undefined)

export function OperatorProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<OperatorSession | null>(null)
  const [operators, setOperators] = useState<OperatorPublic[]>([])
  const [listError, setListError] = useState<OperatorListError | null>(null)
  const [listErrorMessage, setListErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
