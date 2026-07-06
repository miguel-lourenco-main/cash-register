"use client"

import { useEffect, type ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { springs } from "@/lib/motion"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** id of the element inside `children` that titles the dialog (a11y). */
  labelledBy?: string
}

/**
 * Centered modal dialog: a dimmed backdrop plus a scale/fade panel that meets
 * the user wherever they are on the page (unlike a top-pinned inline form).
 * Closes on Escape or backdrop click; locks body scroll while open.
 */
export function Modal({ open, onClose, children, labelledBy }: ModalProps) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-root"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto no-scrollbar p-4 sm:p-6 md:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="fixed inset-0 bg-festa-ink/50 backdrop-blur-sm cursor-default"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="relative z-10 w-full max-w-2xl my-auto"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={springs.snappy}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
