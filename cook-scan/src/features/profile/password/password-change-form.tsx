'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { updatePassword, type PasswordChangeFormData } from './actions'
import { Button, Input, Alert } from '@/components/ui'

export function PasswordChangeForm() {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // コンポーネントのアンマウント時にタイマーをクリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await updatePassword(formData)

      if (!result.success) {
        setError(result.error!)
      }
      // 成功時は自動的に /login にリダイレクトされるため、ここでは何もしない
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      {/* エラー表示 */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* 現在のパスワード */}
      <div>
        <label
          htmlFor="currentPassword"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-gray-400 to-gray-500">
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          現在のパスワード
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type="password"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            placeholder="現在のパスワードを入力"
            disabled={isPending}
            required
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 新しいパスワード */}
      <div>
        <label
          htmlFor="newPassword"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-indigo-500 to-purple-600">
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          新しいパスワード
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type="password"
            id="newPassword"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            placeholder="8文字以上、大文字・小文字・数字を含む"
            disabled={isPending}
            required
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          パスワードは8文字以上で、大文字、小文字、数字を含める必要があります
        </p>
      </div>

      {/* パスワード確認 */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-indigo-500 to-purple-600">
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          新しいパスワード（確認）
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="もう一度入力してください"
            disabled={isPending}
            required
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* セキュリティ警告 */}
      <Alert variant="warning">
        パスワード変更後、すべてのデバイスから自動的にログアウトされます。新しいパスワードで再度ログインしてください。
      </Alert>

      {/* ボタン */}
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            'パスワードを変更中...'
          ) : (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              パスワードを変更
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => window.history.back()}
          disabled={isPending}
          className="w-full"
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}
