import Link from 'next/link'

export function QuickActions() {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">クイックアクション</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/recipes/upload"
          className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 opacity-50 transition-transform group-hover:scale-110" />
          <div className="relative flex flex-col h-full">
            <div className="mb-4 inline-flex rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg transition-transform group-hover:scale-110">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">レシピをスキャン</h3>
            <p className="flex-1 text-sm leading-relaxed text-gray-600">
              料理本やレシピカードを撮影して、AIが自動でデジタル化します
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 transition-colors group-hover:text-purple-600">
              スキャンを開始
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link
          href="/recipes"
          className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-green-100 to-emerald-100 opacity-50 transition-transform group-hover:scale-110" />
          <div className="relative flex flex-col h-full">
            <div className="mb-4 inline-flex rounded-xl bg-linear-to-br from-green-500 to-emerald-600 p-3 text-white shadow-lg transition-transform group-hover:scale-110">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">マイレシピ</h3>
            <p className="flex-1 text-sm leading-relaxed text-gray-600">保存したレシピを閲覧・編集・管理できます</p>
            <div className="mt-4 flex items-center text-sm font-medium text-green-600 transition-colors group-hover:text-emerald-600">
              レシピを見る
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link
          href="/tags"
          className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-amber-100 to-orange-100 opacity-50 transition-transform group-hover:scale-110" />
          <div className="relative flex flex-col h-full">
            <div className="mb-4 inline-flex rounded-xl bg-linear-to-br from-amber-500 to-orange-600 p-3 text-white shadow-lg transition-transform group-hover:scale-110">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">タグ管理</h3>
            <p className="flex-1 text-sm leading-relaxed text-gray-600">タグとカテゴリを作成・編集して、レシピを整理しましょう</p>
            <div className="mt-4 flex items-center text-sm font-medium text-amber-600 transition-colors group-hover:text-orange-600">
              タグを管理
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
