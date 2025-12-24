import { checkUserProfile } from '@/features/auth/auth-utils'
import { redirect } from 'next/navigation'
import LogoutButton from '@/features/auth/logout-button'
import { AuthLayoutWrapper } from '@/components/layouts/auth-layout-wrapper'
import { PageContainer } from '@/components/layouts/page-container'
import { DashboardContent } from '@/features/dashboard/dashboard-content'

export default async function DashboardPage() {
  const { profile } = await checkUserProfile()

  if (!profile) {
    return redirect('/login')
  }

  return (
    <AuthLayoutWrapper title="ダッシュボード" rightAction={<LogoutButton />}>
      <PageContainer>
        <DashboardContent profile={profile} />
      </PageContainer>
    </AuthLayoutWrapper>
  )
}
