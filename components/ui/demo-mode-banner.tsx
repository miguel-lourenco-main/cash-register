"use client"

import { useEffect, useState } from "react"
import { MaterialIcon } from "@/components/ui/material-icon"
import { ensureDbStatus, getDbOffline, subscribeDbStatus } from "@/lib/db-status"

/**
 * Slim banner shown whenever the Supabase backend is unreachable (paused
 * project) and the app has fallen back to static demo data. Lets the user know
 * their changes are local-only while still letting them explore everything.
 */
export function DemoModeBanner() {
  const [offline, setOffline] = useState(getDbOffline() === true)

  useEffect(() => {
    const unsubscribe = subscribeDbStatus(setOffline)
    // Probe up front so the banner appears even before any data is loaded.
    void ensureDbStatus()
    return unsubscribe
  }, [])

  if (!offline) return null

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
