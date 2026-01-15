'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Result } from '@/utils/result'
import { failure, Errors } from '@/utils/result'

// バリデーションスキーマ
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z
      .string()
      .min(8, 'パスワードは8文字以上である必要があります')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードには大文字、小文字、数字を含める必要があります'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

/**
 * パスワードを更新
 * 成功時はログインページにリダイレクト
 */
export async function updatePassword(formData: PasswordChangeFormData): Promise<Result<void>> {
  const supabase = await createClient()

  // 1. セッション確認（認証チェック）
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return failure(
      Errors.unauthenticated('ログインセッションが無効です。再度ログインしてください。')
    )
  }

  // 2. バリデーション
  const validationResult = passwordChangeSchema.safeParse(formData)
  if (!validationResult.success) {
    return failure(Errors.validation(validationResult.error.errors[0].message))
  }

  const { currentPassword, newPassword } = validationResult.data

  // 3. 現在のパスワード検証（再認証による確認）
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })

  if (verifyError) {
    return failure(Errors.validation('現在のパスワードが正しくありません'))
  }

  // 4. パスワード更新
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return failure(
      Errors.server('パスワードの更新に失敗しました。時間をおいて再度お試しください。')
    )
  }

  // 5. 全デバイスからログアウト（セキュリティベストプラクティス）
  await supabase.auth.signOut({ scope: 'global' })

  // 6. ログインページへリダイレクト
  const message = encodeURIComponent(
    'パスワードを変更しました。新しいパスワードでログインしてください。'
  )
  redirect(`/login?message=${message}`)
}
