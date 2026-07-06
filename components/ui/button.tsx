import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold uppercase tracking-wide cursor-pointer touch-manipulation transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-festa-amber/60 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "lift-block border-2 border-festa-border bg-primary text-primary-foreground shadow-block-sm hover:bg-festa-primary-container dark:hover:bg-primary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        accent:
          "lift-block border-2 border-festa-border bg-festa-amber text-festa-ink shadow-block-sm hover:bg-festa-amber/85 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        destructive:
          "lift-block border-2 border-festa-border bg-destructive text-destructive-foreground shadow-block-sm hover:bg-destructive/90 focus-visible:ring-destructive/30 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        outline:
          "lift-block border-2 border-festa-border bg-festa-paper text-festa-on-surface shadow-block-sm hover:bg-festa-amber hover:text-festa-ink active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "lift-block border-2 border-festa-border bg-festa-surface-high text-festa-on-surface shadow-block-sm hover:bg-festa-surface-low active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline normal-case tracking-normal",
      },
      size: {
        default: "h-12 px-5 py-2 has-[>svg]:px-4",
        sm: "h-10 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-14 px-8 text-base has-[>svg]:px-6",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
