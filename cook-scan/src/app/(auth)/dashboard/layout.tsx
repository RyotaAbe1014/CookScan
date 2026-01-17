import { ReactNode } from 'react'
import Link from 'next/link'
import LogoutButton from '@/features/auth/logout-button'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { UserIcon } from '@/components/icons/user-icon'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthLayoutWrapper
      title="ダッシュボード"
      rightAction={
        <>
          <Link
            href="/settings/profile"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900"
          >
            <UserIcon className="h-4 w-4" />
            プロフィール
          </Link>
          <LogoutButton />
        </>
      }
    >
      {children}
    </AuthLayoutWrapper>
  )
}
