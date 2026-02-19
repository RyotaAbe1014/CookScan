'use server'

import { buildTagFilters } from './utils'
import * as RecipeService from '@/backend/services/recipes'
import * as TagService from '@/backend/services/tags'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'
import type { RecipeListOutput } from '@/backend/domain/recipes'
import type { TagsForRecipeOutput } from '@/backend/domain/tags'

/**
 * フィルタ条件に基づいてレシピを取得
 */
export async function getRecipesWithFilters(
  searchQuery: string,
  tagIds: string[]
): Promise<Result<RecipeListOutput[]>> {
  return withAuth(async (profile) => {
    const tagFilters = buildTagFilters(tagIds)

    try {
      const recipes = await RecipeService.getRecipes(profile.id, searchQuery, tagFilters)
      return success(recipes)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
      return failure(Errors.server('レシピの取得に失敗しました'))
    }
  })
}

/**
 * ユーザー用のタグカテゴリを取得
 */
export async function getTagCategoriesForUser(): Promise<Result<TagsForRecipeOutput>> {
  return withAuth(async (profile) => {
    try {
      const tagCategories = await TagService.getAllTagsForRecipe(profile.id)
      return success(tagCategories)
    } catch (error) {
      console.error('Failed to fetch tag categories:', error)
      return failure(Errors.server('タグカテゴリの取得に失敗しました'))
    }
  })
}
