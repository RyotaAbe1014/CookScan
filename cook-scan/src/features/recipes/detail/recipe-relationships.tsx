import Link from 'next/link'
import type { ParentRecipeBasic, ChildRecipeBasic } from '@/types/recipe'

type RecipeRelationshipsProps = {
  parentRecipe?: ParentRecipeBasic | null
  childRecipes?: ChildRecipeBasic[]
}

export function RecipeRelationships({ parentRecipe, childRecipes }: RecipeRelationshipsProps) {
  // 親も子も存在しない場合は何も表示しない
  if (!parentRecipe && (!childRecipes || childRecipes.length === 0)) {
    return null
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        関連レシピ
      </h3>

      <div className="space-y-6">
        {/* 親レシピ */}
        {parentRecipe && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              元のレシピ
            </p>
            <Link
              href={`/recipes/${parentRecipe.id}`}
              className="group block rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                {parentRecipe.imageUrl && (
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={parentRecipe.imageUrl}
                      alt={parentRecipe.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    {parentRecipe.title}
                  </p>
                </div>
                <svg className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        )}

        {/* 子レシピ */}
        {childRecipes && childRecipes.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              このレシピから派生したレシピ ({childRecipes.length})
            </p>
            <div className="space-y-2">
              {childRecipes.map((child) => (
                <Link
                  key={child.id}
                  href={`/recipes/${child.id}`}
                  className="group block rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    {child.imageUrl && (
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={child.imageUrl}
                          alt={child.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                        {child.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        作成日: {new Date(child.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <svg className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
