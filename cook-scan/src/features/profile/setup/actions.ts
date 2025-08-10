'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createProfile(authId: string, email: string, name: string) {
  try {
    await prisma.user.create({
      data: {
        authId,
        email,
        name,
      },
    })
  } catch (error) {
    console.error('Failed to create profile:', error)
    throw new Error('プロフィールの作成に失敗しました')
  }

  redirect('/dashboard')
}
