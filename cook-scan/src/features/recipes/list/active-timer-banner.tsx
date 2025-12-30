'use client'

import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { activeTimerRecipesAtom } from '@/features/recipes/detail/atoms/timer-atoms'

export function ActiveTimerBanner() {
  const activeRecipes = useAtomValue(activeTimerRecipesAtom)

  if (activeRecipes.length === 0) {
    return null
  }

  return (
    <div className="sticky top-0 z-20 mb-4">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg border border-slate-200 p-3">
        <div className="flex items-center gap-3">
          {/* タイマーアイコン */}
          <svg
            className="h-5 w-5 shrink-0 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          {/* レシピ情報 */}
          <div className="flex flex-wrap gap-2">
            {activeRecipes.slice(0, 3).map(({ recipeId, recipeTitle, timerCount }) => (
              <Link key={recipeId} href={`/recipes/${recipeId}`}>
                <span className="text-sm font-medium text-slate-800 transition-colors hover:text-indigo-600">
                  {recipeTitle} ({timerCount}件)
                </span>
              </Link>
            ))}
            {activeRecipes.length > 3 && (
              <span className="text-sm text-slate-600">
                他{activeRecipes.length - 3}件
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
