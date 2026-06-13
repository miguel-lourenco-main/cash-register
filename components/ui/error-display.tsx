import { Button } from "@/components/ui/button"
import { MaterialIcon } from "@/components/ui/material-icon"
import { cn } from "@/lib/utils"

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({
  title = "Algo deu errado",
  message = "Ocorreu um erro inesperado. Tente novamente.",
  onRetry,
  className
}: ErrorDisplayProps) {
  return (
    <div className={cn("py-6 flex items-center justify-center", className)}>
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block-sm">
          <MaterialIcon name="warning" filled className="text-4xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <MaterialIcon name="refresh" className="text-lg" />
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  )
}
