import { ReactNode } from 'react'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import Link from 'next/link'

type RecipeEditLayoutProps = {
  children: ReactNode
  params: Promise<{ id: string }>
}

export default async function RecipeEditLayout({ children, params }: RecipeEditLayoutProps) {
  const { id } = await params

  return (
    <AuthLayoutWrapper
      title="レシピを編集"
      rightAction={
        <Link
          href={`/recipes/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          詳細画面に戻る
        </Link>
      }
    >
      <PageContainer>{children}</PageContainer>
    </AuthLayoutWrapper>
  )
}
