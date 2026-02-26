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
  DAY_LABELS,
} from '@/features/meal-planner/utils'

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
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  function navigateWeek(direction: -1 | 1) {
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
              onClick={() => navigateWeek(-1)}
              disabled={isPending}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-gray-700">{weekLabel}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek(1)}
              disabled={isPending}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_LABELS.map((label, i) => {
              const dateStr = `${weekDates[i].getFullYear()}-${String(weekDates[i].getMonth() + 1).padStart(2, '0')}-${String(weekDates[i].getDate()).padStart(2, '0')}`
              const isToday = dateStr === todayStr
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSelectDay(i)}
                  className={`flex flex-col items-center rounded-lg p-2 text-xs transition-colors hover:bg-emerald-50 disabled:opacity-50 ${
                    isToday
                      ? 'bg-emerald-50 font-bold text-emerald-700 ring-1 ring-emerald-300'
                      : 'text-gray-700'
                  } ${i === 5 ? 'text-blue-600' : ''} ${i === 6 ? 'text-red-500' : ''}`}
                >
                  <span className="font-medium">{label}</span>
                  <span className="mt-0.5 text-[10px] text-gray-500">
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
