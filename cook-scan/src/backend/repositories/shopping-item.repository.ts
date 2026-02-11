/**
 * ShoppingItem Repository
 * Prismaクエリの集約
 */

import { prisma } from '@/lib/prisma'

/**
 * ユーザーの買い物アイテム一覧を取得（displayOrder昇順）
 */
export async function findShoppingItemsByUser(userId: string) {
  return prisma.shoppingItem.findMany({
    where: { userId },
    orderBy: { displayOrder: 'asc' },
  })
}

/**
 * 買い物アイテムをIDで取得
 */
export async function findShoppingItemById(itemId: string) {
  return prisma.shoppingItem.findUnique({
    where: { id: itemId },
  })
}

/**
 * ユーザーの最大displayOrderを取得
 */
export async function getMaxDisplayOrder(userId: string): Promise<number> {
  const result = await prisma.shoppingItem.aggregate({
    where: { userId },
    _max: { displayOrder: true },
  })
  return result._max.displayOrder ?? -1
}

/**
 * 買い物アイテムを作成
 */
export async function createShoppingItem(
  userId: string,
  name: string,
  displayOrder: number,
  memo?: string
) {
  return prisma.shoppingItem.create({
    data: {
      userId,
      name,
      memo: memo || null,
      isChecked: false,
      displayOrder,
    },
  })
}

/**
 * 買い物アイテムを更新
 */
export async function updateShoppingItem(itemId: string, name: string, memo?: string) {
  return prisma.shoppingItem.update({
    where: { id: itemId },
    data: {
      name,
      memo: memo || null,
    },
  })
}

/**
 * 買い物アイテムのチェック状態を更新
 */
export async function updateShoppingItemCheck(itemId: string, isChecked: boolean) {
  return prisma.shoppingItem.update({
    where: { id: itemId },
    data: { isChecked },
  })
}

/**
 * 買い物アイテムを削除
 */
export async function deleteShoppingItem(itemId: string) {
  return prisma.shoppingItem.delete({
    where: { id: itemId },
  })
}

/**
 * 買い物アイテムの並び順を一括更新
 */
export async function reorderShoppingItems(itemIds: string[]) {
  const updates = itemIds.map((id, index) =>
    prisma.shoppingItem.update({
      where: { id },
      data: { displayOrder: index },
    })
  )
  return prisma.$transaction(updates)
}

/**
 * チェック済みアイテムを一括削除
 */
export async function deleteCheckedItems(userId: string) {
  return prisma.shoppingItem.deleteMany({
    where: { userId, isChecked: true },
  })
}
