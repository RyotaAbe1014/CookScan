import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}))

vi.mock('@/backend/repositories/recipe.repository', () => ({
  findRecipeById: vi.fn(),
  findRecipesByUser: vi.fn(),
  createRecipe: vi.fn(),
  createIngredients: vi.fn(),
  createSteps: vi.fn(),
  createSourceInfo: vi.fn(),
  createRecipeTags: vi.fn(),
  checkRecipeOwnership: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRelatedData: vi.fn(),
  deleteRecipe: vi.fn(),
}))

vi.mock('@/backend/repositories/recipe-relation.repository', () => ({
  validateChildRecipeOwnership: vi.fn(),
  checkCircularReference: vi.fn(),
  createRecipeRelations: vi.fn(),
}))

vi.mock('@/backend/repositories/tag.repository', () => ({
  validateTagIdsForUser: vi.fn(),
}))

vi.mock('@/utils/url-validation', () => ({
  sanitizeUrl: vi.fn((url: string | null | undefined) => url ?? null),
}))

import { Prisma, Recipe } from '@prisma/client'
import type { RecipeDetailOutput, RecipeListOutput } from '@/backend/domain/recipes'
import { prisma } from '@/lib/prisma'
import * as RecipeRepository from '@/backend/repositories/recipe.repository'
import * as RecipeRelationRepository from '@/backend/repositories/recipe-relation.repository'
import * as TagRepository from '@/backend/repositories/tag.repository'
import { sanitizeUrl } from '@/utils/url-validation'
import {
  getRecipeById,
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../recipe.service'

describe('recipe.service', () => {
  const mockTx = {} as Prisma.TransactionClient

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: (tx: Prisma.TransactionClient) => Promise<unknown>) => callback(mockTx))

    vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValue({
      validTagIds: ['tag-1'],
      isValid: true,
    })

    vi.mocked(RecipeRepository.createRecipe).mockResolvedValue({
      id: 'recipe-new',
    } as Recipe)
    vi.mocked(RecipeRepository.createIngredients).mockResolvedValue(undefined)
    vi.mocked(RecipeRepository.createSteps).mockResolvedValue(undefined)
    vi.mocked(RecipeRepository.createRecipeTags).mockResolvedValue(undefined)
    vi.mocked(RecipeRepository.createSourceInfo).mockResolvedValue(undefined)

    vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValue(true)
    vi.mocked(RecipeRepository.updateRecipe).mockResolvedValue({
      id: 'recipe-1',
    } as Recipe)
    vi.mocked(RecipeRepository.deleteRelatedData).mockResolvedValue(undefined)
    vi.mocked(RecipeRepository.deleteRecipe).mockResolvedValue(undefined)

    vi.mocked(RecipeRelationRepository.validateChildRecipeOwnership).mockResolvedValue(true)
    vi.mocked(RecipeRelationRepository.checkCircularReference).mockResolvedValue(false)
    vi.mocked(RecipeRelationRepository.createRecipeRelations).mockResolvedValue(undefined)
  })

  // ===== getRecipeById =====

  describe('getRecipeById', () => {
    it('正常系: レシピIDとユーザーIDでレシピを取得できる', async () => {
      const mockRecipe = { id: 'recipe-1', title: 'テストレシピ' }
      vi.mocked(RecipeRepository.findRecipeById).mockResolvedValueOnce(mockRecipe as RecipeDetailOutput)

      const result = await getRecipeById('recipe-1', 'user-1')

      expect(result).toEqual(mockRecipe)
      expect(RecipeRepository.findRecipeById).toHaveBeenCalledWith('recipe-1', 'user-1')
    })

    it('正常系: レシピが見つからない場合はnullを返す', async () => {
      vi.mocked(RecipeRepository.findRecipeById).mockResolvedValueOnce(null)

      const result = await getRecipeById('nonexistent', 'user-1')

      expect(result).toBeNull()
      expect(RecipeRepository.findRecipeById).toHaveBeenCalledWith('nonexistent', 'user-1')
    })
  })

  // ===== getRecipes =====

  describe('getRecipes', () => {
    it('正常系: ユーザーのレシピ一覧を取得できる', async () => {
      const mockRecipes = [
        { id: 'recipe-1', title: 'レシピ1' },
        { id: 'recipe-2', title: 'レシピ2' },
      ]
      vi.mocked(RecipeRepository.findRecipesByUser).mockResolvedValueOnce(mockRecipes as RecipeListOutput[])

      const result = await getRecipes('user-1')

      expect(result).toEqual(mockRecipes)
      expect(RecipeRepository.findRecipesByUser).toHaveBeenCalledWith(
        'user-1',
        undefined,
        undefined
      )
    })

    it('正常系: 検索クエリ付きでレシピ一覧を取得できる', async () => {
      const mockRecipes = [{ id: 'recipe-1', title: 'カレー' }]
      vi.mocked(RecipeRepository.findRecipesByUser).mockResolvedValueOnce(mockRecipes as RecipeListOutput[])

      const result = await getRecipes('user-1', 'カレー')

      expect(result).toEqual(mockRecipes)
      expect(RecipeRepository.findRecipesByUser).toHaveBeenCalledWith(
        'user-1',
        'カレー',
        undefined
      )
    })

    it('正常系: タグフィルタ付きでレシピ一覧を取得できる', async () => {
      const tagFilters: Prisma.RecipeWhereInput[] = [{ recipeTags: { some: { tagId: 'tag-1' } } }]
      vi.mocked(RecipeRepository.findRecipesByUser).mockResolvedValueOnce([])

      const result = await getRecipes('user-1', undefined, tagFilters)

      expect(result).toEqual([])
      expect(RecipeRepository.findRecipesByUser).toHaveBeenCalledWith(
        'user-1',
        undefined,
        tagFilters
      )
    })
  })

  // ===== createRecipe =====

  describe('createRecipe', () => {
    it('正常系: レシピを作成できる', async () => {
      const input = {
        title: '新しいレシピ',
        sourceInfo: null,
        ingredients: [{ name: '卵', unit: '2個', notes: undefined }],
        steps: [{ orderIndex: 1, instruction: '卵を割る', timerSeconds: undefined }],
        memo: 'メモ',
        tags: ['tag-1'],
        childRecipes: undefined,
      }

      const result = await createRecipe('user-1', input)

      expect(result).toEqual({ recipeId: 'recipe-new' })
      expect(TagRepository.validateTagIdsForUser).toHaveBeenCalledWith(['tag-1'], 'user-1')
      expect(RecipeRepository.createRecipe).toHaveBeenCalledWith(mockTx, 'user-1', '新しいレシピ', 'メモ')
      expect(RecipeRepository.createIngredients).toHaveBeenCalledWith(mockTx, 'recipe-new', input.ingredients)
      expect(RecipeRepository.createSteps).toHaveBeenCalledWith(mockTx, 'recipe-new', input.steps)
      expect(RecipeRepository.createRecipeTags).toHaveBeenCalledWith(mockTx, 'recipe-new', ['tag-1'])
    })

    it('正常系: ソース情報付きでレシピを作成できる', async () => {
      const input = {
        title: 'レシピ',
        sourceInfo: { bookName: '料理本', pageNumber: '42', url: 'https://example.com' },
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: undefined,
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await createRecipe('user-1', input)

      expect(sanitizeUrl).toHaveBeenCalledWith('https://example.com')
      expect(RecipeRepository.createSourceInfo).toHaveBeenCalledWith(
        mockTx,
        'recipe-new',
        input.sourceInfo,
        'https://example.com'
      )
    })

    it('正常系: ソース情報が空の場合はcreateSourceInfoが呼ばれない', async () => {
      const input = {
        title: 'レシピ',
        sourceInfo: { bookName: '', pageNumber: '', url: '' },
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: undefined,
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await createRecipe('user-1', input)

      expect(RecipeRepository.createSourceInfo).not.toHaveBeenCalled()
    })

    it('正常系: 子レシピ付きでレシピを作成できる', async () => {
      const input = {
        title: 'レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: [{ childRecipeId: 'child-1' }],
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await createRecipe('user-1', input)

      expect(RecipeRelationRepository.validateChildRecipeOwnership).toHaveBeenCalledWith(
        mockTx,
        'user-1',
        ['child-1']
      )
      expect(RecipeRelationRepository.checkCircularReference).toHaveBeenCalledWith(
        'recipe-new',
        'child-1'
      )
      expect(RecipeRelationRepository.createRecipeRelations).toHaveBeenCalledWith(
        mockTx,
        'recipe-new',
        [{ childRecipeId: 'child-1' }]
      )
    })

    it('エラー: 無効なタグが含まれる場合はエラーを投げる', async () => {
      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: false,
      })

      const input = {
        title: 'レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: ['invalid-tag'],
        childRecipes: undefined,
      }

      await expect(createRecipe('user-1', input)).rejects.toThrow('無効なタグが含まれています')
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it('エラー: 他ユーザーの子レシピIDが含まれる場合は保存前に失敗する', async () => {
      vi.mocked(RecipeRelationRepository.validateChildRecipeOwnership).mockResolvedValueOnce(false)

      const input = {
        title: 'レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: [{ childRecipeId: 'other-user-recipe-id' }],
      }

      await expect(createRecipe('user-1', input)).rejects.toThrow('無効な子レシピが含まれています')

      expect(RecipeRelationRepository.validateChildRecipeOwnership).toHaveBeenCalledWith(
        mockTx,
        'user-1',
        ['other-user-recipe-id']
      )
      expect(RecipeRelationRepository.checkCircularReference).not.toHaveBeenCalled()
      expect(RecipeRelationRepository.createRecipeRelations).not.toHaveBeenCalled()
    })

    it('エラー: 循環参照が検出された場合はエラーを投げる', async () => {
      vi.mocked(RecipeRelationRepository.checkCircularReference).mockResolvedValueOnce(true)

      const input = {
        title: 'レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: [{ childRecipeId: 'circular-recipe' }],
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await expect(createRecipe('user-1', input)).rejects.toThrow(
        '循環参照が検出されました。子レシピの設定を見直してください'
      )

      expect(RecipeRelationRepository.createRecipeRelations).not.toHaveBeenCalled()
    })

    it('正常系: tagsがundefinedの場合は空配列として扱われる', async () => {
      const input = {
        title: 'レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [] as string[],
        childRecipes: undefined,
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await createRecipe('user-1', input)

      expect(TagRepository.validateTagIdsForUser).toHaveBeenCalledWith([], 'user-1')
    })
  })

  // ===== updateRecipe =====

  describe('updateRecipe', () => {
    it('正常系: レシピを更新できる', async () => {
      const input = {
        recipeId: 'recipe-1',
        title: '更新レシピ',
        sourceInfo: null,
        ingredients: [{ name: '塩', unit: '少々', notes: undefined }],
        steps: [{ orderIndex: 1, instruction: '塩を振る', timerSeconds: undefined }],
        memo: '更新メモ',
        tags: ['tag-1'],
        childRecipes: undefined,
      }

      const result = await updateRecipe('user-1', input)

      expect(result).toEqual({ recipeId: 'recipe-1' })
      expect(RecipeRepository.checkRecipeOwnership).toHaveBeenCalledWith('recipe-1', 'user-1')
      expect(RecipeRepository.updateRecipe).toHaveBeenCalledWith(mockTx, 'recipe-1', '更新レシピ', '更新メモ')
      expect(RecipeRepository.deleteRelatedData).toHaveBeenCalledWith(mockTx, 'recipe-1')
      expect(RecipeRepository.createIngredients).toHaveBeenCalledWith(mockTx, 'recipe-1', input.ingredients)
      expect(RecipeRepository.createSteps).toHaveBeenCalledWith(mockTx, 'recipe-1', input.steps)
      expect(RecipeRepository.createRecipeTags).toHaveBeenCalledWith(mockTx, 'recipe-1', ['tag-1'])
    })

    it('正常系: ソース情報付きでレシピを更新できる', async () => {
      const input = {
        recipeId: 'recipe-1',
        title: '更新レシピ',
        sourceInfo: { bookName: '料理本', pageNumber: '10', url: 'https://example.com/recipe' },
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: undefined,
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await updateRecipe('user-1', input)

      expect(sanitizeUrl).toHaveBeenCalledWith('https://example.com/recipe')
      expect(RecipeRepository.createSourceInfo).toHaveBeenCalledWith(
        mockTx,
        'recipe-1',
        input.sourceInfo,
        'https://example.com/recipe'
      )
    })

    it('正常系: 子レシピ付きでレシピを更新できる', async () => {
      const input = {
        recipeId: 'recipe-1',
        title: '更新レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: [{ childRecipeId: 'child-1' }, { childRecipeId: 'child-2' }],
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await updateRecipe('user-1', input)

      expect(RecipeRelationRepository.validateChildRecipeOwnership).toHaveBeenCalledWith(
        mockTx,
        'user-1',
        ['child-1', 'child-2']
      )
      expect(RecipeRelationRepository.checkCircularReference).toHaveBeenCalledTimes(2)
      expect(RecipeRelationRepository.createRecipeRelations).toHaveBeenCalledWith(
        mockTx,
        'recipe-1',
        input.childRecipes
      )
    })

    it('エラー: レシピの所有権がない場合はエラーを投げる', async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(false)

      const input = {
        recipeId: 'recipe-1',
        title: '更新レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: undefined,
      }

      await expect(updateRecipe('user-1', input)).rejects.toThrow('レシピが見つかりません')
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it('エラー: 無効なタグが含まれる場合はエラーを投げる', async () => {
      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: false,
      })

      const input = {
        recipeId: 'recipe-1',
        title: '更新レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: ['invalid-tag'],
        childRecipes: undefined,
      }

      await expect(updateRecipe('user-1', input)).rejects.toThrow('無効なタグが含まれています')
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it('エラー: 他ユーザーの子レシピIDが含まれる場合は保存前に失敗する', async () => {
      vi.mocked(RecipeRelationRepository.validateChildRecipeOwnership).mockResolvedValueOnce(false)

      const input = {
        recipeId: 'recipe-1',
        title: '更新レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: [{ childRecipeId: 'other-user-recipe-id' }],
      }

      await expect(updateRecipe('user-1', input)).rejects.toThrow('無効な子レシピが含まれています')

      expect(RecipeRelationRepository.validateChildRecipeOwnership).toHaveBeenCalledWith(
        mockTx,
        'user-1',
        ['other-user-recipe-id']
      )
      expect(RecipeRelationRepository.checkCircularReference).not.toHaveBeenCalled()
      expect(RecipeRelationRepository.createRecipeRelations).not.toHaveBeenCalled()
    })

    it('エラー: 循環参照が検出された場合はエラーを投げる', async () => {
      vi.mocked(RecipeRelationRepository.checkCircularReference).mockResolvedValueOnce(true)

      const input = {
        recipeId: 'recipe-1',
        title: '更新レシピ',
        sourceInfo: null,
        ingredients: [],
        steps: [],
        memo: '',
        tags: [],
        childRecipes: [{ childRecipeId: 'circular-recipe' }],
      }

      vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValueOnce({
        validTagIds: [],
        isValid: true,
      })

      await expect(updateRecipe('user-1', input)).rejects.toThrow(
        '循環参照が検出されました。子レシピの設定を見直してください'
      )

      expect(RecipeRelationRepository.createRecipeRelations).not.toHaveBeenCalled()
    })
  })

  // ===== deleteRecipe =====

  describe('deleteRecipe', () => {
    it('正常系: レシピを削除できる', async () => {
      await deleteRecipe('user-1', 'recipe-1')

      expect(RecipeRepository.checkRecipeOwnership).toHaveBeenCalledWith('recipe-1', 'user-1')
      expect(prisma.$transaction).toHaveBeenCalled()
      expect(RecipeRepository.deleteRecipe).toHaveBeenCalledWith(mockTx, 'recipe-1')
    })

    it('エラー: レシピの所有権がない場合はエラーを投げる', async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(false)

      await expect(deleteRecipe('user-1', 'recipe-1')).rejects.toThrow('レシピが見つかりません')
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })
  })
})
