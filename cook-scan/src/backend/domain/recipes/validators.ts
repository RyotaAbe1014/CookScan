/**
 * Recipe Domain Validators
 * ドメイン層のバリデーションスキーマ
 */

import { z } from 'zod'

// ===== Ingredient Validator =====

export const ingredientInputSchema = z.object({
  name: z.string().min(1, '材料名を入力してください').max(100, '材料名は100文字以内で入力してください'),
  unit: z.string().max(50, '単位は50文字以内で入力してください').optional(),
  notes: z.string().max(200, 'メモは200文字以内で入力してください').optional(),
})

// ===== Step Validator =====

export const stepInputSchema = z.object({
  instruction: z.string().min(1, '手順を入力してください').max(1000, '手順は1000文字以内で入力してください'),
  timerSeconds: z.number().positive('タイマーは1秒以上を設定してください').optional(),
  orderIndex: z.number().optional(),
})

// ===== SourceInfo Validator =====

export const sourceInfoInputSchema = z
  .object({
    bookName: z.string().max(200, '書籍名は200文字以内で入力してください').optional(),
    pageNumber: z.string().max(20, 'ページ番号は20文字以内で入力してください').optional(),
    url: z.string().max(2000, 'URLは2000文字以内で入力してください').optional(),
  })
  .nullable()

// ===== ChildRecipeRelation Validator =====

export const childRecipeRelationInputSchema = z.object({
  childRecipeId: z.string().min(1, '子レシピを選択してください'),
  quantity: z.string().max(100, '分量は100文字以内').optional(),
  notes: z.string().max(500, 'メモは500文字以内').optional(),
})

// ===== Recipe Validators =====

export const createRecipeInputSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(100, 'タイトルは100文字以内で入力してください'),
  sourceInfo: sourceInfoInputSchema,
  ingredients: z.array(ingredientInputSchema),
  steps: z.array(stepInputSchema),
  memo: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
  tags: z.array(z.string()),
  childRecipes: z.array(childRecipeRelationInputSchema).optional(),
})

export const updateRecipeInputSchema = z.object({
  recipeId: z.string().min(1, 'レシピIDが必要です'),
  title: z.string().min(1, 'タイトルを入力してください').max(100, 'タイトルは100文字以内で入力してください'),
  sourceInfo: sourceInfoInputSchema,
  ingredients: z.array(ingredientInputSchema),
  steps: z.array(
    stepInputSchema.extend({
      orderIndex: z.number(),
    })
  ),
  memo: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
  tags: z.array(z.string()),
  childRecipes: z.array(childRecipeRelationInputSchema).optional(),
})
