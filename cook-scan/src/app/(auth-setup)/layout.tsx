import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function AuthSetupLayout({
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

  // プロフィールチェックはここでは行わない
  return <>{children}</>
}