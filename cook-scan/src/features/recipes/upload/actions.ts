'use server'

import { revalidatePath } from 'next/cache'
import { CreateRecipeRequest } from '@/features/recipes/upload/types'
import * as RecipeService from '@/backend/services/recipes'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

export async function createRecipe(
  request: CreateRecipeRequest
): Promise<Result<{ recipeId: string }>> {
  return withAuth(async (profile) => {
    try {
      const result = await RecipeService.createRecipe(profile.id, request)

      // Revalidate recipe list and detail pages
      revalidatePath('/recipes')
      revalidatePath(`/recipes/${result.recipeId}`)

      return success(result)
    } catch (error) {
      console.error('Failed to create recipe:', error)
      if (error instanceof Error) {
        return failure(Errors.validation(error.message))
      }
      return failure(Errors.server('レシピの作成に失敗しました'))
    }
  })
}
