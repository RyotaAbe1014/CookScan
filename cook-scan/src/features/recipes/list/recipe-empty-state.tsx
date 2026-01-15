import Link from 'next/link'
import { EmptyIcon } from '@/components/icons/empty-icon'
import { CloseIcon } from '@/components/icons/close-icon'
import { PlusIcon } from '@/components/icons/plus-icon'

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
        <EmptyIcon className="h-10 w-10 text-gray-400" />
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
              className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50"
            >
              <CloseIcon className="h-4 w-4" />
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
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
            >
              <PlusIcon className="h-5 w-5" />
              レシピをスキャン
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
