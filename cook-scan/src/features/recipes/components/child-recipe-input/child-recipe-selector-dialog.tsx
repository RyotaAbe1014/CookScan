'use client'

import { useState } from 'react'
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
import { Alert } from '@/components/ui/alert'
import { SearchIcon } from '@/components/icons/search-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { useRecipeSearch } from './hooks/use-recipe-search'
import type { ChildRecipeSelectorDialogProps, ChildRecipeItem } from './types'

export function ChildRecipeSelectorDialog({
  isOpen,
  onClose,
  onAdd,
  parentRecipeId,
  existingChildRecipeIds,
}: ChildRecipeSelectorDialogProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')

  const {
    searchQuery,
    setSearchQuery,
    recipes,
    isLoading,
    error,
    handleSearch,
    handleSearchKeyDown,
    reset,
  } = useRecipeSearch(parentRecipeId, existingChildRecipeIds, isOpen)

  const handleClose = () => {
    reset()
    setSelectedRecipeId(null)
    setQuantity('')
    setNotes('')
    onClose()
  }

  const handleAdd = () => {
    if (!selectedRecipeId) return
    const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId)
    if (!selectedRecipe) return

    const item: ChildRecipeItem = {
      childRecipeId: selectedRecipe.id,
      childRecipeTitle: selectedRecipe.title,
      quantity,
      notes,
    }
    onAdd(item)
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent maxWidth="max-w-lg">
        <DialogHeader className="bg-linear-to-r from-purple-50 to-white">
          <DialogTitle>サブレシピを追加</DialogTitle>
          <DialogDescription>
            既存のレシピからサブレシピとして追加するレシピを選択してください
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="レシピ名で検索..."
                className="pl-9"
              />
            </div>
            <Button type="button" variant="secondary" disabled={isLoading} onClick={() => handleSearch(searchQuery)}>
              検索
            </Button>
          </div>
        </div>

        {/* Recipe List */}
        <div className="max-h-60 overflow-y-auto px-6 py-3">
          {error && (
            <Alert variant="error" className="mb-3">
              {error}
            </Alert>
          )}
          {isLoading ? (
            <p className="py-4 text-center text-sm text-gray-500">検索中...</p>
          ) : recipes.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              該当するレシピがありません
            </p>
          ) : (
            <div className="space-y-1">
              {recipes.map((recipe) => (
                <label
                  key={recipe.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all ${selectedRecipeId === recipe.id
                    ? 'bg-purple-100 ring-2 ring-purple-500'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="childRecipe"
                    value={recipe.id}
                    checked={selectedRecipeId === recipe.id}
                    onChange={() => setSelectedRecipeId(recipe.id)}
                    className="sr-only"
                  />
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selectedRecipeId === recipe.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                      }`}
                  >
                    {selectedRecipeId === recipe.id && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{recipe.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Quantity & Notes */}
        {selectedRecipeId && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  分量（任意）
                </label>
                <Input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="例: 大さじ2"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  メモ（任意）
                </label>
                <Input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="例: 事前に作っておく"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            キャンセル
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!selectedRecipeId}
            onClick={handleAdd}
            className="flex-1"
          >
            <PlusIcon className="h-4 w-4" stroke="currentColor" />
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
