import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeIngredients } from '../recipe-ingredients'
import type { Ingredient } from '@/types/ingredient'

describe('RecipeIngredients', () => {
  describe('Given 材料が存在する場合', () => {
    const mockIngredients: Ingredient[] = [
      {
        id: '1',
        recipeId: 'recipe-1',
        name: 'にんじん',
        unit: '1本',
        notes: '皮をむく',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        recipeId: 'recipe-1',
        name: 'たまねぎ',
        unit: '2個',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        recipeId: 'recipe-1',
        name: '塩',
        unit: null,
        notes: '適量',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    it('When コンポーネントをレンダリングする Then 材料一覧が表示される', () => {
      render(<RecipeIngredients ingredients={mockIngredients} />)

      expect(screen.getByText('材料')).toBeInTheDocument()
      expect(screen.getByText('にんじん')).toBeInTheDocument()
      expect(screen.getByText('たまねぎ')).toBeInTheDocument()
      expect(screen.getByText('塩')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then 単位が表示される', () => {
      render(<RecipeIngredients ingredients={mockIngredients} />)

      expect(screen.getByText('1本')).toBeInTheDocument()
      expect(screen.getByText('2個')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then ノートが表示される', () => {
      render(<RecipeIngredients ingredients={mockIngredients} />)

      expect(screen.getByText('皮をむく')).toBeInTheDocument()
      expect(screen.getByText('適量')).toBeInTheDocument()
    })
  })

  describe('Given 材料が存在しない場合', () => {
    it('When コンポーネントをレンダリングする Then 空の状態メッセージが表示される', () => {
      render(<RecipeIngredients ingredients={[]} />)

      expect(screen.getByText('材料')).toBeInTheDocument()
      expect(screen.getByText('材料が登録されていません')).toBeInTheDocument()
    })
  })
})
