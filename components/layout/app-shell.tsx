"use client"

import type { ReactNode } from "react"
import { PinLogin } from "@/components/auth/pin-login"
import { BottomNav } from "@/components/layout/bottom-nav"
import { SideNav } from "@/components/layout/side-nav"
import { TopAppBar } from "@/components/layout/top-app-bar"
import { useOperator } from "@/lib/operator-provider"

export function AppShell({ children }: { children: ReactNode }) {
  const { session, isLoading } = useOperator()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-festa-surface">
        <p className="text-festa-on-surface-variant">A carregar...</p>
      </div>
    )
  }

  if (!session) {
    return <PinLogin />
  }

  return (
    <div className="flex flex-col min-h-screen bg-festa-surface">
      <SideNav />
      <div className="flex flex-col flex-1 md:ml-24 lg:ml-32">
        <TopAppBar />
        <main className="flex flex-1 flex-col min-h-0 pb-[var(--festa-bottom-nav-height)] md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
