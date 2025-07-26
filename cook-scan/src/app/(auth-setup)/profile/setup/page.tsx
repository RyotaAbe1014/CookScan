import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import ProfileSetupForm from './profile-setup-form'

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">プロフィール設定</h1>
          <p className="mt-2 text-sm text-gray-600">
            初めてご利用いただくため、プロフィール情報を設定してください
          </p>
        </div>
        <ProfileSetupForm userId={user.id} userEmail={user.email!} />
      </div>
    </div>
  )
}