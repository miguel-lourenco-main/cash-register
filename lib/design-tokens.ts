/** Festa POS design tokens — sourced from Modern Festa Kiosk mockups */

export const festaColors = {
  primary: "#7c2810",
  primaryContainer: "#9b3f25",
  terracottaSun: "#9b3f25",
  onPrimary: "#ffffff",
  surface: "#fbf9f5",
  surfaceContainerLow: "#f5f3ef",
  surfaceContainerHigh: "#eae8e4",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#56423d",
  outline: "#89726c",
  outlineVariant: "#dcc0b9",
  secondary: "#615e57",
  tertiary: "#00457f",
  festivalBlue: "#005da7",
  tertiaryContainer: "#005da7",
  successGreen: "#2e7d32",
  error: "#ba1a1a",
  errorRuby: "#ba1a1a",
  primaryFixedDim: "#ffb5a0",
  inverseSurface: "#30312e",
  inversePrimary: "#ffb5a0",
  inverseOnSurface: "#f2f0ed",
  onPrimaryContainer: "#ffffff",
  onError: "#ffffff",
} as const

/** Theme-aware via CSS variables in globals.css — use Tailwind festa-*-emphasis / festa-accent classes */
export const festaSemanticTokens = [
  "festa-primary-emphasis",
  "festa-accent",
  "festa-tertiary-emphasis",
  "festa-success-emphasis",
  "festa-on-primary-container",
  "festa-on-error",
] as const

export const festaSpacing = {
  gutter: "24px",
  marginPage: "32px",
  cardGap: "16px",
  touchTargetMin: "64px",
  panelWidthCart: "380px",
  sideNavWidth: "96px",
  sideNavWidthMd: "128px",
  topBarHeight: "64px",
  topBarHeightMd: "80px",
} as const

export const festaTypography = {
  priceDisplay: { size: "36px", lineHeight: "44px", weight: 800 },
  headlineLg: { size: "32px", lineHeight: "40px", weight: 700 },
  headlineLgMobile: { size: "24px", lineHeight: "32px", weight: 700 },
  titleMd: { size: "20px", lineHeight: "28px", weight: 600 },
  bodyLg: { size: "18px", lineHeight: "26px", weight: 400 },
  bodyMd: { size: "16px", lineHeight: "24px", weight: 400 },
  labelXl: { size: "14px", lineHeight: "20px", weight: 700, letterSpacing: "0.05em" },
} as const

export const festaShadows = {
  card: "0 2px 8px rgba(0, 0, 0, 0.06)",
  cartSheet: "0px -12px 32px rgba(124, 40, 16, 0.12)",
} as const

export const OPERATOR_SESSION_KEY = "cash-register-operator-session"
