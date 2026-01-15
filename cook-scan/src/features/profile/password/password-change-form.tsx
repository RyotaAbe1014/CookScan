'use client'

import { useState, useTransition } from 'react'
import { updatePassword, type PasswordChangeFormData } from './actions'
import { isSuccess } from '@/utils/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { LockIcon } from '@/components/icons/lock-icon'
import { KeyIcon } from '@/components/icons/key-icon'
import { ShieldCheckIcon } from '@/components/icons/shield-check-icon'
import { CheckCircleOutlineIcon } from '@/components/icons/check-circle-outline-icon'

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
      // 成功時は自動的に /login にリダイレクトされるため、失敗時のみエラーを設定
      if (!isSuccess(result)) {
        setError(result.error.message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      {/* エラー表示 */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* 現在のパスワード - slate系（認証用） */}
      <div className="space-y-2">
        <label
          htmlFor="currentPassword"
          className="flex items-center gap-2 text-sm font-medium text-neutral-700"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-500">
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
            <KeyIcon className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        <p className="text-xs text-slate-500">本人確認のため、現在のパスワードが必要です</p>
      </div>

      {/* 新しいパスワード - emerald系（新規設定） */}
      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="flex items-center gap-2 text-sm font-medium text-neutral-700"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600">
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
            <ShieldCheckIcon className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
        <div className="rounded-md bg-emerald-50 p-3">
          <p className="text-xs text-emerald-700">
            <strong>セキュリティ要件:</strong> パスワードは8文字以上で、大文字、小文字、数字を含める必要があります
          </p>
        </div>
      </div>

      {/* パスワード確認 - teal系（確認用） */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="flex items-center gap-2 text-sm font-medium text-neutral-700"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-teal-500">
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
            <CheckCircleOutlineIcon className="h-5 w-5 text-teal-400" />
          </div>
        </div>
        <p className="text-xs text-slate-500">入力ミスを防ぐため、もう一度入力してください</p>
      </div>

      {/* セキュリティ警告 - amber warning */}
      <Alert variant="warning">
        <strong>重要:</strong> パスワード変更後、すべてのデバイスから自動的にログアウトされます。新しいパスワードで再度ログインしてください。
      </Alert>

      {/* ボタン */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          className="w-full shadow-md hover:shadow-lg transition-shadow"
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
