import type { Route } from "next";
import Link from "next/link";
import { CalendarIcon } from "@/components/icons/calendar-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { Card, CardContent } from "@/components/ui/card";

const MAX_VISIBLE_ITEMS = 3;

export type TodayMealPlanSummaryItem = {
  id: string;
  title: string;
};

export type TodayMealPlanSummary = {
  weekStart: string;
  plannerHref: Route;
  dateLabel: string;
  items: TodayMealPlanSummaryItem[];
};

type TodayMealPlanSectionProps = {
  summary: TodayMealPlanSummary;
};

export function TodayMealPlanSection({ summary }: TodayMealPlanSectionProps) {
  const visibleItems = summary.items.slice(0, MAX_VISIBLE_ITEMS);
  const remainingCount = Math.max(summary.items.length - visibleItems.length, 0);
  const hasItems = summary.items.length > 0;

  return (
    <section aria-labelledby="today-meal-plan-heading" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary h-1 w-12 rounded-full" />
          <h2 id="today-meal-plan-heading" className="text-foreground text-2xl font-bold">
            今日の献立
          </h2>
        </div>

        <Link
          href={summary.plannerHref}
          className="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-sm font-semibold transition-colors"
        >
          献立プランナーへ
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <Card className="from-primary-light/55 to-section-header bg-linear-to-br via-white">
        <CardContent padding="lg" className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="bg-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
              <CalendarIcon className="h-5 w-5" strokeWidth={2} />
            </div>

            <div className="space-y-1">
              <p className="text-primary text-sm font-semibold">{summary.dateLabel}</p>
              <p className="text-muted-foreground text-sm">
                {hasItems ? `今日の献立は${summary.items.length}件です` : "今日の献立は未登録です"}
              </p>
            </div>
          </div>

          {hasItems ? (
            <div className="space-y-3">
              <ul className="space-y-2" aria-label="今日の献立一覧">
                {visibleItems.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-gray-900/5"
                  >
                    <span className="bg-primary-light text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-foreground text-sm font-medium">{item.title}</span>
                  </li>
                ))}
              </ul>

              {remainingCount > 0 ? (
                <p className="text-muted-foreground text-sm font-medium">他{remainingCount}件</p>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-sm">
                献立プランナーから今日のレシピを追加できます。
              </p>
              <Link
                href={summary.plannerHref}
                className="bg-primary shadow-primary/25 hover:shadow-primary/35 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                <PlusIcon className="h-4 w-4" />
                献立を追加
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
