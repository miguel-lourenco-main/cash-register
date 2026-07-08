"use client"

import type { ReactNode } from "react"
import { PinLogin } from "@/components/auth/pin-login"
import { ShiftSummaryOverlay } from "@/components/auth/shift-summary-overlay"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageTransition } from "@/components/layout/page-transition"
import { SideNav } from "@/components/layout/side-nav"
import { TopAppBar } from "@/components/layout/top-app-bar"
import { FestaAmbience } from "@/components/ui/festa-ambience"
import { BootCurtain } from "@/components/ui/boot-curtain"
import { DemoModeBanner } from "@/components/ui/demo-mode-banner"
import { useOperator } from "@/lib/operator-provider"

/** Auth gate + authenticated chrome (nav, top bar, shift summary on logout). */
export function AppShell({ children }: { children: ReactNode }) {
  const { session, isLoading } = useOperator()

  if (isLoading) {
    return <BootCurtain />
  }

  if (!session) {
    return (
      <>
        <DemoModeBanner />
        <PinLogin />
      </>
    )
  }

  return (
    <>
      <DemoModeBanner />
      <div className="relative flex flex-col min-h-screen bg-festa-surface">
        <FestaAmbience />
        {/* Full-width top bar spans across the rail column; the rail hangs below it. */}
        <TopAppBar />
        <SideNav />
        <div className="relative z-10 flex flex-col flex-1 md:ml-24 lg:ml-32">
          <main className="flex flex-1 flex-col min-h-0 pb-[var(--festa-bottom-nav-height)] md:pb-0">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <BottomNav />
        <ShiftSummaryOverlay />
      </div>
    </>
  )
}
