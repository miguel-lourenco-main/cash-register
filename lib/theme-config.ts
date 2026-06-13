import { festaColors } from "./design-tokens"

/** Theme picker metadata — actual CSS variables live in app/globals.css */
export const themeConfig = {
  storageKey: "cash-register-theme",
  defaultTheme: "system" as const,

  themes: [
    { value: "light", label: "Claro", icon: "light_mode" },
    { value: "dark", label: "Escuro", icon: "dark_mode" },
    { value: "system", label: "Sistema", icon: "brightness_auto" },
  ],

  light: {
    name: "Modo Claro",
    description: "Warm Pearl festa kiosk palette",
    colors: {
      primary: festaColors.primaryContainer,
      background: festaColors.surface,
      foreground: festaColors.onSurface,
    },
  },

  dark: {
    name: "Modo Escuro",
    description: "Evening service — warm charcoal surfaces",
    colors: {
      primary: festaColors.primaryFixedDim,
      background: festaColors.inverseSurface,
      foreground: festaColors.inverseOnSurface,
    },
  },

  system: {
    name: "Sistema",
    description: "Segue a preferência do dispositivo",
    colors: {
      primary: "var(--primary)",
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
  },
} as const

export type Theme = (typeof themeConfig.themes)[number]["value"]
