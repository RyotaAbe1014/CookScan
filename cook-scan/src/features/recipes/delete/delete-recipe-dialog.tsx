'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRecipe } from './actions'

type Props = {
  recipeId: string
  recipeTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function DeleteRecipeDialog({ recipeId, recipeTitle, isOpen, onClose }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  console.log('DeleteRecipeDialog レンダリング:', { isOpen, recipeId, recipeTitle })

  if (!isOpen) {
    console.log('ダイアログが閉じています')
    return null
  }

  console.log('ダイアログを表示します')

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const result = await deleteRecipe(recipeId)
      
      if (result.success) {
        router.push('/recipes')
      } else {
        alert(result.error || 'レシピの削除に失敗しました')
        setIsDeleting(false)
        onClose()
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('エラーが発生しました')
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
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
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
          style={{ zIndex: 51 }}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  レシピを削除
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    「{recipeTitle}」を削除してもよろしいですか？
                    この操作は取り消すことができません。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  削除中...
                </>
              ) : (
                '削除'
              )}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}