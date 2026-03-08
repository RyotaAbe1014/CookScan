import type { Route } from 'next'
import { redirect } from 'next/navigation'
import * as MealPlanService from '@/backend/services/meal-plans'
import * as RecipeService from '@/backend/services/recipes'
import type { MealPlanOutput } from '@/backend/domain/meal-plans'
import { checkUserProfile } from '@/features/auth/auth-utils'
import {
  DAY_LABELS,
  formatShortDate,
  getMealPlanDayOfWeek,
  getWeekStart,
} from '@/features/meal-planner/utils'
import type { TodayMealPlanSummary } from '@/features/meal-planner/components/today-meal-plan-section'
import { PageContainer } from '@/components/layouts/page-container'
import type { RecipeBasic } from '@/types/recipe'
import { DashboardContent } from './dashboard-content'

function createTodayMealPlanSummary(
  plan: MealPlanOutput | null,
  today: Date,
  weekStart: string
): TodayMealPlanSummary {
  const dayOfWeek = getMealPlanDayOfWeek(today)

  return {
    weekStart,
    plannerHref: `/meal-planner?week=${weekStart}` as Route,
    dateLabel: `${formatShortDate(today)}（${DAY_LABELS[dayOfWeek]}）`,
    items: (plan?.items ?? [])
      .filter((item) => item.dayOfWeek === dayOfWeek)
      .map((item) => ({
        id: item.id,
        title: item.recipe.title,
      })),
  }
}

export async function DashboardServerContent() {
  const { profile } = await checkUserProfile()

  if (!profile) {
    redirect('/login')
  }

  const today = new Date()
  const weekStart = getWeekStart(today)

  const [recentRecipes, mealPlan] = await Promise.all([
    RecipeService.getRecentRecipes(profile.id, 3).catch((error) => {
      console.error('Failed to fetch recent recipes for dashboard:', error)
      return []
    }),
    MealPlanService.getMealPlan(profile.id, weekStart).catch((error) => {
      console.error('Failed to fetch meal plan for dashboard:', error)
      return null
    }),
  ])

  const todayMealPlanSummary = createTodayMealPlanSummary(mealPlan, today, weekStart)

  return (
    <PageContainer>
      <DashboardContent
        profile={profile}
        recentRecipes={recentRecipes}
        todayMealPlanSummary={todayMealPlanSummary}
      />
    </PageContainer>
  )
}
