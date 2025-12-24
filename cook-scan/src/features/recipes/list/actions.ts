'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'
import { buildTagFilters } from './utils'

/**
 * フィルタ条件に基づいてレシピを取得
 */
export async function getRecipesWithFilters(
  userId: string,
  searchQuery: string,
  tagIds: string[]
) {
  const { hasAuth, hasProfile } = await checkUserProfile()

  if (!hasAuth || !hasProfile) {
    redirect('/login')
  }

  const tagFilters = buildTagFilters(tagIds)

  try {
    const recipes = await prisma.recipe.findMany({
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

    return { recipes, error: null }
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
    return { recipes: [], error: 'Failed to load recipes' }
  }
}

/**
 * ユーザー用のタグカテゴリを取得
 */
export async function getTagCategoriesForUser(userId: string) {
  const { hasAuth, hasProfile } = await checkUserProfile()

  if (!hasAuth || !hasProfile) {
    redirect('/login')
  }

  try {
    const tagCategories = await prisma.tagCategory.findMany({
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

    return { tagCategories, error: null }
  } catch (error) {
    console.error('Failed to fetch tag categories:', error)
    return { tagCategories: [], error: 'Failed to load tag categories' }
  }
}
