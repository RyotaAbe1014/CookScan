'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeleteRecipeDialog from '@/features/recipes/delete/delete-recipe-dialog'
import { Button } from '@/components/ui/button'

type Recipe = {
  id: string
  title: string
}

type Props = {
  recipe: Recipe
}

export default function RecipeDetailActions({ recipe }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteClick = () => {
    console.log('削除ボタンがクリックされました')
    setIsDeleteDialogOpen(true)
    console.log('ダイアログ状態:', true)
  }

  const handleCloseDialog = () => {
    console.log('ダイアログを閉じます')
    setIsDeleteDialogOpen(false)
    console.log('ダイアログ状態:', false)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          href={`/recipes/${recipe.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          編集
        </Link>
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
    </>
  )
}