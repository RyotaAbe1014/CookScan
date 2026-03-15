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
          <div className="h-1 w-12 rounded-full bg-primary" />
          <h2 id="today-meal-plan-heading" className="text-2xl font-bold text-foreground">
            今日の献立
          </h2>
        </div>

        <Link
          href={summary.plannerHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          献立プランナーへ
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <Card className="bg-linear-to-br from-primary-light/55 via-white to-section-header">
        <CardContent padding="lg" className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md">
              <CalendarIcon className="h-5 w-5" strokeWidth={2} />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-primary">{summary.dateLabel}</p>
              <p className="text-sm text-muted-foreground">
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
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                  </li>
                ))}
              </ul>

              {remainingCount > 0 ? (
                <p className="text-sm font-medium text-muted-foreground">他{remainingCount}件</p>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                献立プランナーから今日のレシピを追加できます。
              </p>
              <Link
                href={summary.plannerHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35"
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
