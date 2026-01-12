import { render, screen } from '@testing-library/react'
import { Alert } from './alert'

describe('Alert', () => {
  test('正常系：デフォルトでinfo variantのアラートが表示される', () => {
    // Given: アラートコンポーネントが用意されている
    // When: デフォルトpropsでレンダリングする
    render(<Alert>テストメッセージ</Alert>)

    // Then: role="alert"要素が存在する
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()

    // Then: テキストが表示される
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument()

    // Then: デフォルトのinfo variant用スタイルが適用される
    expect(alert).toHaveClass('bg-blue-50', 'ring-blue-200')
  })

  test('正常系：error variantのスタイルが適用される', () => {
    // Given: error variantのアラートが用意されている
    // When: variant="error"でレンダリングする
    render(<Alert variant="error">エラーメッセージ</Alert>)

    // Then: error variant用のスタイルが適用される
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-danger-light', 'ring-danger-light')

    // Then: メッセージが表示される
    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument()
  })

  test('正常系：success variantのスタイルが適用される', () => {
    // Given: success variantのアラートが用意されている
    // When: variant="success"でレンダリングする
    render(<Alert variant="success">成功メッセージ</Alert>)

    // Then: success variant用のスタイルが適用される
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-success-light', 'ring-success-light')
  })

  test('正常系：warning variantのスタイルが適用される', () => {
    // Given: warning variantのアラートが用意されている
    // When: variant="warning"でレンダリングする
    render(<Alert variant="warning">警告メッセージ</Alert>)

    // Then: warning variant用のスタイルが適用される
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-warning-light', 'ring-warning-light')
  })

  test('正常系：hideIcon=trueでアイコンが非表示になる', () => {
    // Given: hideIconプロップが用意されている
    // When: hideIcon=trueでレンダリングする
    const { container } = render(<Alert hideIcon>アイコンなし</Alert>)

    // Then: アイコン用のspan要素が存在しない
    const iconSpan = container.querySelector('span.text-blue-600')
    expect(iconSpan).not.toBeInTheDocument()

    // Then: メッセージは表示される
    expect(screen.getByText('アイコンなし')).toBeInTheDocument()
  })

  test('正常系：デフォルトでアイコンが表示される', () => {
    // Given: hideIconがfalse（デフォルト）のアラートが用意されている
    // When: デフォルトpropsでレンダリングする
    const { container } = render(<Alert>アイコンあり</Alert>)

    // Then: アイコン用のspan要素が存在する
    const iconSpan = container.querySelector('span.text-blue-600')
    expect(iconSpan).toBeInTheDocument()
  })

  test('正常系：各variantで対応するアイコンカラーが表示される', () => {
    // Given: 各variantのアラートが用意されている
    // When: error variantでレンダリングする
    const { container: errorContainer } = render(
      <Alert variant="error">エラー</Alert>
    )
    // Then: dangerカラーのアイコンが表示される
    expect(errorContainer.querySelector('span.text-danger')).toBeInTheDocument()

    // When: success variantでレンダリングする
    const { container: successContainer } = render(
      <Alert variant="success">成功</Alert>
    )
    // Then: successカラーのアイコンが表示される
    expect(successContainer.querySelector('span.text-success')).toBeInTheDocument()

    // When: warning variantでレンダリングする
    const { container: warningContainer } = render(
      <Alert variant="warning">警告</Alert>
    )
    // Then: warningカラーのアイコンが表示される
    expect(warningContainer.querySelector('span.text-warning')).toBeInTheDocument()
  })

  test('正常系：カスタムclassNameが追加される', () => {
    // Given: カスタムclassNameが用意されている
    // When: className propを渡してレンダリングする
    render(<Alert className="custom-class">カスタムクラス</Alert>)

    // Then: カスタムクラスが適用される
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('custom-class')

    // Then: デフォルトのクラスも維持される
    expect(alert).toHaveClass('bg-blue-50', 'ring-blue-200')
  })

  test('正常系：各variantで対応するテキストカラーが適用される', () => {
    // Given: 各variantのアラートが用意されている
    // When: error variantでレンダリングする
    render(<Alert variant="error">エラーテキスト</Alert>)
    // Then: エラー用のテキストカラーが適用される
    const errorText = screen.getByText('エラーテキスト')
    expect(errorText).toHaveClass('text-danger-hover')

    // When: success variantでレンダリングする
    render(<Alert variant="success">成功テキスト</Alert>)
    // Then: 成功用のテキストカラーが適用される
    const successText = screen.getByText('成功テキスト')
    expect(successText).toHaveClass('text-green-800')

    // When: warning variantでレンダリングする
    render(<Alert variant="warning">警告テキスト</Alert>)
    // Then: 警告用のテキストカラーが適用される
    const warningText = screen.getByText('警告テキスト')
    expect(warningText).toHaveClass('text-amber-800')

    // When: info variantでレンダリングする
    render(<Alert variant="info">情報テキスト</Alert>)
    // Then: 情報用のテキストカラーが適用される
    const infoText = screen.getByText('情報テキスト')
    expect(infoText).toHaveClass('text-blue-800')
  })
})
