import { redirect } from 'next/navigation'
import { checkUserProfile } from '@/features/auth/auth-utils'
import { PageContainer } from '@/components/layouts/page-container'
import { DashboardContent } from './dashboard-content'

export async function DashboardServerContent() {
  const { profile } = await checkUserProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <PageContainer>
      <DashboardContent profile={profile} />
    </PageContainer>
  )
}
