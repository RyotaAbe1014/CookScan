import { getUserProfile } from '@/features/profile/edit/actions'
import { ProfileEditForm } from '@/features/profile/edit/profile-edit-form'

export default async function ProfileEditPage() {
  const user = await getUserProfile()

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <ProfileEditForm initialData={user} />
    </div>
  )
}
