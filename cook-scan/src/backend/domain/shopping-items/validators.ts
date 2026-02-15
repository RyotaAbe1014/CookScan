/**
 * ShoppingItem Domain Validators
 * ドメイン層のバリデーションスキーマ
 */

import { z } from 'zod'

export const createShoppingItemInputSchema = z.object({
  name: z.string().min(1, 'アイテム名を入力してください').max(100, 'アイテム名は100文字以内で入力してください'),
  memo: z.string().max(500, 'メモは500文字以内で入力してください').optional(),
})

export const updateShoppingItemInputSchema = z.object({
  itemId: z.string().min(1, 'アイテムIDが必要です'),
  name: z.string().min(1, 'アイテム名を入力してください').max(100, 'アイテム名は100文字以内で入力してください'),
  memo: z.string().max(500, 'メモは500文字以内で入力してください').optional(),
})

export const updateShoppingItemCheckInputSchema = z.object({
  itemId: z.string().min(1, 'アイテムIDが必要です'),
  isChecked: z.boolean(),
})

export const reorderShoppingItemsInputSchema = z.object({
  itemIds: z.array(z.string().min(1)).min(1, '並び替えるアイテムが必要です'),
})
