import { ProfileSetupHeader } from './profile-setup-header'
import ProfileSetupForm from './profile-setup-form'

type ProfileSetupPageContentProps = {
  userId: string
  userEmail: string
}

export function ProfileSetupPageContent({ userId, userEmail }: ProfileSetupPageContentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <ProfileSetupHeader />
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
          <ProfileSetupForm userId={userId} userEmail={userEmail} />
        </div>
      </div>
    </div>
  )
}
