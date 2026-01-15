'use server'

import { prisma } from '@/lib/prisma'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'
import type { Recipe, Ingredient, Step, RecipeTag, Tag, TagCategory, SourceInfo } from '@prisma/client'

export type RecipeWithRelations = Recipe & {
  ingredients: Ingredient[]
  steps: Step[]
  recipeTags: (RecipeTag & {
    tag: Tag & {
      category: TagCategory
    }
  })[]
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

      return success(recipe)
    } catch (error) {
      console.error('Failed to fetch recipe:', error)
      return failure(Errors.server('レシピの取得に失敗しました'))
    }
  })
}
