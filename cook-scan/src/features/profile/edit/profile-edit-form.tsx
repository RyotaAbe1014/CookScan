'use client'

import { useState, useTransition, FormEvent, useEffect, useRef } from 'react'
import Link from 'next/link'
import { updateUserProfile } from './actions'
import { isSuccess as isResultSuccess } from '@/utils/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { EnvelopeIcon } from '@/components/icons/envelope-icon'
import { MailIcon } from '@/components/icons/mail-icon'
import { UserIcon } from '@/components/icons/user-icon'
import { UserCircleIcon } from '@/components/icons/user-circle-icon'
import { CheckIcon } from '@/components/icons/check-icon'
import { LockIcon } from '@/components/icons/lock-icon'

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

      if (!isResultSuccess(result)) {
        setError(result.error.message)
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
      {/* 成功メッセージ - emerald系 */}
      {isSuccess && (
        <Alert variant="success">プロフィールを更新しました</Alert>
      )}

      {/* エラーメッセージ */}
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {/* メールアドレス（読み取り専用） - グレー系で無効表示 */}
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
            value={initialData.email}
            disabled
            variant="disabled"
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MailIcon className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        <p className="text-xs text-slate-500">メールアドレスは変更できません</p>
      </div>

      {/* アカウント名 - emerald系 */}
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
            maxLength={50}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UserCircleIcon className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
        <p className="text-xs text-slate-500">レシピ管理で表示される名前（最大50文字）</p>
      </div>

      {/* 最終更新日時 - 軽いボーダーで区切り */}
      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <span className="font-medium">最終更新:</span>{' '}
          {new Date(initialData.updatedAt).toLocaleString('ja-JP')}
        </p>
      </div>

      {/* 送信ボタン - emerald primary */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isPending || !name.trim()}
        isLoading={isPending}
        className="w-full shadow-md hover:shadow-lg transition-shadow"
      >
        {isPending ? (
          '更新中...'
        ) : (
          <>
            <CheckIcon className="h-5 w-5" />
            変更を保存
          </>
        )}
      </Button>

      {/* パスワード変更へのリンク - セカンダリボタン */}
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
