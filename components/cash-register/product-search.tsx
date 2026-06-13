"use client"

import { MaterialIcon } from "@/components/ui/material-icon"

interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <MaterialIcon
        name="search"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-festa-on-surface-variant pointer-events-none text-xl"
      />
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Procurar produto…"
        aria-label="Procurar produto"
        className="w-full h-12 pl-11 pr-11 rounded-lg border-2 border-festa-border bg-festa-paper shadow-block-sm text-base font-medium text-festa-on-surface placeholder:text-festa-on-surface-variant/60 outline-none focus:ring-4 focus:ring-festa-amber/40 focus:border-festa-amber [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar pesquisa"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md text-festa-on-surface-variant cursor-pointer hover:bg-festa-surface-high"
        >
          <MaterialIcon name="close" className="text-lg" />
        </button>
      )}
    </div>
  )
}
