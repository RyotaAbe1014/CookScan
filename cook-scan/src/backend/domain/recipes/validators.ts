/**
 * Recipe Domain Validators
 * ドメイン層のバリデーションスキーマ
 */

import { z } from 'zod'

// ===== Ingredient Validator =====

export const ingredientInputSchema = z.object({
  name: z.string().min(1, '材料名を入力してください'),
  unit: z.string().optional(),
  notes: z.string().optional(),
})

// ===== Step Validator =====

export const stepInputSchema = z.object({
  instruction: z.string().min(1, '手順を入力してください'),
  timerSeconds: z.number().optional(),
  orderIndex: z.number().optional(),
})

// ===== SourceInfo Validator =====

export const sourceInfoInputSchema = z
  .object({
    bookName: z.string().optional(),
    pageNumber: z.string().optional(),
    url: z.string().optional(),
  })
  .nullable()

// ===== Recipe Validators =====

export const createRecipeInputSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  sourceInfo: sourceInfoInputSchema,
  ingredients: z.array(ingredientInputSchema),
  steps: z.array(stepInputSchema),
  memo: z.string().optional(),
  tags: z.array(z.string()),
})

export const updateRecipeInputSchema = z.object({
  recipeId: z.string().min(1, 'レシピIDが必要です'),
  title: z.string().min(1, 'タイトルを入力してください'),
  sourceInfo: sourceInfoInputSchema,
  ingredients: z.array(ingredientInputSchema),
  steps: z.array(
    stepInputSchema.extend({
      orderIndex: z.number(),
    })
  ),
  memo: z.string().optional(),
  tags: z.array(z.string()),
})
