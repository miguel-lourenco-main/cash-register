"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingCartButtonProps {
  itemCount: number
  onScrollToOrder: () => void
  isOrderInView: boolean
  className?: string
}

export function FloatingCartButton({ 
  itemCount, 
  onScrollToOrder, 
  isOrderInView,
  className 
}: FloatingCartButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile and handle visibility
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 // md breakpoint
      setIsMobile(mobile)
      setIsVisible(mobile) // Always visible on mobile, regardless of item count
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [itemCount])

  if (!isMobile || !isVisible || isOrderInView) {
    return null
  }

  const isDisabled = itemCount === 0

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
      "animate-in slide-in-from-bottom-2",
      className
    )}>
      <Button
        onClick={onScrollToOrder}
        disabled={isDisabled}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg relative hover:scale-105 transition-transform duration-200",
          isDisabled 
            ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted" 
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        )}
      >
        <div className="flex flex-col items-center justify-center">
          <ShoppingCart className="w-5 h-5" />
          <ChevronDown className="w-4 h-4 mt-0.5" />
        </div>
        
        {/* Item count badge */}
        {itemCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-in zoom-in-50 duration-200">
            {itemCount > 99 ? '99+' : itemCount}
          </div>
        )}
      </Button>
    </div>
  )
} 