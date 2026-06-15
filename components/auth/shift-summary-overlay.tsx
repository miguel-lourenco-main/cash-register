"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { AnimatedNumber, MotionPresence } from "@/components/ui/motion"
import { BlockConfetti } from "@/components/ui/block-confetti"
import { formatEuro } from "@/lib/order-utils"
import { springs, STAGGER_S } from "@/lib/motion"
import { useOperator } from "@/lib/operator-provider"

function formatDuration(startedAt: string): string {
  const start = new Date(startedAt).getTime()
  if (Number.isNaN(start)) return "—"
  const totalMinutes = Math.max(0, Math.floor((Date.now() - start) / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} min`
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`
}

function SummaryStat({ label, value, delay }: { label: string; value: string; delay: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm p-4 text-center"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.snappy, delay }}
    >
      <p className="text-label-xl text-festa-on-surface-variant mb-1">{label}</p>
      <p className="font-display text-2xl font-bold text-festa-on-surface tabular-nums">{value}</p>
    </motion.div>
  )
}

export function ShiftSummaryOverlay() {
  const reduce = useReducedMotion()
  const { pendingLogout, confirmLogout, cancelLogout } = useOperator()
  const summary = pendingLogout?.summary ?? null
  const averageTicket =
    summary && summary.ordersCount > 0 ? summary.revenue / summary.ordersCount : 0
  const maxQty = summary?.topItems.reduce((m, i) => Math.max(m, i.quantity), 0) ?? 0
  const celebrate = Boolean(summary && summary.ordersCount > 0)

  const [displayRevenue, setDisplayRevenue] = useState(0)
  useEffect(() => {
    if (!pendingLogout || !summary) return
    setDisplayRevenue(0)
    const raf = requestAnimationFrame(() => setDisplayRevenue(summary.revenue))
    return () => cancelAnimationFrame(raf)
  }, [pendingLogout, summary])

  return (
    <MotionPresence
      show={Boolean(pendingLogout)}
      enterFrom="slide-in-from-bottom-4"
      className="fixed inset-0 z-50 flex flex-col bg-festa-surface overflow-y-auto no-scrollbar"
    >
      {pendingLogout && (
        <div className="relative flex w-full max-w-lg mx-auto flex-1 flex-col gap-5 p-gutter py-8">
          <BlockConfetti fire={celebrate} originY={0.3} count={28} />

          <motion.div
            className="relative z-10 flex items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.snappy}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block-sm">
              <MaterialIcon name="badge" filled className="text-2xl" />
            </div>
            <div>
              <h2 className="text-title-md font-display text-festa-on-surface">Resumo do Turno</h2>
              <p className="text-sm text-festa-on-surface-variant">
                {pendingLogout.operatorName} · {formatDuration(pendingLogout.shiftStartedAt)} de turno
              </p>
            </div>
          </motion.div>

          {summary ? (
            <>
              {/* Hero revenue */}
              <motion.div
                className="relative z-10 overflow-hidden rounded-lg border-2 border-festa-border bg-festa-primary dark:bg-festa-primary-emphasis text-white dark:text-festa-ink shadow-block-lg p-6"
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springs.snappy, delay: 0.08 }}
              >
                <div className="festa-halftone pointer-events-none absolute inset-0 opacity-[0.12]" />
                <p className="relative text-label-xl opacity-80 mb-1">Receita do turno</p>
                <AnimatedNumber
                  value={displayRevenue}
                  format={formatEuro}
                  className="relative block font-display text-price-display tracking-tight tabular-nums"
                />
              </motion.div>

              <div className="relative z-10 grid grid-cols-2 gap-3">
                <SummaryStat label="Pedidos" value={String(summary.ordersCount)} delay={0.16} />
                <SummaryStat label="Ticket Médio" value={formatEuro(averageTicket)} delay={0.22} />
              </div>

              <div className="relative z-10 rounded-lg border-2 border-festa-border bg-festa-paper shadow-block p-5">
                <h3 className="text-label-xl text-festa-on-surface-variant mb-3">
                  Mais vendidos no turno
                </h3>
                {summary.topItems.length === 0 ? (
                  <p className="text-sm text-festa-on-surface-variant">
                    Nenhum pedido registado neste turno.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {summary.topItems.map((item, index) => (
                      <li key={item.name} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border-2 border-festa-border bg-festa-surface-high font-display text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-bold text-festa-on-surface truncate w-28 shrink-0">
                          {item.name}
                        </span>
                        <span className="relative flex-1 h-5 rounded-sm border-2 border-festa-border bg-festa-surface-low overflow-hidden">
                          <motion.span
                            className="absolute inset-y-0 left-0 bg-festa-amber"
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${maxQty > 0 ? (item.quantity / maxQty) * 100 : 0}%` }}
                            transition={{ ...springs.snappy, delay: 0.3 + index * STAGGER_S }}
                          />
                        </span>
                        <span className="font-display font-bold text-festa-accent tabular-nums shrink-0 w-8 text-right">
                          ×{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="relative z-10 rounded-lg border-2 border-festa-border bg-festa-amber/15 p-5 flex items-start gap-3">
              <MaterialIcon name="warning" className="text-festa-error shrink-0" />
              <p className="text-sm text-festa-on-surface">
                Não foi possível carregar o resumo do turno (problema de rede?). Pode encerrar o
                turno mesmo assim.
              </p>
            </div>
          )}

          <div className="relative z-10 mt-auto flex flex-col gap-3 pt-2">
            <Button
              variant="destructive"
              onClick={() => confirmLogout()}
              className="w-full h-16 text-lg gap-3"
            >
              <MaterialIcon name="logout" />
              {summary ? "Confirmar e Encerrar Turno" : "Encerrar mesmo assim"}
            </Button>
            <Button variant="ghost" onClick={cancelLogout} className="w-full">
              Voltar
            </Button>
          </div>
        </div>
      )}
    </MotionPresence>
  )
}
