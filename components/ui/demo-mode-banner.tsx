"use client"

import { useEffect, useState } from "react"
import { MaterialIcon } from "@/components/ui/material-icon"
import { ensureDbStatus, getDbOffline, subscribeDbStatus } from "@/lib/db-status"
import { isLocalMode } from "@/lib/app-mode"

/**
 * Slim banner shown in SHARED mode whenever the Supabase backend is unreachable
 * (paused project) and the app has fallen back to static data — so the user
 * knows their changes are local-only. In local mode there is no backend to fall
 * back from (the on-device store is the source of truth), so the banner never
 * shows and we don't probe the network.
 */
export function DemoModeBanner() {
  const [offline, setOffline] = useState(getDbOffline() === true)

  useEffect(() => {
    if (isLocalMode()) return
    const unsubscribe = subscribeDbStatus(setOffline)
    // Probe up front so the banner appears even before any data is loaded.
    void ensureDbStatus()
    return unsubscribe
  }, [])

  if (isLocalMode() || !offline) return null

  return (
    <div
      role="status"
      className="relative z-40 flex items-center justify-center gap-2 border-b-2 border-festa-border bg-festa-amber px-gutter py-2 text-festa-ink shadow-block-sm"
    >
      <MaterialIcon name="cloud_off" className="text-lg shrink-0" />
      <p className="text-xs sm:text-sm font-bold text-center">
        Modo demonstração
        <span className="hidden sm:inline font-medium">
          {" "}
          — base de dados em pausa. As alterações ficam só neste dispositivo.
        </span>
      </p>
    </div>
  )
}
