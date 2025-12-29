import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { TagEmptyState } from './tag-empty-state'

describe('TagEmptyState', () => {
  test('正常系：空状態のタイトルが表示される', () => {
    // Given: タグ空状態コンポーネントが描画される
    render(<TagEmptyState />)

    // Then: "タグがまだありません"というタイトルが表示される
    expect(screen.getByText('タグがまだありません')).toBeDefined()
  })

  test('正常系：空状態の説明文が表示される', () => {
    // Given: タグ空状態コンポーネントが描画される
    render(<TagEmptyState />)

    // Then: タグ作成を促す説明文が表示される
    expect(
      screen.getByText('上のフォームからタグとカテゴリを作成して、レシピを整理しましょう')
    ).toBeDefined()
  })

  test('正常系：ヘルプメッセージが表示される', () => {
    // Given: タグ空状態コンポーネントが描画される
    render(<TagEmptyState />)

    // Then: カテゴリ作成の手順を示すヘルプメッセージが表示される
    expect(screen.getByText('カテゴリを作成してからタグを追加')).toBeDefined()
  })

  test('正常系：複数のアイコンが表示される', () => {
    // Given: タグ空状態コンポーネントが描画される
    const { container } = render(<TagEmptyState />)

    // Then: メインアイコンと情報アイコンの2つのSVGが表示される
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })

  test('正常系：中央寄せの白背景コンテナで表示される', () => {
    // Given: タグ空状態コンポーネントが描画される
    const { container } = render(<TagEmptyState />)

    // Then: 適切なコンテナスタイルが適用される
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('rounded-xl')
    expect(wrapper.className).toContain('bg-white')
    expect(wrapper.className).toContain('text-center')
  })
})
