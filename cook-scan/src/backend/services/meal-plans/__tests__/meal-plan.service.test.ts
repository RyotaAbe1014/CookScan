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

const mockItem = (overrides?: Partial<{ id: string; dayOfWeek: number; recipeId: string }>) => ({
  id: overrides?.id ?? 'item-1',
  dayOfWeek: overrides?.dayOfWeek ?? 0,
  recipe: {
    id: overrides?.recipeId ?? 'recipe-1',
    title: 'テストレシピ',
    imageUrl: null,
    ingredients: [{ id: 'ing-1', name: '卵', unit: '2個', notes: null }],
  },
})

describe('meal-plan.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ===== getMealPlan =====

  describe('getMealPlan', () => {
    it('正常系: 週の献立プランを取得できる', async () => {
      const mockPlan = {
        id: 'plan-1',
        weekStart: new Date(2026, 2, 2),
        items: [mockItem()],
      }
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(mockPlan as never)

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
      vi.mocked(MealPlanRepository.upsertMealPlan).mockResolvedValueOnce({ id: 'plan-1' } as never)
      vi.mocked(MealPlanRepository.createMealPlanItem).mockResolvedValueOnce(mockItem() as never)

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
      vi.mocked(MealPlanRepository.findMealPlanItemById).mockResolvedValueOnce({
        id: 'item-1',
        mealPlan: { userId: 'user-1' },
      } as never)

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
      vi.mocked(MealPlanRepository.findMealPlanItemById).mockResolvedValueOnce({
        id: 'item-1',
        mealPlan: { userId: 'other-user' },
      } as never)

      await expect(
        removeMealPlanItem('user-1', { itemId: 'item-1' })
      ).rejects.toThrow('このアイテムを削除する権限がありません')

      expect(MealPlanRepository.deleteMealPlanItem).not.toHaveBeenCalled()
    })
  })

  // ===== generateShoppingList =====

  describe('generateShoppingList', () => {
    const mockPlanWithItems = (items: Array<{
      ingredients: Array<{ id: string; name: string; unit: string | null; notes: string | null }>
    }>) => ({
      id: 'plan-1',
      weekStart: new Date(2026, 2, 2),
      items: items.map((item, i) => ({
        id: `item-${i}`,
        dayOfWeek: i,
        recipe: {
          id: `recipe-${i}`,
          title: `レシピ${i}`,
          imageUrl: null,
          ingredients: item.ingredients,
        },
      })),
    })

    it('正常系: 献立プランから買い物リストを生成できる', async () => {
      const plan = mockPlanWithItems([
        { ingredients: [{ id: 'ing-1', name: '卵', unit: '2個', notes: null }] },
        { ingredients: [{ id: 'ing-2', name: '牛乳', unit: '200ml', notes: null }] },
      ])
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan as never)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([])
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(0)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([
        { id: 's-1' },
        { id: 's-2' },
      ] as never)

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
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan as never)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([])
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(0)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([{ id: 's-1' }] as never)

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
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan as never)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([
        { name: '卵' },
      ] as never)
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(5)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([{ id: 's-1' }] as never)

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
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan as never)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([
        { name: '卵' },
      ] as never)

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
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce({
        id: 'plan-1',
        weekStart: new Date(2026, 2, 2),
        items: [],
      } as never)

      await expect(
        generateShoppingList('user-1', { weekStart: '2026-03-02' })
      ).rejects.toThrow('献立プランにレシピが登録されていません')
    })

    it('正常系: unitとnotesの両方がある場合はスペースで結合する', async () => {
      const plan = mockPlanWithItems([
        { ingredients: [{ id: 'ing-1', name: '鶏肉', unit: '300g', notes: '皮なし' }] },
      ])
      vi.mocked(MealPlanRepository.findMealPlanByWeek).mockResolvedValueOnce(plan as never)
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValueOnce([])
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValueOnce(0)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValueOnce([{ id: 's-1' }] as never)

      await generateShoppingList('user-1', { weekStart: '2026-03-02' })

      expect(ShoppingItemRepository.createShoppingItems).toHaveBeenCalledWith('user-1', [
        { name: '鶏肉', memo: '300g 皮なし', displayOrder: 1 },
      ])
    })
  })
})
