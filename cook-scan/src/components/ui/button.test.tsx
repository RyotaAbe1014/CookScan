import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  test('正常系：デフォルトでprimary variantのボタンが表示される', () => {
    // Given: ボタンコンポーネントが用意されている
    // When: デフォルトpropsでレンダリングする
    render(<Button>クリック</Button>)

    // Then: ボタン要素が存在する
    const button = screen.getByRole('button', { name: 'クリック' })
    expect(button).toBeInTheDocument()

    // Then: デフォルトのprimary variant用スタイルが適用される
    expect(button).toHaveClass('bg-primary')
  })

  test('正常系：secondary variantのスタイルが適用される', () => {
    // Given: secondary variantのボタンが用意されている
    // When: variant="secondary"でレンダリングする
    render(<Button variant="secondary">セカンダリ</Button>)

    // Then: secondary variant用のスタイルが適用される
    const button = screen.getByRole('button', { name: 'セカンダリ' })
    expect(button).toHaveClass('border', 'bg-white', 'text-foreground')
  })

  test('正常系：ghost variantのスタイルが適用される', () => {
    // Given: ghost variantのボタンが用意されている
    // When: variant="ghost"でレンダリングする
    render(<Button variant="ghost">ゴースト</Button>)

    // Then: ghost variant用のスタイルが適用される
    const button = screen.getByRole('button', { name: 'ゴースト' })
    expect(button).toHaveClass('text-muted-foreground')
  })

  test('正常系：danger variantのスタイルが適用される', () => {
    // Given: danger variantのボタンが用意されている
    // When: variant="danger"でレンダリングする
    render(<Button variant="danger">削除</Button>)

    // Then: danger variant用のスタイルが適用される
    const button = screen.getByRole('button', { name: '削除' })
    expect(button).toHaveClass('bg-danger', 'text-danger-foreground')
  })

  test('正常系：danger-ghost variantのスタイルが適用される', () => {
    // Given: danger-ghost variantのボタンが用意されている
    // When: variant="danger-ghost"でレンダリングする
    render(<Button variant="danger-ghost">削除</Button>)

    // Then: danger-ghost variant用のスタイルが適用される
    const button = screen.getByRole('button', { name: '削除' })
    expect(button).toHaveClass('text-danger')
  })

  test('正常系：link variantのスタイルが適用される', () => {
    // Given: link variantのボタンが用意されている
    // When: variant="link"でレンダリングする
    render(<Button variant="link">リンク</Button>)

    // Then: link variant用のスタイルが適用される
    const button = screen.getByRole('button', { name: 'リンク' })
    expect(button).toHaveClass('text-primary', 'underline-offset-4')
  })

  test('正常系：sm sizeのスタイルが適用される', () => {
    // Given: sm sizeのボタンが用意されている
    // When: size="sm"でレンダリングする
    render(<Button size="sm">小</Button>)

    // Then: sm size用のスタイルが適用される
    const button = screen.getByRole('button', { name: '小' })
    expect(button).toHaveClass('h-8', 'px-3', 'text-xs')
  })

  test('正常系：md sizeのスタイルが適用される', () => {
    // Given: md sizeのボタンが用意されている
    // When: size="md"（デフォルト）でレンダリングする
    render(<Button size="md">中</Button>)

    // Then: md size用のスタイルが適用される
    const button = screen.getByRole('button', { name: '中' })
    expect(button).toHaveClass('h-10', 'px-4', 'text-sm')
  })

  test('正常系：lg sizeのスタイルが適用される', () => {
    // Given: lg sizeのボタンが用意されている
    // When: size="lg"でレンダリングする
    render(<Button size="lg">大</Button>)

    // Then: lg size用のスタイルが適用される
    const button = screen.getByRole('button', { name: '大' })
    expect(button).toHaveClass('h-12', 'px-6', 'text-base')
  })

  test('正常系：icon sizeのスタイルが適用される', () => {
    // Given: icon sizeのボタンが用意されている
    // When: size="icon"でレンダリングする
    render(<Button size="icon">i</Button>)

    // Then: icon size用のスタイルが適用される
    const button = screen.getByRole('button', { name: 'i' })
    expect(button).toHaveClass('h-10', 'w-10')
  })

  test('正常系：クリックイベントが発火する', async () => {
    // Given: クリックハンドラーが用意されている
    const user = userEvent.setup()
    const handleClick = vi.fn()

    // When: ボタンをクリックする
    render(<Button onClick={handleClick}>クリック</Button>)
    const button = screen.getByRole('button', { name: 'クリック' })
    await user.click(button)

    // Then: クリックハンドラーが1回呼ばれる
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('正常系：disabled状態でクリックできない', async () => {
    // Given: disabledなボタンとクリックハンドラーが用意されている
    const user = userEvent.setup()
    const handleClick = vi.fn()

    // When: disabled状態のボタンをクリックしようとする
    render(
      <Button disabled onClick={handleClick}>
        無効
      </Button>
    )
    const button = screen.getByRole('button', { name: '無効' })
    await user.click(button)

    // Then: ボタンがdisabledになっている
    expect(button).toBeDisabled()

    // Then: クリックハンドラーが呼ばれない
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('正常系：isLoading時にスピナーが表示される', () => {
    // Given: isLoadingプロップが用意されている
    // When: isLoading=trueでレンダリングする
    const { container } = render(<Button isLoading>読み込み中</Button>)

    // Then: スピナーSVGが表示される
    const spinner = container.querySelector('svg.animate-spin')
    expect(spinner).toBeInTheDocument()

    // Then: ボタンテキストも表示される
    expect(screen.getByText('読み込み中')).toBeInTheDocument()
  })

  test('正常系：isLoading時にボタンがdisabledになる', async () => {
    // Given: isLoadingなボタンとクリックハンドラーが用意されている
    const user = userEvent.setup()
    const handleClick = vi.fn()

    // When: isLoading=trueのボタンをクリックしようとする
    render(
      <Button isLoading onClick={handleClick}>
        読み込み中
      </Button>
    )
    const button = screen.getByRole('button', { name: '読み込み中' })
    await user.click(button)

    // Then: ボタンがdisabledになっている
    expect(button).toBeDisabled()

    // Then: クリックハンドラーが呼ばれない
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('正常系：isLoading=falseの時はスピナーが表示されない', () => {
    // Given: isLoading=falseのボタンが用意されている
    // When: isLoading=falseでレンダリングする
    const { container } = render(<Button isLoading={false}>通常</Button>)

    // Then: スピナーSVGが表示されない
    const spinner = container.querySelector('svg.animate-spin')
    expect(spinner).not.toBeInTheDocument()
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    render(<Button className="custom-button">カスタム</Button>)

    // Then: カスタムクラスが適用される
    const button = screen.getByRole('button', { name: 'カスタム' })
    expect(button).toHaveClass('custom-button')

    // Then: デフォルトのクラスも維持される
    expect(button).toHaveClass('bg-primary')
  })

  test('正常系：複数のpropsを組み合わせて使用できる', () => {
    // Given: 複数のpropsが用意されている
    // When: variant、size、classNameを組み合わせてレンダリングする
    render(
      <Button variant="secondary" size="lg" className="mt-4">
        組み合わせ
      </Button>
    )

    // Then: すべてのスタイルが適用される
    const button = screen.getByRole('button', { name: '組み合わせ' })
    expect(button).toHaveClass('bg-white') // variant
    expect(button).toHaveClass('h-12', 'px-6') // size
    expect(button).toHaveClass('mt-4') // custom
  })
})
