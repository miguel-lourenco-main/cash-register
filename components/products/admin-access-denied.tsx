"use client"

import { MaterialIcon } from "@/components/ui/material-icon"

/** Shown when a non-admin operator navigates to /products. */
export function AdminAccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-gutter text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block">
        <MaterialIcon name="lock" filled className="text-4xl" />
      </div>
      <h2 className="text-title-md text-festa-on-surface mb-2">
        Acesso restrito
      </h2>
      <p className="text-festa-on-surface-variant max-w-md">
        Apenas administradores podem gerir produtos. Inicie sessão com uma conta
        de administrador para continuar.
      </p>
    </div>
  )
}
