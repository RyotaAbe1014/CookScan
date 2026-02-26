'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@/components/icons/plus-icon'
import { TrashIcon } from '@/components/icons/trash-icon'
import { isSuccess } from '@/utils/result'
import { removeMealPlanItem } from '../actions'
import { DAY_LABELS, formatShortDate } from '../utils'
import type { MealPlanItemOutput } from '@/backend/domain/meal-plans'

type MealPlanDayCardProps = {
  dayOfWeek: number
  date: Date
  items: MealPlanItemOutput[]
  onAddRecipe: (dayOfWeek: number) => void
  onItemRemoved: () => void
}

export function MealPlanDayCard({
  dayOfWeek,
  date,
  items,
  onAddRecipe,
  onItemRemoved,
}: MealPlanDayCardProps) {
  const [isPending, startTransition] = useTransition()
  const isToday = new Date().toDateString() === date.toDateString()
  const isSaturday = dayOfWeek === 5
  const isSunday = dayOfWeek === 6

  function handleRemove(itemId: string) {
    startTransition(async () => {
      const result = await removeMealPlanItem(itemId)
      if (isSuccess(result)) {
        onItemRemoved()
      }
    })
  }

  return (
    <div
      className={`rounded-xl border bg-white shadow-sm ${
        isToday ? 'ring-2 ring-emerald-500' : ''
      }`}
    >
      <div
        className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${
          isSunday
            ? 'bg-red-50'
            : isSaturday
              ? 'bg-blue-50'
              : 'bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${
              isSunday
                ? 'text-red-600'
                : isSaturday
                  ? 'text-blue-600'
                  : 'text-neutral-700'
            }`}
          >
            {DAY_LABELS[dayOfWeek]}
          </span>
          <span className="text-sm text-neutral-500">
            {formatShortDate(date)}
          </span>
          {isToday && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              今日
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddRecipe(dayOfWeek)}
        >
          <PlusIcon className="h-4 w-4" />
          追加
        </Button>
      </div>

      <div className="min-h-[60px] p-3">
        {items.length === 0 ? (
          <p className="py-2 text-center text-sm text-neutral-400">
            レシピなし
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <Link
                  href={`/recipes/${item.recipe.id}`}
                  className="text-sm font-medium text-neutral-800 hover:underline"
                >
                  {item.recipe.title}
                </Link>
                <Button
                  variant="danger-ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleRemove(item.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
