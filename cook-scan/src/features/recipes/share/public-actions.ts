'use server'

import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import * as RecipeShareService from '@/backend/services/recipes/recipe-share.service'
import type { SharedRecipeOutput } from '@/backend/domain/recipes'

/**
 * 共有トークンからレシピを取得（認証不要）
 */
export async function getSharedRecipe(token: string): Promise<Result<SharedRecipeOutput>> {
  const recipe = await RecipeShareService.getSharedRecipe(token)
  if (!recipe) return failure(Errors.notFound('レシピ'))
  return success(recipe)
}
