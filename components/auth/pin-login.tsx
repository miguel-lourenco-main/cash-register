"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useOperator } from "@/lib/operator-provider"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { Collapsible } from "@/components/ui/motion"
import { FestaAmbience } from "@/components/ui/festa-ambience"
import { FestaBunting } from "@/components/ui/festa-bunting"
import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function PinLogin() {
  const { operators, listError, listErrorMessage, login, isLoading, refreshOperators } =
    useOperator()
  const reduce = useReducedMotion()
  const [selectedId, setSelectedId] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [shake, setShake] = useState(0)

  const canSubmit = Boolean(selectedId) && pin.length >= 4 && !submitting
  const selectedOperator = operators.find((op) => op.id === selectedId)
  const firstName = selectedOperator?.name.split(" ")[0]

  // PINs are four digits — matches the bcrypt-verified length on the server.
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
      setShake((s) => s + 1)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([8, 40, 8])
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
    <div className="relative min-h-screen flex flex-col items-center bg-festa-surface overflow-hidden px-6 py-8">
      <FestaAmbience />
      <FestaBunting className="absolute left-0 top-0 z-0 opacity-90" />

      <div className="relative z-10 flex flex-1 w-full flex-col items-center justify-center">
        {/* Brand ritual */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.snappy}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-festa-border bg-festa-primary dark:bg-festa-primary-emphasis shadow-block-lg"
              initial={reduce ? false : { scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...springs.snappy, delay: 0.1 }}
            >
              <MaterialIcon name="storefront" filled className="text-3xl text-white dark:text-festa-ink" />
            </motion.div>
            <h1 className="text-headline-lg-mobile md:text-display-xl font-display text-festa-primary-emphasis">
              Festa POS
            </h1>
          </div>
          <motion.div
            className="mt-3 h-2 w-32 rounded-sm border border-festa-border bg-festa-amber"
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...springs.snappy, delay: 0.25 }}
            style={{ originX: 0 }}
          />
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
          <motion.p
            className="text-festa-on-surface-variant text-body-lg text-center"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {firstName ? (
              <>
                Olá, <span className="font-bold text-festa-on-surface">{firstName}</span> — introduza o PIN
              </>
            ) : (
              "Selecione o seu nome e introduza o PIN"
            )}
          </motion.p>

          {operators.length === 0 ? (
            <div className="rounded-lg border-2 border-festa-border bg-card p-6 text-center shadow-block">
              <MaterialIcon
                name="person_off"
                className="text-4xl text-festa-on-surface-variant mb-3 mx-auto"
              />
              <p className="text-festa-on-surface font-bold mb-2">
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
                    <code className="block mt-1 p-2 bg-festa-surface-low rounded text-xs">
                      pnpm supabase:start && pnpm supabase:reset && pnpm supabase:env-sync
                    </code>
                    <strong className="block mt-3">Remoto (GitLab/hosted):</strong>
                    <code className="block mt-1 p-2 bg-festa-surface-low rounded text-xs">
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
                className="text-sm font-bold text-festa-accent underline cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              {/* Nome */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.snappy, delay: 0.42 }}
              >
                <label
                  htmlFor="operator-select"
                  className="block text-label-xl text-festa-on-surface-variant mb-2"
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
                    className="w-full h-14 pl-12 pr-4 appearance-none bg-festa-paper border-2 border-festa-border rounded-lg shadow-block-sm text-body-lg font-medium text-festa-on-surface focus:ring-4 focus:ring-festa-amber/40 focus:border-festa-amber outline-none"
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
              </motion.div>

              {/* PIN field (keyboard + a11y) */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.snappy, delay: 0.5 }}
              >
                <label
                  htmlFor="pin-input"
                  className="block text-label-xl text-festa-on-surface-variant mb-2"
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
                      "w-full h-14 pl-12 pr-4 bg-festa-paper border-2 border-festa-border rounded-lg shadow-block-sm text-body-lg font-bold text-festa-on-surface tracking-[0.3em] placeholder:tracking-normal placeholder:font-medium placeholder:text-festa-on-surface-variant/60 focus:ring-4 focus:ring-festa-amber/40 focus:border-festa-amber outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    )}
                    required
                  />
                </div>
              </motion.div>

              {/* PIN dots + numpad */}
              <Collapsible open={Boolean(selectedId)}>
                <div className="flex flex-col items-center gap-5 pt-1">
                  <motion.div
                    className="flex gap-3"
                    aria-hidden
                    key={shake}
                    animate={
                      reduce || !error
                        ? undefined
                        : { x: [0, -10, 10, -8, 8, -4, 0] }
                    }
                    transition={{ duration: 0.4 }}
                  >
                    {[0, 1, 2, 3].map((i) => {
                      const filled = pin.length > i
                      return (
                        <motion.div
                          key={i}
                          className={cn(
                            "h-5 w-5 rounded-sm border-2 border-festa-border",
                            error ? "bg-festa-error" : filled ? "bg-festa-amber" : "bg-festa-paper"
                          )}
                          animate={{ scale: filled ? [1.35, 1] : 1 }}
                          transition={springs.press}
                        />
                      )
                    })}
                  </motion.div>

                  <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"].map((key) => {
                      if (key === "") return <div key="empty" />
                      if (key === "back") {
                        return (
                          <button
                            key="back"
                            type="button"
                            onClick={handleBackspace}
                            aria-label="Apagar dígito"
                            className="h-16 rounded-lg border-2 border-festa-border bg-festa-surface-high shadow-block-sm flex items-center justify-center cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
                          className="lift-block h-16 rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm font-display text-2xl text-foreground font-bold cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:!shadow-none"
                        >
                          {key}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Collapsible>

              <Collapsible open={Boolean(error)}>
                <p
                  className="flex items-center justify-center gap-1.5 text-sm text-festa-error font-bold text-center pt-1"
                  role="alert"
                >
                  <MaterialIcon name="warning" className="text-base" />
                  {error}
                </p>
              </Collapsible>

              <Button
                type="submit"
                variant="accent"
                disabled={!canSubmit}
                className="w-full h-16 text-lg gap-2"
              >
                <MaterialIcon name="login" />
                {submitting ? "A iniciar turno..." : "Iniciar Turno"}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
