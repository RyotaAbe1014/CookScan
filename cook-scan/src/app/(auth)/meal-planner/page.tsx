import { checkUserProfile } from '@/features/auth/auth-utils'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { BackToDashboardLink } from '@/components/navigation/back-to-dashboard-link'
import { getMealPlan, getRecipesForMealPlan } from '@/features/meal-planner/actions'
import { isSuccess } from '@/utils/result'
import { MealPlannerContent } from '@/features/meal-planner/components/meal-planner-content'
import { getWeekStart } from '@/features/meal-planner/utils'

type Props = {
  searchParams: Promise<{ week?: string }>
}

export default async function MealPlannerPage({ searchParams }: Props) {
  const { profile } = await checkUserProfile()

  if (!profile) {
    return null
  }

  const params = await searchParams
  const weekStart = params.week || getWeekStart(new Date())

  const [planResult, recipesResult] = await Promise.all([
    getMealPlan(weekStart),
    getRecipesForMealPlan(),
  ])

  const plan = isSuccess(planResult) ? planResult.data : null
  const recipes = isSuccess(recipesResult) ? recipesResult.data : []

  return (
    <AuthLayoutWrapper
      title="週間献立プランナー"
      subtitle="1週間の献立を計画"
      rightAction={<BackToDashboardLink />}
    >
      <PageContainer>
        <MealPlannerContent
          key={weekStart}
          initialWeekStart={weekStart}
          initialPlan={plan}
          recipes={recipes}
        />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
