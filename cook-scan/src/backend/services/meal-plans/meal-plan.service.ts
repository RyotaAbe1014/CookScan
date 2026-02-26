/**
 * MealPlan Service
 * ビジネスロジック
 */

import * as MealPlanRepository from '@/backend/repositories/meal-plan.repository'
import * as ShoppingItemRepository from '@/backend/repositories/shopping-item.repository'
import type {
  MealPlanOutput,
  MealPlanItemOutput,
  AddMealPlanItemInput,
  RemoveMealPlanItemInput,
  GenerateShoppingListInput,
} from '@/backend/domain/meal-plans'

function toMealPlanItemOutput(item: {
  id: string
  dayOfWeek: number
  recipe: {
    id: string
    title: string
    imageUrl: string | null
    ingredients: Array<{
      id: string
      name: string
      unit: string | null
      notes: string | null
    }>
  }
}): MealPlanItemOutput {
  return {
    id: item.id,
    dayOfWeek: item.dayOfWeek,
    recipe: {
      id: item.recipe.id,
      title: item.recipe.title,
      imageUrl: item.recipe.imageUrl,
      ingredients: item.recipe.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        unit: ing.unit,
        notes: ing.notes,
      })),
    },
  }
}

/**
 * 週の献立プランを取得
 */
export async function getMealPlan(
  userId: string,
  weekStart: string
): Promise<MealPlanOutput | null> {
  const plan = await MealPlanRepository.findMealPlanByWeek(
    userId,
    new Date(weekStart)
  )
  if (!plan) return null

  return {
    id: plan.id,
    weekStart: plan.weekStart,
    items: plan.items.map(toMealPlanItemOutput),
  }
}

/**
 * 献立プランにアイテムを追加
 */
export async function addMealPlanItem(
  userId: string,
  input: AddMealPlanItemInput
): Promise<MealPlanItemOutput> {
  const plan = await MealPlanRepository.upsertMealPlan(
    userId,
    new Date(input.weekStart)
  )

  const item = await MealPlanRepository.createMealPlanItem(
    plan.id,
    input.dayOfWeek,
    input.recipeId
  )

  return toMealPlanItemOutput(item)
}

/**
 * 献立プランからアイテムを削除
 */
export async function removeMealPlanItem(
  userId: string,
  input: RemoveMealPlanItemInput
): Promise<void> {
  const item = await MealPlanRepository.findMealPlanItemById(input.itemId)

  if (!item) {
    throw new Error('アイテムが見つかりません')
  }

  if (item.mealPlan.userId !== userId) {
    throw new Error('このアイテムを削除する権限がありません')
  }

  await MealPlanRepository.deleteMealPlanItem(input.itemId)
}

/**
 * 献立プランから買い物リストを生成
 */
export async function generateShoppingList(
  userId: string,
  input: GenerateShoppingListInput
): Promise<{ count: number }> {
  const plan = await MealPlanRepository.findMealPlanByWeek(
    userId,
    new Date(input.weekStart)
  )

  if (!plan || plan.items.length === 0) {
    throw new Error('献立プランにレシピが登録されていません')
  }

  // 全食材を収集し、名前ベースで重複除去
  const ingredientMap = new Map<string, { name: string; memo?: string }>()
  for (const item of plan.items) {
    for (const ing of item.recipe.ingredients) {
      const key = ing.name.trim().toLowerCase()
      if (!ingredientMap.has(key)) {
        const memo = [ing.unit, ing.notes].filter(Boolean).join(' ')
        ingredientMap.set(key, {
          name: ing.name,
          memo: memo || undefined,
        })
      }
    }
  }

  const ingredients = Array.from(ingredientMap.values())
  const maxOrder = await ShoppingItemRepository.getMaxDisplayOrder(userId)
  const itemsWithOrder = ingredients.map((item, index) => ({
    name: item.name,
    memo: item.memo,
    displayOrder: maxOrder + 1 + index,
  }))

  const created = await ShoppingItemRepository.createShoppingItems(
    userId,
    itemsWithOrder
  )
  return { count: created.length }
}
