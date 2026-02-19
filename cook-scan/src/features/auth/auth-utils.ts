import { createClient } from '@/lib/supabase/server'
import * as UserService from '@/backend/services/users'

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

  const { exists, profile } = await UserService.checkExistingProfile(user.id)

  return {
    hasAuth: true,
    hasProfile: exists,
    authUser: user,
    profile,
  }
}
