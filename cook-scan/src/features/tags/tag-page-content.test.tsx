import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { TagPageContent } from './tag-page-content'

// 子コンポーネントをモック
vi.mock('./tag-create-form', () => ({
  TagCreateForm: ({ categories }: { categories: unknown[] }) => (
    <div data-testid="tag-create-form">TagCreateForm ({categories.length} categories)</div>
  ),
}))

vi.mock('./category-item', () => ({
  CategoryItem: ({ category }: { category: { name: string } }) => (
    <div data-testid="category-item">{category.name}</div>
  ),
}))

vi.mock('./tag-info-banner', () => ({
  TagInfoBanner: () => <div data-testid="tag-info-banner">TagInfoBanner</div>,
}))

vi.mock('./tag-empty-state', () => ({
  TagEmptyState: () => <div data-testid="tag-empty-state">TagEmptyState</div>,
}))

describe('TagPageContent', () => {
  const mockUserId = 'user-123'

  const createMockCategory = (id: string, name: string) => ({
    id,
    name,
    description: `Description for ${name}`,
    isSystem: false,
    userId: mockUserId,
    tags: [
      {
        id: `tag-${id}-1`,
        name: `Tag 1 for ${name}`,
        description: null,
        isSystem: false,
        categoryId: id,
        recipeTags: [] as { recipeId: string }[],
      },
    ],
  })

  test('正常系：タグ情報バナーが表示される', () => {
    // Given: カテゴリが1つ存在する
    const categories = [createMockCategory('cat-1', 'Category 1')]

    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    // Then: タグ情報バナーが表示される
    expect(screen.getByTestId('tag-info-banner')).toBeDefined()
  })

  test('正常系：タグ作成フォームがカテゴリと共に表示される', () => {
    // Given: カテゴリが1つ存在する
    const categories = [createMockCategory('cat-1', 'Category 1')]

    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    // Then: タグ作成フォームにカテゴリ情報が渡される
    const form = screen.getByTestId('tag-create-form')
    expect(form).toBeDefined()
    expect(form.textContent).toContain('1 categories')
  })

  test('正常系：セクションのタイトルと説明が表示される', () => {
    // Given: カテゴリが1つ存在する
    const categories = [createMockCategory('cat-1', 'Category 1')]

    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    // Then: セクションタイトルと説明が表示される
    expect(screen.getByText('登録済みのタグ')).toBeDefined()
    expect(screen.getByText('カテゴリごとに整理されたタグ一覧')).toBeDefined()
  })

  test('正常系：カテゴリが存在する場合、カテゴリ数が表示される', () => {
    // Given: カテゴリが3つ存在する
    const categories = [
      createMockCategory('cat-1', 'Category 1'),
      createMockCategory('cat-2', 'Category 2'),
      createMockCategory('cat-3', 'Category 3'),
    ]

    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    // Then: "3 カテゴリ"と表示される
    expect(screen.getByText('3 カテゴリ')).toBeDefined()
  })

  test('正常系：各カテゴリに対してCategoryItemが表示される', () => {
    // Given: カテゴリが2つ存在する
    const categories = [
      createMockCategory('cat-1', 'Category 1'),
      createMockCategory('cat-2', 'Category 2'),
    ]

    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    // Then: 各カテゴリ名が表示される
    expect(screen.getByText('Category 1')).toBeDefined()
    expect(screen.getByText('Category 2')).toBeDefined()
  })

  test('正常系：カテゴリが存在しない場合、空状態が表示される', () => {
    // Given: カテゴリが存在しない
    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={[]} currentUserId={mockUserId} />)

    // Then: 空状態コンポーネントが表示される
    expect(screen.getByTestId('tag-empty-state')).toBeDefined()
  })

  test('正常系：カテゴリが存在しない場合、カテゴリ数は表示されない', () => {
    // Given: カテゴリが存在しない
    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={[]} currentUserId={mockUserId} />)

    // Then: カテゴリ数の表示はない
    expect(screen.queryByText(/カテゴリ$/)).toBeNull()
  })

  test('正常系：カテゴリが存在しない場合、CategoryItemは表示されない', () => {
    // Given: カテゴリが存在しない
    // When: タグページコンテンツが描画される
    render(<TagPageContent tagCategories={[]} currentUserId={mockUserId} />)

    // Then: CategoryItemは表示されない
    expect(screen.queryByTestId('category-item')).toBeNull()
  })
})
