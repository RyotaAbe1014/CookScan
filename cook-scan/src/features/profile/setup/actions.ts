'use server'

import { redirect } from 'next/navigation'
import { checkUserProfile, type UserProfile } from '@/features/auth/auth-utils'
import * as UserService from '@/backend/services/users'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'

/**
 * 既存のプロフィールをチェック
 */
export async function checkExistingProfile(
  authId: string
): Promise<Result<{ exists: boolean; profile: UserProfile | null }>> {
  try {
    const result = await UserService.checkExistingProfile(authId)
    return success(result)
  } catch (error) {
    console.error('Failed to check existing profile:', error)
    return failure(Errors.server('プロフィールの確認に失敗しました'))
  }
}

/**
 * プロフィールを作成
 * 成功時はダッシュボードにリダイレクト
 */
export async function createProfile(
  authId: string,
  email: string,
  name: string
): Promise<Result<void>> {
  // 現在のセッションユーザーを取得
  const { hasAuth, authUser, hasProfile } = await checkUserProfile()

  // 認証チェック
  if (!hasAuth || !authUser) {
    redirect('/login')
  }

  // authIdが現在のユーザーと一致するか検証
  if (authUser.id !== authId) {
    return failure(Errors.forbidden('認証エラー: ユーザーIDが一致しません'))
  }

  // 既にプロフィールが存在する場合はエラー
  if (hasProfile) {
    return failure(Errors.conflict('プロフィールは既に作成されています'))
  }

  try {
    await UserService.createProfile({ authId, email, name })
  } catch (error) {
    console.error('Failed to create profile:', error)
    if (error instanceof Error && error.message.includes('既に作成されています')) {
      return failure(Errors.conflict(error.message))
    }
    return failure(Errors.server('プロフィールの作成に失敗しました'))
  }

  redirect('/dashboard')
}
