'use server'

import { prisma } from '@/lib/prisma'
import { requireUserProfile } from '@/features/auth/auth-utils'

/**
 * ユーザーの全レシピを取得（親レシピ選択用）
 */
export async function getUserRecipesForSelection(userId: string, excludeRecipeId?: string) {
  const recipes = await prisma.recipe.findMany({
    where: {
      userId,
      ...(excludeRecipeId && { id: { not: excludeRecipeId } })
    },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return recipes
}

/**
 * 循環参照をチェックする関数
 * 指定されたレシピIDを親に設定すると循環参照が発生するかチェック
 *
 * @param recipeId - チェック対象のレシピID
 * @param proposedParentId - 設定しようとしている親レシピID
 * @returns 循環参照が発生する場合true
 */
export async function checkCircularReference(
  recipeId: string,
  proposedParentId: string | null
): Promise<boolean> {
  // 親が設定されていない場合は循環参照なし
  if (!proposedParentId) {
    return false
  }

  // 自己参照チェック
  if (recipeId === proposedParentId) {
    return true
  }

  // proposedParentIdが現在のrecipeIdの子孫である場合、循環参照が発生する
  // proposedParentIdから親方向にたどって、recipeIdが存在するかチェック
  let currentId: string | null = proposedParentId
  const visitedIds = new Set<string>()
  const maxDepth = 100 // 無限ループ防止

  let depth = 0
  while (currentId && depth < maxDepth) {
    // すでに訪問したIDの場合は循環参照
    if (visitedIds.has(currentId)) {
      return true
    }

    // recipeIdに到達した場合は循環参照
    if (currentId === recipeId) {
      return true
    }

    visitedIds.add(currentId)

    // 親レシピを取得
    const recipe: { parentRecipeId: string | null } | null = await prisma.recipe.findUnique({
      where: { id: currentId },
      select: { parentRecipeId: true }
    })

    currentId = recipe?.parentRecipeId ?? null
    depth++
  }

  return false
}

/**
 * 親レシピとして設定可能かバリデーション
 *
 * @param recipeId - チェック対象のレシピID
 * @param proposedParentId - 設定しようとしている親レシピID
 * @param userId - ユーザーID（所有権チェック用）
 * @returns バリデーション結果
 */
export async function validateParentRecipe(
  recipeId: string | null,
  proposedParentId: string | null,
  userId: string
): Promise<{ isValid: boolean; error?: string }> {
  // 親が設定されていない場合はOK
  if (!proposedParentId) {
    return { isValid: true }
  }

  // 自己参照チェック
  if (recipeId && recipeId === proposedParentId) {
    return { isValid: false, error: 'レシピ自身を親レシピとして設定することはできません' }
  }

  // 親レシピが存在するか、かつユーザーが所有しているかチェック
  const parentRecipe = await prisma.recipe.findFirst({
    where: {
      id: proposedParentId,
      userId
    }
  })

  if (!parentRecipe) {
    return { isValid: false, error: '指定された親レシピが見つかりません' }
  }

  // 循環参照チェック（新規作成時はrecipeIdがnullなのでスキップ）
  if (recipeId) {
    const hasCircularReference = await checkCircularReference(recipeId, proposedParentId)
    if (hasCircularReference) {
      return { isValid: false, error: '循環参照が発生するため、この親レシピは設定できません' }
    }
  }

  return { isValid: true }
}

/**
 * 現在のユーザーのレシピを取得（親レシピ選択用）
 * 認証済みユーザーのIDを自動的に取得
 */
export async function getCurrentUserRecipesForSelection(excludeRecipeId?: string) {
  const profile = await requireUserProfile()
  return getUserRecipesForSelection(profile.id, excludeRecipeId)
}
