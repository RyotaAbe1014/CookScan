'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ErrorPageContentProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorPageContent({ error, reset }: ErrorPageContentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-8">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      <div className="relative max-w-2xl w-full">
        <Card className="overflow-hidden">
          <div className="h-2 bg-linear-to-r from-red-500 via-rose-500 to-pink-600" />

          <CardContent className="p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-red-50 to-rose-100 ring-2 ring-red-500/20">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">エラーが発生しました</h1>

            <p className="text-base sm:text-lg text-gray-600 text-center mb-8 leading-relaxed">
              申し訳ございません。予期しないエラーが発生しました。
              <br className="hidden sm:inline" />
              しばらく時間をおいて再度お試しください。
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

              <Button variant="secondary" size="lg" onClick={() => window.location.reload()} className="w-full sm:w-auto">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                再読み込み
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">問題が解決しない場合は、サポートまでお問い合わせください。</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <Link href="/recipes" className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-600/30 hover:decoration-indigo-700 transition-colors">
              レシピ一覧
            </Link>
            {' '}または{' '}
            <Link href="/tags" className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-600/30 hover:decoration-indigo-700 transition-colors">
              タグ管理
            </Link>
            {' '}に移動
          </p>
        </div>
      </div>
    </div>
  )
}
