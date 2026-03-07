import type { RecipeBasic } from '@/types/recipe'
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
}

export function DashboardContent({ profile, recentRecipes }: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <WelcomeSection profile={profile} />
      <RecentRecipesSection recipes={recentRecipes} />
      <QuickActions />
    </div>
  )
}
