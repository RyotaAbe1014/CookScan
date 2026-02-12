import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditShoppingItemDialog } from '../edit-shopping-item-dialog'
import type { ShoppingItemOutput } from '@/backend/domain/shopping-items'

// モック: Server Actions
vi.mock('@/features/shopping-list/actions', () => ({
  updateShoppingItem: vi.fn(),
}))

// Radix Dialog Portal をインラインレンダリングに変更
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<typeof import('@radix-ui/react-dialog')>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  }
})

import { updateShoppingItem } from '@/features/shopping-list/actions'

describe('EditShoppingItemDialog', () => {
  const mockItem: ShoppingItemOutput = {
    id: 'item-1',
    userId: 'user-1',
    name: '牛乳',
    memo: '低脂肪タイプ',
    isChecked: false,
    displayOrder: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const defaultProps = {
    item: mockItem,
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('表示制御', () => {
    it('isOpen=trueの時、ダイアログが表示される', () => {
      // Given: isOpen=true
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: コンポーネントをレンダリング
      // Then: ダイアログの内容が表示される
      expect(screen.getByText('アイテムを編集')).toBeInTheDocument()
    })

    it('isOpen=falseの時、ダイアログが表示されない', () => {
      // Given: isOpen=false
      render(<EditShoppingItemDialog {...defaultProps} isOpen={false} />)

      // When: コンポーネントをレンダリング
      // Then: ダイアログの内容が表示されない
      expect(screen.queryByText('アイテムを編集')).not.toBeInTheDocument()
    })

    it('アイテム名が入力フィールドに初期値として設定される', () => {
      // Given: 名前付きのアイテムが設定されている
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: コンポーネントをレンダリング
      // Then: 名前が入力フィールドに設定される
      expect(screen.getByDisplayValue('牛乳')).toBeInTheDocument()
    })

    it('メモが入力フィールドに初期値として設定される', () => {
      // Given: メモ付きのアイテムが設定されている
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: コンポーネントをレンダリング
      // Then: メモが入力フィールドに設定される
      expect(screen.getByDisplayValue('低脂肪タイプ')).toBeInTheDocument()
    })

    it('メモがnullのアイテムでもエラーなく表示される', () => {
      // Given: メモなしのアイテム
      const itemWithoutMemo = { ...mockItem, memo: null }
      render(<EditShoppingItemDialog {...defaultProps} item={itemWithoutMemo} />)

      // When: コンポーネントをレンダリング
      // Then: ダイアログが正常に表示される
      expect(screen.getByText('アイテムを編集')).toBeInTheDocument()
    })
  })

  describe('更新操作', () => {
    it('名前を変更して保存するとupdateShoppingItemが呼ばれる', async () => {
      // Given: updateShoppingItemが成功を返す
      vi.mocked(updateShoppingItem).mockResolvedValueOnce({ ok: true, data: undefined })
      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: 名前を変更して保存
      const nameInput = screen.getByDisplayValue('牛乳')
      await user.clear(nameInput)
      await user.type(nameInput, '豆乳')
      await user.click(screen.getByRole('button', { name: '保存' }))

      // Then: updateShoppingItemが正しい引数で呼ばれる
      await waitFor(() => {
        expect(updateShoppingItem).toHaveBeenCalledWith('item-1', '豆乳', '低脂肪タイプ')
      })
    })

    it('更新成功後、onCloseが呼ばれる', async () => {
      // Given: updateShoppingItemが成功を返す
      vi.mocked(updateShoppingItem).mockResolvedValueOnce({ ok: true, data: undefined })
      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: 保存ボタンをクリック
      await user.click(screen.getByRole('button', { name: '保存' }))

      // Then: onCloseが呼ばれる
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    it('更新失敗時、エラーメッセージが表示される', async () => {
      // Given: updateShoppingItemが失敗を返す
      vi.mocked(updateShoppingItem).mockResolvedValueOnce({
        ok: false,
        error: { code: 'SERVER_ERROR', message: '更新に失敗しました' },
      })
      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: 保存ボタンをクリック
      await user.click(screen.getByRole('button', { name: '保存' }))

      // Then: エラーメッセージが表示され、ダイアログは閉じない
      await waitFor(() => {
        expect(screen.getByText('更新に失敗しました')).toBeInTheDocument()
        expect(defaultProps.onClose).not.toHaveBeenCalled()
      })
    })

    it('名前が空の場合、保存ボタンがdisabledになり送信できない', async () => {
      // Given: ダイアログが表示されている
      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: 名前を空にする
      const nameInput = screen.getByDisplayValue('牛乳')
      await user.clear(nameInput)

      // Then: 保存ボタンがdisabledになる
      expect(screen.getByRole('button', { name: '保存' })).toBeDisabled()

      // Then: updateShoppingItemは呼ばれない
      expect(updateShoppingItem).not.toHaveBeenCalled()
    })
  })

  describe('キャンセル操作', () => {
    it('キャンセルボタンをクリックするとonCloseが呼ばれる', async () => {
      // Given: ダイアログが表示されている
      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: キャンセルボタンをクリック
      await user.click(screen.getByRole('button', { name: 'キャンセル' }))

      // Then: onCloseが呼ばれる
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('ESCキーでonCloseが呼ばれる', async () => {
      // Given: ダイアログが表示されている
      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: ESCキーを押す
      await user.keyboard('{Escape}')

      // Then: onCloseが呼ばれる
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  describe('ローディング状態', () => {
    it('保存中は両ボタンがdisabledになる', async () => {
      // Given: updateShoppingItemが遅延するようモック
      let resolveUpdate: () => void
      const updatePromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
        resolveUpdate = () => resolve({ ok: true, data: undefined })
      })
      vi.mocked(updateShoppingItem).mockReturnValueOnce(updatePromise)

      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: 保存ボタンをクリック
      await user.click(screen.getByRole('button', { name: '保存' }))

      // Then: 両方のボタンがdisabled
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'キャンセル' })).toBeDisabled()
      })

      // クリーンアップ
      resolveUpdate!()
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    it('保存中は「保存中...」テキストが表示される', async () => {
      // Given: updateShoppingItemが遅延するようモック
      let resolveUpdate: () => void
      const updatePromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
        resolveUpdate = () => resolve({ ok: true, data: undefined })
      })
      vi.mocked(updateShoppingItem).mockReturnValueOnce(updatePromise)

      const user = userEvent.setup()
      render(<EditShoppingItemDialog {...defaultProps} />)

      // When: 保存ボタンをクリック
      await user.click(screen.getByRole('button', { name: '保存' }))

      // Then: ローディングテキストが表示される
      await waitFor(() => {
        expect(screen.getByText('保存中...')).toBeInTheDocument()
      })

      // クリーンアップ
      resolveUpdate!()
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })
  })
})
