import { WelcomeSection } from './welcome-section'
import { QuickActions } from './quick-actions'
import { FeaturesOverview } from './features-overview'

type Profile = {
  name: string | null
  email: string
}

type DashboardContentProps = {
  profile: Profile
}

export function DashboardContent({ profile }: DashboardContentProps) {
  return (
    <>
      <WelcomeSection profile={profile} />
      <QuickActions />
      <FeaturesOverview />
    </>
  )
}
