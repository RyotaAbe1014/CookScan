import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/backend/repositories/meal-plan.repository', () => ({
  findMealPlanByWeek: vi.fn(),
  upsertMealPlan: vi.fn(),
  createMealPlanItem: vi.fn(),
  findMealPlanItemById: vi.fn(),
  deleteMealPlanItem: vi.fn(),
}))

vi.mock('@/backend/repositories/recipe.repository', () => ({
  checkRecipeOwnership: vi.fn(),
}))

vi.mock('@/backend/repositories/shopping-item.repository', () => ({
  findShoppingItemsByUser: vi.fn(),
  getMaxDisplayOrder: vi.fn(),
  createShoppingItems: vi.fn(),
}))

import * as MealPlanRepository from '@/backend/repositories/meal-plan.repository'
import * as RecipeRepository from '@/backend/repositories/recipe.repository'
import * as ShoppingItemRepository from '@/backend/repositories/shopping-item.repository'
import {
  getMealPlan,
  addMealPlanItem,
  removeMealPlanItem,
  generateShoppingList,
} from '../meal-plan.service'

type MealPlanWithItems = NonNullable<
  Awaited<ReturnType<typeof MealPlanRepository.findMealPlanByWeek>>
>
type UpsertedMealPlan = Awaited<ReturnType<typeof MealPlanRepository.upsertMealPlan>>
type MealPlanItemWithRecipe = Awaited<ReturnType<typeof MealPlanRepository.createMealPlanItem>>
type MealPlanItemWithMealPlan = NonNullable<
  Awaited<ReturnType<typeof MealPlanRepository.findMealPlanItemById>>
>
type MealPlanRecord = MealPlanItemWithMealPlan['mealPlan']
type MealPlanIngredient = MealPlanItemWithRecipe['recipe']['ingredients'][number]
type ShoppingItemRecord = Awaited<
  ReturnType<typeof ShoppingItemRepository.findShoppingItemsByUser>
>[number]

const BASE_DATE = new Date(2026, 2, 2)
const BASE_UPDATED_AT = new Date(2026, 2, 3)

function createIngredient(
  overrides: Partial<MealPlanIngredient> & Pick<MealPlanIngredient, 'name'>
): MealPlanIngredient {
  return {
    id: overrides.id ?? 'ing-1',
    recipeId: overrides.recipeId ?? 'recipe-1',
    name: overrides.name,
    unit: overrides.unit ?? null,
    notes: overrides.notes ?? null,
    createdAt: overrides.createdAt ?? BASE_DATE,
    updatedAt: overrides.updatedAt ?? BASE_UPDATED_AT,
  }
}

function createRecipe(
  overrides: Partial<MealPlanItemWithRecipe['recipe']> = {}
): MealPlanItemWithRecipe['recipe'] {
  const recipeId = overrides.id ?? 'recipe-1'

  return {
    id: recipeId,
    userId: overrides.userId ?? 'user-1',
    title: overrides.title ?? 'テストレシピ',
    imageUrl: overrides.imageUrl ?? null,
    memo: overrides.memo ?? null,
    createdAt: overrides.createdAt ?? BASE_DATE,
    updatedAt: overrides.updatedAt ?? BASE_UPDATED_AT,
    ingredients: overrides.ingredients ?? [
      createIngredient({
        id: 'ing-1',
        recipeId,
        name: '卵',
        unit: '2個',
        notes: null,
      }),
    ],
  }
}

function createMealPlanItem(
  overrides: Partial<MealPlanItemWithRecipe> = {}
): MealPlanItemWithRecipe {
  const mealPlanId = overrides.mealPlanId ?? 'plan-1'
  const recipeId = overrides.recipeId ?? overrides.recipe?.id ?? 'recipe-1'

  return {
    id: overrides.id ?? 'item-1',
    mealPlanId,
    recipeId,
    dayOfWeek: overrides.dayOfWeek ?? 0,
    createdAt: overrides.createdAt ?? BASE_DATE,
    recipe: overrides.recipe ?? createRecipe({ id: recipeId }),
  }
}

function createMealPlan(
  overrides: Partial<MealPlanWithItems> = {}
): MealPlanWithItems {
  const planId = overrides.id ?? 'plan-1'

  return {
    id: planId,
    userId: overrides.userId ?? 'user-1',
    weekStart: overrides.weekStart ?? BASE_DATE,
    createdAt: overrides.createdAt ?? BASE_DATE,
    updatedAt: overrides.updatedAt ?? BASE_UPDATED_AT,
    items: overrides.items ?? [createMealPlanItem({ mealPlanId: planId })],
  }
}

function createUpsertedMealPlan(
  overrides: Partial<UpsertedMealPlan> = {}
): UpsertedMealPlan {
  const planId = overrides.id ?? 'plan-1'

  return {
    id: planId,
    userId: overrides.userId ?? 'user-1',
    weekStart: overrides.weekStart ?? BASE_DATE,
    createdAt: overrides.createdAt ?? BASE_DATE,
    updatedAt: overrides.updatedAt ?? BASE_UPDATED_AT,
    items: overrides.items ?? [],
  }
}

function createMealPlanRecord(
  overrides: Partial<MealPlanRecord> = {}
): MealPlanRecord {
  return {
    id: overrides.id ?? 'plan-1',
    userId: overrides.userId ?? 'user-1',
    weekStart: overrides.weekStart ?? BASE_DATE,
    createdAt: overrides.createdAt ?? BASE_DATE,
    updatedAt: overrides.updatedAt ?? BASE_UPDATED_AT,
  }
}

function createMealPlanItemLookup(
  overrides: Partial<MealPlanItemWithMealPlan> = {}
): MealPlanItemWithMealPlan {
  const mealPlanId = overrides.mealPlanId ?? 'plan-1'

  return {
    id: overrides.id ?? 'item-1',
    mealPlanId,
    recipeId: overrides.recipeId ?? 'recipe-1',
    dayOfWeek: overrides.dayOfWeek ?? 0,
    createdAt: overrides.createdAt ?? BASE_DATE,
    mealPlan: overrides.mealPlan ?? createMealPlanRecord({ id: mealPlanId }),
  }
}

function createShoppingItemRecord(
  overrides: Partial<ShoppingItemRecord> & Pick<ShoppingItemRecord, 'name'>
): ShoppingItemRecord {
  return {
    id: overrides.id ?? 'shopping-1',
    userId: overrides.userId ?? 'user-1',
    name: overrides.name,
    memo: overrides.memo ?? null,
    isChecked: overrides.isChecked ?? false,
    displayOrder: overrides.displayOrder ?? 0,
    createdAt: overrides.createdAt ?? BASE_DATE,
    updatedAt: overrides.updatedAt ?? BASE_UPDATED_AT,
  }
}

describe('meal-plan.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ===== getMealPlan =====

  describe('getMealPlan', () => {
    it('正常系: 週の献立プランを取得できる', async () => {
      const mockPlan = createMealPlan({
        weekStart: new Date(2026, 2, 2),
        items: [createMealPlanItem()],
      })
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(mockPlan)

      const result = await getMealPlan('user-1', '2026-03-02')

      expect(result).toEqual({
        id: 'plan-1',
        weekStart: new Date(2026, 2, 2),
        items: [{
          id: 'item-1',
          dayOfWeek: 0,
          recipe: {
            id: 'recipe-1',
            title: 'テストレシピ',
            imageUrl: null,
            ingredients: [{ id: 'ing-1', name: '卵', unit: '2個', notes: null }],
          },
        }],
      })
      expect(MealPlanRepository.findMealPlanByWeek).toHaveBeenCalledWith(
        'user-1',
        new Date(2026, 2, 2)
      )
    })

    it('正常系: 献立プランが存在しない場合はnullを返す', async () => {
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(null)

      const result = await getMealPlan('user-1', '2026-03-02')

      expect(result).toBeNull()
    })
  })

  // ===== addMealPlanItem =====

  describe('addMealPlanItem', () => {
    it('正常系: 献立プランにアイテムを追加できる', async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true)
      vi.mocked(MealPlanRepository.upsertMealPlan).mockResolvedValueOnce(
        createUpsertedMealPlan({ id: 'plan-1' })
      )
      vi.mocked(MealPlanRepository.createMealPlanItem).mockResolvedValueOnce(
        createMealPlanItem()
      )

      const result = await addMealPlanItem('user-1', {
        weekStart: '2026-03-02',
        dayOfWeek: 0,
        recipeId: 'recipe-1',
      })

      expect(result).toEqual({
        id: 'item-1',
        dayOfWeek: 0,
        recipe: {
          id: 'recipe-1',
          title: 'テストレシピ',
          imageUrl: null,
          ingredients: [{ id: 'ing-1', name: '卵', unit: '2個', notes: null }],
        },
      })
      expect(RecipeRepository.checkRecipeOwnership).toHaveBeenCalledWith('recipe-1', 'user-1')
      expect(MealPlanRepository.upsertMealPlan).toHaveBeenCalledWith('user-1', new Date(2026, 2, 2))
      expect(MealPlanRepository.createMealPlanItem).toHaveBeenCalledWith('plan-1', 0, 'recipe-1')
    })

    it('エラー: レシピの所有権がない場合はエラーを投げる', async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(false)

      await expect(
        addMealPlanItem('user-1', {
          weekStart: '2026-03-02',
          dayOfWeek: 0,
          recipeId: 'recipe-1',
        })
      ).rejects.toThrow('このレシピを追加する権限がありません')

      expect(MealPlanRepository.upsertMealPlan).not.toHaveBeenCalled()
    })
  })

  // ===== removeMealPlanItem =====

  describe('removeMealPlanItem', () => {
    it('正常系: 献立プランからアイテムを削除できる', async () => {
      vi.mocked(MealPlanRepository.findMealPlanItemById).mockResolvedValueOnce(
        createMealPlanItemLookup({
          mealPlan: createMealPlanRecord({ userId: 'user-1' }),
        })
      )

      await removeMealPlanItem('user-1', { itemId: 'item-1' })

      expect(MealPlanRepository.deleteMealPlanItem).toHaveBeenCalledWith('item-1')
    })

    it('エラー: アイテムが見つからない場合はエラーを投げる', async () => {
      vi.mocked(MealPlanRepository.findMealPlanItemById).mockResolvedValueOnce(null)

      await expect(
        removeMealPlanItem('user-1', { itemId: 'item-1' })
      ).rejects.toThrow('アイテムが見つかりません')

      expect(MealPlanRepository.deleteMealPlanItem).not.toHaveBeenCalled()
    })

    it('エラー: 他ユーザーのアイテムは削除できない', async () => {
      vi.mocked(MealPlanRepository.findMealPlanItemById).mockResolvedValueOnce(
        createMealPlanItemLookup({
          mealPlan: createMealPlanRecord({ userId: 'other-user' }),
        })
      )

      await expect(
        removeMealPlanItem('user-1', { itemId: 'item-1' })
      ).rejects.toThrow('このアイテムを削除する権限がありません')

      expect(MealPlanRepository.deleteMealPlanItem).not.toHaveBeenCalled()
    })
  })

  // ===== generateShoppingList =====

  describe('generateShoppingList', () => {
    const mockPlanWithItems = (
      items: Array<{
        ingredients: Array<Partial<MealPlanIngredient> & Pick<MealPlanIngredient, 'name'>>
      }>
    ): MealPlanWithItems =>
      createMealPlan({
        weekStart: new Date(2026, 2, 2),
        items: items.map((item, i) => {
          const recipeId = `recipe-${i}`

          return createMealPlanItem({
            id: `item-${i}`,
            mealPlanId: 'plan-1',
            recipeId,
            dayOfWeek: i,
            recipe: createRecipe({
              id: recipeId,
              title: `レシピ${i}`,
              ingredients: item.ingredients.map((ingredient, index) =>
                createIngredient({
                  id: ingredient.id ?? `ing-${i}-${index}`,
                  recipeId,
                  name: ingredient.name,
                  unit: ingredient.unit ?? null,
                  notes: ingredient.notes ?? null,
                  createdAt: ingredient.createdAt ?? BASE_DATE,
                  updatedAt: ingredient.updatedAt ?? BASE_UPDATED_AT,
                })
              ),
            }),
          })
        }),
      })

    it('正常系: 献立プランから買い物リストを生成できる', async () => {
      const plan = mockPlanWithItems([
        { ingredients: [{ id: 'ing-1', name: '卵', unit: '2個', notes: null }] },
        { ingredients: [{ id: 'ing-2', name: '牛乳', unit: '200ml', notes: null }] },
      ])
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([])
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(0)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([
        createShoppingItemRecord({ id: 's-1', name: '卵', displayOrder: 1 }),
        createShoppingItemRecord({ id: 's-2', name: '牛乳', displayOrder: 2 }),
      ])

      const result = await generateShoppingList('user-1', { weekStart: '2026-03-02' })

      expect(result).toEqual({ count: 2 })
      expect(ShoppingItemRepository.createShoppingItems).toHaveBeenCalledWith('user-1', [
        { name: '卵', memo: '2個', displayOrder: 1 },
        { name: '牛乳', memo: '200ml', displayOrder: 2 },
      ])
    })

    it('正常系: 同名の食材は重複除去してmemoを結合する', async () => {
      const plan = mockPlanWithItems([
        { ingredients: [{ id: 'ing-1', name: '卵', unit: '2個', notes: null }] },
        { ingredients: [{ id: 'ing-2', name: '卵', unit: '3個', notes: null }] },
      ])
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([])
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(0)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([
        createShoppingItemRecord({ id: 's-1', name: '卵', displayOrder: 1 }),
      ])

      const result = await generateShoppingList('user-1', { weekStart: '2026-03-02' })

      expect(result).toEqual({ count: 1 })
      expect(ShoppingItemRepository.createShoppingItems).toHaveBeenCalledWith('user-1', [
        { name: '卵', memo: '2個, 3個', displayOrder: 1 },
      ])
    })

    it('正常系: 既存の買い物リストと重複する食材は除外する', async () => {
      const plan = mockPlanWithItems([
        { ingredients: [
          { id: 'ing-1', name: '卵', unit: '2個', notes: null },
          { id: 'ing-2', name: '牛乳', unit: '200ml', notes: null },
        ]},
      ])
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([
        createShoppingItemRecord({ name: '卵' }),
      ])
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(5)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([
        createShoppingItemRecord({ id: 's-1', name: '牛乳', displayOrder: 6 }),
      ])

      const result = await generateShoppingList('user-1', { weekStart: '2026-03-02' })

      expect(result).toEqual({ count: 1 })
      expect(ShoppingItemRepository.createShoppingItems).toHaveBeenCalledWith('user-1', [
        { name: '牛乳', memo: '200ml', displayOrder: 6 },
      ])
    })

    it('正常系: 全食材が既存リストと重複する場合は0件を返す', async () => {
      const plan = mockPlanWithItems([
        { ingredients: [{ id: 'ing-1', name: '卵', unit: '2個', notes: null }] },
      ])
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([
        createShoppingItemRecord({ name: '卵' }),
      ])

      const result = await generateShoppingList('user-1', { weekStart: '2026-03-02' })

      expect(result).toEqual({ count: 0 })
      expect(ShoppingItemRepository.createShoppingItems).not.toHaveBeenCalled()
    })

    it('エラー: 献立プランが存在しない場合はエラーを投げる', async () => {
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(null)

      await expect(
        generateShoppingList('user-1', { weekStart: '2026-03-02' })
      ).rejects.toThrow('献立プランにレシピが登録されていません')
    })

    it('エラー: 献立プランにアイテムがない場合はエラーを投げる', async () => {
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(
        createMealPlan({
          weekStart: new Date(2026, 2, 2),
          items: [],
        })
      )

      await expect(
        generateShoppingList('user-1', { weekStart: '2026-03-02' })
      ).rejects.toThrow('献立プランにレシピが登録されていません')
    })

    it('正常系: unitとnotesの両方がある場合はスペースで結合する', async () => {
      const plan = mockPlanWithItems([
        { ingredients: [{ id: 'ing-1', name: '鶏肉', unit: '300g', notes: '皮なし' }] },
      ])
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([])
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(0)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([
        createShoppingItemRecord({ id: 's-1', name: '鶏肉', displayOrder: 1 }),
      ])

      await generateShoppingList('user-1', { weekStart: '2026-03-02' })

      expect(ShoppingItemRepository.createShoppingItems).toHaveBeenCalledWith('user-1', [
        { name: '鶏肉', memo: '300g 皮なし', displayOrder: 1 },
      ])
    })
  })
})
