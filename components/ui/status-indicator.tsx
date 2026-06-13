import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "info" | "pending"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusIndicator({ 
  status, 
  size = "md", 
  className 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }
  
  const statusClasses = {
    success: "bg-festa-success",
    warning: "bg-festa-amber",
    error: "bg-festa-error",
    info: "bg-festa-festival-blue",
    pending: "bg-muted-foreground animate-pulse"
  }

  return (
    <div
      className={cn(
        "rounded-full border border-festa-border",
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    />
  )
}
