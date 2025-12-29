import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageLoading } from './page-loading'

describe('PageLoading', () => {
  it('renders loading spinner', () => {
    const { container } = render(<PageLoading />)

    // スピナーのSVG要素が存在することを確認
    const spinner = container.querySelector('svg')
    expect(spinner).toBeTruthy()
    expect(spinner?.classList.contains('animate-spin')).toBe(true)
  })

  it('displays loading text', () => {
    render(<PageLoading />)

    // "読み込み中..."というテキストが表示されることを確認
    expect(screen.getByText('読み込み中...')).toBeDefined()
  })

  it('has correct styling classes', () => {
    const { container } = render(<PageLoading />)

    // 最外のdivがmin-h-screenとflex centeringを持つことを確認
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('min-h-screen')
    expect(wrapper.className).toContain('items-center')
    expect(wrapper.className).toContain('justify-center')
  })
})
