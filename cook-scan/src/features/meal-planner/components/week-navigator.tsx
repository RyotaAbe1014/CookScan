"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { formatShortDate } from "../utils";

type WeekNavigatorProps = {
  weekDates: Date[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
};

export function WeekNavigator({ weekDates, onPrevWeek, onNextWeek, onToday }: WeekNavigatorProps) {
  const startDate = formatShortDate(weekDates[0]);
  const endDate = formatShortDate(weekDates[6]);

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="ghost" size="icon" onClick={onPrevWeek}>
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-foreground">
          {startDate} 〜 {endDate}
        </span>
        <Button variant="secondary" size="sm" onClick={onToday}>
          今週
        </Button>
      </div>
      <Button variant="ghost" size="icon" onClick={onNextWeek}>
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
