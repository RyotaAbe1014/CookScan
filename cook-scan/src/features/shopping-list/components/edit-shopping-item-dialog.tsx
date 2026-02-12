'use client'

import { useState, useEffect, useTransition } from 'react'
import type { ShoppingItemOutput } from '@/backend/domain/shopping-items'
import { updateShoppingItem } from '@/features/shopping-list/actions'
import { isSuccess } from '@/utils/result'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { Alert } from '@/components/ui/alert'
import { PencilIcon } from '@/components/icons/pencil-icon'

type EditShoppingItemDialogProps = {
  item: ShoppingItemOutput | null
  isOpen: boolean
  onClose: () => void
}

export function EditShoppingItemDialog({ item, isOpen, onClose }: EditShoppingItemDialogProps) {
  const [name, setName] = useState('')
  const [memo, setMemo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (item) {
      setName(item.name)
      setMemo(item.memo || '')
      setError(null)
    }
  }, [item])

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!item) return

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('アイテム名を入力してください')
      return
    }

    startTransition(async () => {
      const result = await updateShoppingItem(item.id, trimmedName, memo.trim() || undefined)
      if (isSuccess(result)) {
        handleClose()
      } else {
        setError(result.error.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent maxWidth="max-w-md">
        <DialogHeader className="bg-linear-to-r from-emerald-50 to-teal-50">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg">
              <PencilIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle>アイテムを編集</DialogTitle>
              <DialogDescription>
                買い物アイテムの名前やメモを変更できます
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            <FormField label="アイテム名" required>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 牛乳"
                disabled={isPending}
                autoFocus
              />
            </FormField>

            <FormField label="メモ">
              <Input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="例: 低脂肪タイプ"
                disabled={isPending}
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={handleClose}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!name.trim() || isPending}
              isLoading={isPending}
              className="flex-1"
            >
              {isPending ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
