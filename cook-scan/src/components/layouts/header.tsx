'use client'

import { ReactNode, useState } from 'react'
import { BookIcon } from '@/components/icons/book-icon'
import { InfoCircleIcon } from '@/components/icons/info-circle-icon'
import { MenuIcon } from '@/components/icons/menu-icon'
import { Sheet } from '@/components/ui/sheet'
import { MobileNav } from '@/components/layouts/mobile-nav'
import { logout } from '@/features/auth/actions'

type HeaderProps = {
  title: string
  subtitle?: string
  rightAction?: ReactNode
}

export function Header({ title, subtitle, rightAction }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-white shadow-sm">
      {/* Subtle gradient decoration - デザインシステムに従い控えめに */}
      <div className="absolute inset-0 bg-linear-to-r from-emerald-50/40 via-white to-teal-50/40" />

      {/* Accent border - Primary color */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logo/Icon - Primary color with shadow */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/20 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/30">
              <BookIcon className="h-6 w-6 text-white" />
            </div>

            {/* Title and subtitle */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <InfoCircleIcon className="h-4 w-4 text-emerald-500" />
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 sm:hidden"
            aria-label="メニューを開く"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {rightAction && (
            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-4">
              {rightAction}
            </div>
          )}
        </div>
      </div>

      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MobileNav
          onUiLinkClick={() => setIsOpen(false)}
          onLogoutClick={handleLogout}
        />
      </Sheet>
    </header>
  )
}
