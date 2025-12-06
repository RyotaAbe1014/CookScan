import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import ProfileSetupForm from '@/features/profile/setup/profile-setup-form'

export default async function ProfileSetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 既にプロフィールが存在する場合はホームへリダイレクト
  const existingProfile = await prisma.user.findUnique({
    where: { authId: user.id }
  })

  if (existingProfile) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            プロフィール設定
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            初めてご利用いただくため、プロフィール情報を設定してください
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
          <ProfileSetupForm userId={user.id} userEmail={user.email!} />
        </div>
      </div>
    </div>
  )
}
