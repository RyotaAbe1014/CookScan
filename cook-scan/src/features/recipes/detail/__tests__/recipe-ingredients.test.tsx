import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeIngredients } from '../recipe-ingredients'
import type { Ingredient } from '@/types/ingredient'

vi.mock('@/features/shopping-list/actions', () => ({
  createShoppingItems: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const { createShoppingItems } = await import('@/features/shopping-list/actions')
const mockedCreateShoppingItems = vi.mocked(createShoppingItems)

describe('RecipeIngredients', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Given 材料が存在する場合', () => {
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

    it('When コンポーネントをレンダリングする Then まとめて追加ボタンが表示される', () => {
      render(<RecipeIngredients ingredients={mockIngredients} />)

      expect(screen.getByText('まとめて追加')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then 各材料に買い物リスト追加ボタンが表示される', () => {
      render(<RecipeIngredients ingredients={mockIngredients} />)

      expect(screen.getByLabelText('にんじんを買い物リストに追加')).toBeInTheDocument()
      expect(screen.getByLabelText('たまねぎを買い物リストに追加')).toBeInTheDocument()
      expect(screen.getByLabelText('塩を買い物リストに追加')).toBeInTheDocument()
    })

    it('When 個別追加ボタンをクリックする Then 買い物リストに追加される', async () => {
      const user = userEvent.setup()
      mockedCreateShoppingItems.mockResolvedValueOnce({
        ok: true,
        data: { count: 1 },
      })

      render(<RecipeIngredients ingredients={mockIngredients} />)

      await user.click(screen.getByLabelText('にんじんを買い物リストに追加'))

      expect(mockedCreateShoppingItems).toHaveBeenCalledWith([
        { name: 'にんじん', memo: '1本 / 皮をむく' },
      ])
    })

    it('When まとめて追加ボタンをクリックする Then 全材料が買い物リストに追加される', async () => {
      const user = userEvent.setup()
      mockedCreateShoppingItems.mockResolvedValueOnce({
        ok: true,
        data: { count: 3 },
      })

      render(<RecipeIngredients ingredients={mockIngredients} />)

      await user.click(screen.getByText('まとめて追加'))

      expect(mockedCreateShoppingItems).toHaveBeenCalledWith([
        { name: 'にんじん', memo: '1本 / 皮をむく' },
        { name: 'たまねぎ', memo: '2個' },
        { name: '塩', memo: '適量' },
      ])
    })
  })

  describe('Given 材料が存在しない場合', () => {
    it('When コンポーネントをレンダリングする Then 空の状態メッセージが表示される', () => {
      render(<RecipeIngredients ingredients={[]} />)

      expect(screen.getByText('材料')).toBeInTheDocument()
      expect(screen.getByText('材料が登録されていません')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then まとめて追加ボタンが表示されない', () => {
      render(<RecipeIngredients ingredients={[]} />)

      expect(screen.queryByText('まとめて追加')).not.toBeInTheDocument()
    })
  })
})
