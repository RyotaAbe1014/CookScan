/**
 * Tag Repository
 * Prismaクエリの集約
 */

import { prisma } from '@/lib/prisma'

// ===== Tag Category Operations =====

/**
 * タグカテゴリを作成
 */
export async function createTagCategory(userId: string, name: string, description?: string) {
  return prisma.tagCategory.create({
    data: {
      userId,
      name,
      description: description || null,
      isSystem: false,
    },
  })
}

/**
 * タグカテゴリをIDで取得
 */
export async function findTagCategoryById(categoryId: string) {
  return prisma.tagCategory.findUnique({
    where: { id: categoryId },
    include: { tags: true },
  })
}

/**
 * タグカテゴリを更新
 */
export async function updateTagCategory(categoryId: string, name: string, description?: string) {
  return prisma.tagCategory.update({
    where: { id: categoryId },
    data: {
      name,
      description: description || null,
    },
  })
}

/**
 * タグカテゴリを削除
 */
export async function deleteTagCategory(categoryId: string) {
  return prisma.tagCategory.delete({
    where: { id: categoryId },
  })
}

/**
 * ユーザーのタグカテゴリを取得（システムカテゴリ含む）
 */
export async function findTagCategoriesByUser(userId: string) {
  return prisma.tagCategory.findMany({
    where: {
      OR: [{ isSystem: true }, { userId }],
    },
    include: {
      tags: {
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}

/**
 * ユーザーのタグカテゴリを取得（レシピタグ数も含む）
 */
export async function findTagCategoriesWithRecipeTags(userId: string) {
  return prisma.tagCategory.findMany({
    where: {
      OR: [{ isSystem: true }, { userId }],
    },
    include: {
      tags: {
        include: {
          recipeTags: {
            where: {
              recipe: {
                userId,
              },
            },
            select: { recipeId: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}

// ===== Tag Operations =====

/**
 * タグを作成
 */
export async function createTag(
  categoryId: string,
  userId: string,
  name: string,
  description?: string
) {
  return prisma.tag.create({
    data: {
      categoryId,
      name,
      description: description || null,
      isSystem: false,
      userId,
    },
  })
}

/**
 * タグをIDで取得
 */
export async function findTagById(tagId: string) {
  return prisma.tag.findUnique({
    where: { id: tagId },
    include: {
      category: true,
      recipeTags: true,
    },
  })
}

/**
 * タグを更新
 */
export async function updateTag(tagId: string, name: string, description?: string) {
  return prisma.tag.update({
    where: { id: tagId },
    data: {
      name,
      description: description || null,
    },
  })
}

/**
 * タグを削除
 */
export async function deleteTag(tagId: string) {
  return prisma.tag.delete({
    where: { id: tagId },
  })
}

/**
 * タグIDのバリデーション（ユーザー所有権チェック）
 * tag-utils.tsの機能をRepositoryに移行
 */
export async function validateTagIdsForUser(
  tagIds: string[],
  userId: string
): Promise<{ validTagIds: string[]; isValid: boolean }> {
  const uniqueTagIds = Array.from(new Set(tagIds)).filter(Boolean)

  if (uniqueTagIds.length === 0) {
    return { validTagIds: [], isValid: true }
  }

  const validTags = await prisma.tag.findMany({
    where: {
      id: { in: uniqueTagIds },
      OR: [{ isSystem: true }, { user: { id: userId } }],
    },
    select: { id: true },
  })

  const validTagIds = validTags.map((tag) => tag.id)

  return {
    validTagIds,
    isValid: validTagIds.length === uniqueTagIds.length,
  }
}
