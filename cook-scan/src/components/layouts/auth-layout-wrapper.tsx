import { ReactNode } from 'react'
import { Header } from '@/components/layouts/header'
import { ActiveTimerBanner } from '@/features/recipes/list/active-timer-banner'

type AuthLayoutWrapperProps = {
  children: ReactNode
  title: string
  subtitle?: string
  rightAction?: ReactNode
  id?: string
  showTimerBanner?: boolean
}

export function AuthLayoutWrapper({ children, title, subtitle, rightAction, id, showTimerBanner = true }: AuthLayoutWrapperProps) {
  return (
    <div id={id} className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50/50">
      <Header title={title} subtitle={subtitle} rightAction={rightAction} />
      <div className="mx-auto max-w-7xl">
        {showTimerBanner && <ActiveTimerBanner />}
        {children}
      </div>
    </div>
  )
}
