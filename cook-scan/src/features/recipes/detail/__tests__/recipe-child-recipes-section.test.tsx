import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeChildRecipesSection } from '../recipe-child-recipes-section'
import type { ChildRecipeRelation } from '@/types/recipe'

describe('RecipeChildRecipesSection', () => {
  const mockChildRecipes: ChildRecipeRelation[] = [
    {
      id: 'rel-1',
      childRecipeId: 'child-1',
      quantity: '大さじ2',
      notes: '事前に作っておく',
      createdAt: new Date('2024-01-01'),
      childRecipe: {
        id: 'child-1',
        title: '自家製ドレッシング',
        imageUrl: null,
      },
    },
    {
      id: 'rel-2',
      childRecipeId: 'child-2',
      quantity: null,
      notes: null,
      createdAt: new Date('2024-01-02'),
      childRecipe: {
        id: 'child-2',
        title: 'サラダ',
        imageUrl: null,
      },
    },
  ]

  it('子レシピが0件の場合はnullを返す', () => {
    const { container } = render(<RecipeChildRecipesSection childRecipes={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('子レシピのタイトルが表示される', () => {
    render(<RecipeChildRecipesSection childRecipes={mockChildRecipes} />)
    expect(screen.getByText('自家製ドレッシング')).toBeInTheDocument()
    expect(screen.getByText('サラダ')).toBeInTheDocument()
  })

  it('分量とメモが表示される', () => {
    render(<RecipeChildRecipesSection childRecipes={mockChildRecipes} />)
    expect(screen.getByText('大さじ2')).toBeInTheDocument()
    expect(screen.getByText('事前に作っておく')).toBeInTheDocument()
  })

  it('詳細ページへのリンクが正しい', () => {
    render(<RecipeChildRecipesSection childRecipes={mockChildRecipes} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/recipes/child-1')
    expect(links[1]).toHaveAttribute('href', '/recipes/child-2')
  })

  it('セクションタイトルが「サブレシピ」と表示される', () => {
    render(<RecipeChildRecipesSection childRecipes={mockChildRecipes} />)
    expect(screen.getByText('サブレシピ')).toBeInTheDocument()
  })
})
