'use server'

import * as RecipeService from '@/backend/services/recipes'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'
import type { RecipeDetailOutput } from '@/backend/domain/recipes'

// 後方互換性のためのエイリアス
export type RecipeWithRelations = RecipeDetailOutput

export async function getRecipeById(recipeId: string): Promise<Result<RecipeDetailOutput>> {
  return withAuth(async (profile) => {
    try {
      const recipe = await RecipeService.getRecipeById(recipeId, profile.id)

      if (!recipe) {
        return failure(Errors.notFound('レシピ'))
      }

      return success(recipe)
    } catch (error) {
      console.error('Failed to fetch recipe:', error)
      return failure(Errors.server('レシピの取得に失敗しました'))
    }
  })
}
