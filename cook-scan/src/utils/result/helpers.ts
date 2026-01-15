import type { Success, Failure, AppError, ErrorCode } from './types'

/**
 * 成功結果を生成
 */
export function success<T>(data: T): Success<T> {
  return { ok: true, data }
}

/**
 * 失敗結果を生成
 */
export function failure(error: AppError): Failure {
  return { ok: false, error }
}

/**
 * エラーコードからAppErrorを生成
 */
export function createError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): AppError {
  return { code, message, details }
}

/**
 * よく使うエラーのプリセット
 */
export const Errors = {
  /** 認証エラー（未ログイン、セッション切れ） */
  unauthenticated: (message = '認証が必要です'): AppError => ({
    code: 'UNAUTHENTICATED',
    message,
  }),

  /** 権限エラー（他ユーザーのリソースへのアクセス等） */
  forbidden: (message = 'この操作を行う権限がありません'): AppError => ({
    code: 'FORBIDDEN',
    message,
  }),

  /** リソースが見つからない */
  notFound: (resource: string): AppError => ({
    code: 'NOT_FOUND',
    message: `${resource}が見つかりません`,
  }),

  /** バリデーションエラー */
  validation: (message: string, details?: Record<string, unknown>): AppError => ({
    code: 'VALIDATION_ERROR',
    message,
    details,
  }),

  /** 競合エラー（重複、使用中等） */
  conflict: (message: string): AppError => ({
    code: 'CONFLICT',
    message,
  }),

  /** サーバーエラー */
  server: (message = 'サーバーエラーが発生しました'): AppError => ({
    code: 'SERVER_ERROR',
    message,
  }),
} as const
