import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { checkUserProfile } from '@/lib/auth-utils'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 未認証の場合はログインページへ
  if (!user) {
    redirect('/login')
  }

  // プロフィール設定ページ以外で、プロフィールが未設定の場合
  const { hasProfile } = await checkUserProfile()
  if (!hasProfile) {
    redirect('/profile/setup')
  }

  return <>{children}</>
}