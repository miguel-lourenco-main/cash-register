"use client"

import type React from "react"
import { Plus_Jakarta_Sans, Work_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/lib/theme-provider"
import { OperatorProvider } from "@/lib/operator-provider"
import { AppShell } from "@/components/layout/app-shell"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "600", "700", "800"],
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "700"],
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
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
      <body className={`${workSans.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="cash-register-theme">
          <OperatorProvider>
            <AppShell>{children}</AppShell>
          </OperatorProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
