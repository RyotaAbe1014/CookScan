/**
 * User Repository
 * Prismaクエリの集約
 */

import { prisma } from '@/lib/prisma'

// ===== User Profile Operations =====

/**
 * 認証IDでユーザープロフィールを取得
 */
export async function findUserByAuthId(authId: string) {
  return prisma.user.findUnique({
    where: { authId },
  })
}

/**
 * ユーザープロフィールを作成
 */
export async function createUser(authId: string, email: string, name: string) {
  return prisma.user.create({
    data: {
      authId,
      email,
      name,
    },
  })
}

/**
 * ユーザープロフィールを更新
 */
export async function updateUser(authId: string, name: string) {
  return prisma.user.update({
    where: { authId },
    data: { name },
  })
}
