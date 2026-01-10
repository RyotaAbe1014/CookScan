'use client'

import { useEffect, useState } from 'react'
import { getCurrentUserRecipesForSelection } from '@/features/recipes/recipe-utils'
import { Select } from '@/components/ui'

type ParentRecipeSelectorProps = {
  value: string | null
  onChange: (value: string | null) => void
  currentRecipeId?: string
}

export function ParentRecipeSelector({ value, onChange, currentRecipeId }: ParentRecipeSelectorProps) {
  const [recipes, setRecipes] = useState<Array<{
    id: string
    title: string
    imageUrl: string | null
    createdAt: Date
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true)
      try {
        const availableRecipes = await getCurrentUserRecipesForSelection(currentRecipeId)
        setRecipes(availableRecipes)
      } catch (error) {
        console.error('Failed to fetch recipes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecipes()
  }, [currentRecipeId])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value === '' ? null : e.target.value
    onChange(newValue)
  }

  return (
    <div>
      <label htmlFor="parentRecipeId" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        元のレシピ（親レシピ）
      </label>
      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
          <svg className="h-4 w-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          読み込み中...
        </div>
      ) : (
        <Select
          id="parentRecipeId"
          value={value ?? ''}
          onChange={handleChange}
          disabled={recipes.length === 0}
        >
          <option value="">親レシピなし</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.title}
            </option>
          ))}
        </Select>
      )}
      <p className="mt-1.5 text-xs text-gray-500">
        このレシピが別のレシピから派生した場合、元のレシピを選択してください
      </p>
    </div>
  )
}
