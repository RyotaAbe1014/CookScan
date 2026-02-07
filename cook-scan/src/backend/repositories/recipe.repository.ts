/**
 * Recipe Repository
 * Prismaクエリの集約
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type {
  IngredientInput,
  StepInput,
  SourceInfoInput,
  RecipeDetailOutput,
  RecipeListOutput,
} from '@/backend/domain/recipes'

// ===== Find Operations =====

/**
 * レシピIDでレシピを取得（リレーション含む）
 */
export async function findRecipeById(
  recipeId: string,
  userId: string
): Promise<RecipeDetailOutput | null> {
  return prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId,
    },
    include: {
      ingredients: {
        orderBy: { createdAt: 'asc' },
      },
      steps: {
        orderBy: { orderIndex: 'asc' },
      },
      recipeTags: {
        include: {
          tag: {
            include: {
              category: true,
            },
          },
        },
      },
      sourceInfo: true,
      childRecipes: {
        include: {
          childRecipe: {
            select: { id: true, title: true, imageUrl: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      parentRecipes: {
        include: {
          parentRecipe: {
            select: { id: true, title: true, imageUrl: true },
          },
        },
      },
    },
  })
}

/**
 * ユーザーのレシピを取得（フィルタ条件付き）
 */
export async function findRecipesByUser(
  userId: string,
  searchQuery?: string,
  tagFilters?: Prisma.RecipeWhereInput[]
): Promise<RecipeListOutput[]> {
  return prisma.recipe.findMany({
    where: {
      userId,
      ...(searchQuery && {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
      ...(tagFilters && { AND: tagFilters }),
    },
    include: {
      ingredients: true,
      recipeTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * レシピの存在確認（ユーザー所有権チェック）
 */
export async function checkRecipeOwnership(recipeId: string, userId: string): Promise<boolean> {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId,
    },
    select: { id: true },
  })
  return recipe !== null
}

// ===== Create Operations (Transaction用) =====

/**
 * レシピを作成
 */
export async function createRecipe(
  tx: Prisma.TransactionClient,
  userId: string,
  title: string,
  memo?: string
) {
  return tx.recipe.create({
    data: {
      userId,
      title,
      memo: memo || null,
    },
  })
}

/**
 * 材料を一括作成
 */
export async function createIngredients(
  tx: Prisma.TransactionClient,
  recipeId: string,
  ingredients: IngredientInput[]
) {
  if (ingredients.length === 0) return

  await tx.ingredient.createMany({
    data: ingredients.map((ingredient) => ({
      recipeId,
      name: ingredient.name,
      unit: ingredient.unit || null,
      notes: ingredient.notes || null,
    })),
  })
}

/**
 * 手順を一括作成
 */
export async function createSteps(
  tx: Prisma.TransactionClient,
  recipeId: string,
  steps: StepInput[]
) {
  if (steps.length === 0) return

  await tx.step.createMany({
    data: steps.map((step, index) => ({
      recipeId,
      orderIndex: step.orderIndex ?? index + 1,
      instruction: step.instruction,
      timerSeconds: step.timerSeconds || null,
    })),
  })
}

/**
 * ソース情報を作成
 */
export async function createSourceInfo(
  tx: Prisma.TransactionClient,
  recipeId: string,
  sourceInfo: SourceInfoInput,
  sanitizedUrl: string | null
) {
  await tx.sourceInfo.create({
    data: {
      recipeId,
      sourceName: sourceInfo.bookName || null,
      pageNumber: sourceInfo.pageNumber || null,
      sourceUrl: sanitizedUrl,
    },
  })
}

/**
 * レシピタグを一括作成
 */
export async function createRecipeTags(
  tx: Prisma.TransactionClient,
  recipeId: string,
  tagIds: string[]
) {
  if (tagIds.length === 0) return

  await tx.recipeTag.createMany({
    data: tagIds.map((tagId) => ({
      recipeId,
      tagId,
    })),
  })
}

// ===== Update Operations (Transaction用) =====

/**
 * レシピの基本情報を更新
 */
export async function updateRecipe(
  tx: Prisma.TransactionClient,
  recipeId: string,
  title: string,
  memo?: string
) {
  return tx.recipe.update({
    where: { id: recipeId },
    data: {
      title,
      memo: memo || null,
      updatedAt: new Date(),
    },
  })
}

// ===== Delete Operations (Transaction用) =====

/**
 * レシピに関連するデータをすべて削除
 */
export async function deleteRelatedData(tx: Prisma.TransactionClient, recipeId: string) {
  // 材料を削除
  await tx.ingredient.deleteMany({
    where: { recipeId },
  })

  // 手順を削除
  await tx.step.deleteMany({
    where: { recipeId },
  })

  // ソース情報を削除
  await tx.sourceInfo.deleteMany({
    where: { recipeId },
  })

  // レシピタグを削除
  await tx.recipeTag.deleteMany({
    where: { recipeId },
  })

  // 子レシピ関係を削除（親として）
  await tx.recipeRelation.deleteMany({
    where: { parentRecipeId: recipeId },
  })
}

/**
 * レシピを削除（関連データも含む）
 */
export async function deleteRecipe(tx: Prisma.TransactionClient, recipeId: string) {
  // 関連データを削除
  await deleteRelatedData(tx, recipeId)

  // 子レシピ関係を削除（子として参照されている場合）
  await tx.recipeRelation.deleteMany({
    where: { childRecipeId: recipeId },
  })

  // レシピバージョンを削除
  await tx.recipeVersion.deleteMany({
    where: { recipeId },
  })

  // OCR処理履歴を削除
  await tx.ocrProcessingHistory.deleteMany({
    where: { recipeId },
  })

  // レシピ本体を削除
  await tx.recipe.delete({
    where: { id: recipeId },
  })
}
