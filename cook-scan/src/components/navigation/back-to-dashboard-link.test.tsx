import { render, screen } from '@testing-library/react'
import { BackToDashboardLink } from './back-to-dashboard-link'

describe('BackToDashboardLink', () => {
  test('正常系：ダッシュボードへのリンクが表示される', () => {
    // Given: BackToDashboardLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToDashboardLink />)

    // Then: リンクが存在する
    const link = screen.getByRole('link', { name: /ダッシュボード/ })
    expect(link).toBeInTheDocument()
  })

  test('正常系：正しいhref属性を持つ', () => {
    // Given: BackToDashboardLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToDashboardLink />)

    // Then: /dashboardへのリンクである
    const link = screen.getByRole('link', { name: /ダッシュボード/ })
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  test('正常系：ダッシュボードテキストが表示される', () => {
    // Given: BackToDashboardLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToDashboardLink />)

    // Then: 「ダッシュボード」というテキストが表示される
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
  })

  test('正常系：アイコンSVGが表示される', () => {
    // Given: BackToDashboardLinkコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<BackToDashboardLink />)

    // Then: SVG要素が存在する
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    // Then: SVGに適切なクラスが適用される
    expect(svg).toHaveClass('h-4', 'w-4')
  })

  test('正常系：適切なスタイルクラスが適用される', () => {
    // Given: BackToDashboardLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToDashboardLink />)

    // Then: リンクに適切なスタイルクラスが適用される
    const link = screen.getByRole('link', { name: /ダッシュボード/ })
    expect(link).toHaveClass('flex', 'items-center', 'gap-1.5', 'text-sm', 'text-gray-600', 'transition-colors', 'hover:text-indigo-600')
  })

  test('正常系：SVGに戻る矢印のパスが含まれる', () => {
    // Given: BackToDashboardLinkコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<BackToDashboardLink />)

    // Then: 左向き矢印のパス要素が存在する
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('d', 'M10 19l-7-7m0 0l7-7m-7 7h18')
  })

  test('正常系：アイコンとテキストが両方表示される', () => {
    // Given: BackToDashboardLinkコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<BackToDashboardLink />)

    // Then: SVGアイコンが存在する
    expect(container.querySelector('svg')).toBeInTheDocument()

    // Then: テキストが存在する
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
  })
})
