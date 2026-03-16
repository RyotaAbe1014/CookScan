"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { activeTimerRecipesAtom } from "@/features/recipes/atoms";
import { ClockIcon } from "@/components/icons/clock-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";

export function ActiveTimerBanner() {
  const activeRecipes = useAtomValue(activeTimerRecipesAtom);

  if (activeRecipes.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-20 mb-6">
      <div className="border-warning/50 from-warning-light via-warning-light to-warning-light shadow-warning/30 relative overflow-hidden rounded-2xl border-2 bg-linear-to-r p-5 shadow-lg backdrop-blur-sm">
        {/* Decorative background accent */}
        <div className="from-warning/5 via-warning/10 to-warning/5 absolute inset-0 bg-linear-to-r opacity-60" />

        {/* Content container */}
        <div className="relative">
          {/* Header section with status */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Animated timer icon with ping effect */}
              <div className="relative">
                <div className="bg-warning/30 absolute inset-0 animate-ping rounded-full" />
                <ClockIcon
                  className="text-warning relative h-8 w-8 shrink-0 animate-spin"
                  style={{ animationDuration: "8s" }}
                  stroke="currentColor"
                />
              </div>

              {/* Status badge with pulse */}
              <div className="animate-pulse">
                <div className="bg-warning shadow-warning/30 rounded-full px-4 py-1.5 shadow-md">
                  <span className="text-sm font-bold tracking-wider text-white uppercase">
                    タイマー起動中
                  </span>
                </div>
              </div>
            </div>

            {/* Recipe count indicator */}
            <div className="rounded-lg bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="text-foreground text-sm font-semibold">
                {activeRecipes.length}件のレシピ
              </span>
            </div>
          </div>

          {/* Recipe cards grid */}
          <div className="flex flex-wrap gap-3">
            {activeRecipes.map(({ recipeId, recipeTitle, timerCount }) => (
              <Link key={recipeId} href={`/recipes/${recipeId}`} className="group relative block">
                <div className="border-warning/60 hover:border-warning hover:shadow-warning/40 relative overflow-hidden rounded-xl border bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md">
                  {/* Hover gradient overlay */}
                  <div className="from-warning/0 via-warning/5 to-warning/0 absolute inset-0 bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-center gap-3">
                    {/* Recipe indicator dot */}
                    <div className="bg-warning shadow-warning/50 h-2 w-2 shrink-0 animate-pulse rounded-full shadow-sm" />

                    <div className="flex flex-col gap-1">
                      {/* Recipe title */}
                      <span className="text-foreground group-hover:text-warning text-sm font-semibold transition-colors duration-300">
                        {recipeTitle}
                      </span>

                      {/* Timer count */}
                      <span className="text-warning text-xs font-medium">
                        タイマー: {timerCount}件
                      </span>
                    </div>

                    {/* Arrow indicator on hover */}
                    <ChevronRightIcon className="text-warning h-4 w-4 shrink-0 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom instruction hint */}
          <div className="text-warning/70 mt-4 flex items-center gap-2 text-xs">
            <InfoCircleIcon className="h-3.5 w-3.5" />
            <span>クリックしてレシピ詳細を確認</span>
          </div>
        </div>
      </div>
    </div>
  );
}
