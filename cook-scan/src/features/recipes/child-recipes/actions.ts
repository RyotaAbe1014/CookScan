'use server'

import * as RecipeRelationRepository from '@/backend/repositories/recipe-relation.repository'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

type AvailableRecipe = {
  id: string
  title: string
  imageUrl: string | null
}

export async function searchAvailableRecipes(
  parentRecipeId: string | undefined,
  existingChildRecipeIds: string[],
  searchQuery?: string
): Promise<Result<AvailableRecipe[]>> {
  return withAuth(async (profile) => {
    try {
      const excludeIds = [...existingChildRecipeIds]
      if (parentRecipeId) {
        excludeIds.push(parentRecipeId)
      }

      const recipes = await RecipeRelationRepository.findAvailableChildRecipes(
        profile.id,
        excludeIds,
        searchQuery
      )

      return success(recipes)
    } catch (error) {
      console.error('Failed to search available recipes:', error)
      return failure(Errors.server('レシピの検索に失敗しました'))
    }
  })
}
