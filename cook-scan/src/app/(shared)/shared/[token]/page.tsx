import { notFound } from 'next/navigation'
import { getSharedRecipe } from '@/features/recipes/share/public-actions'
import { isSuccess } from '@/utils/result'
import { SharedRecipeContent } from '@/features/recipes/share/shared-recipe-content'

type Props = {
  params: Promise<{ token: string }>
}

export default async function SharedRecipePage({ params }: Props) {
  const { token } = await params
  const result = await getSharedRecipe(token)

  if (!isSuccess(result)) {
    notFound()
  }

  return <SharedRecipeContent recipe={result.data} />
}
