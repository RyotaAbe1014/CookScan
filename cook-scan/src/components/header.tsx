import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  rightAction?: ReactNode
}

export function Header({ title, subtitle, rightAction }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {rightAction && (
            <div className="flex items-center space-x-4">
              {rightAction}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

