import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Textarea } from './textarea'

describe('Textarea', () => {
  test('正常系：デフォルトのテキストエリアが表示される', () => {
    // Given: テキストエリアコンポーネントが用意されている
    // When: デフォルトpropsでレンダリングする
    render(<Textarea placeholder="入力してください" />)

    // Then: テキストエリア要素が存在する
    const textarea = screen.getByPlaceholderText('入力してください')
    expect(textarea).toBeInTheDocument()

    // Then: デフォルトのvariant（default）スタイルが適用される
    expect(textarea).toHaveClass('focus:border-indigo-500', 'focus:ring-indigo-500/20')

    // Then: デフォルトのsize（lg）スタイルが適用される
    expect(textarea).toHaveClass('px-4', 'py-2.5')
  })

  test('正常系：variant="default"のスタイルが適用される', () => {
    // Given: variant="default"のテキストエリアが用意されている
    // When: variant="default"でレンダリングする
    render(<Textarea variant="default" placeholder="デフォルト" />)

    // Then: defaultスタイルが適用される
    const textarea = screen.getByPlaceholderText('デフォルト')
    expect(textarea).toHaveClass('focus:border-indigo-500', 'focus:ring-indigo-500/20')
  })

  test('正常系：variant="green"のスタイルが適用される', () => {
    // Given: variant="green"のテキストエリアが用意されている
    // When: variant="green"でレンダリングする
    render(<Textarea variant="green" placeholder="グリーン" />)

    // Then: greenスタイルが適用される
    const textarea = screen.getByPlaceholderText('グリーン')
    expect(textarea).toHaveClass('focus:border-green-500', 'focus:ring-green-500/20')
  })

  test('正常系：variant="blue"のスタイルが適用される', () => {
    // Given: variant="blue"のテキストエリアが用意されている
    // When: variant="blue"でレンダリングする
    render(<Textarea variant="blue" placeholder="ブルー" />)

    // Then: blueスタイルが適用される
    const textarea = screen.getByPlaceholderText('ブルー')
    expect(textarea).toHaveClass('focus:border-blue-500', 'focus:ring-blue-500/20')
  })

  test('正常系：size="sm"のスタイルが適用される', () => {
    // Given: size="sm"のテキストエリアが用意されている
    // When: size="sm"でレンダリングする
    render(<Textarea size="sm" placeholder="小" />)

    // Then: smサイズのスタイルが適用される
    const textarea = screen.getByPlaceholderText('小')
    expect(textarea).toHaveClass('px-2', 'py-1', 'text-sm')
  })

  test('正常系：size="md"のスタイルが適用される', () => {
    // Given: size="md"のテキストエリアが用意されている
    // When: size="md"でレンダリングする
    render(<Textarea size="md" placeholder="中" />)

    // Then: mdサイズのスタイルが適用される
    const textarea = screen.getByPlaceholderText('中')
    expect(textarea).toHaveClass('px-3', 'py-2', 'text-sm')
  })

  test('正常系：size="lg"のスタイルが適用される', () => {
    // Given: size="lg"のテキストエリアが用意されている
    // When: size="lg"（デフォルト）でレンダリングする
    render(<Textarea size="lg" placeholder="大" />)

    // Then: lgサイズのスタイルが適用される
    const textarea = screen.getByPlaceholderText('大')
    expect(textarea).toHaveClass('px-4', 'py-2.5', 'sm:text-sm')
  })

  test('正常系：size="xl"のスタイルが適用される', () => {
    // Given: size="xl"のテキストエリアが用意されている
    // When: size="xl"でレンダリングする
    render(<Textarea size="xl" placeholder="特大" />)

    // Then: xlサイズのスタイルが適用される
    const textarea = screen.getByPlaceholderText('特大')
    expect(textarea).toHaveClass('px-4', 'py-3')
  })

  test('正常系：ユーザーがテキストを入力できる', async () => {
    // Given: テキストエリアが用意されている
    const user = userEvent.setup()

    // When: テキストを入力する
    render(<Textarea placeholder="入力" />)
    const textarea = screen.getByPlaceholderText('入力')
    await user.type(textarea, 'Hello World')

    // Then: 入力値が反映される
    expect(textarea).toHaveValue('Hello World')
  })

  test('正常系：複数行のテキストを入力できる', async () => {
    // Given: テキストエリアが用意されている
    const user = userEvent.setup()

    // When: 複数行のテキストを入力する
    render(<Textarea placeholder="複数行" />)
    const textarea = screen.getByPlaceholderText('複数行')
    await user.type(textarea, '1行目{Enter}2行目{Enter}3行目')

    // Then: 複数行の入力値が反映される
    expect(textarea).toHaveValue('1行目\n2行目\n3行目')
  })

  test('正常系：onChange イベントが発火する', async () => {
    // Given: onChangeハンドラーが用意されている
    const user = userEvent.setup()
    const handleChange = vi.fn()

    // When: テキストを入力する
    render(<Textarea onChange={handleChange} placeholder="変更" />)
    const textarea = screen.getByPlaceholderText('変更')
    await user.type(textarea, 'a')

    // Then: onChangeが呼ばれる
    expect(handleChange).toHaveBeenCalled()
  })

  test('正常系：disabled状態で入力できない', async () => {
    // Given: disabled状態のテキストエリアが用意されている
    const user = userEvent.setup()

    // When: disabled状態のテキストエリアに入力しようとする
    render(<Textarea disabled placeholder="無効" />)
    const textarea = screen.getByPlaceholderText('無効')
    await user.type(textarea, 'test')

    // Then: テキストエリアがdisabledになっている
    expect(textarea).toBeDisabled()

    // Then: 値が入力されない
    expect(textarea).toHaveValue('')
  })

  test('正常系：rows属性が適用される', () => {
    // Given: rows属性が指定されたテキストエリアが用意されている
    // When: rows=5でレンダリングする
    render(<Textarea rows={5} placeholder="5行" />)

    // Then: rows属性が適用される
    const textarea = screen.getByPlaceholderText('5行')
    expect(textarea).toHaveAttribute('rows', '5')
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    render(<Textarea className="custom-textarea" placeholder="カスタム" />)

    // Then: カスタムクラスが適用される
    const textarea = screen.getByPlaceholderText('カスタム')
    expect(textarea).toHaveClass('custom-textarea')

    // Then: デフォルトのクラスも維持される
    expect(textarea).toHaveClass('rounded-lg', 'border')
  })

  test('正常系：複数のpropsを組み合わせて使用できる', () => {
    // Given: 複数のpropsが用意されている
    // When: variant、size、classNameを組み合わせてレンダリングする
    render(
      <Textarea
        variant="green"
        size="sm"
        className="mt-2"
        placeholder="組み合わせ"
      />
    )

    // Then: すべてのスタイルが適用される
    const textarea = screen.getByPlaceholderText('組み合わせ')
    expect(textarea).toHaveClass('focus:border-green-500') // variant
    expect(textarea).toHaveClass('px-2', 'py-1') // size
    expect(textarea).toHaveClass('mt-2') // custom
  })

  test('正常系：制御コンポーネントとして使用できる', async () => {
    // Given: 制御されたテキストエリアが用意されている
    const user = userEvent.setup()
    const TestComponent = () => {
      const [value, setValue] = React.useState('')
      return (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="制御"
        />
      )
    }

    // When: テキストを入力する
    render(<TestComponent />)
    const textarea = screen.getByPlaceholderText('制御')
    await user.type(textarea, 'Controlled')

    // Then: 値が制御される
    expect(textarea).toHaveValue('Controlled')
  })

  test('正常系：maxLength属性が適用される', async () => {
    // Given: maxLength付きテキストエリアが用意されている
    const user = userEvent.setup()

    // When: maxLength=10でレンダリングして11文字入力しようとする
    render(<Textarea maxLength={10} placeholder="最大10文字" />)
    const textarea = screen.getByPlaceholderText('最大10文字')
    await user.type(textarea, '12345678901')

    // Then: maxLength属性が適用される
    expect(textarea).toHaveAttribute('maxLength', '10')

    // Then: 10文字までしか入力されない
    expect(textarea).toHaveValue('1234567890')
  })

  test('正常系：aria-labelが適用される', () => {
    // Given: aria-label付きテキストエリアが用意されている
    // When: aria-labelでレンダリングする
    render(<Textarea aria-label="コメント入力" />)

    // Then: aria-labelでアクセスできる
    const textarea = screen.getByRole('textbox', { name: 'コメント入力' })
    expect(textarea).toBeInTheDocument()
  })

  test('正常系：readOnly状態で入力できない', async () => {
    // Given: readOnly状態のテキストエリアが用意されている
    const user = userEvent.setup()

    // When: readOnly状態のテキストエリアに入力しようとする
    render(<Textarea readOnly defaultValue="読み取り専用" />)
    const textarea = screen.getByDisplayValue('読み取り専用')
    await user.type(textarea, 'test')

    // Then: 値が変更されない
    expect(textarea).toHaveValue('読み取り専用')
  })

  test('正常系：defaultValueが設定される', () => {
    // Given: defaultValue付きテキストエリアが用意されている
    // When: defaultValueでレンダリングする
    render(<Textarea defaultValue="初期値" />)

    // Then: デフォルト値が設定される
    const textarea = screen.getByDisplayValue('初期値')
    expect(textarea).toHaveValue('初期値')
  })
})
