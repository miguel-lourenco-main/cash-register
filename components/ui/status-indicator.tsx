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
    success: "bg-green-500",
    warning: "bg-yellow-500", 
    error: "bg-red-500",
    info: "bg-blue-500",
    pending: "bg-muted-foreground animate-pulse"
  }
  
  return (
    <div 
      className={cn(
        "rounded-full",
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    />
  )
}
