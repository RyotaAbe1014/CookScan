import { render, screen } from '@testing-library/react'
import { RecipeGrid } from './recipe-grid'
import type { RecipeBasic } from '@/types/recipe'

describe('RecipeGrid', () => {
  const mockRecipes: RecipeBasic[] = [
    {
      id: '1',
      title: 'カレーライス',
      imageUrl: 'https://example.com/curry.jpg',
      createdAt: new Date('2024-01-15'),
      ingredients: [{ id: 'ing1' }, { id: 'ing2' }, { id: 'ing3' }],
      recipeTags: [
        {
          tagId: 'tag1',
          tag: {
            id: 'tag1',
            name: '和食',
          },
        },
        {
          tagId: 'tag2',
          tag: {
            id: 'tag2',
            name: '簡単',
          },
        },
      ],
    },
    {
      id: '2',
      title: 'パスタ',
      imageUrl: null,
      createdAt: new Date('2024-02-20'),
      ingredients: [{ id: 'ing4' }, { id: 'ing5' }],
      recipeTags: [],
    },
  ]

  test('正常系：レシピが複数表示される', () => {
    // Given: 複数のレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={mockRecipes} />)

    // Then: 全てのレシピタイトルが表示される
    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    expect(screen.getByText('パスタ')).toBeInTheDocument()
  })

  test('正常系：レシピがリンクとして表示される', () => {
    // Given: レシピのデータ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={mockRecipes} />)

    // Then: 各レシピが詳細ページへのリンクとして表示される
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/recipes/1')
    expect(links[1]).toHaveAttribute('href', '/recipes/2')
  })

  test('正常系：レシピ画像が表示される', () => {
    // Given: 画像URLを持つレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[mockRecipes[0]]} />)

    // Then: 画像が表示される
    const img = screen.getByRole('img', { name: 'カレーライス' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src')
  })

  test('正常系：画像がないレシピでも表示される', () => {
    // Given: 画像URLがnullのレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[mockRecipes[1]]} />)

    // Then: レシピタイトルは表示される
    expect(screen.getByText('パスタ')).toBeInTheDocument()

    // Then: 画像は表示されない
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('正常系：材料の品目数が表示される', () => {
    // Given: 3つの材料を持つレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[mockRecipes[0]]} />)

    // Then: 材料数が表示される
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('品目')).toBeInTheDocument()
  })

  test('正常系：タグが表示される', () => {
    // Given: タグを持つレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[mockRecipes[0]]} />)

    // Then: タグが表示される
    expect(screen.getByText('和食')).toBeInTheDocument()
    expect(screen.getByText('簡単')).toBeInTheDocument()
  })

  test('正常系：タグがないレシピでも表示される', () => {
    // Given: タグがないレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[mockRecipes[1]]} />)

    // Then: レシピタイトルは表示される
    expect(screen.getByText('パスタ')).toBeInTheDocument()

    // Then: タグは表示されない（他のレシピのタグも含めて）
    expect(screen.queryByText('和食')).not.toBeInTheDocument()
  })

  test('正常系：タグが3つまで表示される', () => {
    // Given: 4つのタグを持つレシピ
    const recipeWithManyTags: RecipeBasic = {
      ...mockRecipes[0],
      recipeTags: [
        { tagId: 'tag1', tag: { id: 'tag1', name: 'タグ1' } },
        { tagId: 'tag2', tag: { id: 'tag2', name: 'タグ2' } },
        { tagId: 'tag3', tag: { id: 'tag3', name: 'タグ3' } },
        { tagId: 'tag4', tag: { id: 'tag4', name: 'タグ4' } },
      ],
    }

    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[recipeWithManyTags]} />)

    // Then: 最初の3つのタグが表示される
    expect(screen.getByText('タグ1')).toBeInTheDocument()
    expect(screen.getByText('タグ2')).toBeInTheDocument()
    expect(screen.getByText('タグ3')).toBeInTheDocument()

    // Then: 残りのタグ数が表示される
    expect(screen.getByText('+1')).toBeInTheDocument()

    // Then: 4つ目のタグは表示されない
    expect(screen.queryByText('タグ4')).not.toBeInTheDocument()
  })

  test('正常系：作成日が日本語フォーマットで表示される', () => {
    // Given: 作成日を持つレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[mockRecipes[0]]} />)

    // Then: 日本語フォーマットの日付が表示される
    expect(screen.getByText('2024年1月15日')).toBeInTheDocument()
  })

  test('正常系：空のレシピ配列でグリッドが表示される', () => {
    // Given: 空のレシピ配列
    // When: RecipeGridをレンダリングする
    const { container } = render(<RecipeGrid recipes={[]} />)

    // Then: グリッド要素は存在するがレシピは表示されない
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  test('正常系：単一のレシピでも正常に表示される', () => {
    // Given: 単一のレシピ
    // When: RecipeGridをレンダリングする
    render(<RecipeGrid recipes={[mockRecipes[0]]} />)

    // Then: レシピが表示される
    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
  })
})
