import { redirect } from 'next/navigation'
import { getUserProfile } from '@/features/profile/edit/actions'
import { ProfileEditForm } from '@/features/profile/edit/profile-edit-form'
import { isSuccess } from '@/utils/result'

export default async function ProfileEditPage() {
  const result = await getUserProfile()

  if (!isSuccess(result)) {
    // 認証エラーまたはプロフィール未設定の場合はリダイレクト
    if (result.error.code === 'UNAUTHENTICATED') {
      redirect('/login')
    }
    redirect('/profile/setup')
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <ProfileEditForm initialData={result.data} />
    </div>
  )
}
