import { render, screen } from '@testing-library/react'
import { NotFoundPageContent } from '../not-found-page-content'

describe('NotFoundPageContent', () => {
  test('正常系：404エラーメッセージが表示される', () => {
    // Given: NotFoundPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<NotFoundPageContent />)

    // Then: 404が表示される
    expect(screen.getByText('404')).toBeInTheDocument()

    // Then: エラーメッセージが表示される
    expect(screen.getByText('ページが見つかりません')).toBeInTheDocument()

    // Then: 説明文が表示される
    expect(
      screen.getByText(/お探しのページは存在しないか、移動または削除された可能性があります/)
    ).toBeInTheDocument()
  })

  test('正常系：ダッシュボードへのリンクが表示される', () => {
    // Given: NotFoundPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<NotFoundPageContent />)

    // Then: ダッシュボードに戻るボタンが表示される
    const dashboardLink = screen.getByRole('link', { name: /ダッシュボードに戻る/i })
    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  test('正常系：レシピ一覧へのリンクが表示される', () => {
    // Given: NotFoundPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<NotFoundPageContent />)

    // Then: レシピ一覧ボタンが表示される（2つ存在：メインボタンと下部リンク）
    const recipeLinks = screen.getAllByRole('link', { name: /レシピ一覧/i })
    expect(recipeLinks.length).toBeGreaterThan(0)
    recipeLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/recipes')
    })
  })

  test('正常系：よく使われるページのリンクが表示される', () => {
    // Given: NotFoundPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<NotFoundPageContent />)

    // Then: 「よく使われるページ」セクションが表示される
    expect(screen.getByText('よく使われるページ')).toBeInTheDocument()

    // Then: レシピアップロードリンクが表示される
    const uploadLink = screen.getByRole('link', { name: /レシピアップロード/i })
    expect(uploadLink).toBeInTheDocument()
    expect(uploadLink).toHaveAttribute('href', '/recipes/upload')

    // Then: タグ管理リンクが表示される
    const tagsLink = screen.getByRole('link', { name: /タグ管理/i })
    expect(tagsLink).toBeInTheDocument()
    expect(tagsLink).toHaveAttribute('href', '/tags')

    // Then: プロフィール設定リンクが表示される
    const profileLink = screen.getByRole('link', { name: /プロフィール設定/i })
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute('href', '/profile/setup')
  })

  test('正常系：404アイコンが表示される', () => {
    // Given: NotFoundPageContentコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<NotFoundPageContent />)

    // Then: SVGアイコンが表示される
    const svgIcon = container.querySelector('svg.text-emerald-600')
    expect(svgIcon).toBeInTheDocument()
  })

  test('正常系：全てのナビゲーションリンクが正しいhrefを持つ', () => {
    // Given: NotFoundPageContentコンポーネントが用意されている
    // When: レンダリングする
    render(<NotFoundPageContent />)

    // Then: 各リンクが正しいパスを持つ
    const links = [
      { name: /ダッシュボードに戻る/i, href: '/dashboard' },
      { name: /レシピアップロード/i, href: '/recipes/upload' },
      { name: /タグ管理/i, href: '/tags' },
      { name: /プロフィール設定/i, href: '/profile/setup' },
    ]

    links.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
    })
  })
})
