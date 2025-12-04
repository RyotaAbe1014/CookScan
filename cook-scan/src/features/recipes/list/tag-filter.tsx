'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type Tag = {
  id: string
  name: string
}

type TagCategory = {
  id: string
  name: string
  tags: Tag[]
}

type TagFilterProps = {
  tagCategories: TagCategory[]
}

export function TagFilter({ tagCategories }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedTags = searchParams.getAll('tag')

  const createQueryString = useCallback(
    (tagId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const currentTags = params.getAll('tag')

      // Remove all existing tag params
      params.delete('tag')

      if (currentTags.includes(tagId)) {
        // Remove the tag if already selected
        currentTags
          .filter(t => t !== tagId)
          .forEach(t => params.append('tag', t))
      } else {
        // Add the tag
        currentTags.forEach(t => params.append('tag', t))
        params.append('tag', tagId)
      }

      return params.toString()
    },
    [searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push('/recipes')
  }, [router])

  const handleTagClick = useCallback(
    (tagId: string) => {
      const queryString = createQueryString(tagId)
      router.push(`/recipes${queryString ? `?${queryString}` : ''}`)
    },
    [createQueryString, router]
  )

  // Filter categories that have tags
  const categoriesWithTags = tagCategories.filter(cat => cat.tags.length > 0)

  if (categoriesWithTags.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-700">タグで絞り込み</h2>
        {selectedTags.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            クリア
          </button>
        )}
      </div>

      <div className="space-y-3">
        {categoriesWithTags.map((category) => (
          <div key={category.id}>
            <h3 className="text-xs font-medium text-gray-500 mb-1.5">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {category.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      transition-colors duration-150
                      ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {selectedTags.length}件のタグで絞り込み中
          </p>
        </div>
      )}
    </div>
  )
}
