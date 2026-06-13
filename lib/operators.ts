import { supabase } from "./supabase"
import type { OperatorSession } from "./operator-session"
import { writeOperatorSession } from "./operator-session"

export interface OperatorPublic {
  id: string
  name: string
  role: string
}

export type OperatorListError = "migration_required" | "connection" | "unknown"

export interface OperatorListResult {
  operators: OperatorPublic[]
  error?: OperatorListError
  errorMessage?: string
}

type SupabaseErrorLike = {
  code?: string
  message?: string
  details?: string
  hint?: string
}

function isMissingRpc(error: SupabaseErrorLike | null): boolean {
  if (!error) return false
  return (
    error.code === "PGRST202" ||
    error.message?.includes("Could not find the function") === true
  )
}

function isMissingTable(error: SupabaseErrorLike | null): boolean {
  if (!error) return false
  return error.code === "42P01" || error.code === "PGRST205"
}

function isUndefinedFunction(error: SupabaseErrorLike | null): boolean {
  if (!error) return false
  return (
    error.code === "42883" ||
    error.message?.includes("No function matches") === true ||
    error.message?.includes("does not exist") === true
  )
}

const MIGRATION_HINT =
  "Migração: 20250801030130_add_operators_and_shifts.sql — local: pnpm supabase:reset && pnpm supabase:env-sync | remoto: pnpm supabase:deploy"

/** Same message for wrong PIN, wrong name/PIN combo, or inactive operator — no account enumeration. */
export const INVALID_OPERATOR_CREDENTIALS_MSG = "Nome ou PIN incorreto."

function formatRpcError(action: string, error: SupabaseErrorLike): string {
  if (isMissingRpc(error)) {
    return `Função RPC em falta ao ${action}. ${MIGRATION_HINT}`
  }
  if (isUndefinedFunction(error)) {
    return `Erro na base de dados ao ${action}: função interna (pgcrypto) inacessível. Volte a aplicar a migração de operadores. ${MIGRATION_HINT}`
  }
  if (error.code === "22P02") {
    return `Erro ao ${action}: identificador inválido (UUID mal formatado).`
  }
  if (error.code === "23503") {
    return `Erro ao ${action}: operador ou turno não encontrado na base de dados.`
  }

  const parts = [error.message, error.details, error.hint].filter(Boolean)
  const detail = parts.length > 0 ? parts.join(" — ") : "erro desconhecido"
  return `Erro ao ${action}: ${detail}`
}

/** List operators via table query (only public columns — never pin_hash). */
async function listOperatorsFromTable(): Promise<OperatorListResult> {
  const { data, error } = await supabase
    .from("operators")
    .select("id, name, role")
    .eq("active", true)
    .order("name")

  if (error) {
    if (isMissingTable(error)) {
      return {
        operators: [],
        error: "migration_required",
        errorMessage: `Tabela "operators" não encontrada. ${MIGRATION_HINT}`,
      }
    }
    console.error("Failed to list operators (table):", error)
    return {
      operators: [],
      error: "unknown",
      errorMessage: formatRpcError("listar operadores", error),
    }
  }

  return { operators: (data ?? []) as OperatorPublic[] }
}

/** Prefer RPC; fall back to a direct table read when migrations haven't been applied yet. */
export async function listActiveOperators(): Promise<OperatorListResult> {
  const { data, error } = await supabase.rpc("list_active_operators")

  if (!error && data) {
    return { operators: (data ?? []) as OperatorPublic[] }
  }

  if (isMissingRpc(error)) {
    return listOperatorsFromTable()
  }

  console.error("Failed to list operators:", error)
  return {
    operators: [],
    error: "unknown",
    errorMessage: error ? formatRpcError("listar operadores", error) : undefined,
  }
}

export async function authenticateOperator(
  operatorId: string,
  pin: string
): Promise<{ operator: OperatorPublic | null; rpcMissing?: boolean; error?: string }> {
  const { data, error } = await supabase.rpc("authenticate_operator", {
    p_operator_id: operatorId,
    p_pin: pin,
  })

  if (isMissingRpc(error)) {
    return { operator: null, rpcMissing: true }
  }

  if (error) {
    console.error("authenticate_operator failed:", error)
    return { operator: null, error: formatRpcError("verificar PIN", error) }
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return { operator: null }
  }

  const row = Array.isArray(data) ? data[0] : data
  return { operator: row as OperatorPublic }
}

export async function startShift(
  operatorId: string
): Promise<{ shiftId: string | null; rpcMissing?: boolean; error?: string }> {
  const { data, error } = await supabase.rpc("start_shift", {
    p_operator_id: operatorId,
  })

  if (isMissingRpc(error)) {
    return { shiftId: null, rpcMissing: true }
  }

  if (error) {
    console.error("Failed to start shift:", error)
    return { shiftId: null, error: formatRpcError("iniciar turno", error) }
  }

  if (!data) {
    return { shiftId: null, error: "A função start_shift não devolveu um ID de turno." }
  }

  return { shiftId: data as string }
}

export async function endShift(shiftId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("end_shift", {
    p_shift_id: shiftId,
  })
  if (error) {
    console.error("Failed to end shift:", error)
    return false
  }
  return Boolean(data)
}

export async function loginWithPin(
  operatorId: string,
  pin: string
): Promise<{ success: boolean; session?: OperatorSession; error?: string }> {
  const { operator, rpcMissing: authRpcMissing, error: authError } =
    await authenticateOperator(operatorId, pin)

  if (authRpcMissing) {
    return {
      success: false,
      error: `Autenticação indisponível (RPC authenticate_operator em falta). ${MIGRATION_HINT}`,
    }
  }

  if (authError) {
    return { success: false, error: authError }
  }

  if (!operator) {
    return { success: false, error: INVALID_OPERATOR_CREDENTIALS_MSG }
  }

  // Successful auth opens a new shift row and persists the session locally
  const { shiftId, rpcMissing: shiftRpcMissing, error: shiftError } =
    await startShift(operator.id)

  if (shiftRpcMissing) {
    return {
      success: false,
      error: `Não foi possível iniciar turno (RPC start_shift em falta). ${MIGRATION_HINT}`,
    }
  }

  if (shiftError) {
    return { success: false, error: shiftError }
  }

  if (!shiftId) {
    return {
      success: false,
      error: "Não foi possível iniciar o turno — resposta vazia da base de dados.",
    }
  }

  const session: OperatorSession = {
    operatorId: operator.id,
    operatorName: operator.name,
    operatorRole: operator.role,
    shiftId,
    shiftStartedAt: new Date().toISOString(),
  }

  writeOperatorSession(session)
  return { success: true, session }
}
