'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'
import { CreateRecipeRequest } from '@/features/recipes/upload/types'

export async function createRecipe(request: CreateRecipeRequest) {
  const { title, sourceInfo, ingredients, steps, memo, tags } = request

  // Get current user
  const { hasAuth, hasProfile, profile } = await checkUserProfile()
  
  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  try {
    // Create recipe with all related data in a transaction
    const recipe = await prisma.$transaction(async (tx) => {
      // Create the main recipe
      const newRecipe = await tx.recipe.create({
        data: {
          userId: profile.id,
          title,
        }
      })

      // Create ingredients
      if (ingredients.length > 0) {
        await tx.ingredient.createMany({
          data: ingredients.map((ingredient, index) => ({
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
        await tx.sourceInfo.create({
          data: {
            recipeId: newRecipe.id,
            sourceName: sourceInfo.bookName || null,
            pageNumber: sourceInfo.pageNumber || null,
            sourceUrl: sourceInfo.url || null,
          }
        })
      }

      // Store memo in recipe version as a snapshot
      if (memo) {
        await tx.recipeVersion.create({
          data: {
            recipeId: newRecipe.id,
            versionNumber: 1,
            snapshot: {
              memo: memo
            },
            changeNote: 'Initial recipe creation',
            createdBy: profile.id,
          }
        })
      }

      return newRecipe
    })

    return { success: true, recipeId: recipe.id }
  } catch (error) {
    console.error('Failed to create recipe:', error)
    return { success: false, error: 'レシピの作成に失敗しました' }
  }
}