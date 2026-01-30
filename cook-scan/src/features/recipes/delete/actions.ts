'use server'

import { revalidatePath } from 'next/cache'
import * as RecipeService from '@/backend/services/recipes'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

export async function deleteRecipe(recipeId: string): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      await RecipeService.deleteRecipe(profile.id, recipeId)

      // Revalidate recipe list and detail pages
      revalidatePath('/recipes')
      revalidatePath(`/recipes/${recipeId}`)

      return success(undefined)
    } catch (error) {
      console.error('Failed to delete recipe:', error)
      if (error instanceof Error && error.message.includes('見つかりません')) {
        return failure(Errors.notFound('レシピ'))
      }
      return failure(Errors.server('レシピの削除に失敗しました'))
    }
  })
}
