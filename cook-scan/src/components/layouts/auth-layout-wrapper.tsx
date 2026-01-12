import { ReactNode } from 'react'
import { Header } from '@/components/layouts/header'

type AuthLayoutWrapperProps = {
  children: ReactNode
  title: string
  subtitle?: string
  rightAction?: ReactNode
  id?: string
}

export function AuthLayoutWrapper({ children, title, subtitle, rightAction, id }: AuthLayoutWrapperProps) {
  return (
    <div id={id} className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50/50">
      <Header title={title} subtitle={subtitle} rightAction={rightAction} />
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  )
}
