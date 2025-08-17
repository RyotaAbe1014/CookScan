'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeleteRecipeDialog from '@/features/recipes/delete/delete-recipe-dialog'

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
      <div className="flex items-center space-x-3">
        <Link
          href={`/recipes/${recipe.id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          編集
        </Link>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          削除
        </button>
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