export function TagInfoBanner() {
  return (
    <div className="overflow-hidden rounded-xl bg-linear-to-r from-amber-500 to-orange-600 p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">タグでレシピを整理</h3>
          <p className="mt-1 text-sm text-orange-100">
            カテゴリとタグを使ってレシピを分類し、簡単に見つけられるようにしましょう
          </p>
        </div>
      </div>
    </div>
  )
}
