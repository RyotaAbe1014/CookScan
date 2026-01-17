'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { setupPassword, type PasswordSetupFormData } from './actions'
import { isSuccess } from '@/utils/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { LockIcon } from '@/components/icons/lock-icon'
import { CheckIcon } from '@/components/icons/check-icon'
import { PasswordRequirements } from './password-requirements'

export const PasswordSetupForm = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData: PasswordSetupFormData = {
      password,
      confirmPassword,
    }

    startTransition(async () => {
      const result = await setupPassword(formData)

      if (!isSuccess(result)) {
        setError(result.error.message)
      }
      // 成功時は setupPassword 内で redirect される
    })
  }

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
          <LockIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          パスワードを設定
        </h1>
        <p className="text-sm text-gray-600">
          アカウントのセキュリティを保護するため、パスワードを設定してください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* エラーメッセージ */}
        {error && <Alert variant="error">{error}</Alert>}

        {/* パスワード */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="flex items-center gap-2 text-sm font-medium text-neutral-700"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600">
              <LockIcon className="h-3 w-3 text-white" />
            </div>
            新しいパスワード
            <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="8文字以上、大文字・小文字・数字を含む"
            size="xl"
            disabled={isPending}
          />
        </div>

        {/* パスワード確認 */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="flex items-center gap-2 text-sm font-medium text-neutral-700"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600">
              <LockIcon className="h-3 w-3 text-white" />
            </div>
            パスワード確認
            <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="もう一度パスワードを入力"
            size="xl"
            disabled={isPending}
          />
        </div>

        {/* パスワード要件 */}
        <PasswordRequirements />

        {/* 送信ボタン */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending || !password || !confirmPassword}
          isLoading={isPending}
          className="w-full shadow-md hover:shadow-lg transition-shadow"
        >
          {isPending ? (
            '設定中...'
          ) : (
            <>
              <CheckIcon className="h-5 w-5" />
              パスワードを設定
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
