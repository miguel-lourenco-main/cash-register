import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  description?: string
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  text = "Carregando...", 
  description,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className={cn(
        "border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin",
        sizeClasses[size]
      )} />
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">{text}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
