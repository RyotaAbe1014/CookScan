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
        <div className="mx-auto max-w-7xl space-y-6">
          {/* 統計バースケルトン */}
          <div className="flex gap-4">
            <div className="h-16 flex-1 animate-pulse rounded-lg bg-muted" />
            <div className="h-16 flex-1 animate-pulse rounded-lg bg-muted" />
            <div className="h-16 flex-1 animate-pulse rounded-lg bg-muted" />
          </div>

          {/* 検索バースケルトン */}
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />

          {/* タグフィルタースケルトン */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-20 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>

          {/* レシピグリッドスケルトン */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-card"
              >
                {/* 画像スケルトン */}
                <div className="aspect-video w-full animate-pulse bg-muted" />
                {/* コンテンツスケルトン */}
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
