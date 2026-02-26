'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import { WeekNavigator } from './week-navigator'
import { MealPlanDayCard } from './meal-plan-day-card'
import { AddRecipeDialog } from './add-recipe-dialog'
import { GenerateShoppingListButton } from './generate-shopping-list-button'
import { getWeekStart, getWeekDates } from '../utils'
import type { MealPlanOutput } from '@/backend/domain/meal-plans'
import type { RecipeListOutput } from '@/backend/domain/recipes'

type MealPlannerContentProps = {
  initialWeekStart: string
  initialPlan: MealPlanOutput | null
  recipes: RecipeListOutput[]
}

export function MealPlannerContent({
  initialWeekStart,
  initialPlan,
  recipes,
}: MealPlannerContentProps) {
  const router = useRouter()
  const [weekStart, setWeekStart] = useState(initialWeekStart)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const plan = initialPlan

  const navigateWeek = useCallback(
    (offset: number) => {
      const current = new Date(weekStart)
      current.setDate(current.getDate() + offset * 7)
      const newWeekStart = getWeekStart(current)
      setWeekStart(newWeekStart)
      router.push(`/meal-planner?week=${newWeekStart}` as Route)
    },
    [weekStart, router]
  )

  const handleToday = useCallback(() => {
    const today = getWeekStart(new Date())
    setWeekStart(today)
    router.push(`/meal-planner?week=${today}` as Route)
  }, [router])

  function handleAddRecipe(dayOfWeek: number) {
    setSelectedDay(dayOfWeek)
    setDialogOpen(true)
  }

  function handleItemChanged() {
    router.refresh()
  }

  const items = plan?.items ?? []
  const weekDates = getWeekDates(weekStart)

  return (
    <div className="space-y-6">
      <WeekNavigator
        weekStart={weekStart}
        onPrevWeek={() => navigateWeek(-1)}
        onNextWeek={() => navigateWeek(1)}
        onToday={handleToday}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weekDates.map((date, dayOfWeek) => (
          <MealPlanDayCard
            key={dayOfWeek}
            dayOfWeek={dayOfWeek}
            date={date}
            items={items.filter((item) => item.dayOfWeek === dayOfWeek)}
            onAddRecipe={handleAddRecipe}
            onItemRemoved={handleItemChanged}
          />
        ))}
      </div>

      <GenerateShoppingListButton
        weekStart={weekStart}
        hasItems={items.length > 0}
      />

      <AddRecipeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dayOfWeek={selectedDay}
        weekStart={weekStart}
        recipes={recipes}
        onItemAdded={handleItemChanged}
      />
    </div>
  )
}
