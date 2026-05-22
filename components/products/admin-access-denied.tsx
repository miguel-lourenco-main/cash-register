"use client"

import { MaterialIcon } from "@/components/ui/material-icon"

export function AdminAccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-gutter text-center">
      <MaterialIcon
        name="lock"
        className="text-5xl text-festa-on-surface-variant mb-4"
      />
      <h2 className="text-title-md font-bold text-festa-on-surface mb-2">
        Acesso restrito
      </h2>
      <p className="text-festa-on-surface-variant max-w-md">
        Apenas administradores podem gerir produtos. Inicie sessão com uma conta
        de administrador para continuar.
      </p>
    </div>
  )
}
