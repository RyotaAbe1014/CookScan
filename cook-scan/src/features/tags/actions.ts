'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'

/**
 * タグカテゴリを作成
 */
export async function createTagCategory(name: string, description?: string) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    const category = await prisma.tagCategory.create({
      data: {
        userId: profile.id,
        name,
        description: description || null,
        isSystem: false,
      }
    })

    revalidatePath('/tags')
    return { success: true, categoryId: category.id }
  } catch (error) {
    console.error('Failed to create tag category:', error)
    return { success: false, error: 'カテゴリの作成に失敗しました' }
  }
}

/**
 * タグを作成
 */
export async function createTag(categoryId: string, name: string, description?: string) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    // カテゴリの存在と権限を確認
    const category = await prisma.tagCategory.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return { success: false, error: 'カテゴリが見つかりません' }
    }

    // システムカテゴリ、または自分のカテゴリのみタグを作成可能
    if (!category.isSystem && category.userId !== profile.id) {
      return { success: false, error: 'このカテゴリにタグを作成する権限がありません' }
    }

    const tag = await prisma.tag.create({
      data: {
        categoryId,
        name,
        description: description || null,
        isSystem: false,
      }
    })

    revalidatePath('/tags')
    return { success: true, tagId: tag.id }
  } catch (error) {
    console.error('Failed to create tag:', error)
    return { success: false, error: 'タグの作成に失敗しました' }
  }
}

/**
 * タグを更新
 */
export async function updateTag(tagId: string, name: string, description?: string) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    // タグの存在と権限を確認
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: { category: true }
    })

    if (!tag) {
      return { success: false, error: 'タグが見つかりません' }
    }

    // システムタグは編集不可
    if (tag.isSystem) {
      return { success: false, error: 'システムタグは編集できません' }
    }

    // 自分のカテゴリのタグのみ編集可能
    if (tag.category.userId !== profile.id) {
      return { success: false, error: 'このタグを編集する権限がありません' }
    }

    await prisma.tag.update({
      where: { id: tagId },
      data: {
        name,
        description: description || null,
      }
    })

    revalidatePath('/tags')
    return { success: true }
  } catch (error) {
    console.error('Failed to update tag:', error)
    return { success: false, error: 'タグの更新に失敗しました' }
  }
}

/**
 * タグを削除
 */
export async function deleteTag(tagId: string) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    // タグの存在と権限を確認
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        category: true,
        recipeTags: true,
      }
    })

    if (!tag) {
      return { success: false, error: 'タグが見つかりません' }
    }

    // システムタグは削除不可
    if (tag.isSystem) {
      return { success: false, error: 'システムタグは削除できません' }
    }

    // 自分のカテゴリのタグのみ削除可能
    if (tag.category.userId !== profile.id) {
      return { success: false, error: 'このタグを削除する権限がありません' }
    }

    // 使用中のタグは削除不可
    if (tag.recipeTags.length > 0) {
      return {
        success: false,
        error: `このタグは${tag.recipeTags.length}件のレシピで使用されているため削除できません`
      }
    }

    await prisma.tag.delete({
      where: { id: tagId }
    })

    revalidatePath('/tags')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete tag:', error)
    return { success: false, error: 'タグの削除に失敗しました' }
  }
}

/**
 * タグカテゴリを更新
 */
export async function updateTagCategory(categoryId: string, name: string, description?: string) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    // カテゴリの存在と権限を確認
    const category = await prisma.tagCategory.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return { success: false, error: 'カテゴリが見つかりません' }
    }

    // システムカテゴリは編集不可
    if (category.isSystem) {
      return { success: false, error: 'システムカテゴリは編集できません' }
    }

    // 自分のカテゴリのみ編集可能
    if (category.userId !== profile.id) {
      return { success: false, error: 'このカテゴリを編集する権限がありません' }
    }

    await prisma.tagCategory.update({
      where: { id: categoryId },
      data: {
        name,
        description: description || null,
      }
    })

    revalidatePath('/tags')
    return { success: true }
  } catch (error) {
    console.error('Failed to update tag category:', error)
    return { success: false, error: 'カテゴリの更新に失敗しました' }
  }
}

/**
 * タグカテゴリを削除
 */
export async function deleteTagCategory(categoryId: string) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    // カテゴリの存在と権限を確認
    const category = await prisma.tagCategory.findUnique({
      where: { id: categoryId },
      include: { tags: true }
    })

    if (!category) {
      return { success: false, error: 'カテゴリが見つかりません' }
    }

    // システムカテゴリは削除不可
    if (category.isSystem) {
      return { success: false, error: 'システムカテゴリは削除できません' }
    }

    // 自分のカテゴリのみ削除可能
    if (category.userId !== profile.id) {
      return { success: false, error: 'このカテゴリを削除する権限がありません' }
    }

    // タグが存在する場合は削除不可
    if (category.tags.length > 0) {
      return {
        success: false,
        error: `このカテゴリには${category.tags.length}個のタグがあるため削除できません`
      }
    }

    await prisma.tagCategory.delete({
      where: { id: categoryId }
    })

    revalidatePath('/tags')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete tag category:', error)
    return { success: false, error: 'カテゴリの削除に失敗しました' }
  }
}
