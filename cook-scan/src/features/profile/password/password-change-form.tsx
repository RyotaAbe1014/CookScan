'use client'

import { useState, useTransition } from 'react'
import { updatePassword, type PasswordChangeFormData } from './actions'
import { Button, Input, Alert } from '@/components/ui'
import {
  LockIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleOutlineIcon,
} from '@/components/icons'

export function PasswordChangeForm() {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)

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
            <LockIcon className="h-3 w-3 text-white" />
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
            <KeyIcon className="h-5 w-5 text-gray-400" />
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
            <LockIcon className="h-3 w-3 text-white" />
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
            <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
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
            <CheckCircleOutlineIcon className="h-3 w-3 text-white" />
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
            <CheckCircleOutlineIcon className="h-5 w-5 text-gray-400" />
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
              <CheckCircleOutlineIcon className="h-5 w-5" />
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
