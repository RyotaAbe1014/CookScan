import type { Result } from '@/utils/result'
import { failure, Errors } from '@/utils/result'
import { checkUserProfile, type UserProfile } from '@/features/auth/auth-utils'

/**
 * 認証必須のServer Actionラッパー
 * 認証チェックを自動化し、認証済みの場合のみコールバックを実行
 *
 * @example
 * ```ts
 * export async function deleteRecipe(recipeId: string): Promise<Result<void>> {
 *   return withAuth(async (profile) => {
 *     // profileは認証済みユーザー
 *     await prisma.recipe.delete({ where: { id: recipeId, userId: profile.id } })
 *     return success(undefined)
 *   })
 * }
 * ```
 */
export async function withAuth<T>(
  action: (profile: UserProfile) => Promise<Result<T>>
): Promise<Result<T>> {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth) {
    return failure(Errors.unauthenticated())
  }

  if (!hasProfile || !profile) {
    return failure(Errors.unauthenticated('プロフィール設定が必要です'))
  }

  return action(profile)
}

