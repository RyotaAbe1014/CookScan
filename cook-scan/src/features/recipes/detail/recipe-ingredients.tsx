'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BeakerIcon } from '@/components/icons/beaker-icon'
import { ShoppingCartIcon } from '@/components/icons/shopping-cart-icon'
import { CheckIcon } from '@/components/icons/check-icon'
import { createShoppingItems } from '@/features/shopping-list/actions'
import type { Ingredient } from '@/types/ingredient'

type RecipeIngredientsProps = {
  ingredients: Ingredient[]
}

function buildMemo(unit: string | null, notes: string | null): string | undefined {
  if (unit && notes) return `${unit} / ${notes}`
  if (unit) return unit
  if (notes) return notes
  return undefined
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  const [isBulkAdded, setIsBulkAdded] = useState(false)

  const handleAddSingle = async (ingredient: Ingredient) => {
    setLoadingIds((prev) => new Set(prev).add(ingredient.id))
    try {
      const result = await createShoppingItems([
        { name: ingredient.name, memo: buildMemo(ingredient.unit, ingredient.notes) },
      ])
      if (result.ok) {
        setAddedIds((prev) => new Set(prev).add(ingredient.id))
        toast.success('買い物リストに追加しました')
      } else {
        toast.error(result.error.message)
      }
    } catch {
      toast.error('買い物リストへの追加に失敗しました')
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev)
        next.delete(ingredient.id)
        return next
      })
    }
  }

  const handleAddAll = async () => {
    const unadded = ingredients.filter((i) => !addedIds.has(i.id))
    if (unadded.length === 0) return

    setIsBulkLoading(true)
    try {
      const items = unadded.map((i) => ({
        name: i.name,
        memo: buildMemo(i.unit, i.notes),
      }))
      const result = await createShoppingItems(items)
      if (result.ok) {
        setAddedIds(new Set(ingredients.map((i) => i.id)))
        setIsBulkAdded(true)
        toast.success(`${result.data.count}件を買い物リストに追加しました`)
      } else {
        toast.error(result.error.message)
      }
    } catch {
      toast.error('買い物リストへの追加に失敗しました')
    } finally {
      setIsBulkLoading(false)
    }
  }

  const allAdded = ingredients.length > 0 && ingredients.every((i) => addedIds.has(i.id))

  return (
    <Card className="mb-8">
      <CardHeader
        icon={
          <BeakerIcon className="h-5 w-5 text-white" />
        }
        iconColor="green"
        title="材料"
        actions={
          ingredients.length > 0 ? (
            <Button
              variant={allAdded || isBulkAdded ? 'ghost' : 'secondary'}
              size="sm"
              isLoading={isBulkLoading}
              disabled={allAdded || isBulkAdded}
              onClick={handleAddAll}
            >
              {allAdded || isBulkAdded ? (
                <>
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">追加済み</span>
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-4 w-4" />
                  まとめて追加
                </>
              )}
            </Button>
          ) : undefined
        }
      />
      <CardContent>
        {ingredients.length > 0 ? (
          <div className="space-y-2">
            {ingredients.map((ingredient) => {
              const isAdded = addedIds.has(ingredient.id)
              const isLoading = loadingIds.has(ingredient.id)

              return (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-semibold text-gray-900">{ingredient.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      {ingredient.unit && <span className="text-sm font-medium text-gray-600">{ingredient.unit}</span>}
                      {ingredient.notes && <div className="text-xs text-gray-500">{ingredient.notes}</div>}
                    </div>
                    <Button
                      variant={isAdded ? 'ghost' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      isLoading={isLoading}
                      disabled={isAdded || isBulkLoading}
                      onClick={() => handleAddSingle(ingredient)}
                      aria-label={`${ingredient.name}を買い物リストに追加`}
                    >
                      {!isLoading && (
                        isAdded ? (
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <ShoppingCartIcon className="h-4 w-4 text-gray-400 hover:text-green-600" />
                        )
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500">材料が登録されていません</p>
        )}
      </CardContent>
    </Card>
  )
}
