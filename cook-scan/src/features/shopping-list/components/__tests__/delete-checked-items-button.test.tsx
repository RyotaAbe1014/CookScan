import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteCheckedItemsButton } from '../delete-checked-items-button'

// モック: Server Actions
vi.mock('@/features/shopping-list/actions', () => ({
  deleteCheckedItems: vi.fn(),
}))

// Radix Dialog Portal をインラインレンダリングに変更
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<typeof import('@radix-ui/react-dialog')>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  }
})

import { deleteCheckedItems } from '@/features/shopping-list/actions'

describe('DeleteCheckedItemsButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('表示', () => {
    it('一括削除ボタンが表示される', () => {
      // Given: コンポーネントが用意されている
      // When: レンダリングする
      render(<DeleteCheckedItemsButton />)

      // Then: ボタンが表示される
      expect(screen.getByRole('button', { name: /一括削除/ })).toBeInTheDocument()
    })
  })

  describe('確認ダイアログ', () => {
    it('一括削除ボタンをクリックすると確認ダイアログが表示される', async () => {
      // Given: コンポーネントが表示されている
      const user = userEvent.setup()
      render(<DeleteCheckedItemsButton />)

      // When: 一括削除ボタンをクリック
      await user.click(screen.getByRole('button', { name: /一括削除/ }))

      // Then: 確認ダイアログが表示される
      expect(screen.getByText('購入済みアイテムを削除')).toBeInTheDocument()
      expect(screen.getByText('チェック済みのアイテムをすべて削除しますか？')).toBeInTheDocument()
    })

    it('確認ダイアログでキャンセルをクリックするとダイアログが閉じる', async () => {
      // Given: 確認ダイアログが表示されている
      const user = userEvent.setup()
      render(<DeleteCheckedItemsButton />)
      await user.click(screen.getByRole('button', { name: /一括削除/ }))

      // When: キャンセルをクリック
      await user.click(screen.getByRole('button', { name: 'キャンセル' }))

      // Then: ダイアログが閉じる
      await waitFor(() => {
        expect(screen.queryByText('購入済みアイテムを削除')).not.toBeInTheDocument()
      })
    })
  })

  describe('削除操作', () => {
    it('削除ボタンをクリックするとdeleteCheckedItemsが呼ばれる', async () => {
      // Given: deleteCheckedItemsが成功を返す
      vi.mocked(deleteCheckedItems).mockResolvedValueOnce({ ok: true, data: undefined })
      const user = userEvent.setup()
      render(<DeleteCheckedItemsButton />)

      // When: 一括削除ボタン → 確認ダイアログの削除ボタンをクリック
      await user.click(screen.getByRole('button', { name: /一括削除/ }))
      const deleteButtons = screen.getAllByRole('button', { name: /削除/ })
      // 確認ダイアログ内の削除ボタンをクリック
      const confirmDeleteButton = deleteButtons.find(
        (btn) => btn.textContent?.includes('削除') && !btn.textContent?.includes('一括')
      )
      await user.click(confirmDeleteButton!)

      // Then: deleteCheckedItemsが呼ばれる
      await waitFor(() => {
        expect(deleteCheckedItems).toHaveBeenCalled()
      })
    })

    it('削除成功後、ダイアログが閉じる', async () => {
      // Given: deleteCheckedItemsが成功を返す
      vi.mocked(deleteCheckedItems).mockResolvedValueOnce({ ok: true, data: undefined })
      const user = userEvent.setup()
      render(<DeleteCheckedItemsButton />)

      // When: 一括削除の確認を行う
      await user.click(screen.getByRole('button', { name: /一括削除/ }))
      const deleteButtons = screen.getAllByRole('button', { name: /削除/ })
      const confirmDeleteButton = deleteButtons.find(
        (btn) => btn.textContent?.includes('削除') && !btn.textContent?.includes('一括')
      )
      await user.click(confirmDeleteButton!)

      // Then: ダイアログが閉じる
      await waitFor(() => {
        expect(screen.queryByText('購入済みアイテムを削除')).not.toBeInTheDocument()
      })
    })
  })

  describe('ローディング状態', () => {
    it('削除中は両ボタンがdisabledになる', async () => {
      // Given: deleteCheckedItemsが遅延するようモック
      let resolveDelete: () => void
      const deletePromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
        resolveDelete = () => resolve({ ok: true, data: undefined })
      })
      vi.mocked(deleteCheckedItems).mockReturnValueOnce(deletePromise)

      const user = userEvent.setup()
      render(<DeleteCheckedItemsButton />)

      // When: 一括削除の確認を行う
      await user.click(screen.getByRole('button', { name: /一括削除/ }))
      const deleteButtons = screen.getAllByRole('button', { name: /削除/ })
      const confirmDeleteButton = deleteButtons.find(
        (btn) => btn.textContent?.includes('削除') && !btn.textContent?.includes('一括')
      )
      await user.click(confirmDeleteButton!)

      // Then: キャンセルボタンがdisabled
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'キャンセル' })).toBeDisabled()
      })

      // クリーンアップ
      resolveDelete!()
      await waitFor(() => {
        expect(screen.queryByText('購入済みアイテムを削除')).not.toBeInTheDocument()
      })
    })
  })
})
