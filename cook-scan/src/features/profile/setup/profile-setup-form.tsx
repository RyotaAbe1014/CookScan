'use client'

import { useState, useTransition } from 'react'
import { createProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { EnvelopeIcon } from '@/components/icons/envelope-icon'
import { MailIcon } from '@/components/icons/mail-icon'
import { UserIcon } from '@/components/icons/user-icon'
import { UserCircleIcon } from '@/components/icons/user-circle-icon'
import { CheckCircleOutlineIcon } from '@/components/icons/check-circle-outline-icon'

type ProfileSetupFormProps = {
  userId: string
  userEmail: string
}

export default function ProfileSetupForm({ userId, userEmail }: ProfileSetupFormProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        await createProfile(userId, userEmail, name)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'プロフィールの作成に失敗しました'
        setError(errorMessage)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8">
      {/* Email Field - 無効化フィールド */}
      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-500">
            <EnvelopeIcon className="h-3 w-3 text-white" />
          </div>
          メールアドレス
        </label>
        <div className="relative">
          <Input
            type="email"
            id="email"
            value={userEmail}
            disabled
            variant="disabled"
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MailIcon className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        <p className="text-xs text-slate-500">認証済みのメールアドレスです</p>
      </div>

      {/* Name Field - プライマリフィールド */}
      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600">
            <UserIcon className="h-3 w-3 text-white" />
          </div>
          お名前
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="例: 山田 太郎"
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UserCircleIcon className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
        <p className="text-xs text-slate-500">レシピ管理で表示される名前です</p>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {/* Submit Button - emerald primary */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isPending || !name.trim()}
        isLoading={isPending}
        className="w-full shadow-md hover:shadow-lg transition-shadow"
      >
        {isPending ? (
          '作成中...'
        ) : (
          <>
            <CheckCircleOutlineIcon className="h-5 w-5" />
            プロフィールを作成して始める
          </>
        )}
      </Button>
    </form>
  )
}
