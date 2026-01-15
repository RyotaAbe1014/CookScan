'use server'

import { prisma } from '@/lib/prisma'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'
import type { Ingredient } from '@/types/ingredient'
import type { Step } from '@/types/step'
import type { SourceInfo } from '@/types/sourceInfo'

export type RecipeWithRelations = {
  id: string
  userId: string
  title: string
  parentRecipeId: string | null
  imageUrl: string | null
  memo: string | null
  createdAt: Date
  updatedAt: Date
  ingredients: Ingredient[]
  steps: Step[]
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
      category: {
        id: string
        name: string
        description: string | null
        isSystem: boolean
        userId: string | null
      }
    }
  }>
  sourceInfo: SourceInfo[]
}

export async function getRecipeById(recipeId: string): Promise<Result<RecipeWithRelations>> {
  return withAuth(async (profile) => {
    try {
      const recipe = await prisma.recipe.findFirst({
        where: {
          id: recipeId,
          userId: profile.id, // Only allow access to user's own recipes
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
        },
      })

      if (!recipe) {
        return failure(Errors.notFound('レシピ'))
      }

      return success(recipe as RecipeWithRelations)
    } catch (error) {
      console.error('Failed to fetch recipe:', error)
      return failure(Errors.server('レシピの取得に失敗しました'))
    }
  })
}
