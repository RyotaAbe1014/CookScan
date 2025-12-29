import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { RecipeListContent } from './recipe-list-content'
import type { RecipeBasic } from '@/types/recipe'

// Next.js navigation のモック
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}))

describe('RecipeListContent', () => {
  const mockRecipes: RecipeBasic[] = [
    {
      id: '1',
      title: 'カレーライス',
      imageUrl: 'https://example.com/curry.jpg',
      createdAt: new Date('2024-01-15'),
      ingredients: [{ id: 'ing1' }, { id: 'ing2' }],
      recipeTags: [
        {
          tagId: 'tag1',
          tag: {
            id: 'tag1',
            name: '和食',
          },
        },
      ],
    },
  ]

  const mockTagCategories = [
    {
      id: 'cat1',
      name: 'カテゴリー1',
      tags: [
        { id: 'tag1', name: 'タグ1' },
        { id: 'tag2', name: 'タグ2' },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams.delete('tag')
  })

  test('正常系：レシピがある場合、RecipeGridが表示される', () => {
    // Given: レシピのデータ
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={mockRecipes}
        tagCategories={mockTagCategories}
        selectedTagIds={[]}
        searchQuery=""
      />
    )

    // Then: レシピタイトルが表示される
    expect(screen.getByText('カレーライス')).toBeInTheDocument()
  })

  test('正常系：レシピがない場合、RecipeEmptyStateが表示される', () => {
    // Given: 空のレシピ配列
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={[]}
        tagCategories={mockTagCategories}
        selectedTagIds={[]}
        searchQuery=""
      />
    )

    // Then: 空状態のメッセージが表示される
    expect(screen.getByText('レシピがまだありません')).toBeInTheDocument()
  })

  test('正常系：フィルターありでレシピがない場合、フィルター用の空状態が表示される', () => {
    // Given: フィルター条件付きで空のレシピ配列
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={[]}
        tagCategories={mockTagCategories}
        selectedTagIds={['tag1']}
        searchQuery=""
      />
    )

    // Then: フィルター用の空状態メッセージが表示される
    expect(screen.getByText('該当するレシピがありません')).toBeInTheDocument()
  })

  test('正常系：検索クエリありでレシピがない場合、検索用の空状態が表示される', () => {
    // Given: 検索クエリ付きで空のレシピ配列
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={[]}
        tagCategories={mockTagCategories}
        selectedTagIds={[]}
        searchQuery="カレー"
      />
    )

    // Then: 検索用の空状態メッセージが表示される
    expect(screen.getByText('該当するレシピがありません')).toBeInTheDocument()
  })

  test('正常系：RecipeStatsBarが表示される', () => {
    // Given: レシピのデータ
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={mockRecipes}
        tagCategories={mockTagCategories}
        selectedTagIds={[]}
        searchQuery=""
      />
    )

    // Then: 保存レシピ数が表示される
    expect(screen.getByText('保存レシピ数')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('正常系：RecipeStatsBarにレシピ数が正しく反映される', () => {
    // Given: 複数のレシピ
    const multipleRecipes: RecipeBasic[] = [
      ...mockRecipes,
      {
        id: '2',
        title: 'パスタ',
        imageUrl: null,
        createdAt: new Date('2024-02-20'),
        ingredients: [{ id: 'ing3' }],
        recipeTags: [],
      },
      {
        id: '3',
        title: 'サラダ',
        imageUrl: null,
        createdAt: new Date('2024-03-10'),
        ingredients: [{ id: 'ing4' }],
        recipeTags: [],
      },
    ]

    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={multipleRecipes}
        tagCategories={mockTagCategories}
        selectedTagIds={[]}
        searchQuery=""
      />
    )

    // Then: 正しいレシピ数が表示される
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('正常系：hasFiltersがfalseの場合、適切なEmptyStateが表示される', () => {
    // Given: フィルターなしで空のレシピ
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={[]}
        tagCategories={mockTagCategories}
        selectedTagIds={[]}
        searchQuery=""
      />
    )

    // Then: レシピをスキャンボタンが複数表示される（RecipeStatsBarとRecipeEmptyStateの両方）
    const links = screen.getAllByRole('link', { name: /レシピをスキャン/i })
    expect(links.length).toBeGreaterThanOrEqual(1)
    expect(links[0]).toHaveAttribute('href', '/recipes/upload')
  })

  test('正常系：hasFiltersがtrueの場合、すべてクリアボタンが表示される', () => {
    // Given: タグフィルター付きで空のレシピ
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={[]}
        tagCategories={mockTagCategories}
        selectedTagIds={['tag1']}
        searchQuery=""
      />
    )

    // Then: すべてクリアボタンが表示される
    const link = screen.getByRole('link', { name: /すべてクリア/i })
    expect(link).toHaveAttribute('href', '/recipes')
  })

  test('正常系：検索クエリとタグ両方でフィルター時の空状態', () => {
    // Given: 検索クエリとタグ両方でフィルター
    // When: RecipeListContentをレンダリングする
    render(
      <RecipeListContent
        recipes={[]}
        tagCategories={mockTagCategories}
        selectedTagIds={['tag1']}
        searchQuery="カレー"
      />
    )

    // Then: 両方に言及した空状態メッセージが表示される
    expect(
      screen.getByText('検索条件とタグに一致するレシピが見つかりませんでした')
    ).toBeInTheDocument()
  })
})
