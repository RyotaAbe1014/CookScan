import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkExistingProfile } from '@/features/profile/setup/actions'
import { ProfileSetupPageContent } from '@/features/profile/setup/profile-setup-page-content'
import { isSuccess } from '@/utils/result'

export default async function ProfileSetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 既にプロフィールが存在する場合はホームへリダイレクト
  const result = await checkExistingProfile(user.id)

  if (isSuccess(result) && result.data.exists) {
    redirect('/')
  }

  return <ProfileSetupPageContent userId={user.id} userEmail={user.email!} />
}
