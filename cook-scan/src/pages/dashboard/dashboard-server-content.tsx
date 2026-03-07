import { redirect } from 'next/navigation'
import * as RecipeService from '@/backend/services/recipes'
import { checkUserProfile } from '@/features/auth/auth-utils'
import { PageContainer } from '@/components/layouts/page-container'
import type { RecipeBasic } from '@/types/recipe'
import { DashboardContent } from './dashboard-content'

export async function DashboardServerContent() {
  const { profile } = await checkUserProfile()

  if (!profile) {
    redirect('/login')
  }

  let recentRecipes: RecipeBasic[] = []

  try {
    recentRecipes = await RecipeService.getRecentRecipes(profile.id, 3)
  } catch (error) {
    console.error('Failed to fetch recent recipes for dashboard:', error)
  }

  return (
    <PageContainer>
      <DashboardContent profile={profile} recentRecipes={recentRecipes} />
    </PageContainer>
  )
}
