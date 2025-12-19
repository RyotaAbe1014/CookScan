import { render, screen } from '@testing-library/react'
import { FormField } from './form-field'

describe('FormField', () => {
  test('正常系：基本的なフォームフィールドが表示される', () => {
    // Given: フォームフィールドが用意されている
    // When: labelとchildrenでレンダリングする
    render(
      <FormField label="ユーザー名">
        <input type="text" />
      </FormField>
    )

    // Then: ラベルが表示される
    expect(screen.getByText('ユーザー名')).toBeInTheDocument()

    // Then: 入力要素が表示される
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('正常系：htmlFor属性でlabelとinputが関連付けられる', () => {
    // Given: htmlForが指定されたフォームフィールドが用意されている
    // When: htmlFor propでレンダリングする
    render(
      <FormField label="メールアドレス" htmlFor="email-input">
        <input type="email" id="email-input" />
      </FormField>
    )

    // Then: labelのfor属性が設定される
    const label = screen.getByText('メールアドレス')
    expect(label).toHaveAttribute('for', 'email-input')

    // Then: getByLabelTextでinputを取得できる（アクセシビリティ確認）
    const input = screen.getByLabelText('メールアドレス')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'email-input')
  })

  test('正常系：required=trueで必須マーク（*）が表示される', () => {
    // Given: required=trueのフォームフィールドが用意されている
    // When: required=trueでレンダリングする
    render(
      <FormField label="パスワード" required>
        <input type="password" />
      </FormField>
    )

    // Then: ラベルが表示される
    expect(screen.getByText('パスワード')).toBeInTheDocument()

    // Then: 必須マーク（*）が表示される
    const asterisk = screen.getByText('*')
    expect(asterisk).toBeInTheDocument()
    expect(asterisk).toHaveClass('text-red-500')
  })

  test('正常系：required=falseで必須マークが表示されない', () => {
    // Given: required=falseのフォームフィールドが用意されている
    // When: required=falseでレンダリングする
    render(
      <FormField label="任意項目" required={false}>
        <input type="text" />
      </FormField>
    )

    // Then: 必須マークが表示されない
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  test('正常系：アイコンが表示される', () => {
    // Given: アイコン付きフォームフィールドが用意されている
    const icon = (
      <svg data-testid="field-icon">
        <circle cx="5" cy="5" r="3" />
      </svg>
    )

    // When: iconプロップでレンダリングする
    render(
      <FormField label="検索" icon={icon}>
        <input type="search" />
      </FormField>
    )

    // Then: アイコンが表示される
    expect(screen.getByTestId('field-icon')).toBeInTheDocument()
  })

  test('正常系：デフォルトのiconColorClass（indigo）が適用される', () => {
    // Given: iconColorClassを指定しないフィールドが用意されている
    const icon = <svg data-testid="icon" />

    // When: デフォルトでレンダリングする
    const { container } = render(
      <FormField label="フィールド" icon={icon}>
        <input type="text" />
      </FormField>
    )

    // Then: デフォルトのindigoカラーが適用される
    const iconSpan = container.querySelector('span.text-indigo-600')
    expect(iconSpan).toBeInTheDocument()
  })

  test('正常系：カスタムiconColorClassが適用される', () => {
    // Given: カスタムiconColorClassが用意されている
    const icon = <svg data-testid="icon" />

    // When: iconColorClassプロップでレンダリングする
    const { container } = render(
      <FormField label="フィールド" icon={icon} iconColorClass="text-green-600">
        <input type="text" />
      </FormField>
    )

    // Then: カスタムカラーが適用される
    const iconSpan = container.querySelector('span.text-green-600')
    expect(iconSpan).toBeInTheDocument()
  })

  test('正常系：labelVariant="default"のスタイルが適用される', () => {
    // Given: labelVariant="default"のフィールドが用意されている
    // When: labelVariant="default"でレンダリングする
    render(
      <FormField label="デフォルト" labelVariant="default">
        <input type="text" />
      </FormField>
    )

    // Then: defaultスタイルが適用される
    const label = screen.getByText('デフォルト')
    expect(label).toHaveClass('mb-2', 'text-sm', 'font-medium')
  })

  test('正常系：labelVariant="semibold"のスタイルが適用される', () => {
    // Given: labelVariant="semibold"のフィールドが用意されている
    // When: labelVariant="semibold"でレンダリングする
    render(
      <FormField label="セミボールド" labelVariant="semibold">
        <input type="text" />
      </FormField>
    )

    // Then: semiboldスタイルが適用される
    const label = screen.getByText('セミボールド')
    expect(label).toHaveClass('mb-2', 'font-semibold', 'text-gray-900')
  })

  test('正常系：labelVariant="compact"のスタイルが適用される', () => {
    // Given: labelVariant="compact"のフィールドが用意されている
    // When: labelVariant="compact"でレンダリングする
    render(
      <FormField label="コンパクト" labelVariant="compact">
        <input type="text" />
      </FormField>
    )

    // Then: compactスタイルが適用される
    const label = screen.getByText('コンパクト')
    expect(label).toHaveClass('text-xs', 'mb-1')
  })

  test('正常系：カスタムclassNameがコンテナに適用される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    const { container } = render(
      <FormField label="カスタム" className="mt-4 custom-field">
        <input type="text" />
      </FormField>
    )

    // Then: カスタムクラスがコンテナdivに適用される
    const fieldContainer = container.firstChild
    expect(fieldContainer).toHaveClass('mt-4', 'custom-field')
  })

  test('正常系：複数のchildrenが表示される', () => {
    // Given: 複数の子要素が用意されている
    // When: 複数のchildrenでレンダリングする
    render(
      <FormField label="複数入力">
        <input type="text" placeholder="姓" />
        <input type="text" placeholder="名" />
      </FormField>
    )

    // Then: すべての子要素が表示される
    expect(screen.getByPlaceholderText('姓')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('名')).toBeInTheDocument()
  })

  test('正常系：すべてのプロップを組み合わせて使用できる', () => {
    // Given: すべてのプロップが用意されている
    const icon = <svg data-testid="full-icon" />

    // When: すべてのプロップでレンダリングする
    render(
      <FormField
        label="完全なフィールド"
        htmlFor="full-input"
        required
        icon={icon}
        iconColorClass="text-purple-600"
        labelVariant="semibold"
        className="my-4"
      >
        <input type="text" id="full-input" />
      </FormField>
    )

    // Then: すべての要素が正しく表示される
    expect(screen.getByText('完全なフィールド')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument() // required
    expect(screen.getByTestId('full-icon')).toBeInTheDocument() // icon
    expect(screen.getByLabelText('完全なフィールド*')).toBeInTheDocument() // htmlFor関連付け

    // Then: スタイルが適用される
    const label = screen.getByText('完全なフィールド')
    expect(label).toHaveClass('font-semibold') // labelVariant="semibold"
  })
})
