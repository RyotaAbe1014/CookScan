'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from '@/components/icons/search-icon'
import { isSuccess } from '@/utils/result'
import { addMealPlanItem } from '../actions'
import { DAY_LABELS } from '../utils'
import type { RecipeListOutput } from '@/backend/domain/recipes'

type AddRecipeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayOfWeek: number | null
  weekStart: string
  recipes: RecipeListOutput[]
  onItemAdded: () => void
}

export function AddRecipeDialog({
  open,
  onOpenChange,
  dayOfWeek,
  weekStart,
  recipes,
  onItemAdded,
}: AddRecipeDialogProps) {
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  function handleSelect(recipeId: string) {
    if (dayOfWeek === null) return

    startTransition(async () => {
      const result = await addMealPlanItem(weekStart, dayOfWeek, recipeId)
      if (isSuccess(result)) {
        onItemAdded()
        onOpenChange(false)
        setSearch('')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-md">
        <DialogHeader>
          <DialogTitle>
            レシピを追加
            {dayOfWeek !== null && ` - ${DAY_LABELS[dayOfWeek]}曜日`}
          </DialogTitle>
          <DialogDescription>献立に追加するレシピを選択してください</DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="レシピを検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-neutral-500">
                レシピが見つかりません
              </p>
            ) : (
              <ul className="space-y-1">
                {filtered.map((recipe) => (
                  <li key={recipe.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      disabled={isPending}
                      onClick={() => handleSelect(recipe.id)}
                    >
                      <span className="truncate">{recipe.title}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
