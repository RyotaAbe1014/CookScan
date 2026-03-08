import type { RecipeBasic } from '@/types/recipe'
import {
  TodayMealPlanSection,
  type TodayMealPlanSummary,
} from '@/features/meal-planner/components/today-meal-plan-section'
import { RecentRecipesSection } from '@/features/recipes/list/recent-recipes-section'
import { WelcomeSection } from './welcome-section'
import { QuickActions } from './quick-actions'

type Profile = {
  name: string | null
  email: string
}

type DashboardContentProps = {
  profile: Profile
  recentRecipes: RecipeBasic[]
  todayMealPlanSummary: TodayMealPlanSummary
}

export function DashboardContent({
  profile,
  recentRecipes,
  todayMealPlanSummary,
}: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <WelcomeSection profile={profile} />
      <TodayMealPlanSection summary={todayMealPlanSummary} />
      <RecentRecipesSection recipes={recentRecipes} />
      <QuickActions />
    </div>
  )
}
