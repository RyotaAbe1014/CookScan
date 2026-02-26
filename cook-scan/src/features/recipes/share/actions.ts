'use server'

import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action/with-auth'
import * as RecipeShareService from '@/backend/services/recipes/recipe-share.service'
import type { ShareInfoOutput } from '@/backend/domain/recipes'

/**
 * 共有リンクを作成
 */
export async function createShareLink(recipeId: string): Promise<Result<ShareInfoOutput>> {
  return withAuth(async (profile) => {
    const share = await RecipeShareService.createShare(profile.id, recipeId)
    if (!share) return failure(Errors.notFound('レシピ'))
    return success(share)
  })
}

/**
 * 共有リンクを無効化
 */
export async function removeShareLink(recipeId: string): Promise<Result<void>> {
  return withAuth(async (profile) => {
    const removed = await RecipeShareService.removeShare(profile.id, recipeId)
    if (!removed) return failure(Errors.notFound('共有リンク'))
    return success(undefined)
  })
}

/**
 * 共有情報を取得
 */
export async function getShareInfo(recipeId: string): Promise<Result<ShareInfoOutput | null>> {
  return withAuth(async (profile) => {
    const share = await RecipeShareService.getShareInfo(profile.id, recipeId)
    return success(share)
  })
}
