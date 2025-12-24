import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRecipeById } from '@/features/recipes/detail/actions'
import RecipeEditForm from '@/features/recipes/edit/recipe-edit-form'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'

type RecipeEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = await params
  const { recipe, error } = await getRecipeById(id)

  if (error || !recipe) {
    notFound()
  }

  return (
    <AuthLayoutWrapper
      title="レシピを編集"
      subtitle={recipe.title}
      rightAction={
        <Link
          href={`/recipes/${recipe.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          詳細画面に戻る
        </Link>
      }
    >
      <PageContainer>
        <RecipeEditForm recipe={recipe} />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}