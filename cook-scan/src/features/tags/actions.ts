'use server'

import { revalidatePath } from 'next/cache'
import * as TagService from '@/backend/services/tags'
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
      const result = await TagService.createTagCategory(profile.id, { name, description })

      revalidatePath('/tags')
      return success(result)
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
      const result = await TagService.createTag(profile.id, { categoryId, name, description })

      revalidatePath('/tags')
      return success(result)
    } catch (error) {
      console.error('Failed to create tag:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('カテゴリ'))
        }
        if (error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
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
      await TagService.updateTag(profile.id, { tagId, name, description })

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to update tag:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('タグ'))
        }
        if (error.message.includes('編集できません') || error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
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
      await TagService.deleteTag(profile.id, tagId)

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to delete tag:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('タグ'))
        }
        if (error.message.includes('削除できません') || error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
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
      await TagService.updateTagCategory(profile.id, { categoryId, name, description })

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to update tag category:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('カテゴリ'))
        }
        if (error.message.includes('編集できません') || error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
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
      await TagService.deleteTagCategory(profile.id, categoryId)

      revalidatePath('/tags')
      return success(undefined)
    } catch (error) {
      console.error('Failed to delete tag category:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('カテゴリ'))
        }
        if (error.message.includes('削除できません') || error.message.includes('権限がありません')) {
          if (error.message.includes('個のタグがあるため')) {
            return failure(Errors.conflict(error.message))
          }
          return failure(Errors.forbidden(error.message))
        }
      }
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
      const tagCategories = await TagService.getAllTagsForRecipe(profile.id)

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
export async function getTagCategoriesWithTags(): Promise<
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
  return withAuth(async (profile) => {
    try {
      const result = await TagService.getTagCategoriesWithTags(profile.id)

      return success(result)
    } catch (error) {
      console.error('Failed to fetch tag categories:', error)
      return failure(Errors.server('タグカテゴリの取得に失敗しました'))
    }
  })
}
