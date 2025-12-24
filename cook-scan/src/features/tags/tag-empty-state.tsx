export function TagEmptyState() {
  return (
    <div className="overflow-hidden rounded-xl bg-white p-12 text-center shadow-lg">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200">
        <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">タグがまだありません</h3>
      <p className="mt-2 text-sm text-gray-600">
        上のフォームからタグとカテゴリを作成して、レシピを整理しましょう
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          カテゴリを作成してからタグを追加
        </div>
      </div>
    </div>
  )
}
