import { WelcomeSection } from './welcome-section'
import { QuickActions } from './quick-actions'

type Profile = {
  name: string | null
  email: string
}

type DashboardContentProps = {
  profile: Profile
}

export function DashboardContent({ profile }: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <WelcomeSection profile={profile} />
      <QuickActions />
    </div>
  )
}
