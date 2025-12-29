import { render, screen } from '@testing-library/react'
import { RecipeEmptyState } from './recipe-empty-state'

describe('RecipeEmptyState', () => {
  test('正常系：フィルターなしの場合、レシピがない旨のメッセージが表示される', () => {
    // Given: フィルターなしの空状態
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={false} hasSearchQuery={false} hasSelectedTags={false} />
    )

    // Then: レシピがない旨のメッセージが表示される
    expect(screen.getByText('レシピがまだありません')).toBeInTheDocument()
    expect(screen.getByText('レシピをスキャンして、マイレシピに追加しましょう')).toBeInTheDocument()
  })

  test('正常系：フィルターなしの場合、レシピをスキャンボタンが表示される', () => {
    // Given: フィルターなしの空状態
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={false} hasSearchQuery={false} hasSelectedTags={false} />
    )

    // Then: レシピをスキャンボタンが表示される
    const link = screen.getByRole('link', { name: /レシピをスキャン/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/recipes/upload')
  })

  test('正常系：フィルターありの場合、該当なし旨のメッセージが表示される', () => {
    // Given: フィルターありの空状態
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={true} hasSearchQuery={true} hasSelectedTags={false} />
    )

    // Then: 該当なし旨のメッセージが表示される
    expect(screen.getByText('該当するレシピがありません')).toBeInTheDocument()
  })

  test('正常系：検索クエリのみの場合、検索条件に一致しないメッセージが表示される', () => {
    // Given: 検索クエリのみのフィルター
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={true} hasSearchQuery={true} hasSelectedTags={false} />
    )

    // Then: 検索条件に一致しないメッセージが表示される
    expect(screen.getByText('検索条件に一致するレシピが見つかりませんでした')).toBeInTheDocument()
  })

  test('正常系：タグのみの場合、選択タグに一致しないメッセージが表示される', () => {
    // Given: タグのみのフィルター
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={true} hasSearchQuery={false} hasSelectedTags={true} />
    )

    // Then: 選択タグに一致しないメッセージが表示される
    expect(screen.getByText('選択したタグに一致するレシピが見つかりませんでした')).toBeInTheDocument()
  })

  test('正常系：検索クエリとタグ両方の場合、両方に言及したメッセージが表示される', () => {
    // Given: 検索クエリとタグ両方のフィルター
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={true} hasSearchQuery={true} hasSelectedTags={true} />
    )

    // Then: 検索条件とタグに言及したメッセージが表示される
    expect(
      screen.getByText('検索条件とタグに一致するレシピが見つかりませんでした')
    ).toBeInTheDocument()
  })

  test('正常系：フィルターありの場合、すべてクリアボタンが表示される', () => {
    // Given: フィルターありの空状態
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={true} hasSearchQuery={true} hasSelectedTags={false} />
    )

    // Then: すべてクリアボタンが表示される
    const link = screen.getByRole('link', { name: /すべてクリア/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/recipes')
  })

  test('正常系：フィルターなしの場合、すべてクリアボタンは表示されない', () => {
    // Given: フィルターなしの空状態
    // When: RecipeEmptyStateをレンダリングする
    render(
      <RecipeEmptyState hasFilters={false} hasSearchQuery={false} hasSelectedTags={false} />
    )

    // Then: すべてクリアボタンが表示されない
    expect(screen.queryByRole('link', { name: /すべてクリア/i })).not.toBeInTheDocument()
  })

  test('正常系：アイコンが表示される', () => {
    // Given: RecipeEmptyStateコンポーネント
    // When: レンダリングする
    const { container } = render(
      <RecipeEmptyState hasFilters={false} hasSearchQuery={false} hasSelectedTags={false} />
    )

    // Then: SVGアイコンが表示される
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})
