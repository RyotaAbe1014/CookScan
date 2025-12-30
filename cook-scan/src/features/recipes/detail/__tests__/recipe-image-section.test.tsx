import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeImageSection } from '../recipe-image-section'

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}))

describe('RecipeImageSection', () => {
  describe('Given 画像URLとタイトルが与えられた場合', () => {
    const mockImageUrl = 'https://example.com/recipe.jpg'
    const mockTitle = 'カレーライス'

    it('When コンポーネントをレンダリングする Then 画像が表示される', () => {
      render(<RecipeImageSection imageUrl={mockImageUrl} title={mockTitle} />)

      const image = screen.getByAltText(mockTitle)
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', mockImageUrl)
    })

    it('When コンポーネントをレンダリングする Then セクションタイトルが表示される', () => {
      render(<RecipeImageSection imageUrl={mockImageUrl} title={mockTitle} />)

      expect(screen.getByText('レシピ画像')).toBeInTheDocument()
    })
  })
})
