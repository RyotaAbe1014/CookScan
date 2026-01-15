/**
 * Result型 - Server Actionsのエラーハンドリング共通化
 *
 * エラーの可能性を型として明示し、型安全なエラーハンドリングを実現
 */

/**
 * エラーコード（HTTPステータスコードに準拠）
 */
export type ErrorCode =
  | 'UNAUTHENTICATED' // 401: 認証なし
  | 'FORBIDDEN' // 403: 権限なし
  | 'NOT_FOUND' // 404: リソースが見つからない
  | 'VALIDATION_ERROR' // 400: バリデーションエラー
  | 'CONFLICT' // 409: 競合（重複等）
  | 'SERVER_ERROR' // 500: サーバーエラー

/**
 * アプリケーションエラー型
 */
export type AppError = {
  code: ErrorCode
  message: string
  details?: Record<string, unknown>
}

/**
 * 成功型
 */
export type Success<T> = {
  ok: true
  data: T
}

/**
 * 失敗型
 */
export type Failure = {
  ok: false
  error: AppError
}

/**
 * Result型
 */
export type Result<T> = Success<T> | Failure

/**
 * 型ガード: 成功判定
 */
export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return result.ok === true
}

/**
 * 型ガード: 失敗判定
 */
export function isFailure<T>(result: Result<T>): result is Failure {
  return result.ok === false
}
