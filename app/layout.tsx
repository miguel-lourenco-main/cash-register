"use client"

import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import "./globals.css"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/lib/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import icon from "./icon.png"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
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
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="cash-register-theme"
        >
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b shrink-0 md:px-6 bg-background">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold sm:text-base">
                <Image 
                  src={icon} 
                  alt="Ticket POS Logo" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
                <span className="sr-only">Ticket POS</span>
              </Link>
              <div className="flex items-center gap-4">
                <nav className="flex gap-4 sm:gap-6">
                  <Link
                    className={cn("text-sm font-medium hover:underline underline-offset-4", pathname !== "/" && "text-muted-foreground")}
                    href="/"
                  >
                    Caixa
                  </Link>
                  <Link
                    className={cn("text-sm font-medium hover:underline underline-offset-4", pathname !== "/orders" && "text-muted-foreground")}
                    href="/orders"
                  >
                    Pedidos
                  </Link>
                </nav>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
