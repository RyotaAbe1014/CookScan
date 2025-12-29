import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TagEmptyState } from './tag-empty-state'

describe('TagEmptyState', () => {
  it('renders empty state title', () => {
    render(<TagEmptyState />)

    expect(screen.getByText('タグがまだありません')).toBeDefined()
  })

  it('renders empty state description', () => {
    render(<TagEmptyState />)

    expect(
      screen.getByText('上のフォームからタグとカテゴリを作成して、レシピを整理しましょう')
    ).toBeDefined()
  })

  it('displays help message', () => {
    render(<TagEmptyState />)

    expect(screen.getByText('カテゴリを作成してからタグを追加')).toBeDefined()
  })

  it('displays tag icon', () => {
    const { container } = render(<TagEmptyState />)

    // SVGアイコンが存在することを確認（2つあります：メインアイコンと情報アイコン）
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })

  it('has correct container styling', () => {
    const { container } = render(<TagEmptyState />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('rounded-xl')
    expect(wrapper.className).toContain('bg-white')
    expect(wrapper.className).toContain('text-center')
  })
})
