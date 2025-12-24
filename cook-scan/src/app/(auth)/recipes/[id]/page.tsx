import { notFound } from 'next/navigation'
import { getRecipeById } from '@/features/recipes/detail/actions'
import { RecipeDetailActions } from '@/features/recipes/detail/recipe-detail-actions'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { BackToRecipesLink } from '@/components/navigation/back-to-recipes-link'
import { RecipeDetailContent } from '@/features/recipes/detail/recipe-detail-content'

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params
  const { recipe, error } = await getRecipeById(id)

  if (error || !recipe) {
    notFound()
  }

  return (
    <AuthLayoutWrapper
      id="recipe-detail-capture"
      title={recipe.title}
      subtitle={`作成日: ${recipe.createdAt.toLocaleDateString('ja-JP')}`}
      rightAction={
        <>
          <RecipeDetailActions recipe={recipe} />
          <BackToRecipesLink />
        </>
      }
    >
      <PageContainer>
        <RecipeDetailContent recipe={recipe} />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
