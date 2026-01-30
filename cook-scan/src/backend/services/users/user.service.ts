/**
 * User Service
 * ビジネスロジック
 */

import * as UserRepository from '@/backend/repositories/user.repository'
import type {
  CreateProfileInput,
  UpdateProfileInput,
  UserProfileOutput,
  ProfileCheckResult,
} from '@/backend/domain/users'

// ===== Profile Services =====

/**
 * プロフィール存在確認
 */
export async function checkExistingProfile(authId: string): Promise<ProfileCheckResult> {
  const profile = await UserRepository.findUserByAuthId(authId)

  return {
    exists: !!profile,
    profile,
  }
}

/**
 * プロフィールを作成
 */
export async function createProfile(input: CreateProfileInput): Promise<UserProfileOutput> {
  const { authId, email, name } = input

  // 既存プロフィールの確認
  const existing = await UserRepository.findUserByAuthId(authId)
  if (existing) {
    throw new Error('プロフィールは既に作成されています')
  }

  return UserRepository.createUser(authId, email, name)
}

/**
 * プロフィールを更新
 */
export async function updateProfile(
  authId: string,
  input: UpdateProfileInput
): Promise<UserProfileOutput> {
  const { name } = input

  // プロフィールの存在確認
  const existing = await UserRepository.findUserByAuthId(authId)
  if (!existing) {
    throw new Error('プロフィールが見つかりません')
  }

  return UserRepository.updateUser(authId, name)
}

/**
 * プロフィールを取得
 */
export async function getUserProfile(authId: string): Promise<UserProfileOutput | null> {
  return UserRepository.findUserByAuthId(authId)
}
