import { RecipeEditPageContent } from '@/features/recipes/edit/recipe-edit-page-content'

type RecipeEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = await params
  return <RecipeEditPageContent recipeId={id} />
}