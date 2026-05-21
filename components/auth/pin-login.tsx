"use client"

import { useState } from "react"
import { useOperator } from "@/lib/operator-provider"
import { MaterialIcon } from "@/components/ui/material-icon"
import { Collapsible } from "@/components/ui/motion"
import { cn } from "@/lib/utils"

export function PinLogin() {
  const { operators, listError, listErrorMessage, login, isLoading, refreshOperators } =
    useOperator()
  const [selectedId, setSelectedId] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = Boolean(selectedId) && pin.length >= 4 && !submitting

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    const result = await login(selectedId, pin)
    setSubmitting(false)
    if (!result.success) {
      setError(result.error ?? "Não foi possível iniciar sessão. Tente novamente.")
      setPin("")
    }
  }

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      setPin((p) => p + digit)
      setError(null)
    }
  }

  const handleBackspace = () => {
    setPin((p) => p.slice(0, -1))
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-festa-surface">
        <p className="text-festa-on-surface-variant">A carregar...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-festa-surface px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <MaterialIcon name="storefront" className="text-4xl text-festa-accent" />
        <h1 className="text-headline-lg-mobile font-display text-festa-primary-emphasis">Festa POS</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <p className="text-festa-on-surface-variant text-body-lg text-center">
          Selecione o seu nome e introduza o PIN
        </p>

        {operators.length === 0 ? (
          <div className="rounded-xl border border-festa-outline-variant/50 bg-card p-6 text-center shadow-festa-card">
            <MaterialIcon
              name="person_off"
              className="text-4xl text-festa-on-surface-variant mb-3 mx-auto"
            />
            <p className="text-festa-on-surface font-medium mb-2">
              {listError === "migration_required"
                ? "Base de dados desatualizada"
                : "Nenhum operador disponível"}
            </p>
            <p className="text-sm text-festa-on-surface-variant mb-4 text-left">
              {listError === "migration_required" ? (
                <>
                  A migração de operadores ainda não foi aplicada neste projeto Supabase.
                  <br />
                  <br />
                  <strong>Local:</strong>
                  <code className="block mt-1 p-2 bg-festa-surface-container-low rounded text-xs">
                    pnpm supabase:start && pnpm supabase:reset && pnpm supabase:env-sync
                  </code>
                  <strong className="block mt-3">Remoto (GitLab/hosted):</strong>
                  <code className="block mt-1 p-2 bg-festa-surface-container-low rounded text-xs">
                    pnpm supabase db push
                  </code>
                  <span className="block mt-2 text-xs">
                    Migração: <code>20250801030130_add_operators_and_shifts.sql</code>
                  </span>
                </>
              ) : (
                listErrorMessage ??
                "Verifique se o Supabase está a correr e se existem operadores ativos."
              )}
            </p>
            <button
              type="button"
              onClick={() => refreshOperators()}
              className="text-sm font-bold text-festa-accent underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {/* Nome */}
            <div>
              <label
                htmlFor="operator-select"
                className="block text-label-xl text-festa-on-surface-variant uppercase tracking-wider mb-2"
              >
                Nome
              </label>
              <div className="relative">
                <MaterialIcon
                  name="person"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-festa-on-surface-variant pointer-events-none"
                />
                <select
                  id="operator-select"
                  value={selectedId}
                  onChange={(e) => {
                    setSelectedId(e.target.value)
                    setPin("")
                    setError(null)
                  }}
                  className="w-full h-14 pl-12 pr-4 appearance-none bg-festa-surface-container-low border-2 border-festa-outline-variant/50 rounded-xl text-body-lg font-medium text-festa-on-surface focus:ring-4 focus:ring-festa-primary-container/10 focus:border-festa-primary-container outline-none"
                  required
                >
                  <option value="" disabled>
                    Selecione o seu nome
                  </option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name} ({op.role})
                    </option>
                  ))}
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-festa-on-surface-variant pointer-events-none"
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label
                htmlFor="pin-input"
                className="block text-label-xl text-festa-on-surface-variant uppercase tracking-wider mb-2"
              >
                PIN
              </label>
              <div className="relative">
                <MaterialIcon
                  name="lock"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-festa-on-surface-variant pointer-events-none"
                />
                <input
                  id="pin-input"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setPin(digits)
                    setError(null)
                  }}
                  placeholder="Introduza o PIN (4 dígitos)"
                  disabled={!selectedId}
                  className={cn(
                    "w-full h-14 pl-12 pr-4 bg-festa-surface-container-low border-2 border-festa-outline-variant/50 rounded-xl text-body-lg font-bold text-festa-on-surface tracking-[0.3em] placeholder:tracking-normal placeholder:font-medium placeholder:text-festa-on-surface-variant/60 focus:ring-4 focus:ring-festa-primary-container/10 focus:border-festa-primary-container outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  required
                />
              </div>
            </div>

            {/* PIN dots + numpad (optional, tablet-friendly) */}
            <Collapsible open={Boolean(selectedId)}>
              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="flex gap-3" aria-hidden>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-4 h-4 rounded-full border-2 border-festa-primary-container transition-colors",
                        pin.length > i && "bg-festa-primary-container"
                      )}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"].map((key) => {
                    if (key === "") return <div key="empty" />
                    if (key === "back") {
                      return (
                        <button
                          key="back"
                          type="button"
                          onClick={handleBackspace}
                          className="h-12 rounded-xl bg-festa-surface-container-high flex items-center justify-center active:scale-95"
                        >
                          <MaterialIcon name="backspace" />
                        </button>
                      )
                    }
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleDigit(key)}
                        className="h-12 rounded-xl bg-card border border-festa-outline-variant/50 text-lg text-foreground font-bold active:scale-95 shadow-festa-card"
                      >
                        {key}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Collapsible>

            <Collapsible open={Boolean(error)}>
              <p className="text-sm text-festa-error font-medium text-center pt-1" role="alert">
                {error}
              </p>
            </Collapsible>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-14 bg-festa-primary-container text-festa-on-primary-container rounded-2xl font-bold text-lg disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MaterialIcon name="login" />
              {submitting ? "A iniciar turno..." : "Iniciar Turno"}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
