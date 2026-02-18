import { checkUserProfile } from '@/features/auth/auth-utils'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { BackToDashboardLink } from '@/components/navigation/back-to-dashboard-link'
import {
  getRecipesWithFilters,
  getTagCategoriesForUser,
} from '@/features/recipes/list/actions'
import { isSuccess } from '@/utils/result'
import { parseRecipeSearchParams } from '@/features/recipes/list/utils'
import { RecipeListContent } from '@/features/recipes/list/recipe-list-content'

type SearchParams = Promise<{ tag?: string | string[]; q?: string }>

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { profile } = await checkUserProfile()
  const params = await searchParams

  if (!profile) {
    return null
  }

  // Parse search params
  const { tagIds: selectedTagIds, searchQuery } = parseRecipeSearchParams(params)

  // Fetch recipes and tag categories in parallel
  const [recipesResult, tagCategoriesResult] = await Promise.all([
    getRecipesWithFilters(searchQuery, selectedTagIds),
    getTagCategoriesForUser(),
  ])

  const recipes = isSuccess(recipesResult) ? recipesResult.data : []
  const tagCategories = isSuccess(tagCategoriesResult) ? tagCategoriesResult.data : []

  return (
    <AuthLayoutWrapper
      title="マイレシピ"
      subtitle="保存済みのレシピ一覧"
      rightAction={<BackToDashboardLink />}
    >
      <PageContainer>
        <RecipeListContent
          recipes={recipes}
          tagCategories={tagCategories}
          selectedTagIds={selectedTagIds}
          searchQuery={searchQuery}
        />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
