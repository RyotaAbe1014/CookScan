'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

/**
 * タグカテゴリを作成
 */
export async function createTagCategory(
  name: string,
  description?: string
): Promise<Result<{ categoryId: string }>> {
  return withAuth(async (profile) => {
    try {
      const category = await prisma.tagCategory.create({
        data: {
          userId: profile.id,
          name,
          description: description || null,
          isSystem: false,
        },
      })

      revalidatePath('/tags')
      return success({ categoryId: category.id })
    } catch (error) {
      console.error('Failed to create tag category:', error)
      return failure(Errors.server('カテゴリの作成に失敗しました'))
    }
  })
}

/**
 * タグを作成
 */
export async function createTag(
  categoryId: string,
  name: string,
  description?: string
): Promise<Result<{ tagId: string }>> {
  return withAuth(async (profile) => {
    try {
      // カテゴリの存在と権限を確認
      const category = await prisma.tagCategory.findUnique({
        where: { id: categoryId },
      })

      if (!category) {
        return failure(Errors.notFound('カテゴリ'))
      }

      // システムカテゴリ、または自分のカテゴリのみタグを作成可能
      if (!category.isSystem && category.userId !== profile.id) {
        return failure(Errors.forbidden('このカテゴリにタグを作成する権限がありません'))
      }

      const tag = await prisma.tag.create({
        data: {
          categoryId,
          name,
          description: description || null,
          isSystem: false,
          userId: profile.id,
        },
      })

      revalidatePath('/tags')
      return success({ tagId: tag.id })
    } catch (error) {
      console.error('Failed to create tag:', error)
      return failure(Errors.server('タグの作成に失敗しました'))
    }
  })
}

/**
 * タグを更新
 */
export async function updateTag(
  tagId: string,
  name: string,
  description?: string
): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      // タグの存在と権限を確認
      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
        include: { category: true },
      })

      if (!tag) {
        return failure(Errors.notFound('タグ'))
      }

      // システムタグは編集不可
      if (tag.isSystem) {
        return failure(Errors.forbidden('システムタグは編集できません'))
      }

      // 自分が作成したタグのみ編集可能
      if (tag.userId !== profile.id) {
        return failure(Errors.forbidden('このタグを編集する権限がありません'))
      }

      await prisma.tag.update({
        where: { id: tagId },
        data: {
          name,
          description: description || null,
        },
      })

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to update tag:', error)
      return failure(Errors.server('タグの更新に失敗しました'))
    }
  })
}

/**
 * タグを削除
 */
export async function deleteTag(tagId: string): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      // タグの存在と権限を確認
      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
        include: {
          category: true,
          recipeTags: true,
        },
      })

      if (!tag) {
        return failure(Errors.notFound('タグ'))
      }

      // システムタグは削除不可
      if (tag.isSystem) {
        return failure(Errors.forbidden('システムタグは削除できません'))
      }

      // 自分が作成したタグのみ削除可能
      if (tag.userId !== profile.id) {
        return failure(Errors.forbidden('このタグを削除する権限がありません'))
      }

      // 使用中のタグは削除不可
      if (tag.recipeTags.length > 0) {
        return failure(
          Errors.conflict(
            `このタグは${tag.recipeTags.length}件のレシピで使用されているため削除できません`
          )
        )
      }

      await prisma.tag.delete({
        where: { id: tagId },
      })

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to delete tag:', error)
      return failure(Errors.server('タグの削除に失敗しました'))
    }
  })
}

/**
 * タグカテゴリを更新
 */
export async function updateTagCategory(
  categoryId: string,
  name: string,
  description?: string
): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      // カテゴリの存在と権限を確認
      const category = await prisma.tagCategory.findUnique({
        where: { id: categoryId },
      })

      if (!category) {
        return failure(Errors.notFound('カテゴリ'))
      }

      // システムカテゴリは編集不可
      if (category.isSystem) {
        return failure(Errors.forbidden('システムカテゴリは編集できません'))
      }

      // 自分のカテゴリのみ編集可能
      if (category.userId !== profile.id) {
        return failure(Errors.forbidden('このカテゴリを編集する権限がありません'))
      }

      await prisma.tagCategory.update({
        where: { id: categoryId },
        data: {
          name,
          description: description || null,
        },
      })

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to update tag category:', error)
      return failure(Errors.server('カテゴリの更新に失敗しました'))
    }
  })
}

/**
 * タグカテゴリを削除
 */
export async function deleteTagCategory(categoryId: string): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      // カテゴリの存在と権限を確認
      const category = await prisma.tagCategory.findUnique({
        where: { id: categoryId },
        include: { tags: true },
      })

      if (!category) {
        return failure(Errors.notFound('カテゴリ'))
      }

      // システムカテゴリは削除不可
      if (category.isSystem) {
        return failure(Errors.forbidden('システムカテゴリは削除できません'))
      }

      // 自分のカテゴリのみ削除可能
      if (category.userId !== profile.id) {
        return failure(Errors.forbidden('このカテゴリを削除する権限がありません'))
      }

      // タグが存在する場合は削除不可
      if (category.tags.length > 0) {
        return failure(
          Errors.conflict(
            `このカテゴリには${category.tags.length}個のタグがあるため削除できません`
          )
        )
      }

      await prisma.tagCategory.delete({
        where: { id: categoryId },
      })

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to delete tag category:', error)
      return failure(Errors.server('カテゴリの削除に失敗しました'))
    }
  })
}

/**
 * すべてのタグカテゴリとタグを取得（レシピ作成・編集時のタグ選択用）
 */
export async function getAllTagsForRecipe(): Promise<
  Result<
    Array<{
      id: string
      name: string
      description: string | null
      isSystem: boolean
      tags: Array<{
        id: string
        name: string
        description: string | null
      }>
    }>
  >
> {
  return withAuth(async (profile) => {
    try {
      const tagCategories = await prisma.tagCategory.findMany({
        where: {
          OR: [{ isSystem: true }, { userId: profile.id }],
        },
        include: {
          tags: {
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      })

      return success(tagCategories)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
      return failure(Errors.server('タグの取得に失敗しました'))
    }
  })
}

/**
 * タグカテゴリとタグ、レシピタグの関連を取得（タグページ用）
 */
export async function getTagCategoriesWithTags(userId: string): Promise<
  Result<{
    tagCategories: Array<{
      id: string
      name: string
      description: string | null
      isSystem: boolean
      userId: string | null
      tags: Array<{
        id: string
        name: string
        description: string | null
        isSystem: boolean
        userId: string | null
        categoryId: string
        recipeTags: Array<{ recipeId: string }>
      }>
    }>
  }>
> {
  return withAuth(async () => {
    try {
      const tagCategories = await prisma.tagCategory.findMany({
        where: {
          OR: [{ isSystem: true }, { userId }],
        },
        include: {
          tags: {
            include: {
              recipeTags: userId
                ? {
                    where: {
                      recipe: {
                        userId,
                      },
                    },
                    select: { recipeId: true },
                  }
                : {
                    select: { recipeId: true },
                  },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      })

      return success({ tagCategories })
    } catch (error) {
      console.error('Failed to fetch tag categories:', error)
      return failure(Errors.server('タグカテゴリの取得に失敗しました'))
    }
  })
}
