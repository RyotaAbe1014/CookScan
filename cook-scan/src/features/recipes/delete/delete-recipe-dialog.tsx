'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRecipe } from './actions'
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
import { Alert } from '@/components/ui/alert'
import { TrashIcon } from '@/components/icons/trash-icon'
import { WarningIcon } from '@/components/icons/warning-icon'

type Props = {
  recipeId: string
  recipeTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function DeleteRecipeDialog({ recipeId, recipeTitle, isOpen, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await deleteRecipe(recipeId)
        if (isSuccess(result)) {
          router.push('/recipes')
          handleClose()
        } else {
          setError(result.error.message)
        }
      } catch {
        setError('エラーが発生しました')
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent maxWidth="max-w-md">
        {/* Header with gradient */}
        <DialogHeader className="bg-linear-to-r from-red-50 to-orange-50">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-50 to-orange-600 shadow-lg">
              <WarningIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle>レシピを削除</DialogTitle>
              <DialogDescription className="mt-2 leading-relaxed">
                「<span className="font-semibold text-gray-900">{recipeTitle}</span>
                」を削除してもよろしいですか？
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Warning message */}
        <div className="bg-white px-6 py-4">
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          <Alert variant="error">この操作は取り消すことができません</Alert>
        </div>

        {/* Actions */}
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
  )
}
