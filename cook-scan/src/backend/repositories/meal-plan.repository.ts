/**
 * MealPlan Repository
 * Prismaクエリの集約
 */

import { prisma } from '@/lib/prisma'

const mealPlanItemInclude = {
  recipe: {
    include: {
      ingredients: true,
    },
  },
} as const

/**
 * 週の献立プランを取得
 */
export async function findMealPlanByWeek(userId: string, weekStart: Date) {
  return prisma.mealPlan.findUnique({
    where: {
      userId_weekStart: { userId, weekStart },
    },
    include: {
      items: {
        include: mealPlanItemInclude,
        orderBy: [{ dayOfWeek: 'asc' }, { createdAt: 'asc' }],
      },
    },
  })
}

/**
 * 献立プランを取得または作成
 */
export async function upsertMealPlan(userId: string, weekStart: Date) {
  return prisma.mealPlan.upsert({
    where: {
      userId_weekStart: { userId, weekStart },
    },
    create: { userId, weekStart },
    update: {},
    include: {
      items: {
        include: mealPlanItemInclude,
        orderBy: [{ dayOfWeek: 'asc' }, { createdAt: 'asc' }],
      },
    },
  })
}

/**
 * 献立プランアイテムを追加
 */
export async function createMealPlanItem(
  mealPlanId: string,
  dayOfWeek: number,
  recipeId: string
) {
  return prisma.mealPlanItem.create({
    data: { mealPlanId, dayOfWeek, recipeId },
    include: mealPlanItemInclude,
  })
}

/**
 * 献立プランアイテムをIDで取得
 */
export async function findMealPlanItemById(itemId: string) {
  return prisma.mealPlanItem.findUnique({
    where: { id: itemId },
    include: {
      mealPlan: true,
    },
  })
}

/**
 * 献立プランアイテムを削除
 */
export async function deleteMealPlanItem(itemId: string) {
  return prisma.mealPlanItem.delete({
    where: { id: itemId },
  })
}
