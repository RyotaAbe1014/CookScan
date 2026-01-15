import { notFound } from 'next/navigation'
import { getRecipeById } from './actions'
import { RecipeDetailContent } from './recipe-detail-content'
import { isSuccess } from '@/utils/result'

type RecipeDetailServerContentProps = {
  recipeId: string
}

export async function RecipeDetailServerContent({ recipeId }: RecipeDetailServerContentProps) {
  const result = await getRecipeById(recipeId)

  if (!isSuccess(result)) {
    notFound()
  }

  return <RecipeDetailContent recipe={result.data} />
}
