'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { ErrorIcon, HomeIcon, ReloadIcon } from '@/components/icons'

type ErrorPageContentProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorPageContent({ error: _error, reset: _reset }: ErrorPageContentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-8">
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/5 pointer-events-none" />

      <div className="relative max-w-2xl w-full">
        <Card className="overflow-hidden shadow-lg">
          <div className="h-2 bg-linear-to-r from-red-500 to-red-600" />

          <CardContent className="p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 ring-4 ring-red-500/20 shadow-sm">
                <ErrorIcon className="w-10 h-10 text-red-500" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center mb-4">エラーが発生しました</h1>

            <p className="text-base sm:text-lg text-slate-600 text-center mb-8 leading-relaxed">
              申し訳ございません。予期しないエラーが発生しました。
              <br className="hidden sm:inline" />
              しばらく時間をおいて再度お試しください。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  <HomeIcon className="w-5 h-5 mr-2" />
                  ダッシュボードに戻る
                </Button>
              </Link>

              <Button variant="secondary" size="lg" onClick={() => window.location.reload()} className="w-full sm:w-auto">
                <ReloadIcon className="w-5 h-5 mr-2" />
                再読み込み
              </Button>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 text-center">問題が解決しない場合は、サポートまでお問い合わせください。</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            <Link href="/recipes" className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-600/30 hover:decoration-emerald-700 transition-colors">
              レシピ一覧
            </Link>
            {' '}または{' '}
            <Link href="/tags" className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-600/30 hover:decoration-emerald-700 transition-colors">
              タグ管理
            </Link>
            {' '}に移動
          </p>
        </div>
      </div>
    </div>
  )
}
