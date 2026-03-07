'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon'
import { ChevronRightIcon } from '@/components/icons/chevron-right-icon'
import { isSuccess } from '@/utils/result'
import { addMealPlanItem } from '@/features/meal-planner/actions'
import {
  getWeekStart,
  parseLocalDate,
  getWeekDates,
  formatShortDate,
  formatDateToYYYYMMDD,
  DAY_LABELS,
  WEEK_DIRECTION,
} from '@/features/meal-planner/utils'
import type { WeekDirection } from '@/features/meal-planner/utils'

type AddToMealPlanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipeId: string
  onSuccess: () => void
  onError: () => void
}

export function AddToMealPlanDialog({
  open,
  onOpenChange,
  recipeId,
  onSuccess,
  onError,
}: AddToMealPlanDialogProps) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()))
  const [isPending, startTransition] = useTransition()

  const weekDates = getWeekDates(weekStart)
  const todayStr = formatDateToYYYYMMDD(new Date())

  function navigateWeek(direction: WeekDirection) {
    const current = parseLocalDate(weekStart)
    current.setDate(current.getDate() + direction * 7)
    setWeekStart(getWeekStart(current))
  }

  function handleSelectDay(dayOfWeek: number) {
    startTransition(async () => {
      const result = await addMealPlanItem(weekStart, dayOfWeek, recipeId)
      if (isSuccess(result)) {
        onSuccess()
        onOpenChange(false)
      } else {
        onError()
      }
    })
  }

  const weekEndDate = weekDates[6]
  const weekLabel = `${formatShortDate(weekDates[0])} - ${formatShortDate(weekEndDate)}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-sm">
        <DialogHeader>
          <DialogTitle>献立に追加</DialogTitle>
          <DialogDescription>追加する曜日を選択してください</DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek(WEEK_DIRECTION.PREVIOUS)}
              disabled={isPending}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-foreground">{weekLabel}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek(WEEK_DIRECTION.NEXT)}
              disabled={isPending}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_LABELS.map((label, i) => {
              const dateStr = formatDateToYYYYMMDD(weekDates[i])
              const isToday = dateStr === todayStr
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSelectDay(i)}
                  className={`flex flex-col items-center rounded-lg p-2 text-xs transition-colors hover:bg-primary-light disabled:opacity-50 ${
                    isToday
                      ? 'bg-primary-light font-bold text-primary-hover ring-1 ring-primary'
                      : 'text-foreground'
                  } ${i === 5 ? 'text-accent-steps' : ''} ${i === 6 ? 'text-danger' : ''}`}
                >
                  <span className="font-medium">{label}</span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">
                    {formatShortDate(weekDates[i])}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
