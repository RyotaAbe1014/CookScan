"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ErrorIcon } from "@/components/icons/error-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { ReloadIcon } from "@/components/icons/reload-icon";

type ErrorPageContentProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function ErrorPageContent({ error: _error, reset: _reset }: ErrorPageContentProps) {
  return (
    <div className="from-primary-light to-secondary-light flex min-h-screen items-center justify-center bg-linear-to-br via-white px-4 py-8">
      <div className="from-primary/5 via-secondary/5 to-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br" />

      <div className="relative w-full max-w-2xl">
        <Card className="overflow-hidden shadow-lg">
          <div className="from-danger to-danger-hover h-2 bg-linear-to-r" />

          <CardContent className="p-8 sm:p-12">
            <div className="mb-6 flex justify-center">
              <div className="bg-danger-light ring-danger/20 inline-flex h-20 w-20 items-center justify-center rounded-full shadow-sm ring-4">
                <ErrorIcon className="text-danger h-10 w-10" />
              </div>
            </div>

            <h1 className="text-foreground mb-4 text-center text-3xl font-bold sm:text-4xl">
              エラーが発生しました
            </h1>

            <p className="text-muted-foreground mb-8 text-center text-base leading-relaxed sm:text-lg">
              申し訳ございません。予期しないエラーが発生しました。
              <br className="hidden sm:inline" />
              しばらく時間をおいて再度お試しください。
            </p>

            <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  <HomeIcon className="mr-2 h-5 w-5" />
                  ダッシュボードに戻る
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                <ReloadIcon className="mr-2 h-5 w-5" />
                再読み込み
              </Button>
            </div>

            <div className="border-border border-t pt-6">
              <p className="text-muted-foreground text-center text-sm">
                問題が解決しない場合は、サポートまでお問い合わせください。
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            <Link
              href="/recipes"
              className="text-primary hover:text-primary-hover decoration-primary/30 hover:decoration-primary-hover font-medium underline transition-colors"
            >
              レシピ一覧
            </Link>{" "}
            または{" "}
            <Link
              href="/tags"
              className="text-primary hover:text-primary-hover decoration-primary/30 hover:decoration-primary-hover font-medium underline transition-colors"
            >
              タグ管理
            </Link>{" "}
            に移動
          </p>
        </div>
      </div>
    </div>
  );
}
