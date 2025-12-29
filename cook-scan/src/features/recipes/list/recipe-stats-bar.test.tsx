import { render, screen } from '@testing-library/react'
import { RecipeStatsBar } from './recipe-stats-bar'

describe('RecipeStatsBar', () => {
  test('正常系：レシピ数が0件の場合に表示される', () => {
    // Given: レシピ数が0件
    // When: RecipeStatsBarをレンダリングする
    render(<RecipeStatsBar recipeCount={0} />)

    // Then: レシピ数が表示される
    expect(screen.getByText('保存レシピ数')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('正常系：レシピ数が1件の場合に表示される', () => {
    // Given: レシピ数が1件
    // When: RecipeStatsBarをレンダリングする
    render(<RecipeStatsBar recipeCount={1} />)

    // Then: レシピ数が表示される
    expect(screen.getByText('保存レシピ数')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('正常系：レシピ数が複数件の場合に表示される', () => {
    // Given: レシピ数が複数件
    // When: RecipeStatsBarをレンダリングする
    render(<RecipeStatsBar recipeCount={42} />)

    // Then: レシピ数が表示される
    expect(screen.getByText('保存レシピ数')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  test('正常系：大きな数値でもレシピ数が表示される', () => {
    // Given: レシピ数が100以上
    // When: RecipeStatsBarをレンダリングする
    render(<RecipeStatsBar recipeCount={999} />)

    // Then: レシピ数が表示される
    expect(screen.getByText('保存レシピ数')).toBeInTheDocument()
    expect(screen.getByText('999')).toBeInTheDocument()
  })

  test('正常系：レシピスキャンボタンが表示される', () => {
    // Given: RecipeStatsBarコンポーネント
    // When: レンダリングする
    render(<RecipeStatsBar recipeCount={5} />)

    // Then: レシピをスキャンボタンが表示される
    const link = screen.getByRole('link', { name: /レシピをスキャン/i })
    expect(link).toBeInTheDocument()
  })

  test('正常系：レシピスキャンボタンが正しいURLにリンクしている', () => {
    // Given: RecipeStatsBarコンポーネント
    // When: レンダリングする
    render(<RecipeStatsBar recipeCount={5} />)

    // Then: /recipes/uploadへのリンクが設定されている
    const link = screen.getByRole('link', { name: /レシピをスキャン/i })
    expect(link).toHaveAttribute('href', '/recipes/upload')
  })

  test('正常系：アイコンが表示される', () => {
    // Given: RecipeStatsBarコンポーネント
    // When: レンダリングする
    const { container } = render(<RecipeStatsBar recipeCount={10} />)

    // Then: SVGアイコンが表示される（レシピアイコンとプラスアイコン）
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})
