import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TagInfoBanner } from './tag-info-banner'

describe('TagInfoBanner', () => {
  it('renders banner with title', () => {
    render(<TagInfoBanner />)

    expect(screen.getByText('タグでレシピを整理')).toBeDefined()
  })

  it('renders banner with description text', () => {
    render(<TagInfoBanner />)

    expect(
      screen.getByText('カテゴリとタグを使ってレシピを分類し、簡単に見つけられるようにしましょう')
    ).toBeDefined()
  })

  it('displays tag icon', () => {
    const { container } = render(<TagInfoBanner />)

    // SVGアイコンが存在することを確認
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('has gradient background styling', () => {
    const { container } = render(<TagInfoBanner />)

    const banner = container.firstChild as HTMLElement
    expect(banner.className).toContain('bg-linear-to-r')
    expect(banner.className).toContain('from-amber-500')
    expect(banner.className).toContain('to-orange-600')
  })
})
