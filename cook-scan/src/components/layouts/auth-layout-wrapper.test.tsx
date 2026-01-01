import { render, screen } from '@testing-library/react'
import { AuthLayoutWrapper } from './auth-layout-wrapper'

describe('AuthLayoutWrapper', () => {
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
    expect(screen.getByText(title)).toBeInTheDocument()
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
    render(
      <AuthLayoutWrapper title="タイトル">
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )

    // Then: サブタイトルが表示されない（情報アイコンがないことで確認）
    const { container } = render(
      <AuthLayoutWrapper title="タイトル">
        <div>コンテンツ</div>
      </AuthLayoutWrapper>
    )
    const svgElements = container.querySelectorAll('svg')
    // サブタイトルなしの場合、ロゴアイコンのみ（1つ）
    expect(svgElements.length).toBe(1)
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
    expect(layoutDiv).toHaveClass('min-h-screen', 'bg-linear-to-br', 'from-indigo-50', 'via-white', 'to-purple-50')
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
