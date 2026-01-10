import { getRecipeById } from '@/features/recipes/detail/actions'
import RecipeEditForm from '@/features/recipes/edit/recipe-edit-form'
import { getAllTagsForRecipe } from '@/features/tags/actions'
import { notFound } from 'next/navigation'

type RecipeEditPageContentProps = {
  recipeId: string
}

export async function RecipeEditPageContent({ recipeId }: RecipeEditPageContentProps) {
  const [{ recipe, error }, tagCategories] = await Promise.all([
    getRecipeById(recipeId),
    getAllTagsForRecipe()
  ])

  if (error || !recipe) {
    notFound()
  }

  return <RecipeEditForm recipe={recipe} tagCategories={tagCategories} />
}
