import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChildRecipeSelectorDialog } from '../child-recipe-selector-dialog'

vi.mock('@/features/recipes/child-recipes/actions', () => ({
  searchAvailableRecipes: vi.fn(),
}))

import { searchAvailableRecipes } from '@/features/recipes/child-recipes/actions'

describe('ChildRecipeSelectorDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onAdd: vi.fn(),
    parentRecipeId: 'parent-1',
    existingChildRecipeIds: [] as string[],
  }

  const mockRecipes = [
    { id: 'recipe-1', title: 'カレーソース', imageUrl: null },
    { id: 'recipe-2', title: 'サラダ', imageUrl: null },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(searchAvailableRecipes).mockResolvedValue({
      ok: true,
      data: mockRecipes,
    })
  })

  describe('表示制御', () => {
    it('isOpen=falseの時、ダイアログが表示されない', () => {
      render(<ChildRecipeSelectorDialog {...defaultProps} isOpen={false} />)
      expect(screen.queryByText('サブレシピを追加')).not.toBeInTheDocument()
    })

    it('isOpen=trueの時、ダイアログが表示される', async () => {
      render(<ChildRecipeSelectorDialog {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByText('サブレシピを追加')).toBeInTheDocument()
      })
    })
  })

  describe('検索機能', () => {
    it('開いた時にレシピ一覧が表示される', async () => {
      render(<ChildRecipeSelectorDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('カレーソース')).toBeInTheDocument()
        expect(screen.getByText('サラダ')).toBeInTheDocument()
      })
    })

    it('検索ボタンをクリックすると検索が実行される', async () => {
      const user = userEvent.setup()
      render(<ChildRecipeSelectorDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('カレーソース')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('レシピ名で検索...')
      await user.type(searchInput, 'カレー')

      const searchButton = screen.getByRole('button', { name: '検索' })
      await user.click(searchButton)

      expect(searchAvailableRecipes).toHaveBeenCalledWith('parent-1', [], 'カレー')
    })
  })

  describe('追加操作', () => {
    it('レシピを選択して追加ボタンをクリックするとonAddが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<ChildRecipeSelectorDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('カレーソース')).toBeInTheDocument()
      })

      await user.click(screen.getByText('カレーソース'))

      const addButton = screen.getByRole('button', { name: /追加/ })
      await user.click(addButton)

      expect(defaultProps.onAdd).toHaveBeenCalledWith({
        childRecipeId: 'recipe-1',
        childRecipeTitle: 'カレーソース',
        quantity: '',
        notes: '',
      })
    })

    it('レシピ未選択時は追加ボタンが無効', async () => {
      render(<ChildRecipeSelectorDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('カレーソース')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /追加/ })
      expect(addButton).toBeDisabled()
    })
  })

  describe('キャンセル操作', () => {
    it('キャンセルボタンクリックでonCloseが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<ChildRecipeSelectorDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('サブレシピを追加')).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /キャンセル/ })
      await user.click(cancelButton)

      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('背景クリックでonCloseが呼ばれる', async () => {
      const user = userEvent.setup()
      const { container } = render(<ChildRecipeSelectorDialog {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('サブレシピを追加')).toBeInTheDocument()
      })

      const backdrop = container.querySelector('[aria-hidden="true"]')
      if (backdrop) {
        await user.click(backdrop)
      }

      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })
})
