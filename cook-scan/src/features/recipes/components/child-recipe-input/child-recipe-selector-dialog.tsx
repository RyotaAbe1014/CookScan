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
import { SearchIcon } from '@/components/icons/search-icon'
import { SpinnerIcon } from '@/components/icons/spinner-icon'
import { useRecipeSearch } from './hooks/use-recipe-search'
import type { ChildRecipeSelectorDialogProps, ChildRecipeItem } from './types'
import { cn } from '@/lib/tailwind'

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
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {/* Header - Purple Gradient */}
        <DialogHeader className="p-6 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-b border-purple-100/50">
          <div className="space-y-1.5">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full inline-block" />
              サブレシピを追加
            </DialogTitle>
            <DialogDescription className="text-muted-foreground ml-3.5">
              親レシピに追加するサブレシピを選択してください。
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-purple-500 pointer-events-none" />
              <Input
                placeholder="レシピを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                hasIcon
                className="focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>
            <Button
              onClick={() => handleSearch(searchQuery)}
              disabled={isLoading}
              variant="secondary"
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 transition-colors"
            >
              検索
            </Button>
          </div>

          {/* Recipe List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              レシピ一覧
            </div>
            <div className="h-[240px] overflow-y-auto border rounded-xl bg-gray-50/50 p-2 space-y-2 relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-purple-600/80">
                  <SpinnerIcon className="h-8 w-8 animate-spin" />
                  <span className="text-xs font-medium">読み込み中...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-destructive text-sm font-medium bg-red-50/50 rounded-lg">
                  {error}
                </div>
              ) : recipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                  <SearchIcon className="h-8 w-8 opacity-20" />
                  <span>条件に一致するレシピは見つかりませんでした</span>
                </div>
              ) : (
                recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={cn(
                      "group flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ease-out",
                      selectedRecipeId === recipe.id
                        ? "border-purple-500 bg-purple-50/80 shadow-sm ring-1 ring-purple-500/50"
                        : "border-transparent bg-white hover:border-purple-200 hover:bg-purple-50/30 hover:shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 flex-shrink-0",
                      selectedRecipeId === recipe.id
                        ? "border-purple-600 bg-purple-600 scale-110"
                        : "border-gray-300 group-hover:border-purple-400 bg-white"
                    )}>
                      {selectedRecipeId === recipe.id && (
                        <div className="h-2 w-2 rounded-full bg-white shadow-sm animate-in zoom-in duration-200" />
                      )}
                    </div>
                    <div className={cn(
                      "font-medium text-sm transition-colors",
                      selectedRecipeId === recipe.id ? "text-purple-900" : "text-gray-700 group-hover:text-gray-900"
                    )}>
                      {recipe.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Input Fields (Animated) */}
          <div className={cn(
            "grid grid-cols-2 gap-4 transition-all duration-500 ease-in-out border-t border-dashed border-gray-100",
            selectedRecipeId
              ? "opacity-100 max-h-[200px] pt-4 translate-y-0"
              : "opacity-0 max-h-0 pt-0 -translate-y-4 pointer-events-none"
          )}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                分量 <span className="text-xs text-muted-foreground font-normal">(任意)</span>
              </label>
              <Input
                placeholder="例: 200g"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                メモ <span className="text-xs text-muted-foreground font-normal">(任意)</span>
              </label>
              <Input
                placeholder="例: 細かく刻む"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50/30"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="hover:bg-gray-100 hover:text-gray-900 text-gray-500"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedRecipeId}
            className={cn(
              "shine-effect relative overflow-hidden transition-all duration-300",
              selectedRecipeId
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 w-full sm:w-auto"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            サブレシピを追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
