/** Festa POS design tokens — bold block duotone system (see app/globals.css for theme-aware values) */

export const festaColors = {
  ink: "#1b130d",
  primary: "#7c2810",
  primaryContainer: "#9b3f25",
  terracottaSun: "#9b3f25",
  onPrimary: "#ffffff",
  amber: "#ffb52e",
  surface: "#faf4e8",
  surfaceContainerLow: "#f3eada",
  surfaceContainerHigh: "#ebdfc9",
  surfaceContainerLowest: "#fffdf7",
  onSurface: "#1b130d",
  onSurfaceVariant: "#5c4a3d",
  outline: "#8a7361",
  outlineVariant: "#d9c9b4",
  secondary: "#5c5345",
  tertiary: "#00457f",
  festivalBlue: "#005da7",
  tertiaryContainer: "#005da7",
  successGreen: "#1b7339",
  error: "#b3261e",
  errorRuby: "#b3261e",
  primaryFixedDim: "#ff9b7a",
  inverseSurface: "#181210",
  inversePrimary: "#ff9b7a",
  inverseOnSurface: "#f6ede0",
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
  cardGap: "20px",
  touchTargetMin: "64px",
  panelWidthCart: "380px",
  sideNavWidth: "96px",
  sideNavWidthMd: "128px",
  topBarHeight: "64px",
  topBarHeightMd: "80px",
} as const

export const festaTypography = {
  displayXl: { size: "56px", lineHeight: "56px", weight: 700 },
  priceDisplay: { size: "40px", lineHeight: "44px", weight: 700 },
  headlineLg: { size: "36px", lineHeight: "40px", weight: 700 },
  headlineLgMobile: { size: "28px", lineHeight: "32px", weight: 700 },
  titleMd: { size: "20px", lineHeight: "26px", weight: 700 },
  bodyLg: { size: "18px", lineHeight: "26px", weight: 400 },
  bodyMd: { size: "16px", lineHeight: "24px", weight: 400 },
  labelXl: { size: "13px", lineHeight: "18px", weight: 700, letterSpacing: "0.08em" },
} as const

/** Hard offset block shadows — theme-aware via --shadow-color */
export const festaShadows = {
  blockSm: "2px 2px 0 0 var(--shadow-color)",
  block: "4px 4px 0 0 var(--shadow-color)",
  blockLg: "6px 6px 0 0 var(--shadow-color)",
  blockUp: "0 -4px 0 0 var(--shadow-color)",
} as const

/** Chart styling contract for recharts — consume CSS vars so dark mode works */
export const festaChartTheme = {
  series: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"],
  grid: "var(--chart-grid)",
  tooltipBg: "var(--chart-tooltip-bg)",
  axisText: "var(--festa-on-surface-variant)",
} as const

export const OPERATOR_SESSION_KEY = "cash-register-operator-session"
