import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { SadFaceIcon, HomeIcon, BookIcon } from '@/components/icons'

export function NotFoundPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-8">
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/5 pointer-events-none" />

      <div className="relative max-w-2xl w-full">
        <Card className="overflow-hidden shadow-lg">
          <div className="h-2 bg-linear-to-r from-emerald-500 to-teal-500" />

          <CardContent className="p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 ring-4 ring-emerald-500/20 shadow-sm">
                <SadFaceIcon className="w-10 h-10 text-emerald-600" />
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="inline-block">
                <h2 className="text-6xl sm:text-7xl font-bold text-emerald-600 mb-2">
                  404
                </h2>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-4">ページが見つかりません</h1>

            <p className="text-base sm:text-lg text-slate-600 text-center mb-8 leading-relaxed">
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

            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 text-center mb-3">よく使われるページ</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/recipes/upload"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-600/30 hover:decoration-emerald-700 transition-colors"
                >
                  レシピアップロード
                </Link>
                <Link
                  href="/tags"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-600/30 hover:decoration-emerald-700 transition-colors"
                >
                  タグ管理
                </Link>
                <Link
                  href="/profile/setup"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-600/30 hover:decoration-emerald-700 transition-colors"
                >
                  プロフィール設定
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            お探しのレシピが見つかりませんか？{' '}
            <Link
              href="/recipes"
              className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-600/30 hover:decoration-emerald-700 transition-colors"
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
