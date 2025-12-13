'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRecipe } from './actions'
import { Button } from '@/components/ui/button'

type Props = {
  recipeId: string
  recipeTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function DeleteRecipeDialog({ recipeId, recipeTitle, isOpen, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (!isOpen) {
    return null
  }

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await deleteRecipe(recipeId)
        if (result.success) {
          router.push('/recipes')
        } else {
          alert(result.error || 'レシピの削除に失敗しました')
        }
      } catch (error) {
        alert('エラーが発生しました')
      }
      finally {
        onClose()
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
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10"
          style={{ zIndex: 51 }}
        >
          {/* Header with gradient */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
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
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
              <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-red-800">
                この操作は取り消すことができません
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={onClose}
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
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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