'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { CreateRecipeRequest } from '@/features/recipes/upload/types'
import { Prisma } from '@prisma/client'
import { validateTagIdsForUser } from '@/features/tags/tag-utils'
import { sanitizeUrl } from '@/utils/url-validation'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

export async function createRecipe(
  request: CreateRecipeRequest
): Promise<Result<{ recipeId: string }>> {
  const { title, sourceInfo, ingredients, steps, memo, tags } = request

  return withAuth(async (profile) => {
    try {
      const { validTagIds, isValid } = await validateTagIdsForUser(tags ?? [], profile.id)

      if (!isValid) {
        return failure(Errors.validation('無効なタグが含まれています'))
      }

      // Create recipe with all related data in a transaction
      const recipe = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Create the main recipe
        const newRecipe = await tx.recipe.create({
          data: {
            userId: profile.id,
            title,
            memo: memo || null,
          },
        })

        // Create ingredients
        if (ingredients.length > 0) {
          await tx.ingredient.createMany({
            data: ingredients.map((ingredient) => ({
              recipeId: newRecipe.id,
              name: ingredient.name,
              unit: ingredient.unit || null,
              notes: ingredient.notes || null,
            })),
          })
        }

        // Create steps
        if (steps.length > 0) {
          await tx.step.createMany({
            data: steps.map((step, index) => ({
              recipeId: newRecipe.id,
              orderIndex: index + 1,
              instruction: step.instruction,
              timerSeconds: step.timerSeconds || null,
            })),
          })
        }

        // Create source info if provided
        if (sourceInfo && (sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url)) {
          const sanitizedUrl = sanitizeUrl(sourceInfo.url)
          await tx.sourceInfo.create({
            data: {
              recipeId: newRecipe.id,
              sourceName: sourceInfo.bookName || null,
              pageNumber: sourceInfo.pageNumber || null,
              sourceUrl: sanitizedUrl,
            },
          })
        }

        // Create recipe tags if provided
        if (validTagIds.length > 0) {
          await tx.recipeTag.createMany({
            data: validTagIds.map((tagId) => ({
              recipeId: newRecipe.id,
              tagId,
            })),
          })
        }

        return newRecipe
      })

      // Revalidate recipe list and detail pages
      revalidatePath('/recipes')
      revalidatePath(`/recipes/${recipe.id}`)

      return success({ recipeId: recipe.id })
    } catch (error) {
      console.error('Failed to create recipe:', error)
      return failure(Errors.server('レシピの作成に失敗しました'))
    }
  })
}
