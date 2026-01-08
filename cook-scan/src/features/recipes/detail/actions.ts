'use server'

import { requireUserProfile } from '@/features/auth/auth-utils'
import { prisma } from '@/lib/prisma'

export async function getRecipeById(recipeId: string) {
  const profile = await requireUserProfile()

  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        userId: profile.id // Only allow access to user's own recipes
      },
      include: {
        ingredients: {
          orderBy: { createdAt: 'asc' }
        },
        steps: {
          orderBy: { orderIndex: 'asc' }
        },
        recipeTags: {
          include: {
            tag: {
              include: {
                category: true
              }
            }
          }
        },
        sourceInfo: true
      }
    })

    if (!recipe) {
      return { recipe: null, error: 'Recipe not found' }
    }

    return { recipe, error: null }
  } catch (error) {
    console.error('Failed to fetch recipe:', error)
    return { recipe: null, error: 'Failed to load recipe' }
  }
}