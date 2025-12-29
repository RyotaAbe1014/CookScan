import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { PageLoading } from './page-loading'

describe('PageLoading', () => {
  test('正常系：ローディングスピナーが表示される', () => {
    // Given: ページローディングコンポーネントが描画される
    const { container } = render(<PageLoading />)

    // Then: アニメーション付きのスピナーが表示される
    const spinner = container.querySelector('svg')
    expect(spinner).toBeTruthy()
    expect(spinner?.classList.contains('animate-spin')).toBe(true)
  })

  test('正常系：読み込み中のテキストが表示される', () => {
    // Given: ページローディングコンポーネントが描画される
    render(<PageLoading />)

    // Then: "読み込み中..."というテキストが表示される
    expect(screen.getByText('読み込み中...')).toBeDefined()
  })

  test('正常系：フルスクリーンの中央配置レイアウトで表示される', () => {
    // Given: ページローディングコンポーネントが描画される
    const { container } = render(<PageLoading />)

    // Then: 最外のdivがフルスクリーンで中央配置のスタイルを持つ
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('min-h-screen')
    expect(wrapper.className).toContain('items-center')
    expect(wrapper.className).toContain('justify-center')
  })
})
