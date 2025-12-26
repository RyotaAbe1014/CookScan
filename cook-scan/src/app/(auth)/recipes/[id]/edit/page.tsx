import { getRecipeById } from '@/features/recipes/detail/actions'
import RecipeEditForm from '@/features/recipes/edit/recipe-edit-form'

type RecipeEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = await params
  const { recipe, error } = await getRecipeById(id)

  if (error || !recipe) {
    // layout.tsxでnotFound()が呼ばれるため、ここでは何もしない
    return null
  }

  return <RecipeEditForm recipe={recipe} />
}