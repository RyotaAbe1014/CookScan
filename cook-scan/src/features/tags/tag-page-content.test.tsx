import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
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
        recipeTags: [],
      },
    ],
  })

  it('renders TagInfoBanner', () => {
    const categories = [createMockCategory('cat-1', 'Category 1')]

    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    expect(screen.getByTestId('tag-info-banner')).toBeDefined()
  })

  it('renders TagCreateForm with categories', () => {
    const categories = [createMockCategory('cat-1', 'Category 1')]

    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    const form = screen.getByTestId('tag-create-form')
    expect(form).toBeDefined()
    expect(form.textContent).toContain('1 categories')
  })

  it('displays section title and description', () => {
    const categories = [createMockCategory('cat-1', 'Category 1')]

    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    expect(screen.getByText('登録済みのタグ')).toBeDefined()
    expect(screen.getByText('カテゴリごとに整理されたタグ一覧')).toBeDefined()
  })

  it('displays category count when categories exist', () => {
    const categories = [
      createMockCategory('cat-1', 'Category 1'),
      createMockCategory('cat-2', 'Category 2'),
      createMockCategory('cat-3', 'Category 3'),
    ]

    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    expect(screen.getByText('3 カテゴリ')).toBeDefined()
  })

  it('renders CategoryItem for each category', () => {
    const categories = [
      createMockCategory('cat-1', 'Category 1'),
      createMockCategory('cat-2', 'Category 2'),
    ]

    render(<TagPageContent tagCategories={categories} currentUserId={mockUserId} />)

    expect(screen.getByText('Category 1')).toBeDefined()
    expect(screen.getByText('Category 2')).toBeDefined()
  })

  it('renders TagEmptyState when no categories exist', () => {
    render(<TagPageContent tagCategories={[]} currentUserId={mockUserId} />)

    expect(screen.getByTestId('tag-empty-state')).toBeDefined()
  })

  it('does not render category count when no categories exist', () => {
    render(<TagPageContent tagCategories={[]} currentUserId={mockUserId} />)

    expect(screen.queryByText(/カテゴリ$/)).toBeNull()
  })

  it('does not render CategoryItem when no categories exist', () => {
    render(<TagPageContent tagCategories={[]} currentUserId={mockUserId} />)

    expect(screen.queryByTestId('category-item')).toBeNull()
  })
})
