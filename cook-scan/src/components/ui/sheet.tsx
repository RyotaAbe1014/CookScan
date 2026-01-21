import React, { useEffect } from 'react'
import { cn } from '@/lib/tailwind'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Sheet({ isOpen, onClose, children, className }: SheetProps) {
  // background scrolling disabled
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escキーで閉じる処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end transition-all duration-300",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
        aria-label="Overlay"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-50 h-full w-3/4 max-w-sm bg-white shadow-xl transition-transform duration-300 dark:bg-gray-900",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
