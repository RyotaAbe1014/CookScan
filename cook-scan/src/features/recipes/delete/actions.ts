'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireUserProfile } from '@/features/auth/auth-utils'
import { Prisma } from '@prisma/client'

export async function deleteRecipe(recipeId: string) {
  const profile = await requireUserProfile()

  try {
    // Verify that the recipe belongs to the current user
    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        userId: profile.id
      }
    })

    if (!existingRecipe) {
      return { success: false, error: 'レシピが見つかりません' }
    }

    // Delete recipe and all related data (cascade delete)
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete related data first (due to foreign key constraints)
      await tx.ingredient.deleteMany({
        where: { recipeId }
      })

      await tx.step.deleteMany({
        where: { recipeId }
      })

      await tx.sourceInfo.deleteMany({
        where: { recipeId }
      })

      await tx.recipeTag.deleteMany({
        where: { recipeId }
      })

      // Delete recipe versions
      await tx.recipeVersion.deleteMany({
        where: { recipeId }
      })

      // Delete OCR processing history (unique constraint)
      await tx.ocrProcessingHistory.deleteMany({
        where: { recipeId }
      })
      // Finally delete the recipe itself
      await tx.recipe.delete({
        where: { id: recipeId }
      })
    })

    // Revalidate recipe list and detail pages
    revalidatePath('/recipes')
    revalidatePath(`/recipes/${recipeId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to delete recipe:', error)
    return { success: false, error: 'レシピの削除に失敗しました' }
  }
}