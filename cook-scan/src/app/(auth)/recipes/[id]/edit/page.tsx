import { getRecipeById } from '@/features/recipes/detail/actions'
import RecipeEditForm from '@/features/recipes/edit/recipe-edit-form'
import { notFound } from 'next/navigation'

type RecipeEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = await params
  const { recipe, error } = await getRecipeById(id)

  if (error || !recipe) {
    notFound()
  }

  return <RecipeEditForm recipe={recipe} />
}