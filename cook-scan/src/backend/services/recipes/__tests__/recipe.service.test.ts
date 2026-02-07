import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}))

vi.mock('@/backend/repositories/recipe.repository', () => ({
  createRecipe: vi.fn(),
  createIngredients: vi.fn(),
  createSteps: vi.fn(),
  createSourceInfo: vi.fn(),
  createRecipeTags: vi.fn(),
  checkRecipeOwnership: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRelatedData: vi.fn(),
}))

vi.mock('@/backend/repositories/recipe-relation.repository', () => ({
  validateChildRecipeOwnership: vi.fn(),
  checkCircularReference: vi.fn(),
  createRecipeRelations: vi.fn(),
}))

vi.mock('@/backend/repositories/tag.repository', () => ({
  validateTagIdsForUser: vi.fn(),
}))

import { prisma } from '@/lib/prisma'
import * as RecipeRepository from '@/backend/repositories/recipe.repository'
import * as RecipeRelationRepository from '@/backend/repositories/recipe-relation.repository'
import * as TagRepository from '@/backend/repositories/tag.repository'
import { createRecipe, updateRecipe } from '../recipe.service'

describe('recipe.service', () => {
  const mockTx = {} as any

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => callback(mockTx))

    vi.mocked(TagRepository.validateTagIdsForUser).mockResolvedValue({
      validTagIds: ['tag-1'],
      isValid: true,
    })

    vi.mocked(RecipeRepository.createRecipe).mockResolvedValue({
      id: 'recipe-new',
    } as any)
    vi.mocked(RecipeRepository.createIngredients).mockResolvedValue(undefined)
    vi.mocked(RecipeRepository.createSteps).mockResolvedValue(undefined)
    vi.mocked(RecipeRepository.createRecipeTags).mockResolvedValue(undefined)

    vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValue(true)
    vi.mocked(RecipeRepository.updateRecipe).mockResolvedValue({
      id: 'recipe-1',
    } as any)
    vi.mocked(RecipeRepository.deleteRelatedData).mockResolvedValue(undefined)

    vi.mocked(RecipeRelationRepository.validateChildRecipeOwnership).mockResolvedValue(true)
    vi.mocked(RecipeRelationRepository.checkCircularReference).mockResolvedValue(false)
    vi.mocked(RecipeRelationRepository.createRecipeRelations).mockResolvedValue(undefined)
  })

  it('createRecipe: 他ユーザーの子レシピIDが含まれる場合は保存前に失敗する', async () => {
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

  it('updateRecipe: 他ユーザーの子レシピIDが含まれる場合は保存前に失敗する', async () => {
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
})
