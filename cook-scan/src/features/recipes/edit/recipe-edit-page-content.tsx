import { getRecipeById } from '@/features/recipes/detail/actions'
import RecipeEditForm from '@/features/recipes/edit/recipe-edit-form'
import { getAllTagsForRecipe } from '@/features/tags/actions'
import { isSuccess } from '@/utils/result'
import { notFound } from 'next/navigation'

export async function RecipeEditPageContent({ recipeId }: { recipeId: string }) {
  const [recipeResult, tagsResult] = await Promise.all([
    getRecipeById(recipeId),
    getAllTagsForRecipe(),
  ])

  if (!isSuccess(recipeResult)) {
    notFound()
  }

  const tagCategories = isSuccess(tagsResult) ? tagsResult.data : []

  return <RecipeEditForm recipe={recipeResult.data} tagCategories={tagCategories} />
}
