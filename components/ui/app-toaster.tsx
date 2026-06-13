"use client"

import { Toaster } from "sonner"
import { useTheme } from "@/lib/theme-provider"

export function AppToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      position="top-center"
      duration={4000}
      theme={theme}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !border-2 !border-festa-border !shadow-block !bg-festa-paper !text-festa-on-surface !font-sans",
          title: "!font-bold",
          description: "!text-festa-on-surface-variant",
          success: "!bg-festa-success/15",
          error: "!bg-festa-error/10",
          warning: "!bg-festa-amber/15",
        },
      }}
    />
  )
}
