import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { SadFaceIcon } from "@/components/icons/sad-face-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { BookIcon } from "@/components/icons/book-icon";

export function NotFoundPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-light via-white to-secondary-light px-4 py-8">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-primary/5 pointer-events-none" />

      <div className="relative max-w-2xl w-full">
        <Card className="overflow-hidden shadow-lg">
          <div className="h-2 bg-linear-to-r from-primary to-secondary" />

          <CardContent className="p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-light ring-4 ring-primary/20 shadow-sm">
                <SadFaceIcon className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="inline-block">
                <h2 className="text-6xl sm:text-7xl font-bold text-primary mb-2">404</h2>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
              ページが見つかりません
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground text-center mb-8 leading-relaxed">
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

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-3">よく使われるページ</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/recipes/upload"
                  className="text-sm text-primary hover:text-primary-hover font-medium underline decoration-primary/30 hover:decoration-primary-hover transition-colors"
                >
                  レシピアップロード
                </Link>
                <Link
                  href="/tags"
                  className="text-sm text-primary hover:text-primary-hover font-medium underline decoration-primary/30 hover:decoration-primary-hover transition-colors"
                >
                  タグ管理
                </Link>
                <Link
                  href="/settings/profile"
                  className="text-sm text-primary hover:text-primary-hover font-medium underline decoration-primary/30 hover:decoration-primary-hover transition-colors"
                >
                  プロフィール
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            お探しのレシピが見つかりませんか？{" "}
            <Link
              href="/recipes"
              className="text-primary hover:text-primary-hover font-medium underline decoration-primary/30 hover:decoration-primary-hover transition-colors"
            >
              レシピ一覧
            </Link>
            から検索してみてください
          </p>
        </div>
      </div>
    </div>
  );
}
