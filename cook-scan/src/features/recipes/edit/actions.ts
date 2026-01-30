'use server'

import { revalidatePath } from 'next/cache'
import { UpdateRecipeRequest } from '@/features/recipes/edit/types'
import * as RecipeService from '@/backend/services/recipes'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

export async function updateRecipe(
  request: UpdateRecipeRequest
): Promise<Result<{ recipeId: string }>> {
  return withAuth(async (profile) => {
    try {
      const result = await RecipeService.updateRecipe(profile.id, request)

      // Revalidate recipe list and detail pages
      revalidatePath('/recipes')
      revalidatePath(`/recipes/${request.recipeId}`)

      return success(result)
    } catch (error) {
      console.error('Failed to update recipe:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('レシピ'))
        }
        return failure(Errors.validation(error.message))
      }
      return failure(Errors.server('レシピの更新に失敗しました'))
    }
  })
}
