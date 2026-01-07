import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextInput } from '../text-input'

// Mock fetch
global.fetch = vi.fn()

describe('TextInput', () => {
  const mockHandleTextInput = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the text input form', () => {
    render(<TextInput handleTextInput={mockHandleTextInput} />)

    expect(screen.getByText('テキストからレシピを作成')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /レシピを生成/ })).toBeInTheDocument()
  })

  it('displays character count when text is entered', async () => {
    const user = userEvent.setup()
    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    await user.type(textarea, 'テストテキスト')

    expect(screen.getByText(/7文字/)).toBeInTheDocument()
  })

  it('shows warning message when text is less than minimum characters', async () => {
    const user = userEvent.setup()
    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    await user.type(textarea, '短いテキスト')

    expect(screen.getByText(/あと/)).toBeInTheDocument()
  })

  it('disables submit button when text is less than minimum characters', async () => {
    const user = userEvent.setup()
    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    await user.type(textarea, '短い')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when text meets minimum characters', async () => {
    const user = userEvent.setup()
    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    await user.type(textarea, 'これは十分な長さのテキストです。20文字以上あります。')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    expect(submitButton).toBeEnabled()
  })

  it('shows error when submitting text with only whitespace', async () => {
    const user = userEvent.setup()
    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    // Type exactly 20 spaces (minimum length)
    await user.type(textarea, '                    ')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('テキストを入力してください')).toBeInTheDocument()
    })
  })

  it('clears error when user starts typing after error', async () => {
    const user = userEvent.setup()
    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    // Type whitespace to trigger error
    await user.type(textarea, '                    ')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('テキストを入力してください')).toBeInTheDocument()
    })

    await user.clear(textarea)
    await user.type(textarea, 'テキスト')

    expect(screen.queryByText('テキストを入力してください')).not.toBeInTheDocument()
  })

  it('enables submit button with valid text', async () => {
    const user = userEvent.setup()

    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    await user.type(textarea, 'これは十分な長さのテキストです。20文字以上あります。')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    expect(submitButton).toBeEnabled()
  })

  it('displays error message when API returns error', async () => {
    const user = userEvent.setup()

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'APIエラーが発生しました' })
    })

    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    await user.type(textarea, 'これは十分な長さのテキストです。20文字以上あります。')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('APIエラーが発生しました')).toBeInTheDocument()
    })
  })

  it('displays network error message on fetch failure', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/)
    await user.type(textarea, 'これは十分な長さのテキストです。20文字以上あります。')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('ネットワークエラーが発生しました。もう一度お試しください。')).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })

  it('clears textarea after successful submission', async () => {
    const user = userEvent.setup()
    const mockExtractedData = {
      title: 'テストレシピ',
      sourceInfo: null,
      ingredients: [{ name: 'テスト材料', unit: '100g', notes: '' }],
      steps: [{ instruction: 'テスト手順' }],
      memo: '',
      tags: []
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, result: mockExtractedData })
    })

    render(<TextInput handleTextInput={mockHandleTextInput} />)

    const textarea = screen.getByPlaceholderText(/レシピのテキストをここに貼り付けてください/) as HTMLTextAreaElement
    await user.type(textarea, 'これは十分な長さのテキストです。20文字以上あります。')

    const submitButton = screen.getByRole('button', { name: /レシピを生成/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(textarea.value).toBe('')
    })
  })
})
