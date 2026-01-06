import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordChangeForm } from '../password-change-form'
import { updatePassword } from '../actions'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Server Actionsをモック
vi.mock('../actions', () => ({
  updatePassword: vi.fn(),
}))

describe('PasswordChangeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('全てのフォームフィールドをレンダリングする', () => {
    render(<PasswordChangeForm />)

    expect(screen.getByLabelText(/現在のパスワード/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/もう一度入力してください/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /パスワードを変更/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /キャンセル/i })
    ).toBeInTheDocument()
  })

  it('セキュリティ警告メッセージを表示する', () => {
    render(<PasswordChangeForm />)

    expect(
      screen.getByText(
        /パスワード変更後、すべてのデバイスから自動的にログアウトされます/i
      )
    ).toBeInTheDocument()
  })

  it('パスワードのヒントテキストを表示する', () => {
    render(<PasswordChangeForm />)

    expect(
      screen.getByText(/パスワードは8文字以上で、大文字、小文字、数字を含める必要があります/i)
    ).toBeInTheDocument()
  })

  it('正しいデータでupdatePasswordを呼び出す', async () => {
    const user = userEvent.setup()
    vi.mocked(updatePassword).mockResolvedValue({ success: true })

    render(<PasswordChangeForm />)

    await user.type(
      screen.getByLabelText(/現在のパスワード/i),
      'OldPass123'
    )
    await user.type(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i), 'NewPass123')
    await user.type(
      screen.getByPlaceholderText(/もう一度入力してください/i),
      'NewPass123'
    )

    await user.click(screen.getByRole('button', { name: /パスワードを変更/i }))

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith({
        currentPassword: 'OldPass123',
        newPassword: 'NewPass123',
        confirmPassword: 'NewPass123',
      })
    })
  })

  it('失敗時にエラーメッセージを表示する', async () => {
    const user = userEvent.setup()
    vi.mocked(updatePassword).mockResolvedValue({
      success: false,
      error: '現在のパスワードが正しくありません',
    })

    render(<PasswordChangeForm />)

    await user.type(
      screen.getByLabelText(/現在のパスワード/i),
      'WrongPass'
    )
    await user.type(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i), 'NewPass123')
    await user.type(
      screen.getByPlaceholderText(/もう一度入力してください/i),
      'NewPass123'
    )

    await user.click(screen.getByRole('button', { name: /パスワードを変更/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/現在のパスワードが正しくありません/i)
      ).toBeInTheDocument()
    })
  })

  it('処理中は送信ボタンを無効化する', async () => {
    const user = userEvent.setup()
    vi.mocked(updatePassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    )

    render(<PasswordChangeForm />)

    await user.type(
      screen.getByLabelText(/現在のパスワード/i),
      'OldPass123'
    )
    await user.type(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i), 'NewPass123')
    await user.type(
      screen.getByPlaceholderText(/もう一度入力してください/i),
      'NewPass123'
    )

    const submitButton = screen.getByRole('button', {
      name: /パスワードを変更/i,
    })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
  })

  it('処理中はキャンセルボタンを無効化する', async () => {
    const user = userEvent.setup()
    vi.mocked(updatePassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    )

    render(<PasswordChangeForm />)

    await user.type(
      screen.getByLabelText(/現在のパスワード/i),
      'OldPass123'
    )
    await user.type(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i), 'NewPass123')
    await user.type(
      screen.getByPlaceholderText(/もう一度入力してください/i),
      'NewPass123'
    )

    const submitButton = screen.getByRole('button', {
      name: /パスワードを変更/i,
    })
    const cancelButton = screen.getByRole('button', { name: /キャンセル/i })

    await user.click(submitButton)

    expect(cancelButton).toBeDisabled()
  })

  it('処理中はローディングテキストを表示する', async () => {
    const user = userEvent.setup()
    vi.mocked(updatePassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    )

    render(<PasswordChangeForm />)

    await user.type(
      screen.getByLabelText(/現在のパスワード/i),
      'OldPass123'
    )
    await user.type(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i), 'NewPass123')
    await user.type(
      screen.getByPlaceholderText(/もう一度入力してください/i),
      'NewPass123'
    )

    await user.click(screen.getByRole('button', { name: /パスワードを変更/i }))

    expect(
      screen.getByRole('button', { name: /パスワードを変更中/i })
    ).toBeInTheDocument()
  })

  it('入力フィールドが処理中に無効化される', async () => {
    const user = userEvent.setup()
    vi.mocked(updatePassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    )

    render(<PasswordChangeForm />)

    await user.type(
      screen.getByLabelText(/現在のパスワード/i),
      'OldPass123'
    )
    await user.type(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i), 'NewPass123')
    await user.type(
      screen.getByPlaceholderText(/もう一度入力してください/i),
      'NewPass123'
    )

    await user.click(screen.getByRole('button', { name: /パスワードを変更/i }))

    expect(screen.getByLabelText(/現在のパスワード/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/8文字以上、大文字・小文字・数字を含む/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/もう一度入力してください/i)).toBeDisabled()
  })
})
