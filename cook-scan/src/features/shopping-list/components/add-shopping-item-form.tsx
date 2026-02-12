'use client'

import { useState, useTransition, useRef } from 'react'
import { createShoppingItem } from '@/features/shopping-list/actions'
import { isSuccess } from '@/utils/result'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@/components/icons/plus-icon'

export function AddShoppingItemForm() {
  const [name, setName] = useState('')
  const [memo, setMemo] = useState('')
  const [showMemo, setShowMemo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    setError(null)
    startTransition(async () => {
      const result = await createShoppingItem(trimmedName, memo.trim() || undefined)
      if (isSuccess(result)) {
        setName('')
        setMemo('')
        setShowMemo(false)
        inputRef.current?.focus()
      } else {
        setError(result.error.message)
      }
    })
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-4 shadow-card ring-1 ring-gray-900/5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
            <PlusIcon className="h-4 w-4 text-emerald-600" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="アイテムを追加..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="md"
            className="border-0 shadow-none focus:ring-0"
            disabled={isPending}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="shrink-0 px-4"
            disabled={!name.trim() || isPending}
            isLoading={isPending}
          >
            追加
          </Button>
        </div>

        {/* メモ入力トグル */}
        {!showMemo ? (
          <button
            type="button"
            onClick={() => setShowMemo(true)}
            className="mt-2 ml-11 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            + メモを追加
          </button>
        ) : (
          <div className="mt-2 ml-11">
            <Input
              type="text"
              placeholder="メモ（任意）"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              size="md"
              className="text-xs"
              disabled={isPending}
            />
          </div>
        )}

        {error && (
          <p className="mt-2 ml-11 text-xs text-danger">{error}</p>
        )}
      </form>
    </div>
  )
}
