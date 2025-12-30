import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { FeaturesOverview } from '../features-overview'

describe('FeaturesOverview', () => {
  test('正常系：セクションタイトルが表示される', () => {
    // Given: FeaturesOverviewコンポーネント
    // When: レンダリングする
    render(<FeaturesOverview />)

    // Then: セクションタイトルが表示される
    expect(screen.getByText('CookScanでできること')).toBeInTheDocument()
  })

  test('正常系：AI画像認識機能が表示される', () => {
    // Given: FeaturesOverviewコンポーネント
    // When: レンダリングする
    render(<FeaturesOverview />)

    // Then: AI画像認識機能のタイトルと説明が表示される
    expect(screen.getByText('AI画像認識')).toBeInTheDocument()
    expect(screen.getByText('高精度のOCRでテキストを抽出')).toBeInTheDocument()
  })

  test('正常系：自動構造化機能が表示される', () => {
    // Given: FeaturesOverviewコンポーネント
    // When: レンダリングする
    render(<FeaturesOverview />)

    // Then: 自動構造化機能のタイトルと説明が表示される
    expect(screen.getByText('自動構造化')).toBeInTheDocument()
    expect(screen.getByText('材料と手順を自動で整理')).toBeInTheDocument()
  })

  test('正常系：タグで整理機能が表示される', () => {
    // Given: FeaturesOverviewコンポーネント
    // When: レンダリングする
    render(<FeaturesOverview />)

    // Then: タグで整理機能のタイトルと説明が表示される
    expect(screen.getByText('タグで整理')).toBeInTheDocument()
    expect(screen.getByText('カテゴリ別にレシピを分類')).toBeInTheDocument()
  })

  test('正常系：簡単検索機能が表示される', () => {
    // Given: FeaturesOverviewコンポーネント
    // When: レンダリングする
    render(<FeaturesOverview />)

    // Then: 簡単検索機能のタイトルと説明が表示される
    expect(screen.getByText('簡単検索')).toBeInTheDocument()
    expect(screen.getByText('すぐに見つかるレシピ検索')).toBeInTheDocument()
  })

  test('正常系：4つの機能アイコンが表示される', () => {
    // Given: FeaturesOverviewコンポーネント
    // When: レンダリングする
    const { container } = render(<FeaturesOverview />)

    // Then: SVGアイコンが4つ表示される
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(4)
  })

  test('正常系：各機能に適切な色のアイコンが設定されている', () => {
    // Given: FeaturesOverviewコンポーネント
    // When: レンダリングする
    const { container } = render(<FeaturesOverview />)

    // Then: 各機能に応じた色クラスが設定されている
    expect(container.querySelector('.bg-indigo-100')).toBeInTheDocument()
    expect(container.querySelector('.bg-green-100')).toBeInTheDocument()
    expect(container.querySelector('.bg-amber-100')).toBeInTheDocument()
    expect(container.querySelector('.bg-purple-100')).toBeInTheDocument()
  })
})
