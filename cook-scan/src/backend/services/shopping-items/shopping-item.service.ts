/**
 * ShoppingItem Service
 * ビジネスロジック
 */

import * as ShoppingItemRepository from '@/backend/repositories/shopping-item.repository'
import type {
  CreateShoppingItemInput,
  UpdateShoppingItemInput,
  UpdateShoppingItemCheckInput,
  ReorderShoppingItemsInput,
  CreateShoppingItemResult,
  ShoppingItemOutput,
} from '@/backend/domain/shopping-items'

/**
 * 買い物アイテム一覧を取得
 */
export async function getShoppingItems(userId: string): Promise<ShoppingItemOutput[]> {
  return ShoppingItemRepository.findShoppingItemsByUser(userId)
}

/**
 * 買い物アイテムを作成
 */
export async function createShoppingItem(
  userId: string,
  input: CreateShoppingItemInput
): Promise<CreateShoppingItemResult> {
  const { name, memo } = input

  const maxOrder = await ShoppingItemRepository.getMaxDisplayOrder(userId)
  const item = await ShoppingItemRepository.createShoppingItem(userId, name, maxOrder + 1, memo)

  return { itemId: item.id }
}

/**
 * 買い物アイテムを更新
 */
export async function updateShoppingItem(
  userId: string,
  input: UpdateShoppingItemInput
): Promise<void> {
  const { itemId, name, memo } = input

  const item = await ShoppingItemRepository.findShoppingItemById(itemId)

  if (!item) {
    throw new Error('アイテムが見つかりません')
  }

  if (item.userId !== userId) {
    throw new Error('このアイテムを編集する権限がありません')
  }

  await ShoppingItemRepository.updateShoppingItem(itemId, name, memo)
}

/**
 * 買い物アイテムのチェック状態を更新
 */
export async function updateShoppingItemCheck(
  userId: string,
  input: UpdateShoppingItemCheckInput
): Promise<void> {
  const { itemId, isChecked } = input

  const item = await ShoppingItemRepository.findShoppingItemById(itemId)

  if (!item) {
    throw new Error('アイテムが見つかりません')
  }

  if (item.userId !== userId) {
    throw new Error('このアイテムを編集する権限がありません')
  }

  await ShoppingItemRepository.updateShoppingItemCheck(itemId, isChecked)
}

/**
 * 買い物アイテムを削除
 */
export async function deleteShoppingItem(userId: string, itemId: string): Promise<void> {
  const item = await ShoppingItemRepository.findShoppingItemById(itemId)

  if (!item) {
    throw new Error('アイテムが見つかりません')
  }

  if (item.userId !== userId) {
    throw new Error('このアイテムを削除する権限がありません')
  }

  await ShoppingItemRepository.deleteShoppingItem(itemId)
}

/**
 * 買い物アイテムの並び順を更新
 */
export async function reorderShoppingItems(
  userId: string,
  input: ReorderShoppingItemsInput
): Promise<void> {
  const { itemIds } = input

  // 全アイテムが自分のものか確認
  const items = await ShoppingItemRepository.findShoppingItemsByUser(userId)
  const ownedItemIds = new Set(items.map((item) => item.id))

  const invalidIds = itemIds.filter((id) => !ownedItemIds.has(id))
  if (invalidIds.length > 0) {
    throw new Error('並び替え対象に無効なアイテムが含まれています')
  }

  await ShoppingItemRepository.reorderShoppingItems(itemIds)
}

/**
 * チェック済みアイテムを一括削除
 */
export async function deleteCheckedItems(userId: string): Promise<void> {
  await ShoppingItemRepository.deleteCheckedItems(userId)
}
