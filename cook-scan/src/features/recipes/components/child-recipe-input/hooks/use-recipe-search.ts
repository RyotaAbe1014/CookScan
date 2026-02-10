import { useState, useEffect, useCallback } from 'react'
import { searchAvailableRecipes } from '@/features/recipes/child-recipes/actions'
import { isSuccess } from '@/utils/result'

type AvailableRecipe = {
  id: string
  title: string
  imageUrl: string | null
}

export function useRecipeSearch(
  parentRecipeId: string | undefined,
  existingChildRecipeIds: string[],
  isOpen: boolean,
) {
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<AvailableRecipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (query?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await searchAvailableRecipes(
        parentRecipeId,
        existingChildRecipeIds,
        query || undefined,
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
  }, [parentRecipeId, existingChildRecipeIds])

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(searchQuery)
    }
  }, [handleSearch, searchQuery])

  useEffect(() => {
    if (isOpen) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const reset = useCallback(() => {
    setSearchQuery('')
    setError(null)
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    recipes,
    isLoading,
    error,
    handleSearch,
    handleSearchKeyDown,
    reset,
  }
}
