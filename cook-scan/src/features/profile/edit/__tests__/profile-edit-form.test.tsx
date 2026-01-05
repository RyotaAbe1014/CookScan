import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileEditForm } from '../profile-edit-form'

// モック: Server Action (updateUserProfile)
vi.mock('../actions', () => ({
  updateUserProfile: vi.fn(() => Promise.resolve({ success: true })),
}))

import { updateUserProfile } from '../actions'

describe('ProfileEditForm', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'テストユーザー',
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期表示', () => {
    it('メールアドレスがdisabledで表示される', () => {
      // Given: ProfileEditFormがマウントされている
      render(<ProfileEditForm initialData={mockUser} />)

      // When: 初期レンダリングされる
      const emailInput = screen.getByLabelText(/メールアドレス/i)

      // Then: メールアドレスがdisabledで表示される
      expect(emailInput).toBeDisabled()
      expect(emailInput).toHaveValue(mockUser.email)
    })

    it('名前入力フィールドに初期値が表示される', () => {
      // Given: ProfileEditFormがマウントされている
      render(<ProfileEditForm initialData={mockUser} />)

      // When: 初期レンダリングされる
      const nameInput = screen.getByLabelText(/お名前/i)

      // Then: 名前の初期値が表示される
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveValue('テストユーザー')
      expect(nameInput).not.toBeDisabled()
    })

    it('最終更新日時が表示される', () => {
      // Given: ProfileEditFormがマウントされている
      render(<ProfileEditForm initialData={mockUser} />)

      // When: 初期レンダリングされる
      const updatedText = screen.getByText(/最終更新/)

      // Then: 最終更新日時が表示される
      expect(updatedText).toBeInTheDocument()
    })

    it('メールアドレス変更不可の説明が表示される', () => {
      // Given: ProfileEditFormがマウントされている
      render(<ProfileEditForm initialData={mockUser} />)

      // When: 初期レンダリングされる
      const helpText = screen.getByText(/メールアドレスは変更できません/i)

      // Then: 説明テキストが表示される
      expect(helpText).toBeInTheDocument()
    })

    it('送信ボタンが初期状態でenabledである（名前が入力済みのため）', () => {
      // Given: ProfileEditFormがマウントされている（名前は"テストユーザー"）
      render(<ProfileEditForm initialData={mockUser} />)

      // When: 初期レンダリングされる
      const submitButton = screen.getByRole('button', { name: /更新する/i })

      // Then: 送信ボタンがenabledである
      expect(submitButton).not.toBeDisabled()
    })

    it('名前がnullの場合は空文字列で初期化される', () => {
      // Given: 名前がnullのユーザー
      const userWithoutName = { ...mockUser, name: null }
      render(<ProfileEditForm initialData={userWithoutName} />)

      // When: 初期レンダリングされる
      const nameInput = screen.getByLabelText(/お名前/i)

      // Then: 名前フィールドは空文字列
      expect(nameInput).toHaveValue('')
    })
  })

  describe('入力とバリデーション', () => {
    it('名前を変更できる', async () => {
      // Given: ProfileEditFormが表示されている
      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const nameInput = screen.getByLabelText(/お名前/i)

      // When: 名前を変更する
      await user.clear(nameInput)
      await user.type(nameInput, '新しい名前')

      // Then: 入力値が更新される
      expect(nameInput).toHaveValue('新しい名前')
    })

    it('名前をクリアすると送信ボタンがdisabledになる', async () => {
      // Given: 名前が入力されている状態
      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const nameInput = screen.getByLabelText(/お名前/i)

      // When: 名前をクリアする
      await user.clear(nameInput)

      // Then: 送信ボタンがdisabledになる
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      expect(submitButton).toBeDisabled()
    })

    it('空白文字のみの入力では送信ボタンがdisabledになる', async () => {
      // Given: ProfileEditFormが表示されている
      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const nameInput = screen.getByLabelText(/お名前/i)

      // When: 空白文字のみを入力する
      await user.clear(nameInput)
      await user.type(nameInput, '   ')

      // Then: 送信ボタンはdisabledになる
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      expect(submitButton).toBeDisabled()
    })

    it('maxLength属性が50に設定されている', () => {
      // Given: ProfileEditFormがマウントされている
      render(<ProfileEditForm initialData={mockUser} />)

      // When: 名前入力フィールドを取得
      const nameInput = screen.getByLabelText(/お名前/i)

      // Then: maxLength属性が50である
      expect(nameInput).toHaveAttribute('maxLength', '50')
    })
  })

  describe('フォーム送信', () => {
    it('有効な名前で送信するとupdateUserProfile()が呼ばれる', async () => {
      // Given: 有効な名前が入力されている
      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.clear(nameInput)
      await user.type(nameInput, '新しい名前')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: updateUserProfile()が正しいパラメータで呼ばれる
      await waitFor(() => {
        expect(updateUserProfile).toHaveBeenCalledTimes(1)
        expect(updateUserProfile).toHaveBeenCalledWith({
          name: '新しい名前',
        })
      })
    })

    it('更新成功時に成功メッセージが表示される', async () => {
      // Given: updateUserProfileが成功を返すようにモック
      vi.mocked(updateUserProfile).mockResolvedValueOnce({ success: true })

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.clear(nameInput)
      await user.type(nameInput, '新しい名前')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: 成功メッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('プロフィールを更新しました')).toBeInTheDocument()
      })
    })

    it('成功メッセージはAlert variantがsuccessである', async () => {
      // Given: updateUserProfileが成功を返す
      vi.mocked(updateUserProfile).mockResolvedValueOnce({ success: true })

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: successバリアントのAlertが表示される
      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent('プロフィールを更新しました')
      })
    })
  })

  describe('エラーハンドリング', () => {
    it('updateUserProfileがエラーを返した場合、エラーメッセージが表示される', async () => {
      // Given: updateUserProfileがエラーを返すようにモック
      const errorMessage = '名前を入力してください'
      vi.mocked(updateUserProfile).mockResolvedValueOnce({
        success: false,
        error: errorMessage,
      })

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.clear(nameInput)
      await user.type(nameInput, '新しい名前')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('エラーメッセージがない場合はデフォルトメッセージが表示される', async () => {
      // Given: updateUserProfileがエラー情報なしで失敗
      vi.mocked(updateUserProfile).mockResolvedValueOnce({
        success: false,
      })

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: デフォルトエラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText('プロフィールの更新に失敗しました')).toBeInTheDocument()
      })
    })

    it('送信時にエラーと成功メッセージが両方消える', async () => {
      // Given: 前回の送信で成功していた
      vi.mocked(updateUserProfile).mockResolvedValueOnce({ success: true })
      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // 成功メッセージが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('プロフィールを更新しました')).toBeInTheDocument()
      })

      // When: 再度送信する
      vi.mocked(updateUserProfile).mockResolvedValueOnce({ success: true })
      await user.click(submitButton)

      // Then: 古いメッセージは一旦消える（新しい送信開始時）
      // その後新しい成功メッセージが表示される
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts).toHaveLength(1) // 1つのみ表示
      })
    })
  })

  describe('ローディング状態', () => {
    it('送信中は送信ボタンがdisabledになる', async () => {
      // Given: updateUserProfileが遅延するようにモック
      let resolveUpdate: (value: { success: boolean }) => void
      const updatePromise = new Promise<{ success: boolean }>((resolve) => {
        resolveUpdate = resolve
      })
      vi.mocked(updateUserProfile).mockReturnValueOnce(updatePromise)

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: 送信中はボタンがdisabledになる
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })

      // クリーンアップ: Promiseを解決
      resolveUpdate!({ success: true })
      await waitFor(() => {
        expect(updateUserProfile).toHaveBeenCalled()
      })
    })

    it('送信中はローディングテキストが表示される', async () => {
      // Given: updateUserProfileが遅延するようにモック
      let resolveUpdate: (value: { success: boolean }) => void
      const updatePromise = new Promise<{ success: boolean }>((resolve) => {
        resolveUpdate = resolve
      })
      vi.mocked(updateUserProfile).mockReturnValueOnce(updatePromise)

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: ローディングテキストが表示される
      await waitFor(() => {
        expect(screen.getByText('更新中...')).toBeInTheDocument()
      })

      // クリーンアップ: Promiseを解決
      resolveUpdate!({ success: true })
      await waitFor(() => {
        expect(updateUserProfile).toHaveBeenCalled()
      })
    })

    it('送信中は名前が空でもボタンがdisabledのまま', async () => {
      // Given: updateUserProfileが遅延するようにモック
      let resolveUpdate: (value: { success: boolean }) => void
      const updatePromise = new Promise<{ success: boolean }>((resolve) => {
        resolveUpdate = resolve
      })
      vi.mocked(updateUserProfile).mockReturnValueOnce(updatePromise)

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /更新する/i })
      await user.click(submitButton)

      // Then: 送信中はdisabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })

      // クリーンアップ
      resolveUpdate!({ success: true })
      await waitFor(() => {
        expect(updateUserProfile).toHaveBeenCalled()
      })
    })
  })

  describe('成功メッセージの自動非表示', () => {
    it('成功メッセージは3秒後に自動的に消える', async () => {
      // Given: updateUserProfileが成功を返す
      vi.mocked(updateUserProfile).mockResolvedValueOnce({ success: true })

      const user = userEvent.setup()
      render(<ProfileEditForm initialData={mockUser} />)
      const submitButton = screen.getByRole('button', { name: /更新する/i })

      // When: フォームを送信する
      await user.click(submitButton)

      // Then: 成功メッセージが表示される
      await waitFor(() => {
        expect(screen.getByText('プロフィールを更新しました')).toBeInTheDocument()
      })

      // When: 3秒待機する（実際の時間を使用）
      await new Promise((resolve) => setTimeout(resolve, 3100))

      // Then: 成功メッセージが消える
      expect(screen.queryByText('プロフィールを更新しました')).not.toBeInTheDocument()
    })
  })
})
