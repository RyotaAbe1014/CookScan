import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShoppingItemRow } from '../shopping-item-row'
import type { ShoppingItemOutput } from '@/backend/domain/shopping-items'

// モック: Server Actions
vi.mock('@/features/shopping-list/actions', () => ({
  deleteShoppingItem: vi.fn(),
}))

import { deleteShoppingItem } from '@/features/shopping-list/actions'

describe('ShoppingItemRow', () => {
  const baseItem: ShoppingItemOutput = {
    id: 'item-1',
    userId: 'user-1',
    name: '牛乳',
    memo: null,
    isChecked: false,
    displayOrder: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const defaultProps = {
    item: baseItem,
    onEdit: vi.fn(),
    onToggleCheck: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('表示', () => {
    it('アイテム名が表示される', () => {
      // Given: アイテムが用意されている
      // When: レンダリングする
      render(<ShoppingItemRow {...defaultProps} />)

      // Then: アイテム名が表示される
      expect(screen.getByText('牛乳')).toBeInTheDocument()
    })

    it('メモがある場合、メモが表示される', () => {
      // Given: メモ付きのアイテムが用意されている
      const itemWithMemo = { ...baseItem, memo: '低脂肪タイプ' }

      // When: レンダリングする
      render(<ShoppingItemRow {...defaultProps} item={itemWithMemo} />)

      // Then: メモが表示される
      expect(screen.getByText('低脂肪タイプ')).toBeInTheDocument()
    })

    it('メモがない場合、メモが表示されない', () => {
      // Given: メモなしのアイテムが用意されている
      // When: レンダリングする
      render(<ShoppingItemRow {...defaultProps} />)

      // Then: メモの要素が存在しない（アイテム名のみ）
      const listItem = screen.getByText('牛乳').closest('li')
      const memoElement = listItem?.querySelector('.text-xs.text-muted-foreground')
      expect(memoElement).not.toBeInTheDocument()
    })

    it('未チェックのアイテムは通常スタイルで表示される', () => {
      // Given: 未チェックのアイテムが用意されている
      // When: レンダリングする
      render(<ShoppingItemRow {...defaultProps} />)

      // Then: 打ち消し線がない
      const nameElement = screen.getByText('牛乳')
      expect(nameElement).not.toHaveClass('line-through')
    })

    it('チェック済みのアイテムは打ち消し線で表示される', () => {
      // Given: チェック済みのアイテムが用意されている
      const checkedItem = { ...baseItem, isChecked: true }

      // When: レンダリングする
      render(<ShoppingItemRow {...defaultProps} item={checkedItem} />)

      // Then: 打ち消し線が適用される
      const nameElement = screen.getByText('牛乳')
      expect(nameElement).toHaveClass('line-through')
    })

    it('編集ボタンが表示される', () => {
      // Given: アイテムが用意されている
      // When: レンダリングする
      render(<ShoppingItemRow {...defaultProps} />)

      // Then: 編集ボタンが存在する
      expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument()
    })

    it('削除ボタンが表示される', () => {
      // Given: アイテムが用意されている
      // When: レンダリングする
      render(<ShoppingItemRow {...defaultProps} />)

      // Then: 削除ボタンが存在する
      expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument()
    })
  })

  describe('チェック操作', () => {
    it('未チェックのアイテムをクリックするとonToggleCheckが呼ばれる', async () => {
      // Given: 未チェックのアイテム
      const user = userEvent.setup()
      render(<ShoppingItemRow {...defaultProps} />)

      // When: チェックボタンをクリック
      const checkButton = screen.getByRole('button', { name: 'チェックする' })
      await user.click(checkButton)

      // Then: onToggleCheckがアイテムIDで呼ばれる
      expect(defaultProps.onToggleCheck).toHaveBeenCalledWith('item-1')
    })

    it('チェック済みのアイテムをクリックするとonToggleCheckが呼ばれる', async () => {
      // Given: チェック済みのアイテム
      const checkedItem = { ...baseItem, isChecked: true }
      const user = userEvent.setup()
      render(<ShoppingItemRow {...defaultProps} item={checkedItem} />)

      // When: チェックボタンをクリック
      const checkButton = screen.getByRole('button', { name: 'チェックを外す' })
      await user.click(checkButton)

      // Then: onToggleCheckがアイテムIDで呼ばれる
      expect(defaultProps.onToggleCheck).toHaveBeenCalledWith('item-1')
    })
  })

  describe('編集操作', () => {
    it('編集ボタンをクリックするとonEditが呼ばれる', async () => {
      // Given: onEditコールバックが用意されている
      const user = userEvent.setup()
      render(<ShoppingItemRow {...defaultProps} />)

      // When: 編集ボタンをクリック
      const editButton = screen.getByRole('button', { name: '編集' })
      await user.click(editButton)

      // Then: onEditが呼ばれる
      expect(defaultProps.onEdit).toHaveBeenCalled()
    })
  })

  describe('削除操作', () => {
    it('削除ボタンをクリックするとdeleteShoppingItemが呼ばれる', async () => {
      // Given: 削除アクションモック
      vi.mocked(deleteShoppingItem).mockResolvedValueOnce({ ok: true, data: undefined })
      const user = userEvent.setup()
      render(<ShoppingItemRow {...defaultProps} />)

      // When: 削除ボタンをクリック
      const deleteButton = screen.getByRole('button', { name: '削除' })
      await user.click(deleteButton)

      // Then: deleteShoppingItemが正しいIDで呼ばれる
      await waitFor(() => {
        expect(deleteShoppingItem).toHaveBeenCalledWith('item-1')
      })
    })
  })
})
