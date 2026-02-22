import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/backend/repositories/shopping-item.repository', () => ({
  findShoppingItemsByUser: vi.fn(),
  findShoppingItemById: vi.fn(),
  getMaxDisplayOrder: vi.fn(),
  createShoppingItem: vi.fn(),
  createShoppingItems: vi.fn(),
  updateShoppingItem: vi.fn(),
  updateShoppingItemCheck: vi.fn(),
  deleteShoppingItem: vi.fn(),
  reorderShoppingItems: vi.fn(),
  deleteCheckedItems: vi.fn(),
}))

import * as ShoppingItemRepository from '@/backend/repositories/shopping-item.repository'
import {
  getShoppingItems,
  createShoppingItem,
  createShoppingItems,
  updateShoppingItem,
  updateShoppingItemCheck,
  deleteShoppingItem,
  reorderShoppingItems,
  deleteCheckedItems,
} from '../shopping-item.service'

describe('shopping-item.service', () => {
  const userId = 'user-1'
  const otherUserId = 'user-other'

  const mockItem = {
    id: 'item-1',
    userId,
    name: '牛乳',
    memo: null,
    isChecked: false,
    displayOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockItem2 = {
    id: 'item-2',
    userId,
    name: '卵',
    memo: '6個入り',
    isChecked: false,
    displayOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ===== getShoppingItems =====

  describe('getShoppingItems', () => {
    it('ユーザーの買い物アイテム一覧を取得できる', async () => {
      const mockItems = [mockItem, mockItem2]
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValue(mockItems as any)

      const result = await getShoppingItems(userId)

      expect(result).toEqual(mockItems)
      expect(ShoppingItemRepository.findShoppingItemsByUser).toHaveBeenCalledWith(userId)
    })

    it('アイテムがない場合は空配列を返す', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValue([])

      const result = await getShoppingItems(userId)

      expect(result).toEqual([])
    })
  })

  // ===== createShoppingItem =====

  describe('createShoppingItem', () => {
    it('買い物アイテムを作成し、itemId を返す', async () => {
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValue(-1)
      vi.mocked(ShoppingItemRepository.createShoppingItem).mockResolvedValue(mockItem as any)

      const result = await createShoppingItem(userId, { name: '牛乳' })

      expect(result).toEqual({ itemId: 'item-1' })
      expect(ShoppingItemRepository.getMaxDisplayOrder).toHaveBeenCalledWith(userId)
      expect(ShoppingItemRepository.createShoppingItem).toHaveBeenCalledWith(
        userId,
        '牛乳',
        0,
        undefined
      )
    })

    it('既存アイテムがある場合はdisplayOrderが最大値+1になる', async () => {
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValue(2)
      vi.mocked(ShoppingItemRepository.createShoppingItem).mockResolvedValue(mockItem as any)

      await createShoppingItem(userId, { name: '牛乳', memo: 'メモ' })

      expect(ShoppingItemRepository.createShoppingItem).toHaveBeenCalledWith(
        userId,
        '牛乳',
        3,
        'メモ'
      )
    })
  })

  // ===== createShoppingItems =====

  describe('createShoppingItems', () => {
    it('買い物アイテムを一括作成し、作成件数を返す', async () => {
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValue(-1)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValue([
        mockItem,
        mockItem2,
      ] as any)

      const result = await createShoppingItems(userId, {
        items: [{ name: '牛乳' }, { name: '卵', memo: '6個入り' }],
      })

      expect(result).toEqual({ count: 2 })
      expect(ShoppingItemRepository.getMaxDisplayOrder).toHaveBeenCalledWith(userId)
      expect(ShoppingItemRepository.createShoppingItems).toHaveBeenCalledWith(userId, [
        { name: '牛乳', memo: undefined, displayOrder: 0 },
        { name: '卵', memo: '6個入り', displayOrder: 1 },
      ])
    })

    it('既存アイテムがある場合はdisplayOrderが最大値+1から連番になる', async () => {
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValue(5)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValue([
        mockItem,
        mockItem2,
      ] as any)

      await createShoppingItems(userId, {
        items: [{ name: '牛乳' }, { name: '卵' }],
      })

      expect(ShoppingItemRepository.createShoppingItems).toHaveBeenCalledWith(userId, [
        { name: '牛乳', memo: undefined, displayOrder: 6 },
        { name: '卵', memo: undefined, displayOrder: 7 },
      ])
    })

    it('空配列の場合は0件を返す', async () => {
      vi.mocked(ShoppingItemRepository.getMaxDisplayOrder).mockResolvedValue(-1)
      vi.mocked(ShoppingItemRepository.createShoppingItems).mockResolvedValue([])

      const result = await createShoppingItems(userId, { items: [] })

      expect(result).toEqual({ count: 0 })
    })
  })

  // ===== updateShoppingItem =====

  describe('updateShoppingItem', () => {
    it('自分のアイテムを更新できる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(mockItem as any)
      vi.mocked(ShoppingItemRepository.updateShoppingItem).mockResolvedValue(undefined as any)

      await updateShoppingItem(userId, {
        itemId: 'item-1',
        name: '低脂肪牛乳',
        memo: '1リットル',
      })

      expect(ShoppingItemRepository.updateShoppingItem).toHaveBeenCalledWith(
        'item-1',
        '低脂肪牛乳',
        '1リットル'
      )
    })

    it('アイテムが見つからない場合はエラーを投げる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(null)

      await expect(
        updateShoppingItem(userId, { itemId: 'item-unknown', name: '名前' })
      ).rejects.toThrow('アイテムが見つかりません')

      expect(ShoppingItemRepository.updateShoppingItem).not.toHaveBeenCalled()
    })

    it('他ユーザーのアイテムは更新できない', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(mockItem as any)

      await expect(
        updateShoppingItem(otherUserId, { itemId: 'item-1', name: '名前' })
      ).rejects.toThrow('このアイテムを編集する権限がありません')

      expect(ShoppingItemRepository.updateShoppingItem).not.toHaveBeenCalled()
    })
  })

  // ===== updateShoppingItemCheck =====

  describe('updateShoppingItemCheck', () => {
    it('自分のアイテムのチェック状態を更新できる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(mockItem as any)
      vi.mocked(ShoppingItemRepository.updateShoppingItemCheck).mockResolvedValue(undefined as any)

      await updateShoppingItemCheck(userId, { itemId: 'item-1', isChecked: true })

      expect(ShoppingItemRepository.updateShoppingItemCheck).toHaveBeenCalledWith('item-1', true)
    })

    it('アイテムが見つからない場合はエラーを投げる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(null)

      await expect(
        updateShoppingItemCheck(userId, { itemId: 'item-unknown', isChecked: true })
      ).rejects.toThrow('アイテムが見つかりません')

      expect(ShoppingItemRepository.updateShoppingItemCheck).not.toHaveBeenCalled()
    })

    it('他ユーザーのアイテムのチェック状態は更新できない', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(mockItem as any)

      await expect(
        updateShoppingItemCheck(otherUserId, { itemId: 'item-1', isChecked: true })
      ).rejects.toThrow('このアイテムを編集する権限がありません')

      expect(ShoppingItemRepository.updateShoppingItemCheck).not.toHaveBeenCalled()
    })
  })

  // ===== deleteShoppingItem =====

  describe('deleteShoppingItem', () => {
    it('自分のアイテムを削除できる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(mockItem as any)
      vi.mocked(ShoppingItemRepository.deleteShoppingItem).mockResolvedValue(undefined as any)

      await deleteShoppingItem(userId, 'item-1')

      expect(ShoppingItemRepository.deleteShoppingItem).toHaveBeenCalledWith('item-1')
    })

    it('アイテムが見つからない場合はエラーを投げる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(null)

      await expect(deleteShoppingItem(userId, 'item-unknown')).rejects.toThrow(
        'アイテムが見つかりません'
      )

      expect(ShoppingItemRepository.deleteShoppingItem).not.toHaveBeenCalled()
    })

    it('他ユーザーのアイテムは削除できない', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemById).mockResolvedValue(mockItem as any)

      await expect(deleteShoppingItem(otherUserId, 'item-1')).rejects.toThrow(
        'このアイテムを削除する権限がありません'
      )

      expect(ShoppingItemRepository.deleteShoppingItem).not.toHaveBeenCalled()
    })
  })

  // ===== reorderShoppingItems =====

  describe('reorderShoppingItems', () => {
    it('自分のアイテムの並び順を更新できる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValue([
        mockItem,
        mockItem2,
      ] as any)
      vi.mocked(ShoppingItemRepository.reorderShoppingItems).mockResolvedValue(undefined as any)

      await reorderShoppingItems(userId, { itemIds: ['item-2', 'item-1'] })

      expect(ShoppingItemRepository.reorderShoppingItems).toHaveBeenCalledWith([
        'item-2',
        'item-1',
      ])
    })

    it('他ユーザーのアイテムIDが含まれる場合はエラーを投げる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValue([
        mockItem,
      ] as any)

      await expect(
        reorderShoppingItems(userId, { itemIds: ['item-1', 'item-other'] })
      ).rejects.toThrow('並び替え対象に無効なアイテムが含まれています')

      expect(ShoppingItemRepository.reorderShoppingItems).not.toHaveBeenCalled()
    })

    it('存在しないアイテムIDが含まれる場合はエラーを投げる', async () => {
      vi.mocked(ShoppingItemRepository.findShoppingItemsByUser).mockResolvedValue([
        mockItem,
      ] as any)

      await expect(
        reorderShoppingItems(userId, { itemIds: ['item-1', 'item-nonexistent'] })
      ).rejects.toThrow('並び替え対象に無効なアイテムが含まれています')

      expect(ShoppingItemRepository.reorderShoppingItems).not.toHaveBeenCalled()
    })
  })

  // ===== deleteCheckedItems =====

  describe('deleteCheckedItems', () => {
    it('チェック済みアイテムを一括削除できる', async () => {
      vi.mocked(ShoppingItemRepository.deleteCheckedItems).mockResolvedValue({ count: 3 } as any)

      await deleteCheckedItems(userId)

      expect(ShoppingItemRepository.deleteCheckedItems).toHaveBeenCalledWith(userId)
    })
  })
})
