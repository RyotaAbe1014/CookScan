import { notFound } from 'next/navigation'
import { getRecipeById } from './actions'
import { getShareInfo } from '@/features/recipes/share/actions'
import { RecipeDetailContent } from './recipe-detail-content'
import { isSuccess } from '@/utils/result'

type RecipeDetailServerContentProps = {
  recipeId: string
}

export async function RecipeDetailServerContent({ recipeId }: RecipeDetailServerContentProps) {
  const [recipeResult, shareResult] = await Promise.all([
    getRecipeById(recipeId),
    getShareInfo(recipeId),
  ])

  if (!isSuccess(recipeResult)) {
    notFound()
  }

  const initialShareInfo = isSuccess(shareResult) && shareResult.data && shareResult.data.isActive
    ? { shareToken: shareResult.data.shareToken, isActive: true }
    : null

  return <RecipeDetailContent recipe={recipeResult.data} initialShareInfo={initialShareInfo} />
}
