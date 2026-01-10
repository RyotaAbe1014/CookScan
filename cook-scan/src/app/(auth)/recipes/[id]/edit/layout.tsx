import { ReactNode } from 'react'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons'

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
          <ChevronLeftIcon className="h-4 w-4" />
          詳細画面に戻る
        </Link>
      }
    >
      <PageContainer>{children}</PageContainer>
    </AuthLayoutWrapper>
  )
}
