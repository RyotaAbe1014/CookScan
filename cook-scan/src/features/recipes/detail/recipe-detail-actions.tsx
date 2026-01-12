'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { domToJpeg } from 'modern-screenshot'
import type { RecipeMinimal } from '@/types/recipe'
import DeleteRecipeDialog from '@/features/recipes/delete/delete-recipe-dialog'
import { Button } from '@/components/ui/button'
import {
  PencilIcon,
  DownloadIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@/components/icons'

type Props = {
  recipe: RecipeMinimal
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <PencilIcon className="h-4 w-4" />
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
          <DownloadIcon className="h-4 w-4" />
          ダウンロード
        </Button>
        <Button
          type="button"
          variant="danger-ghost"
          size="sm"
          onClick={handleDeleteClick}
          className="border border-red-300"
        >
          <TrashIcon className="h-4 w-4" />
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
            <ExclamationTriangleIcon className="h-4 w-4" />
            保存できませんでした
          </div>
        </div>
      )}
    </>
  )
}
