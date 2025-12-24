import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function NotFoundPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-8">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      <div className="relative max-w-2xl w-full">
        <Card className="overflow-hidden">
          <div className="h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-600" />

          <CardContent className="p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-indigo-50 to-purple-100 ring-2 ring-indigo-500/20">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="inline-block">
                <h2 className="text-6xl sm:text-7xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  404
                </h2>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">ページが見つかりません</h1>

            <p className="text-base sm:text-lg text-gray-600 text-center mb-8 leading-relaxed">
              お探しのページは存在しないか、移動または削除された可能性があります。
              <br className="hidden sm:inline" />
              URLをご確認いただくか、以下のリンクからページをお探しください。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  ダッシュボードに戻る
                </Button>
              </Link>

              <Link href="/recipes">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  レシピ一覧
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-3">よく使われるページ</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/recipes/upload"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-600/30 hover:decoration-indigo-700 transition-colors"
                >
                  レシピアップロード
                </Link>
                <Link
                  href="/tags"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-600/30 hover:decoration-indigo-700 transition-colors"
                >
                  タグ管理
                </Link>
                <Link
                  href="/profile/setup"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-600/30 hover:decoration-indigo-700 transition-colors"
                >
                  プロフィール設定
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            お探しのレシピが見つかりませんか？{' '}
            <Link
              href="/recipes"
              className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-600/30 hover:decoration-indigo-700 transition-colors"
            >
              レシピ一覧
            </Link>
            から検索してみてください
          </p>
        </div>
      </div>
    </div>
  )
}
