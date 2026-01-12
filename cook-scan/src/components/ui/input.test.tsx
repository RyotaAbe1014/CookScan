import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Input } from './input'

describe('Input', () => {
  test('正常系：デフォルトのインプットが表示される', () => {
    // Given: インプットコンポーネントが用意されている
    // When: デフォルトpropsでレンダリングする
    render(<Input placeholder="入力してください" />)

    // Then: インプット要素が存在する
    const input = screen.getByPlaceholderText('入力してください')
    expect(input).toBeInTheDocument()

    // Then: デフォルトのvariant（default）スタイルが適用される
    expect(input).toHaveClass('focus:border-primary', 'focus:ring-primary/20')

    // Then: デフォルトのsize（lg）スタイルが適用される
    expect(input).toHaveClass('px-4', 'py-2.5')
  })

  test('正常系：variant="default"のスタイルが適用される', () => {
    // Given: variant="default"のインプットが用意されている
    // When: variant="default"でレンダリングする
    render(<Input variant="default" placeholder="デフォルト" />)

    // Then: defaultスタイルが適用される
    const input = screen.getByPlaceholderText('デフォルト')
    expect(input).toHaveClass('focus:border-primary', 'focus:ring-primary/20')
  })

  test('正常系：variant="green"のスタイルが適用される', () => {
    // Given: variant="green"のインプットが用意されている
    // When: variant="green"でレンダリングする
    render(<Input variant="green" placeholder="グリーン" />)

    // Then: greenスタイルが適用される
    const input = screen.getByPlaceholderText('グリーン')
    expect(input).toHaveClass('focus:border-accent-ingredients', 'focus:ring-accent-ingredients/20')
  })

  test('正常系：variant="blue"のスタイルが適用される', () => {
    // Given: variant="blue"のインプットが用意されている
    // When: variant="blue"でレンダリングする
    render(<Input variant="blue" placeholder="ブルー" />)

    // Then: blueスタイルが適用される
    const input = screen.getByPlaceholderText('ブルー')
    expect(input).toHaveClass('focus:border-accent-steps', 'focus:ring-accent-steps/20')
  })

  test('正常系：variant="disabled"のスタイルが適用される', () => {
    // Given: variant="disabled"のインプットが用意されている
    // When: variant="disabled"でレンダリングする
    render(<Input variant="disabled" placeholder="無効" />)

    // Then: disabledスタイルが適用される
    const input = screen.getByPlaceholderText('無効')
    expect(input).toHaveClass('border-border', 'bg-muted', 'text-muted-foreground')
  })

  test('正常系：size="sm"のスタイルが適用される', () => {
    // Given: size="sm"のインプットが用意されている
    // When: size="sm"でレンダリングする
    render(<Input size="sm" placeholder="小" />)

    // Then: smサイズのスタイルが適用される
    const input = screen.getByPlaceholderText('小')
    expect(input).toHaveClass('px-2', 'py-1', 'text-sm')
  })

  test('正常系：size="md"のスタイルが適用される', () => {
    // Given: size="md"のインプットが用意されている
    // When: size="md"でレンダリングする
    render(<Input size="md" placeholder="中" />)

    // Then: mdサイズのスタイルが適用される
    const input = screen.getByPlaceholderText('中')
    expect(input).toHaveClass('px-3', 'py-2', 'text-sm')
  })

  test('正常系：size="lg"のスタイルが適用される', () => {
    // Given: size="lg"のインプットが用意されている
    // When: size="lg"（デフォルト）でレンダリングする
    render(<Input size="lg" placeholder="大" />)

    // Then: lgサイズのスタイルが適用される
    const input = screen.getByPlaceholderText('大')
    expect(input).toHaveClass('px-4', 'py-2.5', 'text-sm')
  })

  test('正常系：size="xl"のスタイルが適用される', () => {
    // Given: size="xl"のインプットが用意されている
    // When: size="xl"でレンダリングする
    render(<Input size="xl" placeholder="特大" />)

    // Then: xlサイズのスタイルが適用される
    const input = screen.getByPlaceholderText('特大')
    expect(input).toHaveClass('px-4', 'py-3')
  })

  test('正常系：hasIcon=trueでアイコン用パディングが追加される', () => {
    // Given: hasIcon=trueのインプットが用意されている
    // When: hasIcon=trueでレンダリングする
    render(<Input hasIcon placeholder="アイコン付き" />)

    // Then: 左パディングが追加される
    const input = screen.getByPlaceholderText('アイコン付き')
    expect(input).toHaveClass('pl-10')
  })

  test('正常系：hasIcon=falseでアイコン用パディングが追加されない', () => {
    // Given: hasIcon=falseのインプットが用意されている
    // When: hasIcon=falseでレンダリングする
    render(<Input hasIcon={false} placeholder="通常" />)

    // Then: 左パディングが追加されない
    const input = screen.getByPlaceholderText('通常')
    expect(input).not.toHaveClass('pl-10')
  })

  test('正常系：ユーザーがテキストを入力できる', async () => {
    // Given: インプットが用意されている
    const user = userEvent.setup()

    // When: テキストを入力する
    render(<Input placeholder="入力" />)
    const input = screen.getByPlaceholderText('入力')
    await user.type(input, 'Hello World')

    // Then: 入力値が反映される
    expect(input).toHaveValue('Hello World')
  })

  test('正常系：onChange イベントが発火する', async () => {
    // Given: onChangeハンドラーが用意されている
    const user = userEvent.setup()
    const handleChange = vi.fn()

    // When: テキストを入力する
    render(<Input onChange={handleChange} placeholder="変更" />)
    const input = screen.getByPlaceholderText('変更')
    await user.type(input, 'a')

    // Then: onChangeが呼ばれる
    expect(handleChange).toHaveBeenCalled()
  })

  test('正常系：disabled状態で入力できない', async () => {
    // Given: disabled状態のインプットが用意されている
    const user = userEvent.setup()

    // When: disabled状態のインプットに入力しようとする
    render(<Input disabled placeholder="無効" />)
    const input = screen.getByPlaceholderText('無効')
    await user.type(input, 'test')

    // Then: インプットがdisabledになっている
    expect(input).toBeDisabled()

    // Then: 値が入力されない
    expect(input).toHaveValue('')
  })

  test('正常系：type属性が適用される', () => {
    // Given: type属性が指定されたインプットが用意されている
    // When: type="email"でレンダリングする
    render(<Input type="email" placeholder="メール" />)

    // Then: email typeが適用される
    const input = screen.getByPlaceholderText('メール')
    expect(input).toHaveAttribute('type', 'email')
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    render(<Input className="custom-input" placeholder="カスタム" />)

    // Then: カスタムクラスが適用される
    const input = screen.getByPlaceholderText('カスタム')
    expect(input).toHaveClass('custom-input')

    // Then: デフォルトのクラスも維持される
    expect(input).toHaveClass('rounded-md', 'border')
  })

  test('正常系：複数のpropsを組み合わせて使用できる', () => {
    // Given: 複数のpropsが用意されている
    // When: variant、size、hasIcon、classNameを組み合わせてレンダリングする
    render(
      <Input
        variant="green"
        size="sm"
        hasIcon
        className="mt-2"
        placeholder="組み合わせ"
      />
    )

    // Then: すべてのスタイルが適用される
    const input = screen.getByPlaceholderText('組み合わせ')
    expect(input).toHaveClass('focus:border-accent-ingredients') // variant
    expect(input).toHaveClass('px-2', 'py-1') // size
    expect(input).toHaveClass('pl-10') // hasIcon
    expect(input).toHaveClass('mt-2') // custom
  })

  test('正常系：制御コンポーネントとして使用できる', async () => {
    // Given: 制御されたインプットが用意されている
    const user = userEvent.setup()
    const TestComponent = () => {
      const [value, setValue] = React.useState('')
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="制御"
        />
      )
    }

    // When: テキストを入力する
    render(<TestComponent />)
    const input = screen.getByPlaceholderText('制御')
    await user.type(input, 'Controlled')

    // Then: 値が制御される
    expect(input).toHaveValue('Controlled')
  })
})
