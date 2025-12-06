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
    <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 className="text-base font-semibold text-gray-900">タグで絞り込み</h2>
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              クリア
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {categoriesWithTags.map((category) => (
            <div key={category.id}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  {category.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.id)}
                      className={`
                        inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium
                        transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600'
                            : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-200 hover:ring-gray-300'
                        }
                      `}
                    >
                      {isSelected && (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedTags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3 ring-1 ring-indigo-200">
            <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-indigo-900">
              {selectedTags.length}件のタグで絞り込み中
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
