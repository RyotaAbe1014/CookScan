import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileSetupForm from '../profile-setup-form'

// モック: Server Action (createProfile)
vi.mock('../actions', () => ({
  createProfile: vi.fn(() => Promise.resolve({ ok: true, data: undefined })),
}))

import { createProfile } from '../actions'

describe('ProfileSetupForm', () => {
  const defaultProps = {
    userId: 'test-user-id',
    userEmail: 'test@example.com',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期表示', () => {
    it('メールアドレスフィールドがdisabledで表示される', () => {
      // Given: ProfileSetupFormがマウントされている
      render(<ProfileSetupForm {...defaultProps} />)

      // When: 初期レンダリングされる
      const emailInput = screen.getByLabelText(/メールアドレス/i)

      // Then: メールアドレスがdisabledで表示される
      expect(emailInput).toBeDisabled()
      expect(emailInput).toHaveValue(defaultProps.userEmail)
    })

    it('名前入力フィールドが表示される', () => {
      // Given: ProfileSetupFormがマウントされている
      render(<ProfileSetupForm {...defaultProps} />)

      // When: 初期レンダリングされる
      const nameInput = screen.getByLabelText(/お名前/i)

      // Then: 名前入力フィールドが表示される
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).not.toBeDisabled()
    })

    it('送信ボタンが初期状態でdisabled', () => {
      // Given: ProfileSetupFormがマウントされている
      render(<ProfileSetupForm {...defaultProps} />)

      // When: 初期レンダリングされる（nameが空）
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })

      // Then: 送信ボタンがdisabled
      expect(submitButton).toBeDisabled()
    })
  })

  describe('入力とバリデーション', () => {
    it('名前を入力すると送信ボタンがenabledになる', async () => {
      // Given: ProfileSetupFormが表示されている
      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })

      // When: 名前を入力する
      await user.type(nameInput, '山田太郎')

      // Then: 送信ボタンがenabledになる
      expect(submitButton).not.toBeDisabled()
    })

    it('名前を空にすると送信ボタンがdisabledになる', async () => {
      // Given: 名前が入力されている状態
      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.type(nameInput, '山田太郎')

      // When: 名前をクリアする
      await user.clear(nameInput)

      // Then: 送信ボタンがdisabledになる
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })
      expect(submitButton).toBeDisabled()
    })

    it('空白文字のみの入力では送信ボタンがdisabledのまま', async () => {
      // Given: ProfileSetupFormが表示されている
      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)

      // When: 空白文字のみを入力する
      await user.type(nameInput, '   ')

      // Then: 送信ボタンはdisabledのまま
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('フォーム送信', () => {
    it('有効な名前で送信するとcreateProfile()が呼ばれる', async () => {
      // Given: 有効な名前が入力されている
      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.type(nameInput, '山田太郎')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })
      await user.click(submitButton)

      // Then: createProfile()が正しいパラメータで呼ばれる
      await waitFor(() => {
        expect(createProfile).toHaveBeenCalledTimes(1)
        expect(createProfile).toHaveBeenCalledWith(
          defaultProps.userId,
          defaultProps.userEmail,
          '山田太郎'
        )
      })
    })
  })

  describe('エラーハンドリング', () => {
    it('createProfileがエラーを返した場合、エラーメッセージが表示される', async () => {
      // Given: createProfileがエラーを返すようにモック
      const errorMessage = 'プロフィール作成に失敗しました'
      vi.mocked(createProfile).mockResolvedValueOnce({
        ok: false,
        error: { code: 'SERVER_ERROR', message: errorMessage },
      })

      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.type(nameInput, '山田太郎')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })
      await user.click(submitButton)

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('重複エラーの場合、適切なメッセージが表示される', async () => {
      // Given: createProfileが重複エラーを返すようにモック
      vi.mocked(createProfile).mockResolvedValueOnce({
        ok: false,
        error: { code: 'CONFLICT', message: 'プロフィールは既に作成されています' },
      })

      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.type(nameInput, '山田太郎')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })
      await user.click(submitButton)

      // Then: エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText('プロフィールは既に作成されています')).toBeInTheDocument()
      })
    })
  })

  describe('ローディング状態', () => {
    it('送信中は送信ボタンがdisabledになる', async () => {
      // Given: createProfileが遅延するようにモック
      let resolveCreate: () => void
      const createPromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
        resolveCreate = () => resolve({ ok: true, data: undefined })
      })
      vi.mocked(createProfile).mockReturnValueOnce(createPromise)

      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.type(nameInput, '山田太郎')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })
      await user.click(submitButton)

      // Then: 送信中はボタンがdisabledになる
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })

      // クリーンアップ: Promiseを解決し、状態更新を待つ
      resolveCreate!()
      await waitFor(() => {
        expect(createProfile).toHaveBeenCalled()
      })
    })

    it('送信中はローディングテキストが表示される', async () => {
      // Given: createProfileが遅延するようにモック
      let resolveCreate: () => void
      const createPromise = new Promise<{ ok: true; data: undefined }>((resolve) => {
        resolveCreate = () => resolve({ ok: true, data: undefined })
      })
      vi.mocked(createProfile).mockReturnValueOnce(createPromise)

      const user = userEvent.setup()
      render(<ProfileSetupForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/お名前/i)
      await user.type(nameInput, '山田太郎')

      // When: フォームを送信する
      const submitButton = screen.getByRole('button', { name: /プロフィールを作成/i })
      await user.click(submitButton)

      // Then: ローディングテキストが表示される
      await waitFor(() => {
        expect(screen.getByText('作成中...')).toBeInTheDocument()
      })

      // クリーンアップ: Promiseを解決し、状態更新を待つ
      resolveCreate!()
      await waitFor(() => {
        expect(createProfile).toHaveBeenCalled()
      })
    })
  })
})
