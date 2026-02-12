import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddShoppingItemForm } from '../add-shopping-item-form'

// モック: Server Actions
vi.mock('@/features/shopping-list/actions', () => ({
  createShoppingItem: vi.fn(),
}))

import { createShoppingItem } from '@/features/shopping-list/actions'

describe('AddShoppingItemForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('表示', () => {
    it('入力フィールドが表示される', () => {
      // Given: AddShoppingItemFormが用意されている
      // When: レンダリングする
      render(<AddShoppingItemForm />)

      // Then: プレースホルダー付きの入力フィールドが表示される
      expect(screen.getByPlaceholderText('アイテムを追加...')).toBeInTheDocument()
    })

    it('追加ボタンが表示される', () => {
      // Given: AddShoppingItemFormが用意されている
      // When: レンダリングする
      render(<AddShoppingItemForm />)

      // Then: 追加ボタンが表示される
      expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
    })

    it('メモ追加リンクが表示される', () => {
      // Given: AddShoppingItemFormが用意されている
      // When: レンダリングする
      render(<AddShoppingItemForm />)

      // Then: メモ追加リンクが表示される
      expect(screen.getByText('+ メモを追加')).toBeInTheDocument()
    })

    it('空の入力時は追加ボタンがdisabledになる', () => {
      // Given: AddShoppingItemFormが用意されている
      // When: レンダリングする
      render(<AddShoppingItemForm />)

      // Then: 追加ボタンがdisabled
      expect(screen.getByRole('button', { name: '追加' })).toBeDisabled()
    })
  })

  describe('入力操作', () => {
    it('テキストを入力すると追加ボタンが有効になる', async () => {
      // Given: フォームが表示されている
      const user = userEvent.setup()
      render(<AddShoppingItemForm />)

      // When: テキストを入力する
      const input = screen.getByPlaceholderText('アイテムを追加...')
      await user.type(input, '牛乳')

      // Then: 追加ボタンが有効になる
      expect(screen.getByRole('button', { name: '追加' })).not.toBeDisabled()
    })

    it('メモ追加リンクをクリックするとメモ入力フィールドが表示される', async () => {
      // Given: フォームが表示されている
      const user = userEvent.setup()
      render(<AddShoppingItemForm />)

      // When: メモ追加リンクをクリック
      await user.click(screen.getByText('+ メモを追加'))

      // Then: メモ入力フィールドが表示される
      expect(screen.getByPlaceholderText('メモ（任意）')).toBeInTheDocument()
    })
  })

  describe('送信操作', () => {
    it('アイテム名のみで送信すると createShoppingItem が呼ばれる', async () => {
      // Given: createShoppingItemが成功を返す
      vi.mocked(createShoppingItem).mockResolvedValueOnce({ ok: true, data: { itemId: 'new-1' } })
      const user = userEvent.setup()
      render(<AddShoppingItemForm />)

      // When: アイテム名を入力して送信
      const input = screen.getByPlaceholderText('アイテムを追加...')
      await user.type(input, '牛乳')
      await user.click(screen.getByRole('button', { name: '追加' }))

      // Then: createShoppingItemが正しい引数で呼ばれる
      await waitFor(() => {
        expect(createShoppingItem).toHaveBeenCalledWith('牛乳', undefined)
      })
    })

    it('メモ付きで送信すると createShoppingItem にメモが渡される', async () => {
      // Given: createShoppingItemが成功を返す
      vi.mocked(createShoppingItem).mockResolvedValueOnce({ ok: true, data: { itemId: 'new-1' } })
      const user = userEvent.setup()
      render(<AddShoppingItemForm />)

      // When: アイテム名とメモを入力して送信
      const input = screen.getByPlaceholderText('アイテムを追加...')
      await user.type(input, '牛乳')
      await user.click(screen.getByText('+ メモを追加'))
      const memoInput = screen.getByPlaceholderText('メモ（任意）')
      await user.type(memoInput, '低脂肪タイプ')
      await user.click(screen.getByRole('button', { name: '追加' }))

      // Then: createShoppingItemがメモ付きで呼ばれる
      await waitFor(() => {
        expect(createShoppingItem).toHaveBeenCalledWith('牛乳', '低脂肪タイプ')
      })
    })

    it('送信成功後、入力フィールドがクリアされる', async () => {
      // Given: createShoppingItemが成功を返す
      vi.mocked(createShoppingItem).mockResolvedValueOnce({ ok: true, data: { itemId: 'new-1' } })
      const user = userEvent.setup()
      render(<AddShoppingItemForm />)

      // When: アイテム名を入力して送信
      const input = screen.getByPlaceholderText('アイテムを追加...')
      await user.type(input, '牛乳')
      await user.click(screen.getByRole('button', { name: '追加' }))

      // Then: 入力フィールドがクリアされる
      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })

    it('送信失敗時、エラーメッセージが表示される', async () => {
      // Given: createShoppingItemが失敗を返す
      vi.mocked(createShoppingItem).mockResolvedValueOnce({
        ok: false,
        error: { code: 'SERVER_ERROR', message: 'アイテムの作成に失敗しました' },
      })
      const user = userEvent.setup()
      render(<AddShoppingItemForm />)

      // When: アイテム名を入力して送信
      const input = screen.getByPlaceholderText('アイテムを追加...')
      await user.type(input, '牛乳')
      await user.click(screen.getByRole('button', { name: '追加' }))

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('アイテムの作成に失敗しました')).toBeInTheDocument()
      })
    })

    it('空白のみの入力では送信されない', async () => {
      // Given: フォームが表示されている
      const user = userEvent.setup()
      render(<AddShoppingItemForm />)

      // When: 空白のみを入力して送信を試みる
      const input = screen.getByPlaceholderText('アイテムを追加...')
      await user.type(input, '   ')
      await user.click(screen.getByRole('button', { name: '追加' }))

      // Then: createShoppingItemは呼ばれない
      expect(createShoppingItem).not.toHaveBeenCalled()
    })
  })
})
