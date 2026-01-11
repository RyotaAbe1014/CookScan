'use client'

import { useState, useTransition } from 'react'
import { createProfile } from './actions'
import { Button, Input, Alert } from '@/components/ui'
import {
  EnvelopeIcon,
  MailIcon,
  UserIcon,
  UserCircleIcon,
  CheckCircleOutlineIcon,
} from '@/components/icons'

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
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-gray-400 to-gray-500">
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
            <MailIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-indigo-500 to-purple-600">
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
            placeholder="山田 太郎"
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UserCircleIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isPending || !name.trim()}
        isLoading={isPending}
        className="w-full"
      >
        {isPending ? (
          '作成中...'
        ) : (
          <>
            <CheckCircleOutlineIcon className="h-5 w-5" />
            プロフィールを作成
          </>
        )}
      </Button>
    </form>
  )
}
