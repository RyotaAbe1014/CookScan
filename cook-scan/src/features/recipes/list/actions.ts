'use server'

import { prisma } from '@/lib/prisma'
import { buildTagFilters } from './utils'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'
import type { Ingredient } from '@/types/ingredient'

type RecipeWithRelations = {
  id: string
  userId: string
  title: string
  parentRecipeId: string | null
  imageUrl: string | null
  memo: string | null
  createdAt: Date
  updatedAt: Date
  ingredients: Ingredient[]
  recipeTags: Array<{
    tagId: string
    recipeId: string
    tag: {
      id: string
      name: string
      description: string | null
      isSystem: boolean
      userId: string | null
      categoryId: string
    }
  }>
}

type TagCategoryWithTags = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  userId: string | null
  tags: {
    id: string
    name: string
    description: string | null
  }[]
}

/**
 * フィルタ条件に基づいてレシピを取得
 */
export async function getRecipesWithFilters(
  userId: string,
  searchQuery: string,
  tagIds: string[]
): Promise<Result<RecipeWithRelations[]>> {
  return withAuth(async () => {
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

      return success(recipes)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
      return failure(Errors.server('レシピの取得に失敗しました'))
    }
  })
}

/**
 * ユーザー用のタグカテゴリを取得
 */
export async function getTagCategoriesForUser(
  userId: string
): Promise<Result<TagCategoryWithTags[]>> {
  return withAuth(async () => {
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

      return success(tagCategories)
    } catch (error) {
      console.error('Failed to fetch tag categories:', error)
      return failure(Errors.server('タグカテゴリの取得に失敗しました'))
    }
  })
}
