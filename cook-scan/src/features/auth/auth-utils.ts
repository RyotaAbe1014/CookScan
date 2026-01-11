import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

type User = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>

export async function checkUserProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { hasAuth: false, hasProfile: false }
  }

  const profile = await prisma.user.findUnique({
    where: { authId: user.id }
  })

  return {
    hasAuth: true,
    hasProfile: !!profile,
    authUser: user,
    profile
  }
}

/**
 * 認証済みユーザーのプロフィールを取得する
 * 未認証またはプロフィール未設定の場合はログインページにリダイレクト
 *
 * @returns ユーザープロフィール（認証済み保証）
 */
export async function requireUserProfile(): Promise<User> {
  const { hasAuth, hasProfile, profile } = await checkUserProfile()

  if (!hasAuth || !hasProfile || !profile) {
    redirect('/login')
  }

  return profile
}
