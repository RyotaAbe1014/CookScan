/**
 * RecipeRelation Repository
 * 子レシピ関係のPrismaクエリ
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { ChildRecipeRelationInput } from '@/backend/domain/recipes'

/**
 * 子レシピ候補を検索（自分のレシピのうち、除外IDを除く）
 */
export async function findAvailableChildRecipes(
  userId: string,
  excludeRecipeIds: string[],
  searchQuery?: string
) {
  return prisma.recipe.findMany({
    where: {
      userId,
      id: { notIn: excludeRecipeIds },
      ...(searchQuery && {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
    },
    select: {
      id: true,
      title: true,
      imageUrl: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

/**
 * 子レシピ関係を一括作成
 */
export async function createRecipeRelations(
  tx: Prisma.TransactionClient,
  parentRecipeId: string,
  childRecipes: ChildRecipeRelationInput[]
) {
  if (childRecipes.length === 0) return

  await tx.recipeRelation.createMany({
    data: childRecipes.map((cr) => ({
      parentRecipeId,
      childRecipeId: cr.childRecipeId,
      quantity: cr.quantity || null,
      notes: cr.notes || null,
    })),
  })
}

/**
 * 子レシピIDがすべてユーザー所有かを検証
 */
export async function validateChildRecipeOwnership(
  tx: Prisma.TransactionClient,
  userId: string,
  childRecipeIds: string[]
): Promise<boolean> {
  if (childRecipeIds.length === 0) return true

  const uniqueChildRecipeIds = [...new Set(childRecipeIds)]
  const ownedRecipeCount = await tx.recipe.count({
    where: {
      userId,
      id: {
        in: uniqueChildRecipeIds,
      },
    },
  })

  return ownedRecipeCount === uniqueChildRecipeIds.length
}

/**
 * 循環参照チェック（BFS）
 * parentRecipeId -> childRecipeId を追加した場合に循環が生じるかを検出
 */
export async function checkCircularReference(
  parentRecipeId: string,
  childRecipeId: string
): Promise<boolean> {
  // 自己参照チェック
  if (parentRecipeId === childRecipeId) return true

  // BFSでchildRecipeIdの子孫にparentRecipeIdが含まれるか確認
  const visited = new Set<string>()
  const queue = [childRecipeId]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (visited.has(currentId)) continue
    visited.add(currentId)

    const children = await prisma.recipeRelation.findMany({
      where: { parentRecipeId: currentId },
      select: { childRecipeId: true },
    })

    for (const child of children) {
      if (child.childRecipeId === parentRecipeId) return true
      queue.push(child.childRecipeId)
    }
  }

  return false
}
