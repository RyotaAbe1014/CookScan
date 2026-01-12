import { render, screen } from '@testing-library/react'
import { PageContainer } from './page-container'

describe('PageContainer', () => {
  test('正常系：子要素が表示される', () => {
    // Given: 子要素を持つPageContainerが用意されている
    const children = <div>ページコンテンツ</div>

    // When: 子要素でレンダリングする
    render(<PageContainer>{children}</PageContainer>)

    // Then: 子要素が表示される
    expect(screen.getByText('ページコンテンツ')).toBeInTheDocument()
  })

  test('正常系：mainタグとしてレンダリングされる', () => {
    // Given: PageContainerが用意されている
    // When: レンダリングする
    const { container } = render(
      <PageContainer>
        <div>コンテンツ</div>
      </PageContainer>
    )

    // Then: main要素が存在する
    const mainElement = container.querySelector('main')
    expect(mainElement).toBeInTheDocument()
  })

  test('正常系：デフォルトのスタイルクラスが適用される', () => {
    // Given: PageContainerが用意されている
    // When: classNameなしでレンダリングする
    const { container } = render(
      <PageContainer>
        <div>コンテンツ</div>
      </PageContainer>
    )

    // Then: デフォルトのスタイルクラスが適用される
    const mainElement = container.querySelector('main')
    expect(mainElement).toHaveClass('mx-auto', 'max-w-7xl', 'px-4', 'py-6', 'sm:px-6', 'sm:py-8', 'lg:px-8')
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassName付きのPageContainerが用意されている
    const customClassName = 'custom-padding bg-gray-100'

    // When: classNameプロパティでレンダリングする
    const { container } = render(
      <PageContainer className={customClassName}>
        <div>コンテンツ</div>
      </PageContainer>
    )

    // Then: カスタムクラスが追加される
    const mainElement = container.querySelector('main')
    expect(mainElement).toHaveClass('custom-padding', 'bg-gray-100')

    // Then: デフォルトのクラスも維持される
    expect(mainElement).toHaveClass('mx-auto', 'max-w-7xl', 'px-4', 'py-6')
  })

  test('正常系：空文字列のclassNameでも正常に動作する', () => {
    // Given: 空文字列のclassName付きのPageContainerが用意されている
    // When: className=""でレンダリングする
    const { container } = render(
      <PageContainer className="">
        <div>コンテンツ</div>
      </PageContainer>
    )

    // Then: デフォルトのスタイルクラスが適用される
    const mainElement = container.querySelector('main')
    expect(mainElement).toHaveClass('mx-auto', 'max-w-7xl', 'px-4', 'py-6')
  })

  test('正常系：複数の子要素を受け入れる', () => {
    // Given: 複数の子要素が用意されている
    const children = (
      <>
        <div>セクション1</div>
        <div>セクション2</div>
        <div>セクション3</div>
      </>
    )

    // When: 複数の子要素でレンダリングする
    render(<PageContainer>{children}</PageContainer>)

    // Then: すべての子要素が表示される
    expect(screen.getByText('セクション1')).toBeInTheDocument()
    expect(screen.getByText('セクション2')).toBeInTheDocument()
    expect(screen.getByText('セクション3')).toBeInTheDocument()
  })

  test('正常系：複雑な子要素構造を受け入れる', () => {
    // Given: 複雑な構造の子要素が用意されている
    const children = (
      <div>
        <h1>タイトル</h1>
        <section>
          <p>段落1</p>
          <p>段落2</p>
        </section>
        <button>ボタン</button>
      </div>
    )

    // When: 複雑な子要素でレンダリングする
    render(<PageContainer>{children}</PageContainer>)

    // Then: すべての要素が表示される
    expect(screen.getByText('タイトル')).toBeInTheDocument()
    expect(screen.getByText('段落1')).toBeInTheDocument()
    expect(screen.getByText('段落2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ボタン' })).toBeInTheDocument()
  })
})
