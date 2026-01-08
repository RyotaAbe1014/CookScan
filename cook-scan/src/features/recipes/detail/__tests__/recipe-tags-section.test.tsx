import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeTagsSection } from '../recipe-tags-section'
import type { RecipeTag } from '@/types/recipe'

describe('RecipeTagsSection', () => {
  describe('Given タグが存在する場合', () => {
    const mockRecipeTags: RecipeTag[] = [
      {
        tagId: 'tag-1',
        tag: {
          id: 'tag-1',
          name: '和食',
          category: {
            id: 'category-1',
            name: 'ジャンル',
          },
        },
      },
      {
        tagId: 'tag-2',
        tag: {
          id: 'tag-2',
          name: '中華',
          category: {
            id: 'category-1',
            name: 'ジャンル',
          },
        },
      },
      {
        tagId: 'tag-3',
        tag: {
          id: 'tag-3',
          name: '簡単',
          category: {
            id: 'category-2',
            name: '難易度',
          },
        },
      },
    ]

    it('When コンポーネントをレンダリングする Then タグセクションが表示される', () => {
      render(<RecipeTagsSection recipeTags={mockRecipeTags} />)

      expect(screen.getByText('タグ')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then カテゴリ名が表示される', () => {
      render(<RecipeTagsSection recipeTags={mockRecipeTags} />)

      expect(screen.getByText('ジャンル')).toBeInTheDocument()
      expect(screen.getByText('難易度')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then タグ名が表示される', () => {
      render(<RecipeTagsSection recipeTags={mockRecipeTags} />)

      expect(screen.getByText('和食')).toBeInTheDocument()
      expect(screen.getByText('中華')).toBeInTheDocument()
      expect(screen.getByText('簡単')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then タグがカテゴリ別にグループ化される', () => {
      render(<RecipeTagsSection recipeTags={mockRecipeTags} />)

      // ジャンルカテゴリの要素を探す
      const genreSection = screen.getByText('ジャンル').closest('div')
      expect(genreSection).toBeInTheDocument()

      // 難易度カテゴリの要素を探す
      const difficultySection = screen.getByText('難易度').closest('div')
      expect(difficultySection).toBeInTheDocument()
    })
  })

  describe('Given タグが存在しない場合', () => {
    it('When コンポーネントをレンダリングする Then 何も表示されない', () => {
      const { container } = render(<RecipeTagsSection recipeTags={[]} />)

      expect(container).toBeEmptyDOMElement()
    })
  })
})
