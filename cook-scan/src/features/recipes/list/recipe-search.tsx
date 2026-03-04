'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from '@/components/icons/search-icon'
import { CloseIcon } from '@/components/icons/close-icon'
import { DocumentSearchIcon } from '@/components/icons/document-search-icon'

type Props = {
  resultCount?: number
}

export function RecipeSearch({ resultCount }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(currentQuery)
  const [prevCurrentQuery, setPrevCurrentQuery] = useState(currentQuery)
  const [isFocused, setIsFocused] = useState(false)

  // URLのクエリパラメータが外部から変わったらローカルstateを同期
  if (prevCurrentQuery !== currentQuery) {
    setPrevCurrentQuery(currentQuery)
    setQuery(currentQuery)
  }

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
            ? 'ring-2 ring-primary shadow-xl shadow-primary/20'
            : 'ring-card-border hover:shadow-xl'
          }
        `}>
          {/* Animated gradient background on focus */}
          <div className={`
            absolute inset-0 bg-linear-to-r from-primary-light via-secondary-light to-accent-steps-light opacity-0 transition-opacity duration-500
            ${isFocused ? 'opacity-100' : 'group-hover:opacity-50'}
          `} />

          <div className="relative flex items-center gap-3 p-4">
            {/* Search Icon */}
            <div className={`
              flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300
              ${isFocused
                ? 'bg-primary shadow-lg shadow-primary/40 scale-110'
                : 'bg-linear-to-br from-muted to-section-header-border'
              }
            `}>
              <SearchIcon
                className={`h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-white' : 'text-muted-foreground'}`}
              />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="レシピ名で検索..."
              className="flex-1 bg-transparent text-base font-medium text-foreground placeholder-muted-foreground outline-none"
            />

            {/* Clear Button */}
            {hasActiveSearch && (
              <button
                type="button"
                onClick={handleClear}
                className="group/clear flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-all hover:bg-danger-light hover:scale-110"
                aria-label="検索をクリア"
              >
                <CloseIcon
                  className="h-4 w-4 text-muted-foreground transition-colors group-hover/clear:text-danger-hover"
                />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={query.trim().length === 0}
              className="group/btn relative flex h-11 w-11 sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-3 sm:px-6 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />

              <SearchIcon
                className="relative h-4 w-4 transition-transform group-hover/btn:scale-110"
              />
              <span className="relative hidden sm:inline">検索</span>
            </button>
          </div>
        </div>
      </form>

      {/* Search Results Count */}
      {hasActiveSearch && typeof resultCount === 'number' && (
        <div className="mt-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <DocumentSearchIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm font-medium text-foreground">
              検索結果: <span className="font-bold text-primary">{resultCount}</span>件
              {currentQuery && (
                <span className="ml-2 text-muted-foreground">
                  「<span className="font-semibold text-foreground">{currentQuery}</span>」
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
