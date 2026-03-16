import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { SadFaceIcon } from "@/components/icons/sad-face-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { BookIcon } from "@/components/icons/book-icon";

export function NotFoundPageContent() {
  return (
    <div className="from-primary-light to-secondary-light flex min-h-screen items-center justify-center bg-linear-to-br via-white px-4 py-8">
      <div className="from-primary/5 via-secondary/5 to-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br" />

      <div className="relative w-full max-w-2xl">
        <Card className="overflow-hidden shadow-lg">
          <div className="from-primary to-secondary h-2 bg-linear-to-r" />

          <CardContent className="p-8 sm:p-12">
            <div className="mb-6 flex justify-center">
              <div className="bg-primary-light ring-primary/20 inline-flex h-20 w-20 items-center justify-center rounded-full shadow-sm ring-4">
                <SadFaceIcon className="text-primary h-10 w-10" />
              </div>
            </div>

            <div className="mb-4 text-center">
              <div className="inline-block">
                <h2 className="text-primary mb-2 text-6xl font-bold sm:text-7xl">404</h2>
              </div>
            </div>

            <h1 className="text-foreground mb-4 text-center text-2xl font-bold sm:text-3xl">
              ページが見つかりません
            </h1>

            <p className="text-muted-foreground mb-8 text-center text-base leading-relaxed sm:text-lg">
              お探しのページは存在しないか、移動または削除された可能性があります。
              <br className="hidden sm:inline" />
              URLをご確認いただくか、以下のリンクからページをお探しください。
            </p>

            <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  <HomeIcon className="mr-2 h-5 w-5" />
                  ダッシュボードに戻る
                </Button>
              </Link>

              <Link href="/recipes">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <BookIcon className="mr-2 h-5 w-5" />
                  レシピ一覧
                </Button>
              </Link>
            </div>

            <div className="border-border border-t pt-6">
              <p className="text-muted-foreground mb-3 text-center text-sm">よく使われるページ</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/recipes/upload"
                  className="text-primary hover:text-primary-hover decoration-primary/30 hover:decoration-primary-hover text-sm font-medium underline transition-colors"
                >
                  レシピアップロード
                </Link>
                <Link
                  href="/tags"
                  className="text-primary hover:text-primary-hover decoration-primary/30 hover:decoration-primary-hover text-sm font-medium underline transition-colors"
                >
                  タグ管理
                </Link>
                <Link
                  href="/settings/profile"
                  className="text-primary hover:text-primary-hover decoration-primary/30 hover:decoration-primary-hover text-sm font-medium underline transition-colors"
                >
                  プロフィール
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            お探しのレシピが見つかりませんか？{" "}
            <Link
              href="/recipes"
              className="text-primary hover:text-primary-hover decoration-primary/30 hover:decoration-primary-hover font-medium underline transition-colors"
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
