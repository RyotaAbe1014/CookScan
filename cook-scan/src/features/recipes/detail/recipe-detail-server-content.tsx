import { notFound } from 'next/navigation'
import { getRecipeById } from './actions'
import { RecipeDetailContent } from './recipe-detail-content'

type RecipeDetailServerContentProps = {
  recipeId: string
}

export async function RecipeDetailServerContent({ recipeId }: RecipeDetailServerContentProps) {
  const { recipe, error } = await getRecipeById(recipeId)

  if (error || !recipe) {
    notFound()
  }

  return <RecipeDetailContent recipe={recipe} />
}
