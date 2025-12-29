export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* ヘッダースケルトン */}
      <div className="border-b border-border bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      {/* コンテンツスケルトン */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* タグカテゴリースケルトン */}
          {[1, 2, 3].map((categoryIndex) => (
            <div
              key={categoryIndex}
              className="rounded-lg border border-border bg-card p-6 shadow-card"
            >
              <div className="space-y-4">
                {/* カテゴリーヘッダースケルトン */}
                <div className="flex items-center justify-between">
                  <div className="h-6 w-32 animate-pulse rounded-lg bg-muted" />
                  <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
                </div>

                {/* タググリッドスケルトン */}
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((tagIndex) => (
                    <div
                      key={tagIndex}
                      className="h-8 w-24 animate-pulse rounded-full bg-muted"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
