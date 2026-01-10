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
    expect(screen.getByText('レシピをスキャン')).toBeInTheDocument()
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
      screen.getByText('保存したレシピを閲覧・編集して、お気に入りのレシピを管理できます')
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
      screen.getByText('タグとカテゴリを作成・編集して、レシピを整理しましょう')
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

  test('正常系：3つのアクションカードが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: 3つのリンクが表示される
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(3)
  })

  test('正常系：各アクションカードにSVGアイコンが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    const { container } = render(<QuickActions />)

    // Then: SVGアイコンが表示される
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  test('正常系：スキャンを開始のCTAテキストが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: スキャンを開始のテキストが表示される
    expect(screen.getByText('スキャンを開始')).toBeInTheDocument()
  })

  test('正常系：レシピを見るのCTAテキストが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: レシピを見るのテキストが表示される
    expect(screen.getByText('レシピを見る')).toBeInTheDocument()
  })

  test('正常系：タグを管理のCTAテキストが表示される', () => {
    // Given: QuickActionsコンポーネント
    // When: レンダリングする
    render(<QuickActions />)

    // Then: タグを管理のテキストが表示される
    expect(screen.getByText('タグを管理')).toBeInTheDocument()
  })
})
