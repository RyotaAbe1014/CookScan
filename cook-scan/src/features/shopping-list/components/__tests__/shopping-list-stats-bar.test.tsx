import { render, screen } from '@testing-library/react'
import { ShoppingListStatsBar } from '../shopping-list-stats-bar'

describe('ShoppingListStatsBar', () => {
  test('正常系：合計件数が表示される', () => {
    // Given: 5件のアイテムがある
    // When: レンダリングする
    render(<ShoppingListStatsBar totalCount={5} checkedCount={2} />)

    // Then: 合計件数が表示される
    expect(screen.getByText('5件')).toBeInTheDocument()
  })

  test('正常系：残り件数が表示される', () => {
    // Given: 5件中2件がチェック済み
    // When: レンダリングする
    render(<ShoppingListStatsBar totalCount={5} checkedCount={2} />)

    // Then: 残り3件と表示される
    expect(screen.getByText('残り 3件')).toBeInTheDocument()
  })

  test('正常系：購入済み件数が表示される', () => {
    // Given: 5件中2件がチェック済み
    // When: レンダリングする
    render(<ShoppingListStatsBar totalCount={5} checkedCount={2} />)

    // Then: 購入済み件数が表示される
    expect(screen.getByText('2件 購入済み')).toBeInTheDocument()
  })

  test('正常系：合計が0件の場合、残りと購入済みが表示されない', () => {
    // Given: 0件のアイテム
    // When: レンダリングする
    render(<ShoppingListStatsBar totalCount={0} checkedCount={0} />)

    // Then: 合計件数は表示される
    expect(screen.getByText('0件')).toBeInTheDocument()

    // Then: 残りと購入済みは表示されない
    expect(screen.queryByText(/残り/)).not.toBeInTheDocument()
    expect(screen.queryByText(/購入済み/)).not.toBeInTheDocument()
  })

  test('正常系：チェック済みが0件の場合、購入済みが表示されない', () => {
    // Given: 3件すべて未チェック
    // When: レンダリングする
    render(<ShoppingListStatsBar totalCount={3} checkedCount={0} />)

    // Then: 残り件数は表示される
    expect(screen.getByText('残り 3件')).toBeInTheDocument()

    // Then: 購入済みは表示されない
    expect(screen.queryByText(/購入済み/)).not.toBeInTheDocument()
  })

  test('正常系：全件チェック済みの場合、残り0件と表示される', () => {
    // Given: 3件すべてチェック済み
    // When: レンダリングする
    render(<ShoppingListStatsBar totalCount={3} checkedCount={3} />)

    // Then: 残り0件と表示される
    expect(screen.getByText('残り 0件')).toBeInTheDocument()

    // Then: 購入済みが表示される
    expect(screen.getByText('3件 購入済み')).toBeInTheDocument()
  })
})
