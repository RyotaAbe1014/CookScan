'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { ClipboardListIcon } from '@/components/icons/clipboard-list-icon'
import { Alert } from '@/components/ui/alert'
import { isSuccess } from '@/utils/result'
import { generateShoppingList } from '../actions'

type GenerateShoppingListButtonProps = {
  weekStart: string
  hasItems: boolean
}

export function GenerateShoppingListButton({
  weekStart,
  hasItems,
}: GenerateShoppingListButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleGenerate() {
    setMessage(null)
    startTransition(async () => {
      const result = await generateShoppingList(weekStart)
      if (isSuccess(result)) {
        setMessage({
          type: 'success',
          text: `${result.data.count}件の食材を買い物リストに追加しました`,
        })
      } else {
        setMessage({ type: 'error', text: result.error.message })
      }
    })
  }

  return (
    <div className="space-y-3">
      <Button
        variant="primary"
        onClick={handleGenerate}
        isLoading={isPending}
        disabled={!hasItems}
        className="w-full"
      >
        <ClipboardListIcon className="h-5 w-5" />
        買い物リストを生成
      </Button>
      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </Alert>
      )}
    </div>
  )
}
