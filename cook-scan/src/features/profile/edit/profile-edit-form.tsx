'use client'

import { useState, useTransition, FormEvent } from 'react'
import { updateUserProfile } from './actions'
import { Button, Input, Alert } from '@/components/ui'

type User = {
  id: string
  email: string
  name: string | null
  updatedAt: Date
}

type ProfileEditFormProps = {
  initialData: User
}

export function ProfileEditForm({ initialData }: ProfileEditFormProps) {
  const [name, setName] = useState(initialData.name || '')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSuccess(false)

    startTransition(async () => {
      const result = await updateUserProfile({ name })

      if (!result.success) {
        setError(result.error || 'プロフィールの更新に失敗しました')
      } else {
        setIsSuccess(true)
        // 3秒後に成功メッセージを非表示
        setTimeout(() => setIsSuccess(false), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      {/* 成功メッセージ */}
      {isSuccess && (
        <Alert variant="success">プロフィールを更新しました</Alert>
      )}

      {/* エラーメッセージ */}
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {/* メールアドレス（読み取り専用） */}
      <div>
        <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-gray-400 to-gray-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          メールアドレス
        </label>
        <div className="relative">
          <Input
            type="email"
            id="email"
            value={initialData.email}
            disabled
            variant="disabled"
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">メールアドレスは変更できません</p>
      </div>

      {/* アカウント名 */}
      <div>
        <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-indigo-500 to-purple-600">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
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
            maxLength={50}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 最終更新日時 */}
      <div className="text-sm text-gray-500">
        最終更新: {new Date(initialData.updatedAt).toLocaleString('ja-JP')}
      </div>

      {/* 送信ボタン */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isPending || !name.trim()}
        isLoading={isPending}
        className="w-full"
      >
        {isPending ? (
          '更新中...'
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            更新する
          </>
        )}
      </Button>
    </form>
  )
}
