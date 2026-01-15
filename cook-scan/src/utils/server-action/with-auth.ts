import type { User } from '@prisma/client'
import type { Result } from '@/utils/result'
import { failure, success, Errors } from '@/utils/result'
import { checkUserProfile } from '@/features/auth/auth-utils'

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
  action: (profile: User) => Promise<Result<T>>
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

/**
 * 認証必須のServer Actionラッパー（try-catch付き）
 * エラーを自動的にResult型に変換
 *
 * @example
 * ```ts
 * export async function getRecipes(): Promise<Result<Recipe[]>> {
 *   return withAuthSafe(
 *     async (profile) => {
 *       return await prisma.recipe.findMany({ where: { userId: profile.id } })
 *     },
 *     'レシピの取得に失敗しました'
 *   )
 * }
 * ```
 */
export async function withAuthSafe<T>(
  action: (profile: User) => Promise<T>,
  errorMessage = 'エラーが発生しました'
): Promise<Result<T>> {
  return withAuth(async (profile) => {
    try {
      const data = await action(profile)
      return success(data)
    } catch (error) {
      console.error('Server Action error:', error)
      return failure(Errors.server(errorMessage))
    }
  })
}
