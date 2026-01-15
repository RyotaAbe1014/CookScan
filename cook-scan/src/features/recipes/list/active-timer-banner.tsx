'use client'

import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { activeTimerRecipesAtom } from '@/features/recipes/atoms'
import { ClockIcon } from '@/components/icons/clock-icon'
import { ChevronRightIcon } from '@/components/icons/chevron-right-icon'
import { InfoCircleIcon } from '@/components/icons/info-circle-icon'

export function ActiveTimerBanner() {
  const activeRecipes = useAtomValue(activeTimerRecipesAtom)

  if (activeRecipes.length === 0) {
    return null
  }

  return (
    <div className="sticky top-0 z-20 mb-6">
      <div className="relative overflow-hidden rounded-2xl border-2 border-orange-300/50 bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 p-5 shadow-lg shadow-orange-200/30 backdrop-blur-sm">
        {/* Decorative background accent */}
        <div className="absolute inset-0 bg-linear-to-r from-orange-400/5 via-amber-400/10 to-orange-400/5 opacity-60" />

        {/* Content container */}
        <div className="relative">
          {/* Header section with status */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Animated timer icon with ping effect */}
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/30" />
                <ClockIcon
                  className="relative h-8 w-8 shrink-0 animate-spin text-orange-600"
                  style={{ animationDuration: '8s' }}
                  stroke="currentColor"
                />
              </div>

              {/* Status badge with pulse */}
              <div className="animate-pulse">
                <div className="rounded-full bg-orange-600 px-4 py-1.5 shadow-md shadow-orange-700/30">
                  <span className="text-sm font-bold uppercase tracking-wider text-white">
                    タイマー起動中
                  </span>
                </div>
              </div>
            </div>

            {/* Recipe count indicator */}
            <div className="rounded-lg bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="text-sm font-semibold text-orange-900">
                {activeRecipes.length}件のレシピ
              </span>
            </div>
          </div>

          {/* Recipe cards grid */}
          <div className="flex flex-wrap gap-3">
            {activeRecipes.map(({ recipeId, recipeTitle, timerCount }) => (
              <Link
                key={recipeId}
                href={`/recipes/${recipeId}`}
                className="group relative block"
              >
                <div className="relative overflow-hidden rounded-xl border border-orange-200/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-orange-400 hover:bg-white hover:shadow-md hover:shadow-orange-200/40">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-r from-orange-400/0 via-amber-400/5 to-orange-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-center gap-3">
                    {/* Recipe indicator dot */}
                    <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-orange-500 shadow-sm shadow-orange-300" />

                    <div className="flex flex-col gap-1">
                      {/* Recipe title */}
                      <span className="text-sm font-semibold text-slate-800 transition-colors duration-300 group-hover:text-orange-700">
                        {recipeTitle}
                      </span>

                      {/* Timer count */}
                      <span className="text-xs font-medium text-orange-600">
                        タイマー: {timerCount}件
                      </span>
                    </div>

                    {/* Arrow indicator on hover */}
                    <ChevronRightIcon
                      className="h-4 w-4 shrink-0 translate-x-0 text-orange-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom instruction hint */}
          <div className="mt-4 flex items-center gap-2 text-xs text-orange-700/70">
            <InfoCircleIcon
              className="h-3.5 w-3.5"
            />
            <span>クリックしてレシピ詳細を確認</span>
          </div>
        </div>
      </div>
    </div>
  )
}
