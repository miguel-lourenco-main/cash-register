import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"

/** Festa POS storefront tile: the app's start item, shared by the top bar (mobile) and the rail corner (md+). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-md border-2 border-festa-border bg-festa-primary dark:bg-festa-primary-emphasis shadow-block-sm",
        className
      )}
    >
      <MaterialIcon
        name="storefront"
        filled
        className="text-2xl text-white dark:text-festa-ink"
      />
    </div>
  )
}
