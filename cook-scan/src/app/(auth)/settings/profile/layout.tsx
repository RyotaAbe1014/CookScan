import { ReactNode } from 'react'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon'

type ProfileEditLayoutProps = {
  children: ReactNode
}

export default function ProfileEditLayout({ children }: ProfileEditLayoutProps) {
  return (
    <AuthLayoutWrapper
      title="プロフィール"
      rightAction={
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          ダッシュボードに戻る
        </Link>
      }
    >
      <PageContainer>{children}</PageContainer>
    </AuthLayoutWrapper>
  )
}
