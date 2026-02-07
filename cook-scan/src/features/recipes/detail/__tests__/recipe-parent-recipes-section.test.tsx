import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeParentRecipesSection } from '../recipe-parent-recipes-section'
import type { ParentRecipeRelation } from '@/types/recipe'

describe('RecipeParentRecipesSection', () => {
  const mockParentRecipes: ParentRecipeRelation[] = [
    {
      id: 'rel-1',
      parentRecipeId: 'parent-1',
      quantity: null,
      notes: null,
      parentRecipe: {
        id: 'parent-1',
        title: 'フルコースディナー',
        imageUrl: null,
      },
    },
    {
      id: 'rel-2',
      parentRecipeId: 'parent-2',
      quantity: null,
      notes: null,
      parentRecipe: {
        id: 'parent-2',
        title: 'おもてなしセット',
        imageUrl: null,
      },
    },
  ]

  it('親レシピが0件の場合はnullを返す', () => {
    const { container } = render(<RecipeParentRecipesSection parentRecipes={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('親レシピのタイトルが表示される', () => {
    render(<RecipeParentRecipesSection parentRecipes={mockParentRecipes} />)
    expect(screen.getByText('フルコースディナー')).toBeInTheDocument()
    expect(screen.getByText('おもてなしセット')).toBeInTheDocument()
  })

  it('詳細ページへのリンクが正しい', () => {
    render(<RecipeParentRecipesSection parentRecipes={mockParentRecipes} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/recipes/parent-1')
    expect(links[1]).toHaveAttribute('href', '/recipes/parent-2')
  })

  it('セクションタイトルが表示される', () => {
    render(<RecipeParentRecipesSection parentRecipes={mockParentRecipes} />)
    expect(screen.getByText('このレシピを使用しているレシピ')).toBeInTheDocument()
  })
})
