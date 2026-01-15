'use client'

import { useState, useCallback, useTransition } from 'react'
import type { Result, AppError } from '@/utils/result'
import { isFailure } from '@/utils/result'

type UseActionResultOptions<TData> = {
  /** 成功時のコールバック */
  onSuccess?: (data: TData) => void
  /** エラー時のコールバック */
  onError?: (error: AppError) => void
}

/**
 * Server Action呼び出し用のカスタムフック
 *
 * @example
 * ```tsx
 * const { execute, isPending, errorMessage } = useActionResult(
 *   deleteRecipe,
 *   { onSuccess: () => router.push('/recipes') }
 * )
 *
 * return (
 *   <button onClick={() => execute(recipeId)} disabled={isPending}>
 *     {isPending ? '削除中...' : '削除'}
 *   </button>
 *   {errorMessage && <p className="text-red-500">{errorMessage}</p>}
 * )
 * ```
 */
export function useActionResult<TArgs extends unknown[], TData>(
  action: (...args: TArgs) => Promise<Result<TData>>,
  options?: UseActionResultOptions<TData>
) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<AppError | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const execute = useCallback(
    (...args: TArgs) => {
      setError(null)
      setData(null)

      startTransition(async () => {
        const result = await action(...args)

        if (isFailure(result)) {
          setError(result.error)
          options?.onError?.(result.error)
        } else {
          setData(result.data)
          options?.onSuccess?.(result.data)
        }
      })
    },
    [action, options]
  )

  const clearError = useCallback(() => setError(null), [])
  const clearData = useCallback(() => setData(null), [])
  const reset = useCallback(() => {
    setError(null)
    setData(null)
  }, [])

  return {
    /** アクションを実行 */
    execute,
    /** 実行中かどうか */
    isPending,
    /** エラーオブジェクト */
    error,
    /** 成功時のデータ */
    data,
    /** エラーをクリア */
    clearError,
    /** データをクリア */
    clearData,
    /** エラーとデータをリセット */
    reset,
    /** エラーメッセージ（エラーがない場合はnull） */
    errorMessage: error?.message ?? null,
    /** エラーコード（エラーがない場合はnull） */
    errorCode: error?.code ?? null,
  }
}
