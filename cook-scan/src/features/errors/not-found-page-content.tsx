import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { SadFaceIcon, HomeIcon, BookIcon } from '@/components/icons'

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
                <SadFaceIcon className="w-10 h-10 text-indigo-600" />
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
                  <HomeIcon className="w-5 h-5 mr-2" />
                  ダッシュボードに戻る
                </Button>
              </Link>

              <Link href="/recipes">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <BookIcon className="w-5 h-5 mr-2" />
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
