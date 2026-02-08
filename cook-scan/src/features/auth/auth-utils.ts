import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// Prisma User model type (defined locally to avoid Prisma client generation issues)
export type UserProfile = {
  id: string
  authId: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

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
