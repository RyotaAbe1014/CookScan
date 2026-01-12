import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent } from './card'

describe('Card', () => {
  test('正常系：基本的なカードが表示される', () => {
    // Given: カードコンポーネントが用意されている
    // When: デフォルトpropsでレンダリングする
    render(<Card data-testid="card">カード内容</Card>)

    // Then: カード要素が存在する
    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()

    // Then: 内容が表示される
    expect(screen.getByText('カード内容')).toBeInTheDocument()

    // Then: 基本スタイルが適用される
    expect(card).toHaveClass('rounded-xl', 'bg-white', 'shadow-card')
  })

  test('正常系：hover=falseの時はホバーエフェクトなし', () => {
    // Given: hover=falseのカードが用意されている
    // When: hover=falseでレンダリングする
    render(
      <Card hover={false} data-testid="card">
        カード
      </Card>
    )

    // Then: ホバー用のtransitionクラスが適用されない
    const card = screen.getByTestId('card')
    expect(card).not.toHaveClass('transition-all')
  })

  test('正常系：hover=trueの時はホバーエフェクトあり', () => {
    // Given: hover=trueのカードが用意されている
    // When: hover=trueでレンダリングする
    render(
      <Card hover={true} data-testid="card">
        カード
      </Card>
    )

    // Then: ホバー用のtransitionクラスが適用される
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('transition-all')
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    render(
      <Card className="custom-card" data-testid="card">
        カスタム
      </Card>
    )

    // Then: カスタムクラスが適用される
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-card')

    // Then: デフォルトのクラスも維持される
    expect(card).toHaveClass('rounded-xl', 'bg-white')
  })
})

describe('CardHeader', () => {
  test('正常系：タイトルのみのヘッダーが表示される', () => {
    // Given: タイトルのみのヘッダーが用意されている
    // When: titleプロップでレンダリングする
    render(<CardHeader title="カードタイトル" />)

    // Then: タイトルが表示される
    const title = screen.getByRole('heading', { name: 'カードタイトル' })
    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H3')
  })

  test('正常系：アイコン付きヘッダーが表示される', () => {
    // Given: アイコンとタイトルのヘッダーが用意されている
    const icon = (
      <svg data-testid="test-icon">
        <circle cx="10" cy="10" r="5" />
      </svg>
    )

    // When: iconとtitleプロップでレンダリングする
    render(<CardHeader icon={icon} title="タイトル" />)

    // Then: アイコンが表示される
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()

    // Then: タイトルが表示される
    expect(screen.getByRole('heading', { name: 'タイトル' })).toBeInTheDocument()
  })

  test('正常系：デフォルトのiconColor（indigo）が適用される', () => {
    // Given: iconColorを指定しないヘッダーが用意されている
    const icon = <svg data-testid="icon" />

    // When: デフォルトでレンダリングする
    const { container } = render(<CardHeader icon={icon} title="タイトル" />)

    // Then: emeraldの単色クラスが適用される
    const iconWrapper = container.querySelector('.bg-emerald-600')
    expect(iconWrapper).toBeInTheDocument()
  })

  test('正常系：各iconColorの単色が適用される', () => {
    // Given: 各iconColorが用意されている
    const icon = <svg data-testid="icon" />

    // When: amber iconColorでレンダリングする
    const { container: amberContainer } = render(
      <CardHeader icon={icon} iconColor="amber" title="Amber" />
    )
    // Then: amberの単色が適用される
    expect(amberContainer.querySelector('.bg-amber-500')).toBeInTheDocument()

    // When: green iconColorでレンダリングする
    const { container: greenContainer } = render(
      <CardHeader icon={icon} iconColor="green" title="Green" />
    )
    // Then: greenの単色が適用される
    expect(greenContainer.querySelector('.bg-emerald-500')).toBeInTheDocument()

    // When: blue iconColorでレンダリングする
    const { container: blueContainer } = render(
      <CardHeader icon={icon} iconColor="blue" title="Blue" />
    )
    // Then: blueの単色が適用される
    expect(blueContainer.querySelector('.bg-sky-500')).toBeInTheDocument()

    // When: purple iconColorでレンダリングする
    const { container: purpleContainer } = render(
      <CardHeader icon={icon} iconColor="teal" title="Teal" />
    )
    // Then: tealの単色が適用される
    expect(purpleContainer.querySelector('.bg-teal-500')).toBeInTheDocument()

    // When: red iconColorでレンダリングする
    const { container: redContainer } = render(
      <CardHeader icon={icon} iconColor="red" title="Red" />
    )
    // Then: redの単色が適用される
    expect(redContainer.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  test('正常系：アクション要素が表示される', () => {
    // Given: アクション要素が用意されている
    const actions = (
      <button data-testid="action-button">アクション</button>
    )

    // When: actionsプロップでレンダリングする
    render(<CardHeader title="タイトル" actions={actions} />)

    // Then: アクションボタンが表示される
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
  })

  test('正常系：children要素をカスタムレンダリングできる', () => {
    // Given: カスタムchildren要素が用意されている
    // When: childrenプロップでレンダリングする
    render(
      <CardHeader>
        <div data-testid="custom-header">カスタムヘッダー</div>
      </CardHeader>
    )

    // Then: カスタム要素が表示される
    expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    expect(screen.getByText('カスタムヘッダー')).toBeInTheDocument()

    // Then: デフォルトのtitle要素は表示されない（childrenが優先）
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  test('正常系：すべてのプロップを組み合わせて使用できる', () => {
    // Given: すべてのプロップが用意されている
    const icon = <svg data-testid="icon" />
    const actions = <button data-testid="action">編集</button>

    // When: すべてのプロップでレンダリングする
    render(
      <CardHeader
        icon={icon}
        iconColor="green"
        title="完全なヘッダー"
        actions={actions}
      />
    )

    // Then: すべての要素が表示される
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '完全なヘッダー' })).toBeInTheDocument()
    expect(screen.getByTestId('action')).toBeInTheDocument()
  })
})

describe('CardContent', () => {
  test('正常系：デフォルトのpadding（md）で表示される', () => {
    // Given: カードコンテンツが用意されている
    // When: デフォルトpropsでレンダリングする
    render(<CardContent data-testid="content">コンテンツ</CardContent>)

    // Then: md padding用のスタイルが適用される
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('p-6')

    // Then: 内容が表示される
    expect(screen.getByText('コンテンツ')).toBeInTheDocument()
  })

  test('正常系：padding="none"でパディングなし', () => {
    // Given: padding="none"のコンテンツが用意されている
    // When: padding="none"でレンダリングする
    render(
      <CardContent padding="none" data-testid="content">
        パディングなし
      </CardContent>
    )

    // Then: パディングクラスが適用されない
    const content = screen.getByTestId('content')
    expect(content).not.toHaveClass('p-4', 'p-6', 'p-8')
  })

  test('正常系：padding="sm"のスタイルが適用される', () => {
    // Given: padding="sm"のコンテンツが用意されている
    // When: padding="sm"でレンダリングする
    render(
      <CardContent padding="sm" data-testid="content">
        小パディング
      </CardContent>
    )

    // Then: sm padding用のスタイルが適用される
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('p-4')
  })

  test('正常系：padding="lg"のスタイルが適用される', () => {
    // Given: padding="lg"のコンテンツが用意されている
    // When: padding="lg"でレンダリングする
    render(
      <CardContent padding="lg" data-testid="content">
        大パディング
      </CardContent>
    )

    // Then: lg padding用のスタイルが適用される
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('p-8')
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    render(
      <CardContent className="custom-content" data-testid="content">
        カスタム
      </CardContent>
    )

    // Then: カスタムクラスが適用される
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('custom-content')

    // Then: デフォルトのpaddingクラスも維持される
    expect(content).toHaveClass('p-6')
  })
})

describe('Card組み合わせ', () => {
  test('正常系：Card、CardHeader、CardContentを組み合わせて使用できる', () => {
    // Given: 完全なカード構造が用意されている
    const icon = <svg data-testid="card-icon" />

    // When: すべてのコンポーネントを組み合わせてレンダリングする
    render(
      <Card data-testid="full-card">
        <CardHeader
          icon={icon}
          iconColor="blue"
          title="フルカード"
          actions={<button>編集</button>}
        />
        <CardContent padding="lg">カードの本文内容</CardContent>
      </Card>
    )

    // Then: カード全体が表示される
    expect(screen.getByTestId('full-card')).toBeInTheDocument()

    // Then: ヘッダー要素が表示される
    expect(screen.getByTestId('card-icon')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'フルカード' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument()

    // Then: コンテンツが表示される
    expect(screen.getByText('カードの本文内容')).toBeInTheDocument()
  })
})
