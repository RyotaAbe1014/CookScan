'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { checkUserProfile } from '@/features/auth/auth-utils'

/**
 * 既存のプロフィールをチェック
 */
export async function checkExistingProfile(authId: string) {
  try {
    const existingProfile = await prisma.user.findUnique({
      where: { authId },
    })

    return { exists: !!existingProfile, profile: existingProfile }
  } catch (error) {
    console.error('Failed to check existing profile:', error)
    return { exists: false, profile: null }
  }
}

export async function createProfile(authId: string, email: string, name: string) {
  // 現在のセッションユーザーを取得
  const { hasAuth, authUser, hasProfile } = await checkUserProfile()

  // 認証チェック
  if (!hasAuth || !authUser) {
    redirect('/login')
  }

  // authIdが現在のユーザーと一致するか検証
  if (authUser.id !== authId) {
    throw new Error('認証エラー: ユーザーIDが一致しません')
  }

  // 既にプロフィールが存在する場合はエラー
  if (hasProfile) {
    throw new Error('プロフィールは既に作成されています')
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
    throw new Error('プロフィールの作成に失敗しました')
  }

  redirect('/dashboard')
}
