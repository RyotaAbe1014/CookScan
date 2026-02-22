'use client'

import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/tailwind'

const Dialog = DialogPrimitive.Root

function DialogContent({
  children,
  className,
  maxWidth = 'max-w-lg',
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  maxWidth?: string
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="flex min-h-screen items-center justify-center p-4">
          <DialogPrimitive.Content
            className={cn(
              'relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10',
              maxWidth,
              className,
            )}
            {...props}
          >
            {children}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-b border-gray-200 px-6 py-5', className)}>
      {children}
    </div>
  )
}

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-xl font-bold text-gray-900', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('mt-1 text-sm text-gray-600', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-3 border-t border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4', className)}>
      {children}
    </div>
  )
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
