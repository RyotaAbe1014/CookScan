/**
 * Recipe Share Repository
 * レシピ共有のPrismaクエリ
 */

import { prisma } from '@/lib/prisma'
import type { SharedRecipeOutput, ShareInfoOutput } from '@/backend/domain/recipes'

/**
 * 共有トークンからレシピを取得（基本情報のみ）
 */
export async function findByShareToken(shareToken: string): Promise<SharedRecipeOutput | null> {
  const share = await prisma.recipeShare.findUnique({
    where: { shareToken, isActive: true },
    include: {
      recipe: {
        include: {
          ingredients: {
            orderBy: { createdAt: 'asc' },
            select: { name: true, unit: true, notes: true },
          },
          steps: {
            orderBy: { orderIndex: 'asc' },
            select: { orderIndex: true, instruction: true, timerSeconds: true },
          },
        },
      },
    },
  })

  if (!share) return null

  return {
    title: share.recipe.title,
    imageUrl: share.recipe.imageUrl,
    ingredients: share.recipe.ingredients,
    steps: share.recipe.steps,
  }
}

/**
 * レシピIDから共有情報を取得
 */
export async function findByRecipeId(recipeId: string): Promise<ShareInfoOutput | null> {
  const share = await prisma.recipeShare.findUnique({
    where: { recipeId },
    select: { shareToken: true, isActive: true },
  })

  return share
}

/**
 * 共有レコードを作成
 */
export async function create(recipeId: string, shareToken: string): Promise<ShareInfoOutput> {
  const share = await prisma.recipeShare.create({
    data: { recipeId, shareToken },
    select: { shareToken: true, isActive: true },
  })

  return share
}

/**
 * 共有を無効化
 */
export async function deactivate(recipeId: string): Promise<void> {
  await prisma.recipeShare.update({
    where: { recipeId },
    data: { isActive: false },
  })
}

/**
 * 共有を再有効化
 */
export async function activate(recipeId: string): Promise<ShareInfoOutput> {
  const share = await prisma.recipeShare.update({
    where: { recipeId },
    data: { isActive: true },
    select: { shareToken: true, isActive: true },
  })

  return share
}
