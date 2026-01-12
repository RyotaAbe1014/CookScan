import { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 ${className}`}>
      {children}
    </main>
  )
}
