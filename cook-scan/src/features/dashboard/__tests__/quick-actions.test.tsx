import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { QuickActions } from '../quick-actions'

describe('QuickActions', () => {
  test('正常系：セクションタイトルが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: セクションタイトルが表示される
    expect(screen.getByText('クイックアクション')).toBeInTheDocument()
  })

  test('正常系：レシピをスキャンカードが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: レシピをスキャンカードのタイトルと説明が表示される
    expect(screen.getByText('レシピをスキャンする')).toBeInTheDocument()
    expect(
      screen.getByText('料理本やレシピカードを撮影して、AIが自動でデジタル化します')
    ).toBeInTheDocument()
  })

  test('正常系：レシピをスキャンリンクが正しいhrefを持つ', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: レシピをスキャンリンクが/recipes/uploadを指している
    const scanLink = screen.getByRole('link', { name: /レシピをスキャン/i })
    expect(scanLink).toHaveAttribute('href', '/recipes/upload')
  })

  test('正常系：マイレシピカードが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: マイレシピカードのタイトルと説明が表示される
    expect(screen.getByText('マイレシピ')).toBeInTheDocument()
    expect(
      screen.getByText('保存したレシピを閲覧・編集')
    ).toBeInTheDocument()
  })

  test('正常系：マイレシピリンクが正しいhrefを持つ', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: マイレシピリンクが/recipesを指している
    const recipesLink = screen.getByRole('link', { name: /マイレシピ/i })
    expect(recipesLink).toHaveAttribute('href', '/recipes')
  })

  test('正常系：タグ管理カードが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: タグ管理カードのタイトルと説明が表示される
    expect(screen.getByText('タグ管理')).toBeInTheDocument()
    expect(
      screen.getByText('カテゴリを作成してレシピを整理')
    ).toBeInTheDocument()
  })

  test('正常系：タグ管理リンクが正しいhrefを持つ', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: タグ管理リンクが/tagsを指している
    const tagsLink = screen.getByRole('link', { name: /タグ管理/i })
    expect(tagsLink).toHaveAttribute('href', '/tags')
  })

  test('正常系：買い物リストカードが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: 買い物リストカードのタイトルと説明が表示される
    expect(screen.getByText('買い物リスト')).toBeInTheDocument()
    expect(
      screen.getByText('必要な食材をチェック管理')
    ).toBeInTheDocument()
  })

  test('正常系：買い物リストリンクが正しいhrefを持つ', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: 買い物リストリンクが/shopping-listを指している
    const shoppingListLink = screen.getByRole('link', { name: /買い物リスト/i })
    expect(shoppingListLink).toHaveAttribute('href', '/shopping-list')
  })

  test('正常系：4つのアクションカードが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: 4つのリンクが表示される
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(4)
  })

  test('正常系：各アクションカードにSVGアイコンが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    const { container } = render(<QuickActions />)

    // Then: SVGアイコンが表示される
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  test('正常系：AIスキャンバッジが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: AIスキャンバッジが表示される
    expect(screen.getByText('AIスキャン')).toBeInTheDocument()
  })
})
