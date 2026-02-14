'use server'

import { adminClient } from '@/lib/supabase/admin'
import { z } from 'zod'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'

const inviteSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
})

/**
 * ユーザーを招待する
 * @param email 招待するメールアドレス
 */
export async function inviteUser(email: string): Promise<Result<void>> {
  // バリデーション
  const validation = inviteSchema.safeParse({ email })
  if (!validation.success) {
    return failure(Errors.validation(validation.error.issues[0].message))
  }

  try {
    // Supabase Admin API で招待メールを送信
    const { error } = await adminClient.auth.admin.inviteUserByEmail(
      validation.data.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      }
    )

    if (error) {
      console.error('Invite user error:', error)
      return failure(Errors.server(error.message || '招待の送信に失敗しました'))
    }

    return success(undefined)
  } catch (error) {
    console.error('Failed to invite user:', error)
    return failure(Errors.server('招待の送信に失敗しました'))
  }
}
