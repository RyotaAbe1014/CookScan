import { render, screen } from '@testing-library/react'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  test('正常系：アイコン、タイトル、説明文が表示される', () => {
    // Given: EmptyStateコンポーネントが用意されている
    const icon = <svg data-testid="test-icon" />
    const title = 'データがありません'
    const description = 'まだデータが登録されていません'

    // When: 必須プロパティでレンダリングする
    render(<EmptyState icon={icon} title={title} description={description} />)

    // Then: アイコンが表示される
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()

    // Then: タイトルが表示される
    expect(screen.getByText(title)).toBeInTheDocument()

    // Then: 説明文が表示される
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  test('正常系：アクションが提供された場合、表示される', () => {
    // Given: アクション付きのEmptyStateが用意されている
    const icon = <svg data-testid="test-icon" />
    const action = <button>新規作成</button>

    // When: action propsを渡してレンダリングする
    render(<EmptyState icon={icon} title="タイトル" description="説明" action={action} />)

    // Then: アクションボタンが表示される
    expect(screen.getByRole('button', { name: '新規作成' })).toBeInTheDocument()
  })

  test('正常系：アクションが提供されない場合、表示されない', () => {
    // Given: アクションなしのEmptyStateが用意されている
    const icon = <svg data-testid="test-icon" />

    // When: actionなしでレンダリングする
    render(<EmptyState icon={icon} title="タイトル" description="説明" />)

    // Then: アクションボタンが表示されない
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('正常系：複雑なアクション要素を受け入れる', () => {
    // Given: 複数のボタンを含むアクションが用意されている
    const icon = <svg data-testid="test-icon" />
    const action = (
      <div>
        <button>ボタン1</button>
        <button>ボタン2</button>
      </div>
    )

    // When: 複雑なactionを渡してレンダリングする
    render(<EmptyState icon={icon} title="タイトル" description="説明" action={action} />)

    // Then: 両方のボタンが表示される
    expect(screen.getByRole('button', { name: 'ボタン1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ボタン2' })).toBeInTheDocument()
  })

  test('正常系：適切なスタイルクラスが適用される', () => {
    // Given: EmptyStateコンポーネントが用意されている
    const icon = <svg data-testid="test-icon" />

    // When: レンダリングする
    const { container } = render(<EmptyState icon={icon} title="タイトル" description="説明" />)

    // Then: メインコンテナに適切なスタイルが適用される
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('rounded-xl', 'bg-white', 'p-12', 'text-center', 'shadow-lg')
  })
})
