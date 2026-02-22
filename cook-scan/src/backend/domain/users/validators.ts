/**
 * User Domain Validators
 * ドメイン層のバリデーションスキーマ
 */

import { z } from 'zod'

// ===== Profile Validators =====

export const updateProfileInputSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(50, '名前は50文字以内で入力してください')
    .trim()
    .refine((val) => val.length > 0, {
      message: '空白のみの名前は使用できません',
    }),
})
