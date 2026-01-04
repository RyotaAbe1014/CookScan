'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'
import { CreateRecipeRequest } from '@/features/recipes/upload/types'
import { Prisma } from '@prisma/client'
import { validateTagIdsForUser } from '@/features/tags/tag-utils'
import { sanitizeUrl } from '@/utils/url-validation'

export async function createRecipe(request: CreateRecipeRequest) {
  const { title, sourceInfo, ingredients, steps, memo, tags } = request

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

    // Create recipe with all related data in a transaction
    const recipe = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the main recipe
      const newRecipe = await tx.recipe.create({
        data: {
          userId: profile.id,
          title,
          memo: memo || null,
        }
      })

      // Create ingredients
      if (ingredients.length > 0) {
        await tx.ingredient.createMany({
          data: ingredients.map((ingredient) => ({
            recipeId: newRecipe.id,
            name: ingredient.name,
            unit: ingredient.unit || null,
            notes: ingredient.notes || null,
          }))
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
          }))
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
          }
        })
      }

      // Create recipe tags if provided
      if (validTagIds.length > 0) {
        await tx.recipeTag.createMany({
          data: validTagIds.map(tagId => ({
            recipeId: newRecipe.id,
            tagId
          }))
        })
      }

      return newRecipe
    })

    // Revalidate recipe list and detail pages
    revalidatePath('/recipes')
    revalidatePath(`/recipes/${recipe.id}`)

    return { success: true, recipeId: recipe.id }
  } catch (error) {
    console.error('Failed to create recipe:', error)
    return { success: false, error: 'レシピの作成に失敗しました' }
  }
}
