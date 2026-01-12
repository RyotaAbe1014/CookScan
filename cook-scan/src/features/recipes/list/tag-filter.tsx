'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FilterIcon, CloseIcon, CheckSolidIcon, CheckCircleOutlineIcon } from '@/components/icons'
import { useCallback } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

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
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">タグで絞り込み</h2>
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              クリア
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {categoriesWithTags.map((category) => (
            <div key={category.id}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-emerald-600" />
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
                        ${isSelected
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-600'
                          : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-200 hover:ring-gray-300'
                        }
                      `}
                    >
                      {isSelected && (
                        <CheckSolidIcon className="h-3.5 w-3.5" />
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
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
            <CheckCircleOutlineIcon className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">
              {selectedTags.length}件のタグで絞り込み中
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
