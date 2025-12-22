import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { LoginForm } from './LoginForm'
import { login } from '@/features/auth/actions'

// login actionをモック化
vi.mock('@/features/auth/actions', () => ({
  login: vi.fn(),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：フォームの全ての要素が正しくレンダリングされる', () => {
    // Given: LoginFormが表示される
    render(<LoginForm />)

    // Then: 全ての必要な要素が表示される
    expect(screen.getByText('CookScan')).toBeInTheDocument()
    expect(
      screen.getByText(/レシピをスキャンして/)
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /ログイン/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /新規登録/i })
    ).toBeInTheDocument()
  })

  test('正常系：メールアドレス入力フィールドに値を入力できる', async () => {
    // Given: LoginFormが表示されている
    const user = userEvent.setup()
    render(<LoginForm />)

    // When: ユーザーがメールアドレスを入力する
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    await user.type(emailInput, 'test@example.com')

    // Then: 入力した値が表示される
    expect(emailInput).toHaveValue('test@example.com')
  })

  test('正常系：パスワード入力フィールドに値を入力できる', async () => {
    // Given: LoginFormが表示されている
    const user = userEvent.setup()
    render(<LoginForm />)

    // When: ユーザーがパスワードを入力する
    const passwordInput = screen.getByLabelText(/パスワード/i)
    await user.type(passwordInput, 'password123')

    // Then: 入力した値が表示される
    expect(passwordInput).toHaveValue('password123')
  })

  test('正常系：ログインボタンをクリックするとlogin actionが呼ばれる', async () => {
    // Given: LoginFormが表示されており、認証情報が入力されている
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const passwordInput = screen.getByLabelText(/パスワード/i)
    const loginButton = screen.getByRole('button', { name: /ログイン/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    // When: ログインボタンをクリックする
    await user.click(loginButton)

    // Then: login actionが呼ばれる
    expect(login).toHaveBeenCalledTimes(1)

    // FormDataが正しく渡されることを確認
    const formData = vi.mocked(login).mock.calls[0][0] as FormData
    expect(formData.get('email')).toBe('test@example.com')
    expect(formData.get('password')).toBe('password123')
  })

  test('正常系：メールアドレスフィールドには適切なtype属性が設定されている', () => {
    // Given: LoginFormが表示されている
    render(<LoginForm />)

    // Then: メールアドレス入力フィールドのtype属性がemailである
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('正常系：パスワードフィールドには適切なtype属性が設定されている', () => {
    // Given: LoginFormが表示されている
    render(<LoginForm />)

    // Then: パスワード入力フィールドのtype属性がpasswordである
    const passwordInput = screen.getByLabelText(/パスワード/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('正常系：入力フィールドにはrequired属性が設定されている', () => {
    // Given: LoginFormが表示されている
    render(<LoginForm />)

    // Then: メールアドレスとパスワードの両方にrequired属性が設定されている
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const passwordInput = screen.getByLabelText(/パスワード/i)

    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  test('正常系：新規登録ボタンは常に無効化されている', () => {
    // Given: LoginFormが表示されている
    render(<LoginForm />)

    // Then: 新規登録ボタンが無効化されている
    const signupButton = screen.getByRole('button', { name: /新規登録/i })
    expect(signupButton).toBeDisabled()
  })

  test('正常系：プレースホルダーが適切に設定されている', () => {
    // Given: LoginFormが表示されている
    render(<LoginForm />)

    // Then: 各入力フィールドに適切なプレースホルダーが設定されている
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const passwordInput = screen.getByLabelText(/パスワード/i)

    expect(emailInput).toHaveAttribute('placeholder', 'you@example.com')
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••')
  })

  test('正常系：フッターメッセージが表示される', () => {
    // Given: LoginFormが表示されている
    render(<LoginForm />)

    // Then: フッターと追加情報が表示される
    expect(
      screen.getByText(/安全に保存されるあなたのレシピコレクション/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/AIがレシピを自動抽出/)
    ).toBeInTheDocument()
  })

  test('正常系：autoComplete属性が適切に設定されている', () => {
    // Given: LoginFormが表示されている
    render(<LoginForm />)

    // Then: autoComplete属性が適切に設定されている
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const passwordInput = screen.getByLabelText(/パスワード/i)

    expect(emailInput).toHaveAttribute('autocomplete', 'email')
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })
})
