/**
 * Recipe Development Session Repository
 * レシピ開発セッションのPrismaクエリ
 */

import { prisma } from '@/lib/prisma'

const recipeDevelopmentSessionListSelect = {
  id: true,
  userId: true,
  threadId: true,
  title: true,
  createdAt: true,
  updatedAt: true,
} as const

/**
 * レシピ開発セッションを作成
 */
export async function createRecipeDevelopmentSession(
  userId: string,
  threadId: string,
  title = '新しいレシピ相談'
) {
  return prisma.recipeDevelopmentSession.create({
    data: {
      userId,
      threadId,
      title,
    },
    select: recipeDevelopmentSessionListSelect,
  })
}

/**
 * セッションIDでレシピ開発セッションを取得
 */
export async function findRecipeDevelopmentSessionById(sessionId: string) {
  return prisma.recipeDevelopmentSession.findUnique({
    where: { id: sessionId },
    select: recipeDevelopmentSessionListSelect,
  })
}

/**
 * スレッドIDでレシピ開発セッションを取得
 */
export async function findRecipeDevelopmentSessionByThreadId(threadId: string) {
  return prisma.recipeDevelopmentSession.findUnique({
    where: { threadId },
    select: recipeDevelopmentSessionListSelect,
  })
}

/**
 * ユーザーのレシピ開発セッション一覧を取得
 */
export async function findRecipeDevelopmentSessionsByUser(userId: string) {
  return prisma.recipeDevelopmentSession.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: recipeDevelopmentSessionListSelect,
  })
}

/**
 * セッションタイトルを更新
 */
export async function updateRecipeDevelopmentSessionTitle(
  sessionId: string,
  title: string
) {
  return prisma.recipeDevelopmentSession.update({
    where: { id: sessionId },
    data: { title },
    select: recipeDevelopmentSessionListSelect,
  })
}

/**
 * レシピ開発セッションを削除
 */
export async function deleteRecipeDevelopmentSession(sessionId: string) {
  return prisma.recipeDevelopmentSession.delete({
    where: { id: sessionId },
    select: recipeDevelopmentSessionListSelect,
  })
}
