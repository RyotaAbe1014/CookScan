import Link from 'next/link'

type RecipeEmptyStateProps = {
  hasFilters: boolean
  hasSearchQuery: boolean
  hasSelectedTags: boolean
}

export function RecipeEmptyState({
  hasFilters,
  hasSearchQuery,
  hasSelectedTags,
}: RecipeEmptyStateProps) {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow-lg">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200">
        <svg
          className="h-10 w-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <h3 className="mt-6 text-lg font-semibold text-gray-900">該当するレシピがありません</h3>
          <p className="mt-2 text-sm text-gray-600">
            {hasSearchQuery && hasSelectedTags
              ? '検索条件とタグに一致するレシピが見つかりませんでした'
              : hasSearchQuery
              ? '検索条件に一致するレシピが見つかりませんでした'
              : '選択したタグに一致するレシピが見つかりませんでした'}
          </p>
          <div className="mt-6">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              すべてクリア
            </Link>
          </div>
        </>
      ) : (
        <>
          <h3 className="mt-6 text-lg font-semibold text-gray-900">レシピがまだありません</h3>
          <p className="mt-2 text-sm text-gray-600">レシピをスキャンして、マイレシピに追加しましょう</p>
          <div className="mt-6">
            <Link
              href="/recipes/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              レシピをスキャン
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
