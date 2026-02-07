'use client'

import { useState, useEffect } from 'react'
import { searchAvailableRecipes } from '@/features/recipes/child-recipes/actions'
import { isSuccess } from '@/utils/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { SearchIcon } from '@/components/icons/search-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import type { ChildRecipeSelectorDialogProps, ChildRecipeItem } from './types'

type AvailableRecipe = {
  id: string
  title: string
  imageUrl: string | null
}

export function ChildRecipeSelectorDialog({
  isOpen,
  onClose,
  onAdd,
  parentRecipeId,
  existingChildRecipeIds,
}: ChildRecipeSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<AvailableRecipe[]>([])
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleSearch = async (query?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await searchAvailableRecipes(
        parentRecipeId,
        existingChildRecipeIds,
        query || undefined
      )
      if (isSuccess(result)) {
        setRecipes(result.data)
      } else {
        setError(result.error.message)
      }
    } catch {
      setError('検索に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(searchQuery)
    }
  }

  const handleClose = () => {
    setSearchQuery('')
    setSelectedRecipeId(null)
    setQuantity('')
    setNotes('')
    setError(null)
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

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />

        <div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10"
          style={{ zIndex: 51 }}
        >
          {/* Header */}
          <div className="border-b border-gray-200 bg-linear-to-r from-purple-50 to-white px-6 py-5">
            <h3 className="text-xl font-bold text-gray-900">サブレシピを追加</h3>
            <p className="mt-1 text-sm text-gray-600">
              既存のレシピからサブレシピとして追加するレシピを選択してください
            </p>
          </div>

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
                    className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all ${
                      selectedRecipeId === recipe.id
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
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        selectedRecipeId === recipe.id
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

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
