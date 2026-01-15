'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

export async function deleteRecipe(recipeId: string): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
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

      // Delete recipe and all related data (cascade delete)
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Delete related data first (due to foreign key constraints)
        await tx.ingredient.deleteMany({
          where: { recipeId },
        })

        await tx.step.deleteMany({
          where: { recipeId },
        })

        await tx.sourceInfo.deleteMany({
          where: { recipeId },
        })

        await tx.recipeTag.deleteMany({
          where: { recipeId },
        })

        // Delete recipe versions
        await tx.recipeVersion.deleteMany({
          where: { recipeId },
        })

        // Delete OCR processing history (unique constraint)
        await tx.ocrProcessingHistory.deleteMany({
          where: { recipeId },
        })
        // Finally delete the recipe itself
        await tx.recipe.delete({
          where: { id: recipeId },
        })
      })

      // Revalidate recipe list and detail pages
      revalidatePath('/recipes')
      revalidatePath(`/recipes/${recipeId}`)

      return success(undefined)
    } catch (error) {
      console.error('Failed to delete recipe:', error)
      return failure(Errors.server('レシピの削除に失敗しました'))
    }
  })
}
