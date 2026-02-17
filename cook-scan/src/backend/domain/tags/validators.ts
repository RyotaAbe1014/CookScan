/**
 * Tag Domain Validators
 * ドメイン層のバリデーションスキーマ
 */

import { z } from 'zod'

// ===== Tag Category Validators =====

export const createTagCategoryInputSchema = z.object({
  name: z.string().min(1, 'カテゴリ名を入力してください').max(50, 'カテゴリ名は50文字以内で入力してください'),
  description: z.string().max(200, '説明は200文字以内で入力してください').optional(),
})

export const updateTagCategoryInputSchema = z.object({
  categoryId: z.string().min(1, 'カテゴリIDが必要です'),
  name: z.string().min(1, 'カテゴリ名を入力してください').max(50, 'カテゴリ名は50文字以内で入力してください'),
  description: z.string().max(200, '説明は200文字以内で入力してください').optional(),
})

// ===== Tag Validators =====

export const createTagInputSchema = z.object({
  categoryId: z.string().min(1, 'カテゴリIDが必要です'),
  name: z.string().min(1, 'タグ名を入力してください').max(50, 'タグ名は50文字以内で入力してください'),
  description: z.string().max(200, '説明は200文字以内で入力してください').optional(),
})

export const updateTagInputSchema = z.object({
  tagId: z.string().min(1, 'タグIDが必要です'),
  name: z.string().min(1, 'タグ名を入力してください').max(50, 'タグ名は50文字以内で入力してください'),
  description: z.string().max(200, '説明は200文字以内で入力してください').optional(),
})
