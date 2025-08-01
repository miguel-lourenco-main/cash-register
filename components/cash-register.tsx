"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, MinusCircle, XCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import type { Product, OrderItem } from "@/lib/types"
import { createOrder } from "@/lib/actions"

export default function CashRegister({ products }: { products: Product[] }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stickyItemIndex, setStickyItemIndex] = useState<number | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const router = useRouter()
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  const handleAddToOrder = (product: Product) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prevItems, { product, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromOrder(productId)
    } else {
      setOrderItems((prevItems) =>
        prevItems.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)),
      )
    }
  }

  const handleRemoveFromOrder = (productId: string) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleConfirmOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Empty Order", {
        description: "Please add items to the order before confirming.",
      })
      return
    }

    setIsSubmitting(true)
    const result = await createOrder(orderItems)
    setIsSubmitting(false)

    if (result.success && result.order) {
      toast.success("Order Confirmed!", {
        description: `Order #${result.order.id} has been successfully created.`,
      })
      setOrderItems([]) // Clear for next order
      router.refresh() // Refresh server components to update order list
    } else {
      toast.error("Error", {
        description: "There was a problem confirming the order.",
      })
    }
  }



  // Auto-scroll to bottom when new items are added and keep last item sticky
  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]')
    
    if (!scrollViewport || orderItems.length === 0) return

    // Auto-scroll to bottom when items are added
    const scrollToBottom = () => {
      setIsAutoScrolling(true)
      scrollViewport.scrollTo({
        top: scrollViewport.scrollHeight,
        behavior: 'smooth'
      })
      
      // Clear auto-scroll flag after animation completes
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current)
      }
      autoScrollTimeoutRef.current = setTimeout(() => {
        setIsAutoScrolling(false)
      }, 600) // Longer timeout to ensure smooth scroll completes
    }

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 50)

    // Set up intersection observer to track when items go out of view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Don't update sticky states during auto-scroll to prevent visual conflicts
        if (isAutoScrolling) return
        
        entries.forEach(entry => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          
          // If the last item goes out of view at the bottom, auto-scroll to keep it visible
          if (!entry.isIntersecting && index === orderItems.length - 1) {
            const targetRect = entry.target.getBoundingClientRect()
            const rootRect = scrollViewport.getBoundingClientRect()
            
            // If item went below the visible area, scroll down to keep it at bottom
            if (targetRect.top > rootRect.bottom) {
              setIsAutoScrolling(true)
              entry.target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end',
                inline: 'nearest'
              })
              
              // Set sticky state after scroll completes
              setTimeout(() => {
                setStickyItemIndex(index)
                setIsScrolling(true)
                setIsAutoScrolling(false)
                
                if (scrollTimeoutRef.current) {
                  clearTimeout(scrollTimeoutRef.current)
                }
                
                scrollTimeoutRef.current = setTimeout(() => {
                  setIsScrolling(false)
                }, 200)
              }, 400)
            }
          }
        })
      },
      {
        root: scrollViewport,
        threshold: [0, 1],
        rootMargin: '0px 0px -50px 0px' // Trigger when item is 50px from bottom
      }
    )

    // Observe all items
    itemRefs.current.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref)
      }
    })

    return () => {
      clearTimeout(timeoutId)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current)
      }
    }
  }, [orderItems.length, isAutoScrolling])

  // Track manually scrolled position and highlight bottom-most visible item
  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]')
    
    if (!scrollViewport) return

    const handleManualScroll = () => {
      // Don't update sticky states during auto-scroll to prevent visual conflicts
      if (isAutoScrolling) return
      
      setIsScrolling(true)
      
      // Find which item is at the bottom of the visible area
      const items = itemRefs.current.filter(Boolean)
      let bottomMostIndex = -1
      
      items.forEach((item, index) => {
        if (item) {
          const rect = item.getBoundingClientRect()
          const viewportRect = scrollViewport.getBoundingClientRect()
          
          // Check if item is visible and closest to bottom
          if (rect.bottom <= viewportRect.bottom && rect.top >= viewportRect.top) {
            bottomMostIndex = Math.max(bottomMostIndex, index)
          }
        }
      })
      
      if (bottomMostIndex >= 0) {
        setStickyItemIndex(bottomMostIndex)
      }
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 200)
    }

    scrollViewport.addEventListener('scroll', handleManualScroll, { passive: true })

    return () => {
      scrollViewport.removeEventListener('scroll', handleManualScroll)
    }
  }, [orderItems.length, isAutoScrolling])

  return (
    <div className="grid md:grid-cols-2 gap-8 h-[calc(100vh-5rem)] py-6">
      {/* Products Section */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAddToOrder(product)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Current Order Section */}
      <div className="flex flex-col h-[80vh] bg-muted/40 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Current Order</h2>
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="pr-6">
              {orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p>No items in order.</p>
                  <p className="text-sm">Click on a ticket to add it.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item, index) => {
                    const isSticky = stickyItemIndex === index && isScrolling && !isAutoScrolling
                    
                    return (
                      <div 
                        key={item.product.id} 
                        ref={(el) => {
                          itemRefs.current[index] = el
                        }}
                        data-index={index}
                        className={`
                          flex items-center justify-between p-3 rounded-lg 
                          ${isAutoScrolling 
                            ? 'transition-none' 
                            : 'transition-all duration-200 ease-out'
                          }
                          ${isSticky
                            ? 'bg-accent/50 border-l-4 border-l-primary shadow-lg scale-[1.01]' 
                            : 'hover:bg-accent/20'
                          }
                        `}
                      >
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <MinusCircle className="w-5 h-5" />
                          </Button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <PlusCircle className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleRemoveFromOrder(item.product.id)}
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Sticky bottom item indicator */}
          {stickyItemIndex !== null && isScrolling && !isAutoScrolling && orderItems.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-primary/10 border-t border-primary/20 p-2 text-sm text-muted-foreground text-center rounded-b-lg">
              Viewing item {stickyItemIndex + 1} of {orderItems.length} - {orderItems[stickyItemIndex]?.product.name}
            </div>
          )}
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <Button
            className="w-full text-lg py-6"
            onClick={handleConfirmOrder}
            disabled={isSubmitting || orderItems.length === 0}
          >
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </Button>
        </div>
      </div>
    </div>
  )
}
