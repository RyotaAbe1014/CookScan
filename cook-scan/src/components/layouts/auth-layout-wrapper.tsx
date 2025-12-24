import { ReactNode } from 'react'
import { Header } from '@/components/header'

type AuthLayoutWrapperProps = {
  children: ReactNode
  title: string
  subtitle?: string
  rightAction?: ReactNode
  id?: string
}

export function AuthLayoutWrapper({ children, title, subtitle, rightAction, id }: AuthLayoutWrapperProps) {
  return (
    <div id={id} className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <Header title={title} subtitle={subtitle} rightAction={rightAction} />
      {children}
    </div>
  )
}
