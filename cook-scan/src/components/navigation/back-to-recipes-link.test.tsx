import { render, screen } from '@testing-library/react'
import { BackToRecipesLink } from './back-to-recipes-link'

describe('BackToRecipesLink', () => {
  test('正常系：レシピ一覧へのリンクが表示される', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToRecipesLink />)

    // Then: リンクが存在する
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
  })

  test('正常系：正しいhref属性を持つ', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToRecipesLink />)

    // Then: /recipesへのリンクである
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/recipes')
  })

  test('正常系：マイレシピに戻るテキストが表示される', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToRecipesLink />)

    // Then: 「マイレシピに戻る」というテキストが表示される
    expect(screen.getByText('マイレシピに戻る')).toBeInTheDocument()
  })

  test('正常系：アイコンSVGが表示される', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<BackToRecipesLink />)

    // Then: SVG要素が存在する
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    // Then: SVGに適切なクラスが適用される
    expect(svg).toHaveClass('h-4', 'w-4')
  })

  test('正常系：適切なスタイルクラスが適用される', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToRecipesLink />)

    // Then: リンクに適切なスタイルクラスが適用される
    const link = screen.getByRole('link')
    expect(link).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-1.5',
      'rounded-lg',
      'border',
      'border-gray-300',
      'bg-white',
      'px-3',
      'py-2',
      'text-sm',
      'text-gray-600',
      'transition-colors',
      'hover:bg-gray-50',
      'hover:text-indigo-600',
      'sm:border-0',
      'sm:bg-transparent',
      'sm:px-0',
      'sm:py-0'
    )
  })

  test('正常系：SVGに戻る矢印のパスが含まれる', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<BackToRecipesLink />)

    // Then: 左向き矢印のパス要素が存在する
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('d', 'M10 19l-7-7m0 0l7-7m-7 7h18')
  })

  test('正常系：テキストにレスポンシブクラスが適用される', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<BackToRecipesLink />)

    // Then: テキストを含むspan要素にレスポンシブクラスが適用される
    const textSpan = container.querySelector('span')
    expect(textSpan).toBeInTheDocument()
    expect(textSpan).toHaveClass('hidden', 'sm:inline')
  })

  test('正常系：アイコンとテキストが両方表示される', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    const { container } = render(<BackToRecipesLink />)

    // Then: SVGアイコンが存在する
    expect(container.querySelector('svg')).toBeInTheDocument()

    // Then: テキストが存在する
    expect(screen.getByText('マイレシピに戻る')).toBeInTheDocument()
  })

  test('正常系：ボーダーとボタンスタイルが適用される', () => {
    // Given: BackToRecipesLinkコンポーネントが用意されている
    // When: レンダリングする
    render(<BackToRecipesLink />)

    // Then: リンクにボーダーとボタンスタイルが適用される
    const link = screen.getByRole('link')
    expect(link).toHaveClass('border', 'border-gray-300', 'bg-white', 'rounded-lg')
  })
})
