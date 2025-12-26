import { ReactNode } from 'react'
import LogoutButton from '@/features/auth/logout-button'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthLayoutWrapper title="ダッシュボード" rightAction={<LogoutButton />}>
      {children}
    </AuthLayoutWrapper>
  )
}
