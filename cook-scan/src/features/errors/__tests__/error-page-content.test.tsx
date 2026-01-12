import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorPageContent } from '../error-page-content'

describe('ErrorPageContent', () => {
  const mockError = new Error('Test error')
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：エラーメッセージが表示される', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: エラーとリセット関数を渡してレンダリングする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: エラータイトルが表示される
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()

    // Then: エラーの説明文が表示される
    expect(screen.getByText(/申し訳ございません。予期しないエラーが発生しました/)).toBeInTheDocument()
    expect(screen.getByText(/しばらく時間をおいて再度お試しください/)).toBeInTheDocument()
  })

  test('正常系：ダッシュボードへのリンクが表示される', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: ダッシュボードに戻るボタンが表示される
    const dashboardLink = screen.getByRole('link', { name: /ダッシュボードに戻る/i })
    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  test('正常系：再読み込みボタンが表示される', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: 再読み込みボタンが表示される
    const reloadButton = screen.getByRole('button', { name: /再読み込み/i })
    expect(reloadButton).toBeInTheDocument()
  })

  test('正常系：再読み込みボタンをクリックするとページがリロードされる', async () => {
    // Given: window.location.reloadをモック化
    const user = userEvent.setup()
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    })

    // When: 再読み込みボタンをクリックする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)
    const reloadButton = screen.getByRole('button', { name: /再読み込み/i })
    await user.click(reloadButton)

    // Then: window.location.reloadが呼ばれる
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  test('正常系：レシピ一覧へのリンクが表示される', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: レシピ一覧リンクが表示される
    const recipeLink = screen.getByRole('link', { name: /レシピ一覧/i })
    expect(recipeLink).toBeInTheDocument()
    expect(recipeLink).toHaveAttribute('href', '/recipes')
  })

  test('正常系：タグ管理へのリンクが表示される', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: タグ管理リンクが表示される
    const tagsLink = screen.getByRole('link', { name: /タグ管理/i })
    expect(tagsLink).toBeInTheDocument()
    expect(tagsLink).toHaveAttribute('href', '/tags')
  })

  test('正常系：サポートメッセージが表示される', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: サポートメッセージが表示される
    expect(screen.getByText(/問題が解決しない場合は、サポートまでお問い合わせください/)).toBeInTheDocument()
  })

  test('正常系：エラーアイコンが表示される', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: 警告アイコンのSVGが表示される
    const svgIcon = container.querySelector('svg.text-red-500')
    expect(svgIcon).toBeInTheDocument()
  })

  test('正常系：全てのナビゲーションリンクが正しいhrefを持つ', () => {
    // Given: ErrorPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<ErrorPageContent error={mockError} reset={mockReset} />)

    // Then: 各リンクが正しいパスを持つ
    const dashboardLink = screen.getByRole('link', { name: /ダッシュボードに戻る/i })
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')

    const recipeLink = screen.getByRole('link', { name: /レシピ一覧/i })
    expect(recipeLink).toHaveAttribute('href', '/recipes')

    const tagsLink = screen.getByRole('link', { name: /タグ管理/i })
    expect(tagsLink).toHaveAttribute('href', '/tags')
  })

  test('正常系：digestプロパティを持つエラーも正しく処理される', () => {
    // Given: digestプロパティを持つエラーが用意されている
    const errorWithDigest = Object.assign(new Error('Test error'), { digest: 'abc123' })

    // When: レンダリングする
    render(<ErrorPageContent error={errorWithDigest} reset={mockReset} />)

    // Then: エラーメッセージが正しく表示される
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
  })
})
