import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

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
