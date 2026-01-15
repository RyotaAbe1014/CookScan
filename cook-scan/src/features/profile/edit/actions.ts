'use server'

import { prisma } from '@/lib/prisma'
import { checkUserProfile, type UserProfile } from '@/features/auth/auth-utils'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'

// バリデーションスキーマ
const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(50, '名前は50文字以内で入力してください')
    .trim()
    .refine((val) => val.length > 0, {
      message: '空白のみの名前は使用できません',
    }),
})

/**
 * 現在のユーザープロフィールを取得
 */
export async function getUserProfile(): Promise<Result<UserProfile>> {
  const { hasAuth, authUser, profile } = await checkUserProfile()

  if (!hasAuth || !authUser) {
    return failure(Errors.unauthenticated())
  }

  if (!profile) {
    return failure(Errors.notFound('プロフィール'))
  }

  return success(profile)
}

/**
 * ユーザープロフィールを更新
 */
export async function updateUserProfile(data: { name: string }): Promise<Result<void>> {
  // バリデーション
  const validation = profileUpdateSchema.safeParse(data)
  if (!validation.success) {
    return failure(Errors.validation(validation.error.errors[0].message))
  }

  // 認証確認
  const { hasAuth, authUser, profile } = await checkUserProfile()

  if (!hasAuth || !authUser) {
    return failure(Errors.unauthenticated())
  }

  if (!profile) {
    return failure(Errors.notFound('プロフィール'))
  }

  try {
    // プロフィール更新
    await prisma.user.update({
      where: { authId: authUser.id },
      data: {
        name: validation.data.name,
      },
    })

    revalidatePath('/settings/profile')

    return success(undefined)
  } catch (error) {
    console.error('Failed to update profile:', error)
    return failure(Errors.server('プロフィールの更新に失敗しました'))
  }
}
