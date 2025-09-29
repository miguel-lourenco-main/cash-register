export const themeConfig = {
  // Theme storage key
  storageKey: "cash-register-theme",
  
  // Default theme
  defaultTheme: "system" as const,
  
  // Available themes
  themes: [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "system", label: "System", icon: "💻" },
  ],
  
  // Theme-specific configurations
  light: {
    name: "Light Mode",
    description: "Clean and bright interface",
    colors: {
      primary: "oklch(0.205 0 0)",
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
    }
  },
  
  dark: {
    name: "Dark Mode", 
    description: "Easy on the eyes in low light",
    colors: {
      primary: "oklch(0.922 0 0)",
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
    }
  },
  
  system: {
    name: "System",
    description: "Follows your system preference",
    colors: {
      primary: "var(--primary)",
      background: "var(--background)", 
      foreground: "var(--foreground)",
    }
  }
} as const

export type Theme = keyof typeof themeConfig.themes[number]["value"]
