'use server'

import { revalidatePath } from 'next/cache'
import * as MealPlanService from '@/backend/services/meal-plans'
import * as RecipeService from '@/backend/services/recipes'
import type { MealPlanOutput, MealPlanItemOutput } from '@/backend/domain/meal-plans'
import type { RecipeListOutput } from '@/backend/domain/recipes'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

/**
 * 週の献立プランを取得
 */
export async function getMealPlan(
  weekStart: string
): Promise<Result<MealPlanOutput | null>> {
  return withAuth(async (profile) => {
    try {
      const plan = await MealPlanService.getMealPlan(profile.id, weekStart)
      return success(plan)
    } catch (error) {
      console.error('Failed to fetch meal plan:', error)
      return failure(Errors.server('献立プランの取得に失敗しました'))
    }
  })
}

/**
 * 献立プランにアイテムを追加
 */
export async function addMealPlanItem(
  weekStart: string,
  dayOfWeek: number,
  recipeId: string
): Promise<Result<MealPlanItemOutput>> {
  return withAuth(async (profile) => {
    if (dayOfWeek < 0 || dayOfWeek > 6 || !Number.isInteger(dayOfWeek)) {
      return failure(Errors.validation('曜日の値が不正です'))
    }

    try {
      const item = await MealPlanService.addMealPlanItem(profile.id, {
        weekStart,
        dayOfWeek,
        recipeId,
      })

      revalidatePath('/meal-planner')
      return success(item)
    } catch (error) {
      console.error('Failed to add meal plan item:', error)
      return failure(Errors.server('レシピの追加に失敗しました'))
    }
  })
}

/**
 * 献立プランからアイテムを削除
 */
export async function removeMealPlanItem(itemId: string): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      await MealPlanService.removeMealPlanItem(profile.id, { itemId })

      revalidatePath('/meal-planner')
      return success(undefined)
    } catch (error) {
      console.error('Failed to remove meal plan item:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('アイテム'))
        }
        if (error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
      return failure(Errors.server('レシピの削除に失敗しました'))
    }
  })
}

/**
 * 献立プランから買い物リストを生成
 */
export async function generateShoppingList(
  weekStart: string
): Promise<Result<{ count: number }>> {
  return withAuth(async (profile) => {
    try {
      const result = await MealPlanService.generateShoppingList(profile.id, {
        weekStart,
      })

      revalidatePath('/shopping-list')
      revalidatePath('/meal-planner')
      return success(result)
    } catch (error) {
      console.error('Failed to generate shopping list:', error)
      if (error instanceof Error && error.message.includes('登録されていません')) {
        return failure(Errors.validation(error.message))
      }
      return failure(Errors.server('買い物リストの生成に失敗しました'))
    }
  })
}

/**
 * ユーザーのレシピ一覧を取得
 */
export async function getRecipesForMealPlan(): Promise<Result<RecipeListOutput[]>> {
  return withAuth(async (profile) => {
    try {
      const recipes = await RecipeService.getRecipes(profile.id, '', undefined)
      return success(recipes)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
      return failure(Errors.server('レシピの取得に失敗しました'))
    }
  })
}
