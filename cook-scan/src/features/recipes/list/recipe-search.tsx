'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  resultCount?: number
}

export function RecipeSearch({ resultCount }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(currentQuery)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setQuery(currentQuery)
  }, [currentQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()

    const params = new URLSearchParams(searchParams.toString())

    if (trimmedQuery) {
      params.set('q', trimmedQuery)
    } else {
      params.delete('q')
    }

    router.push(`/recipes?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/recipes?${params.toString()}`)
  }

  const hasActiveSearch = currentQuery.length > 0

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="relative">
        <div className={`
          group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 transition-all duration-300
          ${isFocused
            ? 'ring-2 ring-indigo-400 shadow-xl shadow-indigo-500/20'
            : 'ring-gray-900/5 hover:shadow-xl'
          }
        `}>
          {/* Animated gradient background on focus */}
          <div className={`
            absolute inset-0 bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-0 transition-opacity duration-500
            ${isFocused ? 'opacity-100' : 'group-hover:opacity-50'}
          `} />

          <div className="relative flex items-center gap-3 p-4">
            {/* Search Icon */}
            <div className={`
              flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300
              ${isFocused
                ? 'bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 scale-110'
                : 'bg-linear-to-br from-gray-100 to-gray-200'
              }
            `}>
              <svg
                className={`h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-white' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="レシピ名で検索..."
              className="flex-1 bg-transparent text-base font-medium text-gray-900 placeholder-gray-400 outline-none"
            />

            {/* Clear Button */}
            {hasActiveSearch && (
              <button
                type="button"
                onClick={handleClear}
                className="group/clear flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-all hover:bg-red-50 hover:scale-110"
                aria-label="検索をクリア"
              >
                <svg
                  className="h-4 w-4 text-gray-500 transition-colors group-hover/clear:text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={query.trim().length === 0}
              className="group/btn relative flex h-11 items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />

              <svg
                className="relative h-4 w-4 transition-transform group-hover/btn:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="relative">検索</span>
            </button>
          </div>
        </div>
      </form>

      {/* Search Results Count */}
      {hasActiveSearch && typeof resultCount === 'number' && (
        <div className="mt-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-purple-600">
              <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              検索結果: <span className="font-bold text-indigo-600">{resultCount}</span>件
              {currentQuery && (
                <span className="ml-2 text-gray-500">
                  「<span className="font-semibold text-gray-700">{currentQuery}</span>」
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
