import Link from "next/link";
import type { Route } from "next";
import { CameraIcon } from "@/components/icons/camera-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { ClipboardListIcon } from "@/components/icons/clipboard-list-icon";
import { EmptyIcon } from "@/components/icons/empty-icon";
import { TagIcon } from "@/components/icons/tag-icon";
import { CalendarIcon } from "@/components/icons/calendar-icon";

export function QuickActions() {
  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary h-1 w-12 rounded-full" />
        <h2 className="text-foreground text-2xl font-bold">クイックアクション</h2>
      </div>

      <div className="space-y-4">
        {/* Hero Card - レシピをスキャン */}
        <Link
          href="/recipes/upload"
          className="group bg-primary relative block overflow-hidden rounded-2xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10"
          style={{
            animation: "fadeInUp 0.5s ease-out",
            animationDelay: "0ms",
            animationFillMode: "both",
          }}
        >
          {/* 背景装飾 */}
          <div className="pointer-events-none absolute inset-0">
            <div className="bg-primary/30 absolute -top-20 -right-20 h-80 w-80 rounded-full" />
            <div className="bg-secondary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full" />
          </div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                AIスキャン
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                レシピをスキャンする
              </h3>
              <p className="text-primary-light max-w-md text-base sm:text-lg">
                料理本やレシピカードを撮影して、AIが自動でデジタル化します
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <CameraIcon className="text-primary h-8 w-8" strokeWidth={2} />
            </div>
          </div>
        </Link>

        {/* Secondary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* マイレシピ */}
          <Link
            href="/recipes"
            className="group ring-border relative overflow-hidden rounded-xl bg-white p-6 shadow-md ring-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "100ms",
              animationFillMode: "both",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="bg-secondary-light flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110">
                <EmptyIcon className="text-secondary-hover h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground mb-1 font-semibold">マイレシピ</h3>
                <p className="text-muted-foreground text-sm">保存したレシピを閲覧・編集</p>
              </div>
              <ChevronRightIcon className="text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 買い物リスト */}
          <Link
            href="/shopping-list"
            className="group ring-border relative overflow-hidden rounded-xl bg-white p-6 shadow-md ring-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "150ms",
              animationFillMode: "both",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent-steps-light flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110">
                <ClipboardListIcon className="text-accent-steps h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground mb-1 font-semibold">買い物リスト</h3>
                <p className="text-muted-foreground text-sm">必要な食材をチェック管理</p>
              </div>
              <ChevronRightIcon className="text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 献立プランナー */}
          <Link
            href={"/meal-planner" as Route}
            className="group ring-border relative overflow-hidden rounded-xl bg-white p-6 shadow-md ring-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "200ms",
              animationFillMode: "both",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="bg-secondary-light flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110">
                <CalendarIcon className="text-secondary-hover h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground mb-1 font-semibold">献立プランナー</h3>
                <p className="text-muted-foreground text-sm">1週間の献立を計画・管理</p>
              </div>
              <ChevronRightIcon className="text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>

          {/* タグ管理 */}
          <Link
            href="/tags"
            className="group ring-border relative overflow-hidden rounded-xl bg-white p-6 shadow-md ring-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "200ms",
              animationFillMode: "both",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="bg-warning-light flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110">
                <TagIcon className="text-warning h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground mb-1 font-semibold">タグ管理</h3>
                <p className="text-muted-foreground text-sm">カテゴリを作成してレシピを整理</p>
              </div>
              <ChevronRightIcon className="text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
