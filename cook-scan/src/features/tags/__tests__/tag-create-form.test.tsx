import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagCreateForm } from '../tag-create-form'

// モック: Server Actions
vi.mock('../actions', () => ({
  createTag: vi.fn(() => Promise.resolve({ success: true })),
  createTagCategory: vi.fn(() => Promise.resolve({ success: true })),
}))

import { createTag, createTagCategory } from '../actions'

// ヘルパー: type="submit"のボタンを取得
const getSubmitButton = () => {
  const buttons = screen.getAllByRole('button')
  return buttons.find(btn => btn.getAttribute('type') === 'submit')!
}

// ヘルパー: タブボタンを取得（navの中にあるボタン）
const getTabButton = (name: RegExp) => {
  const nav = screen.getByRole('navigation')
  return within(nav).getByRole('button', { name })
}

describe('TagCreateForm', () => {
  const mockCategories = [
    { id: 'cat-1', name: '料理ジャンル', description: 'ジャンル別分類', isSystem: false },
    { id: 'cat-2', name: '調理時間', description: null, isSystem: true },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期表示', () => {
    it('タグタブがデフォルトでアクティブ', () => {
      // Given: TagCreateFormがマウントされている
      render(<TagCreateForm categories={mockCategories} />)

      // When: 初期レンダリングされる

      // Then: タグ作成フォームが表示される
      expect(screen.getByLabelText(/タグ名/)).toBeInTheDocument()
      expect(screen.getByLabelText(/カテゴリ/)).toBeInTheDocument()
    })

    it('カテゴリセレクトにカテゴリ一覧が表示される', () => {
      // Given: TagCreateFormがマウントされている
      render(<TagCreateForm categories={mockCategories} />)

      // When: カテゴリセレクトを確認する
      const select = screen.getByLabelText(/カテゴリ/)

      // Then: カテゴリが選択肢として表示される
      expect(select).toBeInTheDocument()
      expect(screen.getByText('料理ジャンル')).toBeInTheDocument()
      expect(screen.getByText(/調理時間.*システム/)).toBeInTheDocument()
    })

    it('非システムカテゴリがデフォルトで選択される', () => {
      // Given: TagCreateFormがマウントされている
      render(<TagCreateForm categories={mockCategories} />)

      // When: カテゴリセレクトを確認する
      const select = screen.getByLabelText(/カテゴリ/) as HTMLSelectElement

      // Then: 非システムカテゴリが選択されている
      expect(select.value).toBe('cat-1')
    })

    it('カテゴリが空の場合、「カテゴリがありません」と表示される', () => {
      // Given: カテゴリが空
      render(<TagCreateForm categories={[]} />)

      // Then: メッセージが表示される
      expect(screen.getByText('カテゴリがありません')).toBeInTheDocument()
    })
  })

  describe('タブ切り替え', () => {
    it('カテゴリタブをクリックするとカテゴリ作成フォームが表示される', async () => {
      // Given: TagCreateFormが表示されている
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      // When: カテゴリタブをクリック
      await user.click(getTabButton(/カテゴリを作成/))

      // Then: カテゴリ作成フォームが表示される
      expect(screen.getByLabelText(/カテゴリ名/)).toBeInTheDocument()
      expect(screen.queryByLabelText(/タグ名/)).not.toBeInTheDocument()
    })

    it('タグタブに戻るとタグ作成フォームが表示される', async () => {
      // Given: カテゴリタブがアクティブ
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)
      await user.click(getTabButton(/カテゴリを作成/))

      // When: タグタブをクリック
      await user.click(getTabButton(/タグを作成/))

      // Then: タグ作成フォームが表示される
      expect(screen.getByLabelText(/タグ名/)).toBeInTheDocument()
    })
  })

  describe('タグ作成フォーム - バリデーション', () => {
    it('タグ名が空の場合、送信するとエラーメッセージが表示される', async () => {
      // Given: タグ名が空
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: エラーメッセージが表示される
      expect(screen.getByText('タグ名を入力してください')).toBeInTheDocument()
      expect(createTag).not.toHaveBeenCalled()
    })

    it('カテゴリが空の場合、送信ボタンがdisabled', () => {
      // Given: カテゴリがない状態
      render(<TagCreateForm categories={[]} />)

      // Then: 送信ボタンがdisabled
      expect(getSubmitButton()).toBeDisabled()
    })
  })

  describe('タグ作成フォーム - 送信', () => {
    it('有効な入力で送信するとcreateTagが呼ばれる', async () => {
      // Given: 有効な入力
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      await user.type(screen.getByLabelText(/タグ名/), '和食')
      await user.type(screen.getByLabelText('説明（任意）'), 'テスト説明')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: createTagが正しいパラメータで呼ばれる
      await waitFor(() => {
        expect(createTag).toHaveBeenCalledTimes(1)
        expect(createTag).toHaveBeenCalledWith('cat-1', '和食', 'テスト説明')
      })
    })

    it('説明が空の場合はundefinedで送信される', async () => {
      // Given: 説明が空
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      await user.type(screen.getByLabelText(/タグ名/), '和食')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: 説明がundefinedで呼ばれる
      await waitFor(() => {
        expect(createTag).toHaveBeenCalledWith('cat-1', '和食', undefined)
      })
    })

    it('成功時に成功メッセージが表示され、フォームがクリアされる', async () => {
      // Given: createTagが成功を返す
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      const tagNameInput = screen.getByLabelText(/タグ名/)
      await user.type(tagNameInput, '和食')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: 成功メッセージが表示され、フォームがクリアされる
      await waitFor(() => {
        expect(screen.getByText('タグを作成しました')).toBeInTheDocument()
        expect(tagNameInput).toHaveValue('')
      })
    })

    it('createTagがエラーを返した場合、エラーメッセージが表示される', async () => {
      // Given: createTagがエラーを返す
      vi.mocked(createTag).mockResolvedValueOnce({ success: false, error: '同名のタグが存在します' })

      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      await user.type(screen.getByLabelText(/タグ名/), '和食')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('同名のタグが存在します')).toBeInTheDocument()
      })
    })

    it('createTagが例外をスローした場合、エラーメッセージが表示される', async () => {
      // Given: createTagが例外をスロー
      vi.mocked(createTag).mockRejectedValueOnce(new Error('Network error'))

      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      await user.type(screen.getByLabelText(/タグ名/), '和食')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('タグの作成中にエラーが発生しました')).toBeInTheDocument()
      })
    })
  })

  describe('タグ作成フォーム - ローディング状態', () => {
    it('送信中はローディングテキストが表示される', async () => {
      // Given: createTagが遅延する
      let resolveCreate: (value: { success: boolean }) => void
      const createPromise = new Promise<{ success: boolean }>((resolve) => {
        resolveCreate = resolve
      })
      vi.mocked(createTag).mockReturnValueOnce(createPromise)

      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)

      await user.type(screen.getByLabelText(/タグ名/), '和食')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: ローディング状態
      await waitFor(() => {
        expect(screen.getByText('作成中...')).toBeInTheDocument()
      })

      // クリーンアップ
      resolveCreate!({ success: true })
      await waitFor(() => {
        expect(createTag).toHaveBeenCalled()
      })
    })
  })

  describe('カテゴリ作成フォーム - バリデーション', () => {
    it('カテゴリ名が空の場合、送信するとエラーメッセージが表示される', async () => {
      // Given: カテゴリタブがアクティブ
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)
      await user.click(getTabButton(/カテゴリを作成/))

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('カテゴリ名を入力してください')).toBeInTheDocument()
      })
      expect(createTagCategory).not.toHaveBeenCalled()
    })
  })

  describe('カテゴリ作成フォーム - 送信', () => {
    it('有効な入力で送信するとcreateTagCategoryが呼ばれる', async () => {
      // Given: カテゴリタブがアクティブで有効な入力
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)
      await user.click(getTabButton(/カテゴリを作成/))

      await user.type(screen.getByLabelText(/カテゴリ名/), '難易度')
      await user.type(screen.getByLabelText('説明（任意）'), 'レシピの難しさ')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: createTagCategoryが正しいパラメータで呼ばれる
      await waitFor(() => {
        expect(createTagCategory).toHaveBeenCalledTimes(1)
        expect(createTagCategory).toHaveBeenCalledWith('難易度', 'レシピの難しさ')
      })
    })

    it('成功時に成功メッセージが表示され、フォームがクリアされる', async () => {
      // Given: createTagCategoryが成功を返す
      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)
      await user.click(getTabButton(/カテゴリを作成/))

      const categoryNameInput = screen.getByLabelText(/カテゴリ名/)
      await user.type(categoryNameInput, '難易度')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: 成功メッセージが表示され、フォームがクリアされる
      await waitFor(() => {
        expect(screen.getByText('カテゴリを作成しました')).toBeInTheDocument()
        expect(categoryNameInput).toHaveValue('')
      })
    })

    it('createTagCategoryがエラーを返した場合、エラーメッセージが表示される', async () => {
      // Given: createTagCategoryがエラーを返す
      vi.mocked(createTagCategory).mockResolvedValueOnce({ success: false, error: '同名のカテゴリが存在します' })

      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)
      await user.click(getTabButton(/カテゴリを作成/))

      await user.type(screen.getByLabelText(/カテゴリ名/), '難易度')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('同名のカテゴリが存在します')).toBeInTheDocument()
      })
    })

    it('createTagCategoryが例外をスローした場合、エラーメッセージが表示される', async () => {
      // Given: createTagCategoryが例外をスロー
      vi.mocked(createTagCategory).mockRejectedValueOnce(new Error('Network error'))

      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)
      await user.click(getTabButton(/カテゴリを作成/))

      await user.type(screen.getByLabelText(/カテゴリ名/), '難易度')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('カテゴリの作成中にエラーが発生しました')).toBeInTheDocument()
      })
    })
  })

  describe('カテゴリ作成フォーム - ローディング状態', () => {
    it('送信中はローディングテキストが表示される', async () => {
      // Given: createTagCategoryが遅延する
      let resolveCreate: (value: { success: boolean }) => void
      const createPromise = new Promise<{ success: boolean }>((resolve) => {
        resolveCreate = resolve
      })
      vi.mocked(createTagCategory).mockReturnValueOnce(createPromise)

      const user = userEvent.setup()
      render(<TagCreateForm categories={mockCategories} />)
      await user.click(getTabButton(/カテゴリを作成/))

      await user.type(screen.getByLabelText(/カテゴリ名/), '難易度')

      // When: 送信ボタンをクリック
      await user.click(getSubmitButton())

      // Then: ローディング状態
      await waitFor(() => {
        expect(screen.getByText('作成中...')).toBeInTheDocument()
      })

      // クリーンアップ
      resolveCreate!({ success: true })
      await waitFor(() => {
        expect(createTagCategory).toHaveBeenCalled()
      })
    })
  })
})
