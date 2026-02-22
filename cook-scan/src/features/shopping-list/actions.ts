'use server'

import { revalidatePath } from 'next/cache'
import * as ShoppingItemService from '@/backend/services/shopping-items'
import type { ShoppingItemOutput } from '@/backend/domain/shopping-items'
import type { Result } from '@/utils/result'
import { success, failure, Errors } from '@/utils/result'
import { withAuth } from '@/utils/server-action'

/**
 * 買い物アイテム一覧を取得
 */
export async function getShoppingItems(): Promise<Result<ShoppingItemOutput[]>> {
  return withAuth(async (profile) => {
    try {
      const items = await ShoppingItemService.getShoppingItems(profile.id)
      return success(items)
    } catch (error) {
      console.error('Failed to fetch shopping items:', error)
      return failure(Errors.server('買い物リストの取得に失敗しました'))
    }
  })
}

/**
 * 買い物アイテムを作成
 */
export async function createShoppingItem(
  name: string,
  memo?: string
): Promise<Result<{ itemId: string }>> {
  return withAuth(async (profile) => {
    try {
      const result = await ShoppingItemService.createShoppingItem(profile.id, { name, memo })

      revalidatePath('/shopping-list')
      return success(result)
    } catch (error) {
      console.error('Failed to create shopping item:', error)
      return failure(Errors.server('買い物アイテムの作成に失敗しました'))
    }
  })
}

/**
 * 買い物アイテムを一括作成
 */
export async function createShoppingItems(
  items: { name: string; memo?: string }[]
): Promise<Result<{ count: number }>> {
  return withAuth(async (profile) => {
    try {
      const result = await ShoppingItemService.createShoppingItems(profile.id, { items })

      revalidatePath('/shopping-list')
      return success(result)
    } catch (error) {
      console.error('Failed to create shopping items:', error)
      return failure(Errors.server('買い物リストへの追加に失敗しました'))
    }
  })
}

/**
 * 買い物アイテムを更新
 */
export async function updateShoppingItem(
  itemId: string,
  name: string,
  memo?: string
): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      await ShoppingItemService.updateShoppingItem(profile.id, { itemId, name, memo })

      revalidatePath('/shopping-list')
      return success(undefined)
    } catch (error) {
      console.error('Failed to update shopping item:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('アイテム'))
        }
        if (error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
      return failure(Errors.server('買い物アイテムの更新に失敗しました'))
    }
  })
}

/**
 * 買い物アイテムのチェック状態を更新
 */
export async function updateShoppingItemCheck(
  itemId: string,
  isChecked: boolean
): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      await ShoppingItemService.updateShoppingItemCheck(profile.id, { itemId, isChecked })

      revalidatePath('/shopping-list')
      return success(undefined)
    } catch (error) {
      console.error('Failed to update shopping item check:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('アイテム'))
        }
        if (error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
      return failure(Errors.server('チェック状態の更新に失敗しました'))
    }
  })
}

/**
 * 買い物アイテムを削除
 */
export async function deleteShoppingItem(itemId: string): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      await ShoppingItemService.deleteShoppingItem(profile.id, itemId)

      revalidatePath('/shopping-list')
      return success(undefined)
    } catch (error) {
      console.error('Failed to delete shopping item:', error)
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          return failure(Errors.notFound('アイテム'))
        }
        if (error.message.includes('権限がありません')) {
          return failure(Errors.forbidden(error.message))
        }
      }
      return failure(Errors.server('買い物アイテムの削除に失敗しました'))
    }
  })
}

/**
 * チェック済みアイテムを一括削除
 */
export async function deleteCheckedItems(): Promise<Result<void>> {
  return withAuth(async (profile) => {
    try {
      await ShoppingItemService.deleteCheckedItems(profile.id)

      revalidatePath('/shopping-list')
      return success(undefined)
    } catch (error) {
      console.error('Failed to delete checked items:', error)
      return failure(Errors.server('チェック済みアイテムの削除に失敗しました'))
    }
  })
}
