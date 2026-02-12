import { render, screen } from '@testing-library/react'
import { ShoppingListEmptyState } from '../shopping-list-empty-state'

describe('ShoppingListEmptyState', () => {
  test('正常系：空状態のタイトルが表示される', () => {
    // Given: ShoppingListEmptyStateコンポーネントが用意されている
    // When: レンダリングする
    render(<ShoppingListEmptyState />)

    // Then: タイトルが表示される
    expect(screen.getByText('買い物リストは空です')).toBeInTheDocument()
  })

  test('正常系：空状態の説明文が表示される', () => {
    // Given: ShoppingListEmptyStateコンポーネントが用意されている
    // When: レンダリングする
    render(<ShoppingListEmptyState />)

    // Then: 説明文が表示される
    expect(screen.getByText('上のフォームからアイテムを追加してみましょう')).toBeInTheDocument()
  })
})
