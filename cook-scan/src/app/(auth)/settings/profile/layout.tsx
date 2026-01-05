import { ReactNode } from 'react'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import Link from 'next/link'

type ProfileEditLayoutProps = {
  children: ReactNode
}

export default function ProfileEditLayout({ children }: ProfileEditLayoutProps) {
  return (
    <AuthLayoutWrapper
      title="プロフィール編集"
      rightAction={
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ダッシュボードに戻る
        </Link>
      }
    >
      <PageContainer>{children}</PageContainer>
    </AuthLayoutWrapper>
  )
}
