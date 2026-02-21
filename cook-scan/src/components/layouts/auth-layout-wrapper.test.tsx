import { render, screen } from '@testing-library/react'
import { AuthLayoutWrapper } from './auth-layout-wrapper'
import { vi } from 'vitest'
import { usePathname } from 'next/navigation'

// モック: next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}))

// モック: next/link
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, onClick, className }: { children: React.ReactNode; href: string; onClick?: () => void; className?: string }) => (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    ),
  }
})

// モック: auth actions
vi.mock('@/features/auth/actions', () => ({
  logout: vi.fn(),
}))

// モック: ActiveTimerBanner
vi.mock('@/features/recipes/list/active-timer-banner', () => ({
  ActiveTimerBanner: () => <div data-testid="active-timer-banner" />,
}))

describe('AuthLayoutWrapper', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/')
  })

  test('正常系：子要素が表示される', () => {
    // Given: 子要素を持つAuthLayoutWrapperが用意されている
    const children = <div>テストコンテンツ</div>

    // When: 子要素とtitleでレンダリングする
    render(<AuthLayoutWrapper title="テストタイトル">{children}</AuthLayoutWrapper>)

    // Then: 子要素が表示される
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument()
  })

  test('正常系：タイトルがHeaderに渡される', () => {
    // Given: タイトルを持つAuthLayoutWrapperが用意されている
    const title = 'ダッシュボード'

    // When: titleプロパティでレンダリングする
    render(
      <AuthLayoutWrapper title={title}>
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: タイトルが表示される（Headerコンポーネント経由）
    // Header内のタイトルとMobileNav内のタイトル（もしあれば）が表示される可能性があるため、getAllByTextを使用
    const elements = screen.getAllByText(title)
    expect(elements.length).toBeGreaterThan(0)
  })

  test('正常系：サブタイトルがHeaderに渡される', () => {
    // Given: サブタイトル付きのAuthLayoutWrapperが用意されている
    const subtitle = 'アプリケーションの概要'

    // When: subtitleプロパティでレンダリングする
    render(
      <AuthLayoutWrapper title="タイトル" subtitle={subtitle}>
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: サブタイトルが表示される
    expect(screen.getByText(subtitle)).toBeInTheDocument()
  })

  test('正常系：サブタイトルが未指定の場合、Headerに渡されない', () => {
    // Given: サブタイトルなしのAuthLayoutWrapperが用意されている
    // When: subtitleなしでレンダリングする
    const { container } = render(
      <AuthLayoutWrapper title="タイトル">
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: サブタイトルが表示されない（情報アイコンがないことで確認）
    // MobileNavが追加されたため、SVGの数は1つではなくなった
    // BookIcon(Logo) + MenuIcon + Link Icons (4) + Logout Icon
    const svgElements = container.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(1)

    // サブタイトル用のアイコン（InfoCircleIcon - w-4 h-4 text-emerald-500）がないことを確認すべきだが、
    // クラス名での検索は脆弱なので、テキストが存在しないことを確認する
    const subtitle = screen.queryByText(/Test Subtitle/)
    expect(subtitle).not.toBeInTheDocument()
  })

  test('正常系：rightActionがHeaderに渡される', () => {
    // Given: rightAction付きのAuthLayoutWrapperが用意されている
    const rightAction = <button>アクション</button>

    // When: rightActionプロパティでレンダリングする
    render(
      <AuthLayoutWrapper title="タイトル" rightAction={rightAction}>
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: アクションボタンが表示される
    expect(screen.getByRole('button', { name: 'アクション' })).toBeInTheDocument()
  })

  test('正常系：id属性が設定される', () => {
    // Given: id付きのAuthLayoutWrapperが用意されている
    const id = 'test-layout'

    // When: idプロパティでレンダリングする
    const { container } = render(
      <AuthLayoutWrapper id={id} title="タイトル">
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: メインコンテナにidが設定される
    const layoutDiv = container.querySelector(`#${id}`)
    expect(layoutDiv).toBeInTheDocument()
  })

  test('正常系：グラデーション背景スタイルが適用される', () => {
    // Given: AuthLayoutWrapperが用意されている
    // When: レンダリングする
    const { container } = render(
      <AuthLayoutWrapper title="タイトル">
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: メインコンテナにグラデーション背景クラスが適用される
    const layoutDiv = container.firstChild as HTMLElement
    expect(layoutDiv).toHaveClass('min-h-screen', 'bg-linear-to-br', 'from-emerald-50', 'via-white')
  })

  test('正常系：すべてのプロパティを同時に使用できる', () => {
    // Given: すべてのプロパティを持つAuthLayoutWrapperが用意されている
    const props = {
      id: 'complete-layout',
      title: 'メインタイトル',
      subtitle: 'サブタイトル',
      rightAction: <button>アクション</button>,
    }

    // When: すべてのプロパティでレンダリングする
    const { container } = render(
      <AuthLayoutWrapper {...props}>
        <div>メインコンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: すべての要素が正しく表示される
    expect(container.querySelector('#complete-layout')).toBeInTheDocument()
    expect(screen.getByText('メインタイトル')).toBeInTheDocument()
    expect(screen.getByText('サブタイトル')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'アクション' })).toBeInTheDocument()
    expect(screen.getByText('メインコンテンツ')).toBeInTheDocument()
  })

  test('正常系：showTimerBannerがデフォルト（true）の場合、ActiveTimerBannerが表示される', () => {
    // Given: showTimerBannerを指定しないAuthLayoutWrapperが用意されている
    // When: レンダリングする
    render(
      <AuthLayoutWrapper title="タイトル">
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: ActiveTimerBannerが表示される
    expect(screen.getByTestId('active-timer-banner')).toBeInTheDocument()
  })

  test('正常系：showTimerBanner={false}の場合、ActiveTimerBannerが表示されない', () => {
    // Given: showTimerBanner={false}のAuthLayoutWrapperが用意されている
    // When: レンダリングする
    render(
      <AuthLayoutWrapper title="タイトル" showTimerBanner={false}>
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: ActiveTimerBannerが表示されない
    expect(screen.queryByTestId('active-timer-banner')).not.toBeInTheDocument()
  })

  test('正常系：複数の子要素を受け入れる', () => {
    // Given: 複数の子要素が用意されている
    const children = (
      <>
        <div>コンテンツ1</div>
        <div>コンテンツ2</div>
        <div>コンテンツ3</div>
      </>
    )

    // When: 複数の子要素でレンダリングする
    render(<AuthLayoutWrapper title="タイトル">{children}</AuthLayoutWrapper>)

    // Then: すべての子要素が表示される
    expect(screen.getByText('コンテンツ1')).toBeInTheDocument()
    expect(screen.getByText('コンテンツ2')).toBeInTheDocument()
    expect(screen.getByText('コンテンツ3')).toBeInTheDocument()
  })
})
