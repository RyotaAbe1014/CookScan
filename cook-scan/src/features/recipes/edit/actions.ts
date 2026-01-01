'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'
import { UpdateRecipeRequest, UpdateRecipeResponse } from '@/features/recipes/edit/types'
import { Prisma } from '@prisma/client'
import { validateTagIdsForUser } from '@/features/tags/tag-utils'

export async function updateRecipe(request: UpdateRecipeRequest): Promise<UpdateRecipeResponse> {
  const { recipeId, title, sourceInfo, ingredients, steps, memo, tags } = request

  // Get current user
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    const { validTagIds, isValid } = await validateTagIdsForUser(
      tags ?? [],
      profile.id
    )

    if (!isValid) {
      return { success: false, error: '無効なタグが含まれています' }
    }

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

    // Update recipe with all related data in a transaction
    const updatedRecipe = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update the main recipe
      const recipe = await tx.recipe.update({
        where: { id: recipeId },
        data: {
          title,
          memo: memo || null,
          updatedAt: new Date()
        }
      })

      // Delete existing ingredients and create new ones
      await tx.ingredient.deleteMany({
        where: { recipeId }
      })

      if (ingredients.length > 0) {
        await tx.ingredient.createMany({
          data: ingredients.map((ingredient) => ({
            recipeId,
            name: ingredient.name,
            unit: ingredient.unit || null,
            notes: ingredient.notes || null,
          }))
        })
      }

      // Delete existing steps and create new ones
      await tx.step.deleteMany({
        where: { recipeId }
      })

      if (steps.length > 0) {
        await tx.step.createMany({
          data: steps.map((step) => ({
            recipeId,
            orderIndex: step.orderIndex,
            instruction: step.instruction,
            timerSeconds: step.timerSeconds || null,
          }))
        })
      }

      // Update source info
      await tx.sourceInfo.deleteMany({
        where: { recipeId }
      })

      if (sourceInfo && (sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url)) {
        await tx.sourceInfo.create({
          data: {
            recipeId,
            sourceName: sourceInfo.bookName || null,
            pageNumber: sourceInfo.pageNumber || null,
            sourceUrl: sourceInfo.url || null,
          }
        })
      }

      // Update recipe tags
      await tx.recipeTag.deleteMany({
        where: { recipeId }
      })

      if (validTagIds.length > 0) {
        await tx.recipeTag.createMany({
          data: validTagIds.map(tagId => ({
            recipeId,
            tagId
          }))
        })
      }

      return recipe
    })

    // Revalidate recipe list and detail pages
    revalidatePath('/recipes')
    revalidatePath(`/recipes/${recipeId}`)

    return { success: true, recipeId: updatedRecipe.id }
  } catch (error) {
    console.error('Failed to update recipe:', error)
    return { success: false, error: 'レシピの更新に失敗しました' }
  }
}
