'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRecipe } from './actions'
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

  if (!isOpen) {
    return null
  }

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await deleteRecipe(recipeId)
        if (result.success) {
          router.push('/recipes')
          handleClose()
        } else {
          setError(result.error || 'レシピの削除に失敗しました')
        }
      } catch (_error) {
        setError('エラーが発生しました')
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Background overlay */}
        <div
          className="absolute inset-0"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10"
          style={{ zIndex: 51 }}
        >
          {/* Header with gradient */}
          <div className="border-b border-gray-200 bg-linear-to-r from-red-50 to-orange-50 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-50 to-orange-600 shadow-lg">
                <WarningIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  レシピを削除
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  「<span className="font-semibold text-gray-900">{recipeTitle}</span>」を削除してもよろしいですか？
                </p>
              </div>
            </div>
          </div>

          {/* Warning message */}
          <div className="bg-white px-6 py-4">
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}
            <Alert variant="error">
              この操作は取り消すことができません
            </Alert>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}