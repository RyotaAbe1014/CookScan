'use server'

import { checkUserProfile, type UserProfile } from '@/features/auth/auth-utils'
import * as UserService from '@/backend/services/users'
import { updateProfileInputSchema } from '@/backend/domain/users'
import { revalidatePath } from 'next/cache'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'

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
  const validation = updateProfileInputSchema.safeParse(data)
  if (!validation.success) {
    return failure(Errors.validation(validation.error.issues[0].message))
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
    await UserService.updateProfile(authUser.id, validation.data)

    revalidatePath('/settings/profile')

    return success(undefined)
  } catch (error) {
    console.error('Failed to update profile:', error)
    if (error instanceof Error && error.message.includes('見つかりません')) {
      return failure(Errors.notFound('プロフィール'))
    }
    return failure(Errors.server('プロフィールの更新に失敗しました'))
  }
}
