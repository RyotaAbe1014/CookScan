import { Suspense } from 'react'
import type { RecipeBasic } from '@/types/recipe'
import { RecipeSearch } from './recipe-search'
import { TagFilter } from './tag-filter'
import { RecipeStatsBar } from './recipe-stats-bar'
import { RecipeEmptyState } from './recipe-empty-state'
import { RecipeGrid } from './recipe-grid'
import { ActiveTimerBanner } from './active-timer-banner'

type TagCategory = {
  id: string
  name: string
  tags: Array<{
    id: string
    name: string
  }>
}

type RecipeListContentProps = {
  recipes: RecipeBasic[]
  tagCategories: TagCategory[]
  selectedTagIds: string[]
  searchQuery: string
}

export function RecipeListContent({
  recipes,
  tagCategories,
  selectedTagIds,
  searchQuery,
}: RecipeListContentProps) {
  const hasFilters = selectedTagIds.length > 0 || searchQuery.length > 0

  return (
    <>
      <ActiveTimerBanner />

      <RecipeStatsBar recipeCount={recipes.length} />

      <Suspense fallback={null}>
        <RecipeSearch resultCount={recipes.length} />
      </Suspense>

      <Suspense fallback={null}>
        <TagFilter tagCategories={tagCategories} />
      </Suspense>

      {recipes.length === 0 ? (
        <RecipeEmptyState
          hasFilters={hasFilters}
          hasSearchQuery={searchQuery.length > 0}
          hasSelectedTags={selectedTagIds.length > 0}
        />
      ) : (
        <RecipeGrid recipes={recipes} />
      )}
    </>
  )
}
