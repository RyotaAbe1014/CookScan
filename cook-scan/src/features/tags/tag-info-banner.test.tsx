import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { TagInfoBanner } from './tag-info-banner'

describe('TagInfoBanner', () => {
  test('正常系：タイトルが表示される', () => {
    // Given: タグ情報バナーが描画される
    render(<TagInfoBanner />)

    // Then: "タグでレシピを整理"というタイトルが表示される
    expect(screen.getByText('タグでレシピを整理')).toBeDefined()
  })

  test('正常系：説明文が表示される', () => {
    // Given: タグ情報バナーが描画される
    render(<TagInfoBanner />)

    // Then: カテゴリとタグの使い方を説明する文が表示される
    expect(
      screen.getByText('カテゴリとタグを使ってレシピを分類し、簡単に見つけられるようにしましょう')
    ).toBeDefined()
  })

  test('正常系：タグアイコンが表示される', () => {
    // Given: タグ情報バナーが描画される
    const { container } = render(<TagInfoBanner />)

    // Then: SVGアイコンが表示される
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  test('正常系：グラデーション背景が適用される', () => {
    // Given: タグ情報バナーが描画される
    const { container } = render(<TagInfoBanner />)

    // Then: オレンジ系のグラデーション背景スタイルが適用される
    const banner = container.firstChild as HTMLElement
    expect(banner.className).toContain('bg-linear-to-r')
    expect(banner.className).toContain('from-amber-500')
    expect(banner.className).toContain('to-orange-600')
  })
})
