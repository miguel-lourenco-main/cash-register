"use client"

import { usePathname } from "next/navigation"
import { MaterialIcon } from "@/components/ui/material-icon"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useOperator } from "@/lib/operator-provider"
import { FadeIn } from "@/components/ui/motion"
import { cn } from "@/lib/utils"

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
}

const defaultPage = {
  title: "Festa POS",
  subtitle: "Ponto de venda",
  icon: "storefront",
}

export function TopAppBar() {
  const pathname = usePathname()
  const { session, logout } = useOperator()
  const page = pageMeta[pathname] ?? defaultPage

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-festa-outline-variant/30 bg-festa-surface/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 h-touch-target-min md:h-20 px-gutter md:px-margin-page">
        {/* Brand + current page */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-festa-primary-container shadow-sm ring-1 ring-festa-primary-container/20">
            <MaterialIcon
              name="storefront"
              className="text-2xl text-festa-on-primary-container"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="font-display text-title-md font-extrabold text-festa-primary-emphasis tracking-tight truncate">
                Festa POS
              </h1>
              <span className="hidden sm:inline text-festa-outline-variant/80">·</span>
              <span className="hidden sm:flex items-center gap-1.5 min-w-0 text-festa-on-surface font-semibold truncate">
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
                  "hidden sm:flex items-center gap-3 pl-3 pr-1 py-1 rounded-full",
                  "bg-festa-surface-container-low border border-festa-outline-variant/40"
                )}
              >
                <div className="flex flex-col items-end min-w-0">
                  <span className="text-sm font-bold text-festa-on-surface leading-tight truncate max-w-[140px] lg:max-w-[180px]">
                    {session.operatorName}
                  </span>
                  <span className="text-[10px] text-festa-on-surface-variant uppercase tracking-wider">
                    {session.operatorRole}
                  </span>
                </div>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-festa-primary-container text-festa-on-primary-container font-bold text-sm"
                  aria-hidden
                >
                  {session.operatorName.charAt(0)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                className="hidden md:flex items-center gap-2 h-10 px-4 rounded-full bg-festa-error text-festa-on-error text-label-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <MaterialIcon name="logout" className="text-lg" />
                Encerrar Turno
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-festa-error/10 text-festa-error active:scale-95"
                aria-label="Encerrar turno"
              >
                <MaterialIcon name="logout" />
              </button>
            </FadeIn>
          )}
        </div>
      </div>

      {/* Page accent strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-festa-primary-container via-festa-festival-blue/60 to-transparent opacity-80" />
    </header>
  )
}
