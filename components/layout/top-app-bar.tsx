"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { MaterialIcon } from "@/components/ui/material-icon"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useOperator } from "@/lib/operator-provider"
import { FadeIn } from "@/components/ui/motion"
import { cn } from "@/lib/utils"

/** Live elapsed shift time, ticking each half-minute. */
function ShiftClock({ startedAt }: { startedAt: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(t)
  }, [])
  const start = new Date(startedAt).getTime()
  if (now === null || Number.isNaN(start)) return null
  const mins = Math.max(0, Math.floor((now - start) / 60000))
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const label = h === 0 ? `${m}m` : `${h}h ${m.toString().padStart(2, "0")}m`
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-festa-on-surface-variant tabular-nums">
      <MaterialIcon name="schedule" className="text-[13px]" />
      {label}
    </span>
  )
}

const pageMeta: Record<string, { title: string; subtitle: string; icon: string }> = {
  "/": {
    title: "Caixa",
    subtitle: "Registo de vendas",
    icon: "point_of_sale",
  },
  "/orders": {
    title: "Pedidos",
    subtitle: "Histórico e estatísticas",
    icon: "receipt_long",
  },
  "/products": {
    title: "Produtos",
    subtitle: "Gestão do menu",
    icon: "inventory_2",
  },
}

const defaultPage = {
  title: "Festa POS",
  subtitle: "Ponto de venda",
  icon: "storefront",
}

export function TopAppBar() {
  const pathname = usePathname()
  const { session, requestLogout, isPreparingLogout } = useOperator()
  const page = pageMeta[pathname] ?? defaultPage

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b-2 border-festa-border bg-festa-surface">
      <div className="flex items-center justify-between gap-4 h-touch-target-min md:h-20 px-gutter md:px-margin-page">
        {/* Brand + current page */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-md border-2 border-festa-border bg-festa-primary dark:bg-festa-primary-emphasis shadow-block-sm">
            <MaterialIcon
              name="storefront"
              filled
              className="text-2xl text-white dark:text-festa-ink"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="font-display text-title-md uppercase text-festa-primary-emphasis tracking-tight truncate">
                Festa POS
              </h1>
              <span className="hidden sm:inline text-festa-on-surface-variant/60">/</span>
              <span className="hidden sm:flex items-center gap-1.5 min-w-0 font-display font-bold text-festa-on-surface truncate">
                <MaterialIcon
                  name={page.icon}
                  className="text-lg text-festa-accent shrink-0"
                />
                {page.title}
              </span>
            </div>
            <p className="text-xs md:text-sm text-festa-on-surface-variant truncate mt-0.5">
              <span className="sm:hidden">{page.title} — </span>
              {page.subtitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <ThemeToggle />

          {session && (
            <FadeIn
              from="slide-in-from-right-2"
              className="flex items-center gap-2 md:gap-3"
            >
              <div
                className={cn(
                  "hidden sm:flex items-center gap-3 pl-3 pr-1.5 py-1.5 rounded-md",
                  "bg-festa-paper border-2 border-festa-border shadow-block-sm"
                )}
              >
                <div className="flex flex-col items-end min-w-0">
                  <span className="text-sm font-bold text-festa-on-surface leading-tight truncate max-w-[140px] lg:max-w-[180px]">
                    {session.operatorName}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-festa-on-surface-variant uppercase tracking-wider font-bold">
                    {session.operatorRole}
                    <span aria-hidden className="text-festa-outline-variant">·</span>
                    <ShiftClock startedAt={session.shiftStartedAt} />
                  </span>
                </div>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2 border-festa-border bg-festa-amber text-festa-ink font-display font-bold text-sm"
                  aria-hidden
                >
                  {session.operatorName.charAt(0)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => requestLogout()}
                disabled={isPreparingLogout}
                className="hidden md:flex items-center gap-2 h-12 px-4 rounded-lg border-2 border-festa-border bg-festa-error text-festa-on-error text-label-xl shadow-block-sm cursor-pointer transition-colors duration-200 hover:bg-festa-error/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
              >
                <MaterialIcon
                  name={isPreparingLogout ? "progress_activity" : "logout"}
                  className={cn("text-lg", isPreparingLogout && "animate-spin")}
                />
                Encerrar Turno
              </button>
              <button
                type="button"
                onClick={() => requestLogout()}
                disabled={isPreparingLogout}
                className="md:hidden flex h-12 w-12 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-error text-festa-on-error shadow-block-sm cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
                aria-label="Encerrar turno"
              >
                <MaterialIcon
                  name={isPreparingLogout ? "progress_activity" : "logout"}
                  className={cn(isPreparingLogout && "animate-spin")}
                />
              </button>
            </FadeIn>
          )}
        </div>
      </div>
    </header>
  )
}
