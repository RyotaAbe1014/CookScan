/**
 * Recipe Share Service
 * レシピ共有のビジネスロジック
 */

import { randomBytes } from 'crypto'
import * as RecipeShareRepository from '@/backend/repositories/recipe-share.repository'
import * as RecipeRepository from '@/backend/repositories/recipe.repository'
import type { SharedRecipeOutput, ShareInfoOutput } from '@/backend/domain/recipes'

/**
 * 共有トークンからレシピを取得（認証不要）
 */
export async function getSharedRecipe(shareToken: string): Promise<SharedRecipeOutput | null> {
  return RecipeShareRepository.findByShareToken(shareToken)
}

/**
 * 共有リンクを作成（既存の共有がある場合は再有効化）
 */
export async function createShare(userId: string, recipeId: string): Promise<ShareInfoOutput | null> {
  const isOwner = await RecipeRepository.checkRecipeOwnership(recipeId, userId)
  if (!isOwner) return null

  const existing = await RecipeShareRepository.findByRecipeId(recipeId)

  if (existing) {
    if (existing.isActive) return existing
    return RecipeShareRepository.activate(recipeId)
  }

  const shareToken = randomBytes(32).toString('base64url')
  return RecipeShareRepository.create(recipeId, shareToken)
}

/**
 * 共有リンクを無効化
 */
export async function removeShare(userId: string, recipeId: string): Promise<boolean> {
  const isOwner = await RecipeRepository.checkRecipeOwnership(recipeId, userId)
  if (!isOwner) return false

  const existing = await RecipeShareRepository.findByRecipeId(recipeId)
  if (!existing || !existing.isActive) return false

  await RecipeShareRepository.deactivate(recipeId)
  return true
}

/**
 * 共有情報を取得
 */
export async function getShareInfo(userId: string, recipeId: string): Promise<ShareInfoOutput | null> {
  const isOwner = await RecipeRepository.checkRecipeOwnership(recipeId, userId)
  if (!isOwner) return null

  return RecipeShareRepository.findByRecipeId(recipeId)
}
