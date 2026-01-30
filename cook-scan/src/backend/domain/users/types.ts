/**
 * User Domain Types
 * ドメイン層の型定義
 */

// ===== Input Types =====

/** プロフィール作成用の入力型 */
export type CreateProfileInput = {
  authId: string
  email: string
  name: string
}

/** プロフィール更新用の入力型 */
export type UpdateProfileInput = {
  name: string
}

// ===== Output Types =====

/** ユーザープロフィールの出力型 */
export type UserProfileOutput = {
  id: string
  authId: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

/** プロフィール存在確認の結果型 */
export type ProfileCheckResult = {
  exists: boolean
  profile: UserProfileOutput | null
}
