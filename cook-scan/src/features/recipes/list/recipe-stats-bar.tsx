import Link from 'next/link'

type RecipeStatsBarProps = {
  recipeCount: number
}

export function RecipeStatsBar({ recipeCount }: RecipeStatsBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-600">保存レシピ数</p>
          <p className="text-2xl font-bold text-gray-900">{recipeCount}</p>
        </div>
      </div>
      <Link
        href="/recipes/upload"
        className="flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        レシピをスキャン
      </Link>
    </div>
  )
}
