import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteRecipeDialog from '../delete-recipe-dialog'

// モック: Next.js Router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// モック: Server Action
vi.mock('../actions', () => ({
  deleteRecipe: vi.fn(),
}))

import { deleteRecipe } from '../actions'

describe('DeleteRecipeDialog', () => {
  const defaultProps = {
    recipeId: 'recipe-123',
    recipeTitle: 'テストレシピ',
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('表示制御', () => {
    it('isOpen=falseの時、ダイアログが表示されない', () => {
      // Given: isOpen=false
      render(<DeleteRecipeDialog {...defaultProps} isOpen={false} />)

      // When: コンポーネントをレンダリング
      // Then: ダイアログのコンテンツが表示されない
      expect(screen.queryByText('レシピを削除')).not.toBeInTheDocument()
      expect(screen.queryByText(/テストレシピ/)).not.toBeInTheDocument()
    })

    it('isOpen=trueの時、ダイアログが表示される', () => {
      // Given: isOpen=true
      render(<DeleteRecipeDialog {...defaultProps} />)

      // When: コンポーネントをレンダリング
      // Then: レシピタイトルと警告メッセージが表示される
      expect(screen.getByText('レシピを削除')).toBeInTheDocument()
      expect(screen.getByText(/テストレシピ/)).toBeInTheDocument()
      expect(screen.getByText('この操作は取り消すことができません')).toBeInTheDocument()
    })
  })

  describe('削除操作', () => {
    it('削除成功時、/recipesにリダイレクトされる', async () => {
      // Given: deleteRecipeが成功を返す
      vi.mocked(deleteRecipe).mockResolvedValueOnce({ ok: true, data: undefined })

      const user = userEvent.setup()
      render(<DeleteRecipeDialog {...defaultProps} />)

      // When: 削除ボタンをクリック
      const deleteButton = screen.getByRole('button', { name: /削除/ })
      await user.click(deleteButton)

      // Then: router.push('/recipes')が呼ばれ、onClose()が呼ばれる
      await waitFor(() => {
        expect(deleteRecipe).toHaveBeenCalledWith('recipe-123')
        expect(mockPush).toHaveBeenCalledWith('/recipes')
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    it('削除失敗時（result.success=false）、エラーアラートが表示される', async () => {
      // Given: deleteRecipeが失敗を返す
      const errorMessage = 'レシピが見つかりません'
      vi.mocked(deleteRecipe).mockResolvedValueOnce({
        ok: false,
        error: { code: 'NOT_FOUND', message: errorMessage }
      })

      const user = userEvent.setup()
      render(<DeleteRecipeDialog {...defaultProps} />)

      // When: 削除ボタンをクリック
      const deleteButton = screen.getByRole('button', { name: /削除/ })
      await user.click(deleteButton)

      // Then: エラーメッセージが表示され、ダイアログは閉じない
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
        expect(mockPush).not.toHaveBeenCalled()
        expect(defaultProps.onClose).not.toHaveBeenCalled()
      })
    })

    it('例外発生時、エラーアラートが表示される', async () => {
      // Given: deleteRecipeが例外をスロー
      vi.mocked(deleteRecipe).mockRejectedValueOnce(new Error('Network error'))

      const user = userEvent.setup()
      render(<DeleteRecipeDialog {...defaultProps} />)

      // When: 削除ボタンをクリック
      const deleteButton = screen.getByRole('button', { name: /削除/ })
      await user.click(deleteButton)

      // Then: エラーメッセージが表示され、ダイアログは閉じない
      await waitFor(() => {
        expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
        expect(mockPush).not.toHaveBeenCalled()
        expect(defaultProps.onClose).not.toHaveBeenCalled()
      })
    })
  })

  describe('キャンセル操作', () => {
    it('キャンセルボタンクリックでonClose()が呼ばれる', async () => {
      // Given: ダイアログが表示されている
      const user = userEvent.setup()
      render(<DeleteRecipeDialog {...defaultProps} />)

      // When: キャンセルボタンをクリック
      const cancelButton = screen.getByRole('button', { name: /キャンセル/ })
      await user.click(cancelButton)

      // Then: onClose()が呼ばれる
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('背景クリックでonClose()が呼ばれる', async () => {
      // Given: ダイアログが表示されている
      const user = userEvent.setup()
      const { container } = render(<DeleteRecipeDialog {...defaultProps} />)

      // When: 背景部分をクリック
      // aria-hidden="true"の要素（背景オーバーレイ）を探す
      const backdrop = container.querySelector('[aria-hidden="true"]')
      if (backdrop) {
        await user.click(backdrop)
      }

      // Then: onClose()が呼ばれる
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  describe('ローディング状態', () => {
    it('削除中は両ボタンがdisabledになる', async () => {
      // Given: deleteRecipeが遅延するようモック
      let resolveDelete: () => void
      const deletePromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
        resolveDelete = () => resolve({ ok: true, data: undefined })
      })
      vi.mocked(deleteRecipe).mockReturnValueOnce(deletePromise)

      const user = userEvent.setup()
      render(<DeleteRecipeDialog {...defaultProps} />)

      // When: 削除ボタンをクリック
      const deleteButton = screen.getByRole('button', { name: /削除/ })
      await user.click(deleteButton)

      // Then: キャンセルと削除ボタンの両方がdisabled
      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /キャンセル/ })
        expect(cancelButton).toBeDisabled()
        expect(deleteButton).toBeDisabled()
      })

      // クリーンアップ: Promiseを解決し、状態更新を待つ
      resolveDelete!()
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    it('削除中は削除ボタンにローディングテキストが表示される', async () => {
      // Given: deleteRecipeが遅延するようモック
      let resolveDelete: () => void
      const deletePromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
        resolveDelete = () => resolve({ ok: true, data: undefined })
      })
      vi.mocked(deleteRecipe).mockReturnValueOnce(deletePromise)

      const user = userEvent.setup()
      render(<DeleteRecipeDialog {...defaultProps} />)

      // When: 削除ボタンをクリック
      const deleteButton = screen.getByRole('button', { name: /削除/ })
      await user.click(deleteButton)

      // Then: "削除中..."が表示される
      await waitFor(() => {
        expect(screen.getByText('削除中...')).toBeInTheDocument()
      })

      // クリーンアップ: Promiseを解決し、状態更新を待つ
      resolveDelete!()
      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })
  })
})
