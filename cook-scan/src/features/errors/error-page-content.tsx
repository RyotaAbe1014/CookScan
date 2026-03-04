'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { ErrorIcon } from '@/components/icons/error-icon'
import { HomeIcon } from '@/components/icons/home-icon'
import { ReloadIcon } from '@/components/icons/reload-icon'

type ErrorPageContentProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorPageContent({ error: _error, reset: _reset }: ErrorPageContentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-light via-white to-secondary-light px-4 py-8">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-primary/5 pointer-events-none" />

      <div className="relative max-w-2xl w-full">
        <Card className="overflow-hidden shadow-lg">
          <div className="h-2 bg-linear-to-r from-danger to-danger-hover" />

          <CardContent className="p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-danger-light ring-4 ring-danger/20 shadow-sm">
                <ErrorIcon className="w-10 h-10 text-danger" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">エラーが発生しました</h1>

            <p className="text-base sm:text-lg text-muted-foreground text-center mb-8 leading-relaxed">
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

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">問題が解決しない場合は、サポートまでお問い合わせください。</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/recipes" className="text-primary hover:text-primary-hover font-medium underline decoration-primary/30 hover:decoration-primary-hover transition-colors">
              レシピ一覧
            </Link>
            {' '}または{' '}
            <Link href="/tags" className="text-primary hover:text-primary-hover font-medium underline decoration-primary/30 hover:decoration-primary-hover transition-colors">
              タグ管理
            </Link>
            {' '}に移動
          </p>
        </div>
      </div>
    </div>
  )
}
