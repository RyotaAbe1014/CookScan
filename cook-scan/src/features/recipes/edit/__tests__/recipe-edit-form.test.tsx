import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeEditForm from '../recipe-edit-form'

// モック: Next.js Router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// モック: Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  },
}))

// モック: Server Actions
vi.mock('../actions', () => ({
  updateRecipe: vi.fn(),
}))

vi.mock('@/features/tags/actions', () => ({
  getAllTagsForRecipe: vi.fn(),
}))

// モック: Header Component
vi.mock('@/components/header', () => ({
  Header: ({ title, rightAction }: { title: string; rightAction?: React.ReactNode }) => (
    <header>
      <h1>{title}</h1>
      {rightAction}
    </header>
  ),
}))

import { updateRecipe } from '../actions'
import { getAllTagsForRecipe } from '@/features/tags/actions'

describe('RecipeEditForm', () => {
  const mockRecipe = {
    id: 'recipe-123',
    title: 'テストレシピ',
    memo: 'テストメモ',
    imageUrl: 'https://example.com/image.jpg',
    ingredients: [
      {
        id: 'ing-1',
        name: '玉ねぎ',
        unit: '1個',
        notes: '薄切り',
      },
    ],
    steps: [
      {
        id: 'step-1',
        orderIndex: 1,
        instruction: '玉ねぎを切る',
        timerSeconds: 60,
      },
    ],
    sourceInfo: [
      {
        id: 'source-1',
        sourceName: '料理本',
        pageNumber: 'P.10',
        sourceUrl: 'https://example.com',
      },
    ],
    recipeTags: [
      {
        tagId: 'tag-1',
        tag: {
          id: 'tag-1',
          name: '和食',
        },
      },
    ],
  }

  const mockTagCategories = [
    {
      id: 'cat-1',
      name: 'ジャンル',
      description: null,
      userId: null,
      isSystem: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tags: [
        {
          id: 'tag-1',
          name: '和食',
          description: null,
          categoryId: 'cat-1',
          userId: null,
          isSystem: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'tag-2',
          name: '洋食',
          description: null,
          categoryId: 'cat-1',
          userId: null,
          isSystem: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getAllTagsForRecipe).mockResolvedValue(mockTagCategories)
  })

  describe('初期表示', () => {
    it('レシピのタイトルが表示される', async () => {
      // Given: RecipeEditFormがマウントされている
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        const titleInput = screen.getByLabelText(/レシピタイトル/i)

        // Then: タイトルが表示される
        expect(titleInput).toHaveValue('テストレシピ')
      })
    })

    it('材料が表示される', async () => {
      // Given: RecipeEditFormがマウントされている
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        // Then: 材料情報が表示される
        expect(screen.getByDisplayValue('玉ねぎ')).toBeInTheDocument()
        expect(screen.getByDisplayValue('1個')).toBeInTheDocument()
        expect(screen.getByDisplayValue('薄切り')).toBeInTheDocument()
      })
    })

    it('手順が表示される', async () => {
      // Given: RecipeEditFormがマウントされている
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        // Then: 手順情報が表示される
        expect(screen.getByDisplayValue('玉ねぎを切る')).toBeInTheDocument()
        expect(screen.getByDisplayValue('60')).toBeInTheDocument()
      })
    })

    it('メモが表示される', async () => {
      // Given: RecipeEditFormがマウントされている
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        const memoInput = screen.getByLabelText(/メモ/i)

        // Then: メモが表示される
        expect(memoInput).toHaveValue('テストメモ')
      })
    })

    it('ソース情報が表示される', async () => {
      // Given: RecipeEditFormがマウントされている
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        // Then: ソース情報が表示される
        expect(screen.getByDisplayValue('料理本')).toBeInTheDocument()
        expect(screen.getByDisplayValue('P.10')).toBeInTheDocument()
        expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
      })
    })

    it('タグが読み込まれて選択状態が反映される', async () => {
      // Given: RecipeEditFormがマウントされている
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: タグデータが読み込まれる
      await waitFor(() => {
        expect(screen.getByText('和食')).toBeInTheDocument()
      })

      // Then: 選択済みタグがチェックされている
      const waTag = screen.getByLabelText(/和食/)
      expect(waTag).toBeChecked()
    })

    it('画像が表示される', async () => {
      // Given: RecipeEditFormがマウントされている
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        const image = screen.getByAltText('レシピ画像')

        // Then: 画像が表示される
        expect(image).toBeInTheDocument()
        // Next.jsのImageコンポーネントは画像URLを最適化するため、src属性に元のURLがエンコードされて含まれる
        expect(image).toHaveAttribute('src')
      })
    })
  })

  describe('基本情報の編集', () => {
    it('タイトルを変更できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByLabelText(/レシピタイトル/i)).toBeInTheDocument()
      })

      const titleInput = screen.getByLabelText(/レシピタイトル/i)

      // When: タイトルを変更する
      await user.clear(titleInput)
      await user.type(titleInput, '新しいレシピ')

      // Then: 変更が反映される
      expect(titleInput).toHaveValue('新しいレシピ')
    })

    it('本の名前を変更できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByLabelText(/本の名前/i)).toBeInTheDocument()
      })

      const bookNameInput = screen.getByLabelText(/本の名前/i)

      // When: 本の名前を変更する
      await user.clear(bookNameInput)
      await user.type(bookNameInput, '新しい料理本')

      // Then: 変更が反映される
      expect(bookNameInput).toHaveValue('新しい料理本')
    })

    it('ページ番号を変更できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByLabelText(/ページ番号/i)).toBeInTheDocument()
      })

      const pageNumberInput = screen.getByLabelText(/ページ番号/i)

      // When: ページ番号を変更する
      await user.clear(pageNumberInput)
      await user.type(pageNumberInput, 'P.20')

      // Then: 変更が反映される
      expect(pageNumberInput).toHaveValue('P.20')
    })

    it('URLを変更できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByLabelText(/参照URL/i)).toBeInTheDocument()
      })

      const urlInput = screen.getByLabelText(/参照URL/i)

      // When: URLを変更する
      await user.clear(urlInput)
      await user.type(urlInput, 'https://new-url.com')

      // Then: 変更が反映される
      expect(urlInput).toHaveValue('https://new-url.com')
    })

    it('メモを変更できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByLabelText(/メモ/i)).toBeInTheDocument()
      })

      const memoInput = screen.getByLabelText(/メモ/i)

      // When: メモを変更する
      await user.clear(memoInput)
      await user.type(memoInput, '新しいメモ')

      // Then: 変更が反映される
      expect(memoInput).toHaveValue('新しいメモ')
    })
  })

  describe('材料の操作', () => {
    it('材料を追加できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText(/材料を追加/)).toBeInTheDocument()
      })

      // When: 材料を追加ボタンをクリックする
      const addButton = screen.getByText(/材料を追加/)
      await user.click(addButton)

      // Then: 新しい材料入力フィールドが追加される
      const materialInputs = screen.getAllByPlaceholderText('材料名')
      expect(materialInputs).toHaveLength(2)
    })

    it('材料の名前を編集できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('玉ねぎ')).toBeInTheDocument()
      })

      const nameInput = screen.getByDisplayValue('玉ねぎ')

      // When: 材料名を変更する
      await user.clear(nameInput)
      await user.type(nameInput, '人参')

      // Then: 変更が反映される
      expect(nameInput).toHaveValue('人参')
    })

    it('材料を削除できる（2個以上ある場合）', async () => {
      // Given: 複数の材料がある状態
      const user = userEvent.setup()
      const recipeWithMultipleIngredients = {
        ...mockRecipe,
        ingredients: [
          ...mockRecipe.ingredients,
          {
            id: 'ing-2',
            name: '人参',
            unit: '1本',
            notes: '角切り',
          },
        ],
      }
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={recipeWithMultipleIngredients} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('人参')).toBeInTheDocument()
      })

      // When: 2番目の材料の削除ボタンをクリック
      const ingredientRows = screen.getAllByPlaceholderText('材料名').map(input => input.closest('.group'))
      const deleteButton = ingredientRows[1]?.querySelector('button[type="button"]')

      if (deleteButton) {
        await user.click(deleteButton)
      }

      // Then: 材料が削除される
      await waitFor(() => {
        expect(screen.queryByDisplayValue('人参')).not.toBeInTheDocument()
      })
    })

    it('材料が1個の場合は削除ボタンが無効', async () => {
      // Given: 材料が1個だけの状態
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('玉ねぎ')).toBeInTheDocument()
      })

      // When: 削除ボタンを確認する
      const ingredientRow = screen.getByPlaceholderText('材料名').closest('.group')
      const deleteButton = ingredientRow?.querySelector('button[type="button"]')

      // Then: 削除ボタンが無効
      expect(deleteButton).toBeDisabled()
    })
  })

  describe('手順の操作', () => {
    it('手順を追加できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText(/手順を追加/)).toBeInTheDocument()
      })

      // When: 手順を追加ボタンをクリックする
      const addButton = screen.getByText(/手順を追加/)
      await user.click(addButton)

      // Then: 新しい手順入力フィールドが追加される
      const stepInputs = screen.getAllByPlaceholderText('手順の説明')
      expect(stepInputs).toHaveLength(2)
    })

    it('手順の説明を編集できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('玉ねぎを切る')).toBeInTheDocument()
      })

      const instructionInput = screen.getByDisplayValue('玉ねぎを切る')

      // When: 手順を変更する
      await user.clear(instructionInput)
      await user.type(instructionInput, '人参を切る')

      // Then: 変更が反映される
      expect(instructionInput).toHaveValue('人参を切る')
    })

    it('手順のタイマーを編集できる', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('60')).toBeInTheDocument()
      })

      const timerInput = screen.getByDisplayValue('60')

      // When: タイマーを変更する
      await user.clear(timerInput)
      await user.type(timerInput, '120')

      // Then: 変更が反映される
      expect(timerInput).toHaveValue(120)
    })

    it('手順を削除できる（2個以上ある場合）', async () => {
      // Given: 複数の手順がある状態
      const user = userEvent.setup()
      const recipeWithMultipleSteps = {
        ...mockRecipe,
        steps: [
          ...mockRecipe.steps,
          {
            id: 'step-2',
            orderIndex: 2,
            instruction: '炒める',
            timerSeconds: 120,
          },
        ],
      }
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={recipeWithMultipleSteps} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('炒める')).toBeInTheDocument()
      })

      // When: 2番目の手順の削除ボタンをクリック
      const stepRows = screen.getAllByPlaceholderText('手順の説明').map(input => input.closest('.group'))
      const deleteButton = stepRows[1]?.querySelector('button[type="button"]')

      if (deleteButton) {
        await user.click(deleteButton)
      }

      // Then: 手順が削除される
      await waitFor(() => {
        expect(screen.queryByDisplayValue('炒める')).not.toBeInTheDocument()
      })
    })

    it('手順が1個の場合は削除ボタンが無効', async () => {
      // Given: 手順が1個だけの状態
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('玉ねぎを切る')).toBeInTheDocument()
      })

      // When: 削除ボタンを確認する
      const stepRow = screen.getByPlaceholderText('手順の説明').closest('.group')
      const deleteButton = stepRow?.querySelector('button[type="button"]')

      // Then: 削除ボタンが無効
      expect(deleteButton).toBeDisabled()
    })
  })

  describe('タグの操作', () => {
    it('タグを選択できる', async () => {
      // Given: タグが選択されていない状態
      const user = userEvent.setup()
      const recipeWithoutTags = {
        ...mockRecipe,
        recipeTags: [],
      }
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={recipeWithoutTags} />)

      await waitFor(() => {
        expect(screen.getByText('和食')).toBeInTheDocument()
      })

      const waTag = screen.getByLabelText(/和食/)
      expect(waTag).not.toBeChecked()

      // When: タグをクリックする
      await user.click(waTag)

      // Then: タグが選択される
      expect(waTag).toBeChecked()
    })

    it('タグの選択を解除できる', async () => {
      // Given: タグが選択されている状態
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText('和食')).toBeInTheDocument()
      })

      const waTag = screen.getByLabelText(/和食/)
      expect(waTag).toBeChecked()

      // When: タグをクリックする
      await user.click(waTag)

      // Then: タグの選択が解除される
      expect(waTag).not.toBeChecked()
    })

    it('複数のタグを選択できる', async () => {
      // Given: タグが選択されていない状態
      const user = userEvent.setup()
      const recipeWithoutTags = {
        ...mockRecipe,
        recipeTags: [],
      }
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={recipeWithoutTags} />)

      await waitFor(() => {
        expect(screen.getByText('和食')).toBeInTheDocument()
      })

      const waTag = screen.getByLabelText(/和食/)
      const yoTag = screen.getByLabelText(/洋食/)

      // When: 複数のタグをクリックする
      await user.click(waTag)
      await user.click(yoTag)

      // Then: 両方のタグが選択される
      expect(waTag).toBeChecked()
      expect(yoTag).toBeChecked()
    })
  })

  describe('フォーム送信', () => {
    it('更新成功時、レシピ詳細ページにリダイレクトされる', async () => {
      // Given: 有効なデータが入力されている
      const user = userEvent.setup()
      vi.mocked(updateRecipe).mockResolvedValueOnce({ ok: true, data: { recipeId: 'recipe-123' } })

      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText(/レシピを更新/)).toBeInTheDocument()
      })

      // When: 送信ボタンをクリックする
      const submitButton = screen.getByRole('button', { name: /レシピを更新/ })
      await user.click(submitButton)

      // Then: updateRecipeが呼ばれ、リダイレクトされる
      await waitFor(() => {
        expect(updateRecipe).toHaveBeenCalledWith({
          recipeId: 'recipe-123',
          title: 'テストレシピ',
          sourceInfo: {
            bookName: '料理本',
            pageNumber: 'P.10',
            url: 'https://example.com',
          },
          ingredients: [
            {
              id: 'ing-1',
              name: '玉ねぎ',
              unit: '1個',
              notes: '薄切り',
            },
          ],
          steps: [
            {
              id: 'step-1',
              instruction: '玉ねぎを切る',
              timerSeconds: 60,
              orderIndex: 1,
            },
          ],
          memo: 'テストメモ',
          tags: ['tag-1'],
        })
        expect(mockPush).toHaveBeenCalledWith('/recipes/recipe-123')
      })
    })

    it('更新失敗時、アラートが表示される', async () => {
      // Given: updateRecipeが失敗を返す
      const user = userEvent.setup()
      vi.mocked(updateRecipe).mockResolvedValueOnce({
        ok: false,
        error: { code: 'SERVER_ERROR', message: '更新に失敗しました' },
      })

      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText(/レシピを更新/)).toBeInTheDocument()
      })

      // When: 送信ボタンをクリックする
      const submitButton = screen.getByRole('button', { name: /レシピを更新/ })
      await user.click(submitButton)

      // Then: エラーメッセージが表示され、リダイレクトされない
      await waitFor(() => {
        expect(screen.getByText('更新に失敗しました')).toBeInTheDocument()
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('例外発生時、アラートが表示される', async () => {
      // Given: updateRecipeが例外をスロー
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(updateRecipe).mockRejectedValueOnce(new Error('Network error'))

      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText(/レシピを更新/)).toBeInTheDocument()
      })

      // When: 送信ボタンをクリックする
      const submitButton = screen.getByRole('button', { name: /レシピを更新/ })
      await user.click(submitButton)

      // Then: エラーアラートが表示される
      await waitFor(() => {
        expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
        expect(mockPush).not.toHaveBeenCalled()
      })

      consoleErrorSpy.mockRestore()
    })

    it('タイトルが空の場合、送信ボタンが無効', async () => {
      // Given: タイトルが空の状態
      const recipeWithoutTitle = {
        ...mockRecipe,
        title: '',
      }
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={recipeWithoutTitle} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /レシピを更新/ })

        // Then: 送信ボタンが無効
        expect(submitButton).toBeDisabled()
      })
    })

    it('ソース情報がすべて空の場合、nullとして送信される', async () => {
      // Given: ソース情報がない状態
      const user = userEvent.setup()
      const recipeWithoutSource = {
        ...mockRecipe,
        sourceInfo: [],
      }
      vi.mocked(updateRecipe).mockResolvedValueOnce({ ok: true, data: { recipeId: 'recipe-123' } })

      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={recipeWithoutSource} />)

      await waitFor(() => {
        expect(screen.getByText(/レシピを更新/)).toBeInTheDocument()
      })

      // When: 送信ボタンをクリックする
      const submitButton = screen.getByRole('button', { name: /レシピを更新/ })
      await user.click(submitButton)

      // Then: sourceInfoがnullとして送信される
      await waitFor(() => {
        expect(updateRecipe).toHaveBeenCalledWith(
          expect.objectContaining({
            sourceInfo: null,
          })
        )
      })
    })
  })

  describe('ローディング状態', () => {
    it('送信中はボタンが無効になる', async () => {
      // Given: updateRecipeが遅延するようモック
      const user = userEvent.setup()
      let resolveUpdate: () => void
      const updatePromise = new Promise<{ ok: true; data: { recipeId: string } }>((resolve) => {
        resolveUpdate = () => resolve({ ok: true, data: { recipeId: 'recipe-123' } })
      })
      vi.mocked(updateRecipe).mockReturnValueOnce(updatePromise)

      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText(/レシピを更新/)).toBeInTheDocument()
      })

      // When: 送信ボタンをクリックする
      const submitButton = screen.getByRole('button', { name: /レシピを更新/ })
      await user.click(submitButton)

      // Then: 送信中はボタンが無効
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })

      // クリーンアップ
      resolveUpdate!()
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled()
      })
    })

    it('送信中はローディングテキストが表示される', async () => {
      // Given: updateRecipeが遅延するようモック
      const user = userEvent.setup()
      let resolveUpdate: () => void
      const updatePromise = new Promise<{ ok: true; data: { recipeId: string } }>((resolve) => {
        resolveUpdate = () => resolve({ ok: true, data: { recipeId: 'recipe-123' } })
      })
      vi.mocked(updateRecipe).mockReturnValueOnce(updatePromise)

      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      await waitFor(() => {
        expect(screen.getByText(/レシピを更新/)).toBeInTheDocument()
      })

      // When: 送信ボタンをクリックする
      const submitButton = screen.getByRole('button', { name: /レシピを更新/ })
      await user.click(submitButton)

      // Then: ローディングテキストが表示される
      await waitFor(() => {
        expect(screen.getByText('保存中...')).toBeInTheDocument()
      })

      // クリーンアップ
      resolveUpdate!()
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled()
      })
    })
  })

  describe('キャンセル操作', () => {
    it('キャンセルボタンが表示される', async () => {
      // Given: RecipeEditFormが表示されている
      const user = userEvent.setup()
      render(<RecipeEditForm tagCategories={mockTagCategories} recipe={mockRecipe} />)

      // When: 初期レンダリングされる
      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /キャンセル/ })

        // Then: キャンセルボタンが表示される
        expect(cancelButton).toBeInTheDocument()
      })

      // When: キャンセルボタンをクリックする
      const cancelButton = screen.getByRole('button', { name: /キャンセル/ })
      await user.click(cancelButton)

      // Then: レシピ詳細ページに遷移する
      expect(mockPush).toHaveBeenCalledWith('/recipes/recipe-123')
    })

  })
})
