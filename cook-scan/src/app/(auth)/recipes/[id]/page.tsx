import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { BackToRecipesLink } from '@/components/navigation/back-to-recipes-link'
import { RecipeDetailServerContent } from '@/features/recipes/detail/recipe-detail-server-content'

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params

  return (
    <AuthLayoutWrapper title="レシピ詳細" rightAction={<BackToRecipesLink />} showTimerBanner={false}>
      <PageContainer>
        <RecipeDetailServerContent recipeId={id} />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
