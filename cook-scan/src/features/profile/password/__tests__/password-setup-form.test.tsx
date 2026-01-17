import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import { PasswordSetupForm } from '../password-setup-form'
import { setupPassword } from '../actions'
import { failure, Errors } from '@/utils/result'

// モックの設定
vi.mock('../actions', () => ({
  setupPassword: vi.fn(),
}))

describe('PasswordSetupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：有効なパスワードで設定できる', async () => {
    // Given: パスワード設定フォームが表示されている
    const user = userEvent.setup()
    // setupPasswordは成功時にredirectするため、実際には返り値を使わない
    // テスト環境ではredirectをモックする必要がある
    const promise = new Promise<never>(() => {
      // Promise never resolves (redirect happens instead)
    })
    vi.mocked(setupPassword).mockReturnValue(promise)

    render(<PasswordSetupForm />)

    // When: ユーザーが有効なパスワードを入力して送信する
    const passwordInput = screen.getByPlaceholderText('8文字以上、大文字・小文字・数字を含む')
    const confirmPasswordInput = screen.getByPlaceholderText('もう一度入力してください')
    const submitButton = screen.getByRole('button', { name: /パスワードを設定/i })

    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'Password123')
    await user.click(submitButton)

    // Then: setupPassword アクションが正しい値で呼ばれる
    await vi.waitFor(() => {
      expect(setupPassword).toHaveBeenCalledWith({
        password: 'Password123',
        confirmPassword: 'Password123',
      })
    })
  })

  test('異常系：パスワードが一致しない場合にエラーが表示される', async () => {
    // Given: パスワード設定フォームが表示されている
    const user = userEvent.setup()
    const errorMessage = 'パスワードが一致しません'
    vi.mocked(setupPassword).mockResolvedValue(
      failure(Errors.validation(errorMessage))
    )

    render(<PasswordSetupForm />)

    // When: ユーザーが異なるパスワードを入力して送信する
    const passwordInput = screen.getByPlaceholderText('8文字以上、大文字・小文字・数字を含む')
    const confirmPasswordInput = screen.getByPlaceholderText('もう一度入力してください')
    const submitButton = screen.getByRole('button', { name: /パスワードを設定/i })

    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'DifferentPassword123')
    await user.click(submitButton)

    // Then: エラーメッセージが表示される
    await vi.waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  test('異常系：パスワード要件を満たさない場合にエラーが表示される', async () => {
    // Given: パスワード設定フォームが表示されている
    const user = userEvent.setup()
    const errorMessage = 'パスワードは8文字以上で入力してください'
    vi.mocked(setupPassword).mockResolvedValue(
      failure(Errors.validation(errorMessage))
    )

    render(<PasswordSetupForm />)

    // When: ユーザーが短いパスワードを入力して送信する
    const passwordInput = screen.getByPlaceholderText('8文字以上、大文字・小文字・数字を含む')
    const confirmPasswordInput = screen.getByPlaceholderText('もう一度入力してください')
    const submitButton = screen.getByRole('button', { name: /パスワードを設定/i })

    await user.type(passwordInput, 'Pass1')
    await user.type(confirmPasswordInput, 'Pass1')
    await user.click(submitButton)

    // Then: エラーメッセージが表示される
    await vi.waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  test('UI：パスワード要件が表示される', () => {
    // Given: パスワード設定フォームが表示されている
    render(<PasswordSetupForm />)

    // Then: パスワード要件が表示される
    expect(screen.getByText(/セキュリティ要件:/)).toBeInTheDocument()
    expect(
      screen.getByText(/パスワードは8文字以上で、大文字、小文字、数字を含める必要があります/)
    ).toBeInTheDocument()
  })

  test('UI：空のフォームでは送信ボタンが無効になる', () => {
    // Given: パスワード設定フォームが表示されている
    render(<PasswordSetupForm />)

    // Then: 送信ボタンが無効になっている
    const submitButton = screen.getByRole('button', { name: /パスワードを設定/i })
    expect(submitButton).toBeDisabled()
  })
})
