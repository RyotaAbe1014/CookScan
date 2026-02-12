'use client'

import { useState, useTransition } from 'react'
import { deleteCheckedItems } from '@/features/shopping-list/actions'
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
import { TrashIcon } from '@/components/icons/trash-icon'
import { WarningIcon } from '@/components/icons/warning-icon'

export function DeleteCheckedItemsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCheckedItems()
      if (isSuccess(result)) {
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <Button
        type="button"
        variant="danger-ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon className="h-3.5 w-3.5" />
        一括削除
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent maxWidth="max-w-sm">
          <DialogHeader className="bg-linear-to-r from-red-50 to-orange-50">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-50 to-orange-600 shadow-lg">
                <WarningIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle>購入済みアイテムを削除</DialogTitle>
                <DialogDescription>
                  チェック済みのアイテムをすべて削除しますか？
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={isPending}
              isLoading={isPending}
              onClick={handleDelete}
              className="flex-1"
            >
              {isPending ? (
                '削除中...'
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  削除
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
