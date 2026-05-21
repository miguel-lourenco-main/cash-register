"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MaterialIcon } from "@/components/ui/material-icon"
import { useTheme } from "@/lib/theme-provider"
import { themeConfig } from "@/lib/theme-config"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className="rounded-full">
        <MaterialIcon name="brightness_auto" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-fit rounded-full border-festa-outline-variant/50"
        >
          <MaterialIcon name={theme === "dark" ? "dark_mode" : theme === "light" ? "light_mode" : "brightness_auto"} />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeConfig.themes.map((t) => (
          <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
            <MaterialIcon name={t.icon} className="mr-2 text-base" />
            <span>{t.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
