import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeSourceInfo } from '../recipe-source-info'
import type { SourceInfoDisplay } from '@/types/sourceInfo'

describe('RecipeSourceInfo', () => {
  describe('Given すべてのソース情報が存在する場合', () => {
    const mockSourceInfo: SourceInfoDisplay = {
      sourceName: 'おいしい料理の本',
      pageNumber: '42',
      sourceUrl: 'https://example.com/recipe',
    }

    it('When コンポーネントをレンダリングする Then すべての情報が表示される', () => {
      render(<RecipeSourceInfo sourceInfo={mockSourceInfo} />)

      expect(screen.getByText('ソース情報')).toBeInTheDocument()
      expect(screen.getByText('本の名前')).toBeInTheDocument()
      expect(screen.getByText('おいしい料理の本')).toBeInTheDocument()
      expect(screen.getByText('ページ番号')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('参照URL')).toBeInTheDocument()
      expect(screen.getByText('https://example.com/recipe')).toBeInTheDocument()
    })

    it('When URLをレンダリングする Then リンクが適切な属性を持つ', () => {
      render(<RecipeSourceInfo sourceInfo={mockSourceInfo} />)

      const link = screen.getByRole('link', { name: 'https://example.com/recipe' })
      expect(link).toHaveAttribute('href', 'https://example.com/recipe')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Given 本の名前のみが存在する場合', () => {
    const mockSourceInfo: SourceInfoDisplay = {
      sourceName: '料理の基本',
      pageNumber: null,
      sourceUrl: null,
    }

    it('When コンポーネントをレンダリングする Then 本の名前のみが表示される', () => {
      render(<RecipeSourceInfo sourceInfo={mockSourceInfo} />)

      expect(screen.getByText('本の名前')).toBeInTheDocument()
      expect(screen.getByText('料理の基本')).toBeInTheDocument()
      expect(screen.queryByText('ページ番号')).not.toBeInTheDocument()
      expect(screen.queryByText('参照URL')).not.toBeInTheDocument()
    })
  })

  describe('Given ページ番号のみが存在する場合', () => {
    const mockSourceInfo: SourceInfoDisplay = {
      sourceName: null,
      pageNumber: '123',
      sourceUrl: null,
    }

    it('When コンポーネントをレンダリングする Then ページ番号のみが表示される', () => {
      render(<RecipeSourceInfo sourceInfo={mockSourceInfo} />)

      expect(screen.getByText('ページ番号')).toBeInTheDocument()
      expect(screen.getByText('123')).toBeInTheDocument()
      expect(screen.queryByText('本の名前')).not.toBeInTheDocument()
      expect(screen.queryByText('参照URL')).not.toBeInTheDocument()
    })
  })

  describe('Given URLのみが存在する場合', () => {
    const mockSourceInfo: SourceInfoDisplay = {
      sourceName: null,
      pageNumber: null,
      sourceUrl: 'https://recipe-site.com/curry',
    }

    it('When コンポーネントをレンダリングする Then URLのみが表示される', () => {
      render(<RecipeSourceInfo sourceInfo={mockSourceInfo} />)

      expect(screen.getByText('参照URL')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'https://recipe-site.com/curry' })).toBeInTheDocument()
      expect(screen.queryByText('本の名前')).not.toBeInTheDocument()
      expect(screen.queryByText('ページ番号')).not.toBeInTheDocument()
    })
  })
})
