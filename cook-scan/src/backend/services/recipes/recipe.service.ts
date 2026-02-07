/**
 * Recipe Service
 * ビジネスロジックとトランザクション管理
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import * as RecipeRepository from '@/backend/repositories/recipe.repository'
import * as RecipeRelationRepository from '@/backend/repositories/recipe-relation.repository'
import * as TagRepository from '@/backend/repositories/tag.repository'
import { sanitizeUrl } from '@/utils/url-validation'
import type {
  CreateRecipeInput,
  UpdateRecipeInput,
  RecipeDetailOutput,
  RecipeListOutput,
  CreateRecipeResult,
  UpdateRecipeResult,
} from '@/backend/domain/recipes'

// ===== Recipe Retrieval =====

/**
 * レシピIDでレシピを取得
 */
export async function getRecipeById(
  recipeId: string,
  userId: string
): Promise<RecipeDetailOutput | null> {
  return RecipeRepository.findRecipeById(recipeId, userId)
}

/**
 * ユーザーのレシピ一覧を取得（フィルタ条件付き）
 */
export async function getRecipes(
  userId: string,
  searchQuery?: string,
  tagFilters?: Prisma.RecipeWhereInput[]
): Promise<RecipeListOutput[]> {
  return RecipeRepository.findRecipesByUser(userId, searchQuery, tagFilters)
}

// ===== Recipe Creation =====

/**
 * レシピを作成（トランザクション管理）
 */
export async function createRecipe(
  userId: string,
  input: CreateRecipeInput
): Promise<CreateRecipeResult> {
  const { title, sourceInfo, ingredients, steps, memo, tags, childRecipes } = input

  // タグのバリデーション
  const { validTagIds, isValid } = await TagRepository.validateTagIdsForUser(tags ?? [], userId)

  if (!isValid) {
    throw new Error('無効なタグが含まれています')
  }

  // トランザクション実行
  const recipe = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // レシピ作成
    const newRecipe = await RecipeRepository.createRecipe(tx, userId, title, memo)

    // 材料作成
    await RecipeRepository.createIngredients(tx, newRecipe.id, ingredients)

    // 手順作成
    await RecipeRepository.createSteps(tx, newRecipe.id, steps)

    // ソース情報作成
    if (sourceInfo && (sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url)) {
      const sanitizedUrl = sanitizeUrl(sourceInfo.url)
      await RecipeRepository.createSourceInfo(tx, newRecipe.id, sourceInfo, sanitizedUrl)
    }

    // レシピタグ作成
    await RecipeRepository.createRecipeTags(tx, newRecipe.id, validTagIds)

    // 子レシピ関係作成
    if (childRecipes && childRecipes.length > 0) {
      for (const cr of childRecipes) {
        const isCircular = await RecipeRelationRepository.checkCircularReference(
          newRecipe.id,
          cr.childRecipeId
        )
        if (isCircular) {
          throw new Error('循環参照が検出されました。子レシピの設定を見直してください')
        }
      }
      await RecipeRelationRepository.createRecipeRelations(tx, newRecipe.id, childRecipes)
    }

    return newRecipe
  })

  return { recipeId: recipe.id }
}

// ===== Recipe Update =====

/**
 * レシピを更新（トランザクション管理）
 */
export async function updateRecipe(
  userId: string,
  input: UpdateRecipeInput
): Promise<UpdateRecipeResult> {
  const { recipeId, title, sourceInfo, ingredients, steps, memo, tags, childRecipes } = input

  // 所有権チェック
  const hasOwnership = await RecipeRepository.checkRecipeOwnership(recipeId, userId)
  if (!hasOwnership) {
    throw new Error('レシピが見つかりません')
  }

  // タグのバリデーション
  const { validTagIds, isValid } = await TagRepository.validateTagIdsForUser(tags ?? [], userId)

  if (!isValid) {
    throw new Error('無効なタグが含まれています')
  }

  // トランザクション実行
  const updatedRecipe = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // レシピ基本情報を更新
    const recipe = await RecipeRepository.updateRecipe(tx, recipeId, title, memo)

    // 既存の関連データを削除
    await RecipeRepository.deleteRelatedData(tx, recipeId)

    // 材料作成
    await RecipeRepository.createIngredients(tx, recipeId, ingredients)

    // 手順作成
    await RecipeRepository.createSteps(tx, recipeId, steps)

    // ソース情報作成
    if (sourceInfo && (sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url)) {
      const sanitizedUrl = sanitizeUrl(sourceInfo.url)
      await RecipeRepository.createSourceInfo(tx, recipeId, sourceInfo, sanitizedUrl)
    }

    // レシピタグ作成
    await RecipeRepository.createRecipeTags(tx, recipeId, validTagIds)

    // 子レシピ関係作成
    if (childRecipes && childRecipes.length > 0) {
      for (const cr of childRecipes) {
        const isCircular = await RecipeRelationRepository.checkCircularReference(
          recipeId,
          cr.childRecipeId
        )
        if (isCircular) {
          throw new Error('循環参照が検出されました。子レシピの設定を見直してください')
        }
      }
      await RecipeRelationRepository.createRecipeRelations(tx, recipeId, childRecipes)
    }

    return recipe
  })

  return { recipeId: updatedRecipe.id }
}

// ===== Recipe Deletion =====

/**
 * レシピを削除（トランザクション管理）
 */
export async function deleteRecipe(userId: string, recipeId: string): Promise<void> {
  // 所有権チェック
  const hasOwnership = await RecipeRepository.checkRecipeOwnership(recipeId, userId)
  if (!hasOwnership) {
    throw new Error('レシピが見つかりません')
  }

  // トランザクション実行
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await RecipeRepository.deleteRecipe(tx, recipeId)
  })
}
