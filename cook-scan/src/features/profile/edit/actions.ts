'use server'

import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'
import { z } from 'zod'
import { refresh } from 'next/cache'

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
export async function getUserProfile() {
  const { hasAuth, authUser, profile } = await checkUserProfile()

  if (!hasAuth || !authUser) {
    throw new Error('認証エラー')
  }

  if (!profile) {
    throw new Error('プロフィールが見つかりません')
  }

  return profile
}

/**
 * ユーザープロフィールを更新
 */
export async function updateUserProfile(data: { name: string }) {
  // バリデーション
  const validation = profileUpdateSchema.safeParse(data)
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    }
  }

  // 認証確認
  const { hasAuth, authUser, profile } = await checkUserProfile()

  if (!hasAuth || !authUser) {
    return {
      success: false,
      error: '認証エラーが発生しました',
    }
  }

  if (!profile) {
    return {
      success: false,
      error: 'プロフィールが見つかりません',
    }
  }

  try {
    // プロフィール更新
    await prisma.user.update({
      where: { authId: authUser.id },
      data: {
        name: validation.data.name,
        // updatedAtは@updatedAtにより自動更新
      },
    })

    refresh()

    return { success: true }
  } catch (error) {
    console.error('Failed to update profile:', error)
    return {
      success: false,
      error: 'プロフィールの更新に失敗しました',
    }
  }
}
