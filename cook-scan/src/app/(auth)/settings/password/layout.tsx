import { ReactNode } from 'react'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon'

type PasswordChangeLayoutProps = {
  children: ReactNode
}

export default function PasswordChangeLayout({
  children,
}: PasswordChangeLayoutProps) {
  return (
    <AuthLayoutWrapper
      title="パスワード変更"
      subtitle="セキュリティのため、現在のパスワードの入力が必要です"
      rightAction={
        <Link
          href="/settings/profile"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          プロフィールに戻る
        </Link>
      }
    >
      <PageContainer>{children}</PageContainer>
    </AuthLayoutWrapper>
  )
}
