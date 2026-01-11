import Link from 'next/link'
import {
  PlusIcon,
  ChevronRightIcon,
  EmptyIcon,
  TagIcon,
} from '@/components/icons'

export function QuickActions() {
  return (
    <div className="mb-8">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">クイックアクション</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* レシピをスキャン */}
        <Link
          href="/recipes/upload"
          className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-50 via-purple-50 to-indigo-50 p-6 shadow-sm ring-1 ring-indigo-100/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-200/60"
        >
          {/* 装飾的な背景要素 */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-linear-to-br from-indigo-200/30 to-purple-200/30 blur-2xl transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-linear-to-tr from-purple-200/20 to-indigo-200/20 blur-xl" />

          <div className="relative flex h-full flex-col">
            {/* アイコン */}
            <div className="mb-5 inline-flex">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-indigo-400/30 blur-xl transition-all duration-300 group-hover:bg-indigo-400/50" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <PlusIcon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* タイトルと説明 */}
            <h3 className="mb-2 text-xl font-bold text-gray-900">レシピをスキャン</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
              料理本やレシピカードを撮影して、AIが自動でデジタル化します
            </p>

            {/* アクションリンク */}
            <div className="flex items-center text-sm font-semibold text-indigo-600 transition-colors duration-200 group-hover:text-purple-600">
              スキャンを開始
              <ChevronRightIcon className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={2.5} />
            </div>
          </div>
        </Link>

        {/* マイレシピ */}
        <Link
          href="/recipes"
          className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-50 via-teal-50 to-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-emerald-200/60"
        >
          {/* 装飾的な背景要素 */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-linear-to-br from-emerald-200/30 to-teal-200/30 blur-2xl transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-linear-to-tr from-teal-200/20 to-emerald-200/20 blur-xl" />

          <div className="relative flex h-full flex-col">
            {/* アイコン */}
            <div className="mb-5 inline-flex">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl transition-all duration-300 group-hover:bg-emerald-400/50" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <EmptyIcon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* タイトルと説明 */}
            <h3 className="mb-2 text-xl font-bold text-gray-900">マイレシピ</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
              保存したレシピを閲覧・編集して、お気に入りのレシピを管理できます
            </p>

            {/* アクションリンク */}
            <div className="flex items-center text-sm font-semibold text-emerald-600 transition-colors duration-200 group-hover:text-teal-600">
              レシピを見る
              <ChevronRightIcon className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={2.5} />
            </div>
          </div>
        </Link>

        {/* タグ管理 */}
        <Link
          href="/tags"
          className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 via-orange-50 to-amber-50 p-6 shadow-sm ring-1 ring-amber-100/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-amber-200/60"
        >
          {/* 装飾的な背景要素 */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-linear-to-br from-amber-200/30 to-orange-200/30 blur-2xl transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-linear-to-tr from-orange-200/20 to-amber-200/20 blur-xl" />

          <div className="relative flex h-full flex-col">
            {/* アイコン */}
            <div className="mb-5 inline-flex">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-xl transition-all duration-300 group-hover:bg-amber-400/50" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <TagIcon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* タイトルと説明 */}
            <h3 className="mb-2 text-xl font-bold text-gray-900">タグ管理</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
              タグとカテゴリを作成・編集して、レシピを整理しましょう
            </p>

            {/* アクションリンク */}
            <div className="flex items-center text-sm font-semibold text-amber-600 transition-colors duration-200 group-hover:text-orange-600">
              タグを管理
              <ChevronRightIcon className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={2.5} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
