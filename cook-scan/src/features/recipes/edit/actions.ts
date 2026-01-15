'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UpdateRecipeRequest } from '@/features/recipes/edit/types'
import { validateTagIdsForUser } from '@/features/tags/tag-utils'
import { sanitizeUrl } from '@/utils/url-validation'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

export async function updateRecipe(
  request: UpdateRecipeRequest
): Promise<Result<{ recipeId: string }>> {
  const { recipeId, title, sourceInfo, ingredients, steps, memo, tags } = request

  return withAuth(async (profile) => {
    try {
      const { validTagIds, isValid } = await validateTagIdsForUser(tags ?? [], profile.id)

      if (!isValid) {
        return failure(Errors.validation('無効なタグが含まれています'))
      }

      // Verify that the recipe belongs to the current user
      const existingRecipe = await prisma.recipe.findFirst({
        where: {
          id: recipeId,
          userId: profile.id,
        },
      })

      if (!existingRecipe) {
        return failure(Errors.notFound('レシピ'))
      }

      // Update recipe with all related data in a transaction
      const updatedRecipe = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Update the main recipe
        const recipe = await tx.recipe.update({
          where: { id: recipeId },
          data: {
            title,
            memo: memo || null,
            updatedAt: new Date(),
          },
        })

        // Delete existing ingredients and create new ones
        await tx.ingredient.deleteMany({
          where: { recipeId },
        })

        if (ingredients.length > 0) {
          await tx.ingredient.createMany({
            data: ingredients.map((ingredient) => ({
              recipeId,
              name: ingredient.name,
              unit: ingredient.unit || null,
              notes: ingredient.notes || null,
            })),
          })
        }

        // Delete existing steps and create new ones
        await tx.step.deleteMany({
          where: { recipeId },
        })

        if (steps.length > 0) {
          await tx.step.createMany({
            data: steps.map((step) => ({
              recipeId,
              orderIndex: step.orderIndex,
              instruction: step.instruction,
              timerSeconds: step.timerSeconds || null,
            })),
          })
        }

        // Update source info
        await tx.sourceInfo.deleteMany({
          where: { recipeId },
        })

        if (sourceInfo && (sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url)) {
          const sanitizedUrl = sanitizeUrl(sourceInfo.url)
          await tx.sourceInfo.create({
            data: {
              recipeId,
              sourceName: sourceInfo.bookName || null,
              pageNumber: sourceInfo.pageNumber || null,
              sourceUrl: sanitizedUrl,
            },
          })
        }

        // Update recipe tags
        await tx.recipeTag.deleteMany({
          where: { recipeId },
        })

        if (validTagIds.length > 0) {
          await tx.recipeTag.createMany({
            data: validTagIds.map((tagId) => ({
              recipeId,
              tagId,
            })),
          })
        }

        return recipe
      })

      // Revalidate recipe list and detail pages
      revalidatePath('/recipes')
      revalidatePath(`/recipes/${recipeId}`)

      return success({ recipeId: updatedRecipe.id })
    } catch (error) {
      console.error('Failed to update recipe:', error)
      return failure(Errors.server('レシピの更新に失敗しました'))
    }
  })
}
