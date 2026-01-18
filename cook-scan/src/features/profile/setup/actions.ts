'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { checkUserProfile, type UserProfile } from '@/features/auth/auth-utils'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'

/**
 * 既存のプロフィールをチェック
 */
export async function checkExistingProfile(
  authId: string
): Promise<Result<{ exists: boolean; profile: UserProfile | null }>> {
  try {
    const existingProfile = await prisma.user.findUnique({
      where: { authId },
    })

    return success({ exists: !!existingProfile, profile: existingProfile })
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
    await prisma.user.create({
      data: {
        authId,
        email,
        name,
      },
    })
  } catch (error) {
    console.error('Failed to create profile:', error)
    return failure(Errors.server('プロフィールの作成に失敗しました'))
  }

  redirect('/dashboard')
}
