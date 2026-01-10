'use client'

import { useState, useTransition, FormEvent, useEffect, useRef } from 'react'
import Link from 'next/link'
import { updateUserProfile } from './actions'
import { Button, Input, Alert } from '@/components/ui'
import {
  EnvelopeIcon,
  MailIcon,
  UserIcon,
  UserCircleIcon,
  CheckIcon,
  LockIcon,
} from '@/components/icons'

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
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // コンポーネントのアンマウント時にタイマーをクリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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
        // 既存のタイマーをクリア
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        // 3秒後に成功メッセージを非表示
        timeoutRef.current = setTimeout(() => setIsSuccess(false), 3000)
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
            <EnvelopeIcon className="h-3 w-3 text-white" />
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
            <MailIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">メールアドレスは変更できません</p>
      </div>

      {/* アカウント名 */}
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
            maxLength={50}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UserCircleIcon className="h-5 w-5 text-gray-400" />
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
            <CheckIcon className="h-5 w-5" />
            更新する
          </>
        )}
      </Button>

      {/* パスワード変更へのリンク */}
      <Link href="/settings/password" className="block">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={isPending}
          className="w-full"
        >
          <LockIcon className="h-5 w-5" />
          パスワードを変更
        </Button>
      </Link>
    </form>
  )
}
