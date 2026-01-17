import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import { InviteUserForm } from '../invite-user-form'
import { inviteUser } from '../actions'
import { success, failure, Errors } from '@/utils/result'
import { toast } from 'sonner'

// モックの設定
vi.mock('../actions', () => ({
  inviteUser: vi.fn(),
}))
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('InviteUserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：有効なメールアドレスで招待を送信できる', async () => {
    // Given: 招待フォームが表示されている
    const user = userEvent.setup()
    vi.mocked(inviteUser).mockResolvedValue(success(undefined))

    render(<InviteUserForm />)

    // When: ユーザーが有効なメールアドレスを入力して送信する
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const submitButton = screen.getByRole('button', { name: /招待を送信する/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    // Then: 招待アクションが呼ばれ、成功トーストが表示される
    expect(inviteUser).toHaveBeenCalledWith('test@example.com')

    // トーストの表示を待つ
    await vi.waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('招待の送信に成功しました')
    })
  })

  test('UI：メールアドレス入力フィールドが正しく表示される', () => {
    // Given: 招待フォームが表示されている
    render(<InviteUserForm />)

    // Then: メールアドレス入力フィールドと送信ボタンが表示される
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /招待を送信する/i })).toBeInTheDocument()
  })

  test('異常系：サーバーエラー時にエラーメッセージが表示される', async () => {
    // Given: 招待フォームが表示されている
    const user = userEvent.setup()
    const errorMessage = '招待の送信に失敗しました'
    vi.mocked(inviteUser).mockResolvedValue(failure(Errors.server(errorMessage)))

    render(<InviteUserForm />)

    // When: ユーザーがメールアドレスを入力して送信し、エラーが発生する
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const submitButton = screen.getByRole('button', { name: /招待を送信する/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    // Then: エラートーストが表示される
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  test('正常系：送信成功後にフォームがリセットされる', async () => {
    // Given: 招待フォームが表示されている
    const user = userEvent.setup()
    vi.mocked(inviteUser).mockResolvedValue(success(undefined))

    render(<InviteUserForm />)

    // When: ユーザーがメールアドレスを入力して送信する
    const emailInput = screen.getByLabelText(/メールアドレス/i) as HTMLInputElement
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByRole('button', { name: /招待を送信する/i }))

    // Then: 送信成功後、入力欄がクリアされる
    await vi.waitFor(() => {
      expect(emailInput.value).toBe('')
    })
  })
})
