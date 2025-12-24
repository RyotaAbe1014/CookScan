'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { domToJpeg } from 'modern-screenshot'
import DeleteRecipeDialog from '@/features/recipes/delete/delete-recipe-dialog'
import { Button } from '@/components/ui/button'

type Recipe = {
  id: string
  title: string
}

type Props = {
  recipe: Recipe
}

export function RecipeDetailActions({ recipe }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)
  const errorTimeoutRef = useRef<number | null>(null)

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false)
  }

  const showDownloadError = () => {
    setDownloadError(true)
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current)
    }
    errorTimeoutRef.current = window.setTimeout(() => {
      setDownloadError(false)
    }, 3000)
  }

  const handleDownloadClick = async () => {
    setIsDownloading(true)
    try {
      const target = document.getElementById('recipe-detail-capture')
      if (!target) {
        throw new Error('capture target not found')
      }

      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      const dataUrl = await domToJpeg(target, { quality: 0.95 })
      const link = document.createElement('a')
      link.download = `${recipe.title}.jpg`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('画像ダウンロードに失敗しました', error)
      showDownloadError()
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          href={`/recipes/${recipe.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          編集
        </Link>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleDownloadClick}
          isLoading={isDownloading}
          className="border border-gray-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
          </svg>
          ダウンロード
        </Button>
        <Button
          type="button"
          variant="danger-ghost"
          size="sm"
          onClick={handleDeleteClick}
          className="border border-red-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          削除
        </Button>
      </div>

      <DeleteRecipeDialog
        recipeId={recipe.id}
        recipeTitle={recipe.title}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDialog}
      />

      {downloadError && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            保存できませんでした
          </div>
        </div>
      )}
    </>
  )
}
