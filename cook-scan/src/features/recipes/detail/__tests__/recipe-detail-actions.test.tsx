import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeDetailActions } from '../recipe-detail-actions'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('modern-screenshot', () => ({
  domToJpeg: vi.fn(),
}))

vi.mock('@/features/recipes/delete/delete-recipe-dialog', () => ({
  default: () => <div>DeleteRecipeDialog</div>,
}))

vi.mock('@/features/recipes/share/recipe-share-button', () => ({
  RecipeShareButton: () => <button>共有</button>,
}))

import { domToJpeg } from 'modern-screenshot'

describe('RecipeDetailActions', () => {
  const recipe = {
    id: 'recipe-1',
    title: 'カレー',
  }

  let captureTarget: HTMLDivElement | null = null

  beforeEach(() => {
    vi.clearAllMocks()
    captureTarget = document.createElement('div')
    captureTarget.id = 'recipe-detail-capture'
    document.body.appendChild(captureTarget)
  })

  afterEach(() => {
    captureTarget?.remove()
    captureTarget = null
  })

  it('正常系：アクションボタンが表示される', () => {
    // Given: RecipeDetailActionsが表示されている
    render(<RecipeDetailActions recipe={recipe} initialShareInfo={null} />)

    // Then: 編集・ダウンロード・削除ボタンが表示される
    expect(screen.getByRole('link', { name: /編集/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ダウンロード/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /削除/ })).toBeInTheDocument()
  })

  it('正常系：ダウンロードボタンで画面が画像化される', async () => {
    // Given: DOMキャプチャの戻り値が用意されている
    const dataUrl = 'data:image/jpeg;base64,xxx'
    vi.mocked(domToJpeg).mockResolvedValueOnce(dataUrl)

    const user = userEvent.setup()
    let lastAnchor: HTMLAnchorElement | null = null
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName)
        if (tagName.toLowerCase() === 'a') {
          lastAnchor = element as HTMLAnchorElement
          lastAnchor.click = vi.fn()
        }
        return element
      })

    render(<RecipeDetailActions recipe={recipe} initialShareInfo={null} />)

    try {
      // When: ユーザーがダウンロードボタンをクリックする
      await user.click(screen.getByRole('button', { name: /ダウンロード/ }))

      // Then: domToJpegが呼ばれ、ダウンロードが開始される
      await waitFor(() => {
        expect(domToJpeg).toHaveBeenCalledWith(captureTarget, { quality: 0.95 })
        expect(lastAnchor?.download).toBe('カレー.jpg')
        expect(lastAnchor?.href).toBe(dataUrl)
        expect(lastAnchor?.click).toHaveBeenCalled()
      })
    } finally {
      createElementSpy.mockRestore()
    }
  })

  it('異常系：画像化に失敗した場合はエラートーストが表示される', async () => {
    // Given: domToJpegがエラーを返す
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(domToJpeg).mockRejectedValueOnce(new Error('capture failed'))
    const user = userEvent.setup()
    render(<RecipeDetailActions recipe={recipe} initialShareInfo={null} />)

    // When: ユーザーがダウンロードボタンをクリックする
    await user.click(screen.getByRole('button', { name: /ダウンロード/ }))

    // Then: エラートーストが表示される
    expect(await screen.findByText('保存できませんでした')).toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })
})
