import { cn } from "@/lib/utils"

interface MaterialIconProps {
  name: string
  filled?: boolean
  className?: string
}

export function MaterialIcon({ name, filled = false, className }: MaterialIconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined",
        filled && "material-symbols-filled",
        className
      )}
    >
      {name}
    </span>
  )
}
