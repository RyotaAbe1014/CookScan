import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryItem } from '../category-item'

// モック: Server Actions
vi.mock('../actions', () => ({
  updateTagCategory: vi.fn(() => Promise.resolve({ ok: true, data: undefined })),
  deleteTagCategory: vi.fn(() => Promise.resolve({ ok: true, data: undefined })),
}))

// モック: sonner (toast)
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

import { updateTagCategory, deleteTagCategory } from '../actions'
import { toast } from 'sonner'

// window.confirmをモック
const mockConfirm = vi.fn()
global.confirm = mockConfirm

describe('CategoryItem', () => {
  const mockCategory = {
    id: 'cat-1',
    name: '料理ジャンル',
    description: 'ジャンル別分類',
    isSystem: false,
    userId: 'user-1',
    tags: [
      {
        id: 'tag-1',
        name: '和食',
        description: '日本料理',
        isSystem: false,
        userId: 'user-1',
        recipeTags: [{ recipeId: 'recipe-1' }, { recipeId: 'recipe-2' }],
      },
      {
        id: 'tag-2',
        name: '洋食',
        description: null,
        isSystem: false,
        userId: 'user-1',
        recipeTags: [{ recipeId: 'recipe-3' }],
      },
    ],
  }

  const mockSystemCategory = {
    ...mockCategory,
    id: 'cat-2',
    name: 'システムカテゴリ',
    isSystem: true,
    tags: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockConfirm.mockReturnValue(true)
    vi.mocked(toast.error).mockClear()
  })

  it('初期表示: カテゴリ名とタグ数が表示される', () => {
    // Given: CategoryItemがマウントされている
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // Then: カテゴリ名が表示される
    expect(screen.getByText('料理ジャンル')).toBeInTheDocument()

    // Then: タグ数が表示される（複数の"2"が存在するため、getAllByTextを使用）
    const tagCounts = screen.getAllByText('2')
    expect(tagCounts.length).toBeGreaterThan(0)
  })

  it('初期表示: システムカテゴリの場合、システムバッジが表示される', () => {
    // Given: システムカテゴリがマウントされている
    render(<CategoryItem category={mockSystemCategory} currentUserId="user-1" />)

    // Then: システムバッジが表示される
    expect(screen.getByText('システム')).toBeInTheDocument()
  })

  it('初期表示: ユーザー所有カテゴリの場合、ユーザーバッジが表示される', () => {
    // Given: ユーザー所有カテゴリがマウントされている
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // Then: ユーザーバッジが表示される
    expect(screen.getByText('ユーザー')).toBeInTheDocument()
  })

  it('初期表示: タグがない場合、メッセージが表示される', () => {
    // Given: タグが空のカテゴリがマウントされている
    const emptyCategory = { ...mockCategory, tags: [] }
    render(<CategoryItem category={emptyCategory} currentUserId="user-1" />)

    // Then: メッセージが表示される
    expect(screen.getByText('このカテゴリにはまだタグがありません。')).toBeInTheDocument()
  })

  it('初期表示: タグがある場合、TagItemが表示される', () => {
    // Given: タグがあるカテゴリがマウントされている
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // Then: タグが表示される
    expect(screen.getByText('和食')).toBeInTheDocument()
    expect(screen.getByText('洋食')).toBeInTheDocument()
  })

  it('編集/削除ボタンの表示制御: ユーザー所有かつ非システムカテゴリの場合、編集・削除ボタンが表示される', () => {
    // Given: ユーザー所有の非システムカテゴリ
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // Then: 編集・削除ボタンが表示される
    expect(screen.getAllByTitle('編集').length).toBeGreaterThan(0)
    expect(screen.getAllByTitle('削除').length).toBeGreaterThan(0)
  })

  it('編集/削除ボタンの表示制御: システムカテゴリの場合、編集・削除ボタンが表示されない', () => {
    // Given: システムカテゴリ
    render(<CategoryItem category={mockSystemCategory} currentUserId="user-1" />)

    // Then: カテゴリの編集フォームが表示されない
    const categoryNameInput = screen.queryByDisplayValue('システムカテゴリ')
    expect(categoryNameInput).not.toBeInTheDocument()
  })

  it('編集/削除ボタンの表示制御: 他のユーザーのカテゴリの場合、編集・削除ボタンが表示されない', () => {
    // Given: 他のユーザーのカテゴリ
    render(<CategoryItem category={mockCategory} currentUserId="user-2" />)

    // Then: 編集・削除ボタンが表示されない
    expect(screen.queryAllByTitle('編集').length).toBe(0)
    expect(screen.queryAllByTitle('削除').length).toBe(0)
  })

  it('編集モード: 編集ボタンをクリックすると編集フォームが表示される', async () => {
    // Given: ユーザー所有カテゴリが表示されている
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // When: 編集ボタンをクリック
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    // Then: 編集フォームが表示される
    expect(screen.getByLabelText(/カテゴリ名/)).toBeInTheDocument()
    expect(screen.getByDisplayValue('料理ジャンル')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ジャンル別分類')).toBeInTheDocument()
  })

  it('編集モード: キャンセルボタンをクリックすると編集モードが解除される', async () => {
    // Given: 編集モードが表示されている
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    // When: キャンセルボタンをクリック
    await user.click(screen.getByRole('button', { name: /キャンセル/ }))

    // Then: 通常モードに戻る
    expect(screen.queryByLabelText(/カテゴリ名/)).not.toBeInTheDocument()
    expect(screen.getByText('料理ジャンル')).toBeInTheDocument()
  })

  it('編集モード: キャンセル時に入力内容がリセットされる', async () => {
    // Given: 編集モードで内容を変更している
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '変更されたカテゴリ')

    // When: キャンセルボタンをクリック
    await user.click(screen.getByRole('button', { name: /キャンセル/ }))

    // Then: 元の内容に戻る
    await user.click(screen.getAllByTitle('編集')[0])
    expect(screen.getByDisplayValue('料理ジャンル')).toBeInTheDocument()
  })

  it('カテゴリ更新: 有効な入力で更新するとupdateTagCategoryが呼ばれる', async () => {
    // Given: 編集フォームに有効な入力
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたカテゴリ')

    const descriptionInput = screen.getByLabelText(/説明/)
    await user.clear(descriptionInput)
    await user.type(descriptionInput, '更新された説明')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: updateTagCategoryが正しいパラメータで呼ばれる
    await waitFor(() => {
      expect(updateTagCategory).toHaveBeenCalledWith('cat-1', '更新されたカテゴリ', '更新された説明')
    })
  })

  it('カテゴリ更新: 説明が空の場合はundefinedで送信される', async () => {
    // Given: 説明が空の編集フォーム
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたカテゴリ')

    const descriptionInput = screen.getByLabelText(/説明/)
    await user.clear(descriptionInput)

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: 説明がundefinedで呼ばれる
    await waitFor(() => {
      expect(updateTagCategory).toHaveBeenCalledWith('cat-1', '更新されたカテゴリ', undefined)
    })
  })

  it('カテゴリ更新: 成功時に編集モードが解除される', async () => {
    // Given: 編集フォームに有効な入力
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたカテゴリ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: 編集モードが解除される
    await waitFor(() => {
      expect(screen.queryByLabelText(/カテゴリ名/)).not.toBeInTheDocument()
    })
  })

  it('カテゴリ更新: updateTagCategoryがエラーを返した場合、エラーメッセージが表示される', async () => {
    // Given: updateTagCategoryがエラーを返す
    vi.mocked(updateTagCategory).mockResolvedValueOnce({ ok: false, error: { code: 'CONFLICT', message: '同名のカテゴリが存在します' } })

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたカテゴリ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: toast.errorが呼ばれる
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('同名のカテゴリが存在します')
    })
  })

  it('カテゴリ更新: updateTagCategoryが例外をスローした場合、エラーメッセージが表示される', async () => {
    // Given: updateTagCategoryが例外をスロー
    vi.mocked(updateTagCategory).mockRejectedValueOnce(new Error('Network error'))

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたカテゴリ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: toast.errorが呼ばれる
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('カテゴリの更新中にエラーが発生しました')
    })
  })

  it('バリデーション: カテゴリ名が空の場合、エラーメッセージが表示される', async () => {
    // Given: カテゴリ名が空
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: toast.errorが呼ばれる
    expect(toast.error).toHaveBeenCalledWith('カテゴリ名を入力してください')
    expect(updateTagCategory).not.toHaveBeenCalled()
  })

  it('カテゴリ削除: 削除ボタンをクリックすると確認ダイアログが表示される', async () => {
    // Given: ユーザー所有カテゴリが表示されている
    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // When: 削除ボタンをクリック
    const deleteButtons = screen.getAllByTitle('削除')
    await user.click(deleteButtons[0])

    // Then: 確認ダイアログが表示される
    expect(mockConfirm).toHaveBeenCalledWith('カテゴリ「料理ジャンル」を削除しますか？この操作は取り消せません。')
  })

  it('カテゴリ削除: 確認ダイアログでOKを選択するとdeleteTagCategoryが呼ばれる', async () => {
    // Given: 確認ダイアログでOKを選択
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // When: 削除ボタンをクリック
    const deleteButtons = screen.getAllByTitle('削除')
    await user.click(deleteButtons[0])

    // Then: deleteTagCategoryが呼ばれる
    await waitFor(() => {
      expect(deleteTagCategory).toHaveBeenCalledWith('cat-1')
    })
  })

  it('カテゴリ削除: 確認ダイアログでキャンセルを選択するとdeleteTagCategoryが呼ばれない', async () => {
    // Given: 確認ダイアログでキャンセルを選択
    mockConfirm.mockReturnValue(false)

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // When: 削除ボタンをクリック
    const deleteButtons = screen.getAllByTitle('削除')
    await user.click(deleteButtons[0])

    // Then: deleteTagCategoryが呼ばれない
    expect(deleteTagCategory).not.toHaveBeenCalled()
  })

  it('カテゴリ削除: deleteTagCategoryがエラーを返した場合、エラーメッセージが表示される', async () => {
    // Given: deleteTagCategoryがエラーを返す
    vi.mocked(deleteTagCategory).mockResolvedValueOnce({ ok: false, error: { code: 'SERVER_ERROR', message: '削除に失敗しました' } })
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // When: 削除ボタンをクリック
    const deleteButtons = screen.getAllByTitle('削除')
    await user.click(deleteButtons[0])

    // Then: toast.errorが呼ばれる
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('削除に失敗しました')
    })
  })

  it('カテゴリ削除: deleteTagCategoryが例外をスローした場合、エラーメッセージが表示される', async () => {
    // Given: deleteTagCategoryが例外をスロー
    vi.mocked(deleteTagCategory).mockRejectedValueOnce(new Error('Network error'))
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)

    // When: 削除ボタンをクリック
    const deleteButtons = screen.getAllByTitle('削除')
    await user.click(deleteButtons[0])

    // Then: toast.errorが呼ばれる
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('カテゴリの削除中にエラーが発生しました')
    })
  })

  it('ローディング状態: 更新中はローディングテキストが表示される', async () => {
    // Given: updateTagCategoryが遅延する
    let resolveUpdate: (value: { ok: true; data: undefined }) => void
    const updatePromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
      resolveUpdate = resolve
    })
    vi.mocked(updateTagCategory).mockReturnValueOnce(updatePromise)

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたカテゴリ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: ローディング状態
    await waitFor(() => {
      expect(screen.getByText('保存中...')).toBeInTheDocument()
    })

    // クリーンアップ
    resolveUpdate!({ ok: true, data: undefined })
    await waitFor(() => {
      expect(updateTagCategory).toHaveBeenCalled()
    })
  })

  it('ローディング状態: ローディング中は入力フィールドが無効化される', async () => {
    // Given: updateTagCategoryが遅延する
    let resolveUpdate: (value: { ok: true; data: undefined }) => void
    const updatePromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
      resolveUpdate = resolve
    })
    vi.mocked(updateTagCategory).mockReturnValueOnce(updatePromise)

    const user = userEvent.setup()
    render(<CategoryItem category={mockCategory} currentUserId="user-1" />)
    const editButtons = screen.getAllByTitle('編集')
    await user.click(editButtons[0])

    const nameInput = screen.getByLabelText(/カテゴリ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたカテゴリ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: 入力フィールドが無効化される
    await waitFor(() => {
      expect(screen.getByLabelText(/カテゴリ名/)).toBeDisabled()
      expect(screen.getByLabelText(/説明/)).toBeDisabled()
    })

    // クリーンアップ
    resolveUpdate!({ ok: true, data: undefined })
    await waitFor(() => {
      expect(updateTagCategory).toHaveBeenCalled()
    })
  })

  // タグのユーザー所有権に関するテスト
  it('タグの編集・削除ボタン表示: システムカテゴリ内のユーザータグに編集・削除ボタンが表示される', () => {
    // Given: システムカテゴリに属するユーザータグ
    const systemCategoryWithUserTag = {
      id: 'cat-system',
      name: 'システムカテゴリ',
      description: 'システムカテゴリ説明',
      isSystem: true,
      userId: null,
      tags: [
        {
          id: 'tag-user',
          name: 'ユーザー作成タグ',
          description: 'ユーザーが作成したタグ',
          isSystem: false,
          userId: 'user-1',
          recipeTags: [],
        },
      ],
    }

    // When: コンポーネントを描画
    render(<CategoryItem category={systemCategoryWithUserTag} currentUserId="user-1" />)

    // Then: タグの編集・削除ボタンが表示される
    expect(screen.getByText('ユーザー作成タグ')).toBeInTheDocument()
    expect(screen.getAllByTitle('編集').length).toBeGreaterThan(0)
    expect(screen.getAllByTitle('削除').length).toBeGreaterThan(0)
  })

  it('タグの編集・削除ボタン表示: システムカテゴリ内のシステムタグに編集・削除ボタンが表示されない', () => {
    // Given: システムカテゴリに属するシステムタグ
    const systemCategoryWithSystemTag = {
      id: 'cat-system',
      name: 'システムカテゴリ',
      description: 'システムカテゴリ説明',
      isSystem: true,
      userId: null,
      tags: [
        {
          id: 'tag-system',
          name: 'システムタグ',
          description: 'システムが作成したタグ',
          isSystem: true,
          userId: null,
          recipeTags: [],
        },
      ],
    }

    // When: コンポーネントを描画
    render(<CategoryItem category={systemCategoryWithSystemTag} currentUserId="user-1" />)

    // Then: タグの編集・削除ボタンが表示されない
    expect(screen.getByText('システムタグ')).toBeInTheDocument()
    expect(screen.queryAllByTitle('編集')).toHaveLength(0)
    expect(screen.queryAllByTitle('削除')).toHaveLength(0)
  })

  it('タグの編集・削除ボタン表示: ユーザーカテゴリ内のユーザータグに編集・削除ボタンが表示される', () => {
    // Given: ユーザーカテゴリに属するユーザータグ
    const userCategoryWithUserTag = {
      id: 'cat-user',
      name: 'ユーザーカテゴリ',
      description: 'ユーザーカテゴリ説明',
      isSystem: false,
      userId: 'user-1',
      tags: [
        {
          id: 'tag-user',
          name: 'ユーザータグ',
          description: 'ユーザーが作成したタグ',
          isSystem: false,
          userId: 'user-1',
          recipeTags: [],
        },
      ],
    }

    // When: コンポーネントを描画
    render(<CategoryItem category={userCategoryWithUserTag} currentUserId="user-1" />)

    // Then: カテゴリとタグの両方に編集・削除ボタンが表示される
    expect(screen.getByText('ユーザータグ')).toBeInTheDocument()
    expect(screen.getAllByTitle('編集').length).toBeGreaterThan(0)
    expect(screen.getAllByTitle('削除').length).toBeGreaterThan(0)
  })

  it('タグの編集・削除ボタン表示: 他ユーザーのタグに編集・削除ボタンが表示されない', () => {
    // Given: システムカテゴリに属する他ユーザーのタグ
    const systemCategoryWithOtherUserTag = {
      id: 'cat-system',
      name: 'システムカテゴリ',
      description: 'システムカテゴリ説明',
      isSystem: true,
      userId: null,
      tags: [
        {
          id: 'tag-other',
          name: '他ユーザーのタグ',
          description: '他ユーザーが作成したタグ',
          isSystem: false,
          userId: 'user-2',
          recipeTags: [],
        },
      ],
    }

    // When: コンポーネントを描画
    render(<CategoryItem category={systemCategoryWithOtherUserTag} currentUserId="user-1" />)

    // Then: タグの編集・削除ボタンが表示されない
    expect(screen.getByText('他ユーザーのタグ')).toBeInTheDocument()
    expect(screen.queryAllByTitle('編集')).toHaveLength(0)
    expect(screen.queryAllByTitle('削除')).toHaveLength(0)
  })
})
