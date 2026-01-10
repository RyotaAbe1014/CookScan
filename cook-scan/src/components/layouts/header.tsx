import { ReactNode } from 'react'
import { BookIcon, InfoCircleIcon } from '@/components/icons'

type HeaderProps = {
  title: string
  subtitle?: string
  rightAction?: ReactNode
}

export function Header({ title, subtitle, rightAction }: HeaderProps) {
  return (
    <header className="relative overflow-hidden bg-white shadow-md">
      {/* Gradient decoration */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Logo/Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <BookIcon className="h-6 w-6 text-white" />
            </div>

            {/* Title and subtitle */}
            <div>
              <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                  <InfoCircleIcon className="h-4 w-4 text-indigo-500" />
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {rightAction && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {rightAction}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
