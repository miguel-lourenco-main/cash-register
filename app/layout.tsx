"use client"

import type React from "react"
import { Space_Grotesk, Work_Sans } from "next/font/google"
import { MotionConfig } from "motion/react"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-provider"
import { OperatorProvider } from "@/lib/operator-provider"
import { AppShell } from "@/components/layout/app-shell"
import { AppToaster } from "@/components/ui/app-toaster"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
  display: "swap",
})

// Body font for UI copy; Space Grotesk (above) is used for display/price text
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "700"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning className="no-scrollbar">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0..1,0"
          rel="stylesheet"
        />
        {/* Blocking script: apply saved theme before paint to avoid light/dark flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('cash-register-theme') || 'system';
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.classList.add(systemTheme);
                } else {
                  document.documentElement.classList.add(theme);
                }
              } catch (e) {
                document.documentElement.classList.add('light');
              }
            `,
          }}
        />
      </head>
      <body className={`${workSans.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <MotionConfig reducedMotion="user">
          {/* Theme + operator session wrap every route; AppShell gates on PIN login */}
          <ThemeProvider defaultTheme="system" storageKey="cash-register-theme">
            <OperatorProvider>
              <AppShell>{children}</AppShell>
            </OperatorProvider>
            <AppToaster />
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  )
}
