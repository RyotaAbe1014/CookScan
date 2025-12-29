export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* ヘッダースケルトン */}
      <div className="border-b border-border bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      {/* コンテンツスケルトン */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* レシピ画像スケルトン */}
          <div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />

          {/* タイトルとメタ情報スケルトン */}
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="flex gap-4">
              <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
            </div>
          </div>

          {/* 材料セクションスケルトン */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* 作り方セクションスケルトン */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                    <div className="h-5 w-48 animate-pulse rounded-lg bg-muted" />
                  </div>
                  <div className="ml-11 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
