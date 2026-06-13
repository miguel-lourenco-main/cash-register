"use client"

import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { MotionPresence } from "@/components/ui/motion"
import { formatEuro } from "@/lib/order-utils"
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

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm p-4 text-center">
      <p className="text-label-xl text-festa-on-surface-variant mb-1">{label}</p>
      <p className="font-display text-2xl font-bold text-festa-on-surface tabular-nums">{value}</p>
    </div>
  )
}

export function ShiftSummaryOverlay() {
  const { pendingLogout, confirmLogout, cancelLogout } = useOperator()
  const summary = pendingLogout?.summary ?? null
  const averageTicket =
    summary && summary.ordersCount > 0 ? summary.revenue / summary.ordersCount : 0

  return (
    <MotionPresence
      show={Boolean(pendingLogout)}
      enterFrom="slide-in-from-bottom-4"
      className="fixed inset-0 z-50 flex flex-col bg-festa-surface overflow-y-auto no-scrollbar"
    >
      {pendingLogout && (
        <div className="flex w-full max-w-lg mx-auto flex-1 flex-col gap-6 p-gutter py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block-sm">
              <MaterialIcon name="badge" filled className="text-2xl" />
            </div>
            <div>
              <h2 className="text-title-md font-display text-festa-on-surface">
                Resumo do Turno
              </h2>
              <p className="text-sm text-festa-on-surface-variant">
                {pendingLogout.operatorName} · {formatDuration(pendingLogout.shiftStartedAt)} de turno
              </p>
            </div>
          </div>

          {summary ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <SummaryStat label="Pedidos" value={String(summary.ordersCount)} />
                <SummaryStat label="Receita" value={formatEuro(summary.revenue)} />
                <SummaryStat label="Ticket Médio" value={formatEuro(averageTicket)} />
              </div>

              <div className="rounded-lg border-2 border-festa-border bg-festa-paper shadow-block p-5">
                <h3 className="text-label-xl text-festa-on-surface-variant mb-3">
                  Mais vendidos no turno
                </h3>
                {summary.topItems.length === 0 ? (
                  <p className="text-sm text-festa-on-surface-variant">
                    Nenhum pedido registado neste turno.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {summary.topItems.map((item, index) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-3 border-b-2 border-festa-border/10 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border-2 border-festa-border bg-festa-surface-high font-display text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-bold text-festa-on-surface truncate">
                            {item.name}
                          </span>
                        </span>
                        <span className="font-display font-bold text-festa-accent tabular-nums shrink-0">
                          ×{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg border-2 border-festa-border bg-festa-amber/15 p-5 flex items-start gap-3">
              <MaterialIcon name="warning" className="text-festa-error shrink-0" />
              <p className="text-sm text-festa-on-surface">
                Não foi possível carregar o resumo do turno (problema de rede?). Pode
                encerrar o turno mesmo assim.
              </p>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3">
            <Button variant="destructive" onClick={() => confirmLogout()} className="w-full h-16 text-lg gap-3">
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
