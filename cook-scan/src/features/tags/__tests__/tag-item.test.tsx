import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagItem } from '../tag-item'

// モック: Server Actions
vi.mock('../actions', () => ({
  updateTag: vi.fn(() => Promise.resolve({ ok: true, data: undefined })),
  deleteTag: vi.fn(() => Promise.resolve({ ok: true, data: undefined })),
}))

import { updateTag, deleteTag } from '../actions'

// window.confirmをモック
const mockConfirm = vi.fn()
global.confirm = mockConfirm

describe('TagItem', () => {
  const mockTag = {
    id: 'tag-1',
    name: '和食',
    description: '日本料理',
    isSystem: false,
  }

  const mockSystemTag = {
    id: 'tag-2',
    name: 'システムタグ',
    description: null,
    isSystem: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockConfirm.mockReturnValue(true)
  })

  it('初期表示: タグ名と使用回数が表示される', () => {
    // Given: TagItemがマウントされている
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // Then: タグ名と使用回数が表示される
    expect(screen.getByText('和食')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('初期表示: 使用回数が0の場合も表示される', () => {
    // Given: 使用回数が0のタグ
    render(<TagItem tag={mockTag} usageCount={0} isUserOwned={true} />)

    // Then: 使用回数が0と表示される
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('編集/削除ボタンの表示制御: ユーザー所有かつ非システムタグの場合、編集・削除ボタンが表示される', () => {
    // Given: ユーザー所有の非システムタグ
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // Then: 編集・削除ボタンが表示される
    expect(screen.getByTitle('編集')).toBeInTheDocument()
    expect(screen.getByTitle('削除')).toBeInTheDocument()
  })

  it('編集/削除ボタンの表示制御: システムタグの場合、編集・削除ボタンが表示されない', () => {
    // Given: システムタグ
    render(<TagItem tag={mockSystemTag} usageCount={5} isUserOwned={true} />)

    // Then: 編集・削除ボタンが表示されない
    expect(screen.queryByTitle('編集')).not.toBeInTheDocument()
    expect(screen.queryByTitle('削除')).not.toBeInTheDocument()
  })

  it('編集/削除ボタンの表示制御: ユーザー所有でない場合、編集・削除ボタンが表示されない', () => {
    // Given: ユーザー所有でないタグ
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={false} />)

    // Then: 編集・削除ボタンが表示されない
    expect(screen.queryByTitle('編集')).not.toBeInTheDocument()
    expect(screen.queryByTitle('削除')).not.toBeInTheDocument()
  })

  it('編集モード: 編集ボタンをクリックすると編集フォームが表示される', async () => {
    // Given: ユーザー所有タグが表示されている
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 編集ボタンをクリック
    await user.click(screen.getByTitle('編集'))

    // Then: 編集フォームが表示される
    expect(screen.getByLabelText(/タグ名/)).toBeInTheDocument()
    expect(screen.getByDisplayValue('和食')).toBeInTheDocument()
    expect(screen.getByDisplayValue('日本料理')).toBeInTheDocument()
  })

  it('編集モード: キャンセルボタンをクリックすると編集モードが解除される', async () => {
    // Given: 編集モードが表示されている
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    // When: キャンセルボタンをクリック
    await user.click(screen.getByRole('button', { name: /キャンセル/ }))

    // Then: 通常モードに戻る
    expect(screen.queryByLabelText(/タグ名/)).not.toBeInTheDocument()
    expect(screen.getByText('和食')).toBeInTheDocument()
  })

  it('編集モード: キャンセル時に入力内容がリセットされる', async () => {
    // Given: 編集モードで内容を変更している
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '変更されたタグ')

    // When: キャンセルボタンをクリック
    await user.click(screen.getByRole('button', { name: /キャンセル/ }))

    // Then: 元の内容に戻る
    await user.click(screen.getByTitle('編集'))
    expect(screen.getByDisplayValue('和食')).toBeInTheDocument()
  })

  it('編集モード: 説明がnullの場合、編集フォームで空文字として表示される', async () => {
    // Given: 説明がnullのタグ
    const tagWithoutDescription = { ...mockTag, description: null }
    const user = userEvent.setup()
    render(<TagItem tag={tagWithoutDescription} usageCount={5} isUserOwned={true} />)

    // When: 編集ボタンをクリック
    await user.click(screen.getByTitle('編集'))

    // Then: 説明フィールドが空
    expect(screen.getByLabelText(/説明/)).toHaveValue('')
  })

  it('タグ更新: 有効な入力で更新するとupdateTagが呼ばれる', async () => {
    // Given: 編集フォームに有効な入力
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたタグ')

    const descriptionInput = screen.getByLabelText(/説明/)
    await user.clear(descriptionInput)
    await user.type(descriptionInput, '更新された説明')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: updateTagが正しいパラメータで呼ばれる
    await waitFor(() => {
      expect(updateTag).toHaveBeenCalledWith('tag-1', '更新されたタグ', '更新された説明')
    })
  })

  it('タグ更新: 説明が空の場合はundefinedで送信される', async () => {
    // Given: 説明が空の編集フォーム
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたタグ')

    const descriptionInput = screen.getByLabelText(/説明/)
    await user.clear(descriptionInput)

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: 説明がundefinedで呼ばれる
    await waitFor(() => {
      expect(updateTag).toHaveBeenCalledWith('tag-1', '更新されたタグ', undefined)
    })
  })

  it('タグ更新: 成功時に編集モードが解除される', async () => {
    // Given: 編集フォームに有効な入力
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたタグ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: 編集モードが解除される
    await waitFor(() => {
      expect(screen.queryByLabelText(/タグ名/)).not.toBeInTheDocument()
    })
  })

  it('タグ更新: updateTagがエラーを返した場合、エラーメッセージが表示される', async () => {
    // Given: updateTagがエラーを返す
    vi.mocked(updateTag).mockResolvedValueOnce({ ok: false, error: { code: 'CONFLICT', message: '同名のタグが存在します' } })

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたタグ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText('同名のタグが存在します')).toBeInTheDocument()
    })
  })

  it('タグ更新: updateTagが例外をスローした場合、エラーメッセージが表示される', async () => {
    // Given: updateTagが例外をスロー
    vi.mocked(updateTag).mockRejectedValueOnce(new Error('Network error'))

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたタグ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText('タグの更新中にエラーが発生しました')).toBeInTheDocument()
    })
  })

  it('バリデーション: タグ名が空の場合、エラーメッセージが表示される', async () => {
    // Given: タグ名が空
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: エラーメッセージが表示される
    expect(screen.getByText('タグ名を入力してください')).toBeInTheDocument()
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('タグ削除: 削除ボタンをクリックすると確認ダイアログが表示される', async () => {
    // Given: ユーザー所有タグが表示されている
    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 削除ボタンをクリック
    await user.click(screen.getByTitle('削除'))

    // Then: 確認ダイアログが表示される
    expect(mockConfirm).toHaveBeenCalledWith('「和食」を削除しますか？この操作は取り消せません。')
  })

  it('タグ削除: 確認ダイアログでOKを選択するとdeleteTagが呼ばれる', async () => {
    // Given: 確認ダイアログでOKを選択
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 削除ボタンをクリック
    await user.click(screen.getByTitle('削除'))

    // Then: deleteTagが呼ばれる
    await waitFor(() => {
      expect(deleteTag).toHaveBeenCalledWith('tag-1')
    })
  })

  it('タグ削除: 確認ダイアログでキャンセルを選択するとdeleteTagが呼ばれない', async () => {
    // Given: 確認ダイアログでキャンセルを選択
    mockConfirm.mockReturnValue(false)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 削除ボタンをクリック
    await user.click(screen.getByTitle('削除'))

    // Then: deleteTagが呼ばれない
    expect(deleteTag).not.toHaveBeenCalled()
  })

  it('タグ削除: deleteTagがエラーを返した場合、エラーメッセージが表示される', async () => {
    // Given: deleteTagがエラーを返す
    vi.mocked(deleteTag).mockResolvedValueOnce({ ok: false, error: { code: 'SERVER_ERROR', message: '削除に失敗しました' } })
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 削除ボタンをクリック
    await user.click(screen.getByTitle('削除'))

    // Then: エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText('削除に失敗しました')).toBeInTheDocument()
    })
  })

  it('タグ削除: deleteTagが例外をスローした場合、エラーメッセージが表示される', async () => {
    // Given: deleteTagが例外をスロー
    vi.mocked(deleteTag).mockRejectedValueOnce(new Error('Network error'))
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 削除ボタンをクリック
    await user.click(screen.getByTitle('削除'))

    // Then: エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText('タグの削除中にエラーが発生しました')).toBeInTheDocument()
    })
  })

  it('ローディング状態: 更新中はローディングテキストが表示される', async () => {
    // Given: updateTagが遅延する
    let resolveUpdate: (value: { success: boolean }) => void
    const updatePromise = new Promise<{ success: boolean }>((resolve) => {
      resolveUpdate = resolve
    })
    vi.mocked(updateTag).mockReturnValueOnce(updatePromise)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたタグ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: ローディング状態
    await waitFor(() => {
      expect(screen.getByText('保存中...')).toBeInTheDocument()
    })

    // クリーンアップ
    resolveUpdate!({ ok: true, data: undefined })
    await waitFor(() => {
      expect(updateTag).toHaveBeenCalled()
    })
  })

  it('ローディング状態: ローディング中は入力フィールドが無効化される', async () => {
    // Given: updateTagが遅延する
    let resolveUpdate: (value: { success: boolean }) => void
    const updatePromise = new Promise<{ success: boolean }>((resolve) => {
      resolveUpdate = resolve
    })
    vi.mocked(updateTag).mockReturnValueOnce(updatePromise)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)
    await user.click(screen.getByTitle('編集'))

    const nameInput = screen.getByLabelText(/タグ名/)
    await user.clear(nameInput)
    await user.type(nameInput, '更新されたタグ')

    // When: 保存ボタンをクリック
    await user.click(screen.getByRole('button', { name: /保存/ }))

    // Then: 入力フィールドが無効化される
    await waitFor(() => {
      expect(screen.getByLabelText(/タグ名/)).toBeDisabled()
      expect(screen.getByLabelText(/説明/)).toBeDisabled()
    })

    // クリーンアップ
    resolveUpdate!({ ok: true, data: undefined })
    await waitFor(() => {
      expect(updateTag).toHaveBeenCalled()
    })
  })

  it('ローディング状態: 削除ボタンクリック中は編集ボタンが無効化される', async () => {
    // Given: deleteTagが遅延する
    let resolveDelete: (value: { success: boolean }) => void
    const deletePromise = new Promise<{ success: boolean }>((resolve) => {
      resolveDelete = resolve
    })
    vi.mocked(deleteTag).mockReturnValueOnce(deletePromise)
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 削除ボタンをクリック
    await user.click(screen.getByTitle('削除'))

    // Then: 編集ボタンが無効化される
    await waitFor(() => {
      expect(screen.getByTitle('編集')).toBeDisabled()
    })

    // クリーンアップ
    resolveDelete!({ ok: true, data: undefined })
    await waitFor(() => {
      expect(deleteTag).toHaveBeenCalled()
    })
  })

  it('エラー表示: 編集モード外でエラーが発生した場合、絶対配置でエラーが表示される', async () => {
    // Given: 削除がエラーを返す
    vi.mocked(deleteTag).mockResolvedValueOnce({ ok: false, error: { code: 'SERVER_ERROR', message: '削除エラー' } })
    mockConfirm.mockReturnValue(true)

    const user = userEvent.setup()
    render(<TagItem tag={mockTag} usageCount={5} isUserOwned={true} />)

    // When: 削除ボタンをクリック
    await user.click(screen.getByTitle('削除'))

    // Then: エラーメッセージが表示される（絶対配置）
    await waitFor(() => {
      const errorMessage = screen.getByText('削除エラー')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage.parentElement).toHaveClass('absolute')
    })
  })
})
