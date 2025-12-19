import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Select } from './select'

describe('Select', () => {
  test('正常系：デフォルトのセレクトが表示される', () => {
    // Given: セレクトコンポーネントが用意されている
    // When: デフォルトpropsでレンダリングする
    render(
      <Select>
        <option value="">選択してください</option>
        <option value="1">オプション1</option>
        <option value="2">オプション2</option>
      </Select>
    )

    // Then: セレクト要素が存在する
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()

    // Then: デフォルトのvariant（default）スタイルが適用される
    expect(select).toHaveClass('focus:border-indigo-500', 'focus:ring-indigo-500/20')

    // Then: デフォルトのsize（xl）スタイルが適用される
    expect(select).toHaveClass('px-4', 'py-3')
  })

  test('正常系：選択肢が表示される', () => {
    // Given: 選択肢付きセレクトが用意されている
    // When: option要素を含めてレンダリングする
    render(
      <Select>
        <option value="">選択</option>
        <option value="apple">りんご</option>
        <option value="banana">バナナ</option>
        <option value="orange">オレンジ</option>
      </Select>
    )

    // Then: すべてのオプションが存在する
    expect(screen.getByRole('option', { name: '選択' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'りんご' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'バナナ' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'オレンジ' })).toBeInTheDocument()
  })

  test('正常系：variant="default"のスタイルが適用される', () => {
    // Given: variant="default"のセレクトが用意されている
    // When: variant="default"でレンダリングする
    render(
      <Select variant="default">
        <option>デフォルト</option>
      </Select>
    )

    // Then: defaultスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('focus:border-indigo-500', 'focus:ring-indigo-500/20')
  })

  test('正常系：variant="green"のスタイルが適用される', () => {
    // Given: variant="green"のセレクトが用意されている
    // When: variant="green"でレンダリングする
    render(
      <Select variant="green">
        <option>グリーン</option>
      </Select>
    )

    // Then: greenスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('focus:border-green-500', 'focus:ring-green-500/20')
  })

  test('正常系：variant="blue"のスタイルが適用される', () => {
    // Given: variant="blue"のセレクトが用意されている
    // When: variant="blue"でレンダリングする
    render(
      <Select variant="blue">
        <option>ブルー</option>
      </Select>
    )

    // Then: blueスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('focus:border-blue-500', 'focus:ring-blue-500/20')
  })

  test('正常系：size="sm"のスタイルが適用される', () => {
    // Given: size="sm"のセレクトが用意されている
    // When: size="sm"でレンダリングする
    render(
      <Select size="sm">
        <option>小</option>
      </Select>
    )

    // Then: smサイズのスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('px-2', 'py-1', 'text-sm')
  })

  test('正常系：size="md"のスタイルが適用される', () => {
    // Given: size="md"のセレクトが用意されている
    // When: size="md"でレンダリングする
    render(
      <Select size="md">
        <option>中</option>
      </Select>
    )

    // Then: mdサイズのスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('px-3', 'py-2', 'text-sm')
  })

  test('正常系：size="lg"のスタイルが適用される', () => {
    // Given: size="lg"のセレクトが用意されている
    // When: size="lg"でレンダリングする
    render(
      <Select size="lg">
        <option>大</option>
      </Select>
    )

    // Then: lgサイズのスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('px-4', 'py-2.5', 'sm:text-sm')
  })

  test('正常系：size="xl"のスタイルが適用される', () => {
    // Given: size="xl"のセレクトが用意されている
    // When: size="xl"（デフォルト）でレンダリングする
    render(
      <Select size="xl">
        <option>特大</option>
      </Select>
    )

    // Then: xlサイズのスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('px-4', 'py-3')
  })

  test('正常系：ユーザーがオプションを選択できる', async () => {
    // Given: セレクトが用意されている
    const user = userEvent.setup()

    // When: オプションを選択する
    render(
      <Select>
        <option value="">選択</option>
        <option value="red">赤</option>
        <option value="blue">青</option>
      </Select>
    )
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'red')

    // Then: 選択した値が反映される
    expect(select).toHaveValue('red')
  })

  test('正常系：onChange イベントが発火する', async () => {
    // Given: onChangeハンドラーが用意されている
    const user = userEvent.setup()
    const handleChange = vi.fn()

    // When: オプションを選択する
    render(
      <Select onChange={handleChange}>
        <option value="">選択</option>
        <option value="1">オプション1</option>
      </Select>
    )
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, '1')

    // Then: onChangeが呼ばれる
    expect(handleChange).toHaveBeenCalled()
  })

  test('正常系：disabled状態で選択できない', async () => {
    // Given: disabled状態のセレクトが用意されている
    const user = userEvent.setup()

    // When: disabled状態のセレクトで選択しようとする
    render(
      <Select disabled>
        <option value="">選択</option>
        <option value="1">オプション1</option>
      </Select>
    )
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, '1')

    // Then: セレクトがdisabledになっている
    expect(select).toBeDisabled()

    // Then: 値が変更されない
    expect(select).toHaveValue('')
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    render(
      <Select className="custom-select">
        <option>カスタム</option>
      </Select>
    )

    // Then: カスタムクラスが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('custom-select')

    // Then: デフォルトのクラスも維持される
    expect(select).toHaveClass('rounded-lg', 'border')
  })

  test('正常系：複数のpropsを組み合わせて使用できる', () => {
    // Given: 複数のpropsが用意されている
    // When: variant、size、classNameを組み合わせてレンダリングする
    render(
      <Select variant="green" size="sm" className="mt-2">
        <option>組み合わせ</option>
      </Select>
    )

    // Then: すべてのスタイルが適用される
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('focus:border-green-500') // variant
    expect(select).toHaveClass('px-2', 'py-1') // size
    expect(select).toHaveClass('mt-2') // custom
  })

  test('正常系：制御コンポーネントとして使用できる', async () => {
    // Given: 制御されたセレクトが用意されている
    const user = userEvent.setup()
    const TestComponent = () => {
      const [value, setValue] = React.useState('')
      return (
        <Select value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">未選択</option>
          <option value="a">A</option>
          <option value="b">B</option>
        </Select>
      )
    }

    // When: オプションを選択する
    render(<TestComponent />)
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'a')

    // Then: 値が制御される
    expect(select).toHaveValue('a')
  })

  test('正常系：デフォルト値が設定される', () => {
    // Given: defaultValue付きセレクトが用意されている
    // When: defaultValueでレンダリングする
    render(
      <Select defaultValue="default">
        <option value="">選択</option>
        <option value="default">デフォルト</option>
        <option value="other">その他</option>
      </Select>
    )

    // Then: デフォルト値が選択される
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('default')
  })

  test('正常系：aria-labelが適用される', () => {
    // Given: aria-label付きセレクトが用意されている
    // When: aria-labelでレンダリングする
    render(
      <Select aria-label="カテゴリ選択">
        <option value="1">カテゴリ1</option>
      </Select>
    )

    // Then: aria-labelでアクセスできる
    const select = screen.getByRole('combobox', { name: 'カテゴリ選択' })
    expect(select).toBeInTheDocument()
  })
})
