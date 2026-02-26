import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddRecipeDialog } from '../add-recipe-dialog'
import type { RecipeListOutput } from '@/backend/domain/recipes'

vi.mock('@/features/meal-planner/actions', () => ({
  addMealPlanItem: vi.fn(),
}))

// Radix Dialog Portal をインラインレンダリングに変更
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<typeof import('@radix-ui/react-dialog')>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  }
})

import { addMealPlanItem } from '@/features/meal-planner/actions'

const mockRecipes: RecipeListOutput[] = [
  {
    id: 'recipe-1',
    userId: 'user-1',
    title: 'カレーライス',
    imageUrl: null,
    memo: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ingredients: [],
    recipeTags: [],
  },
  {
    id: 'recipe-2',
    userId: 'user-1',
    title: '味噌汁',
    imageUrl: null,
    memo: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ingredients: [],
    recipeTags: [],
  },
  {
    id: 'recipe-3',
    userId: 'user-1',
    title: 'カレーうどん',
    imageUrl: null,
    memo: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ingredients: [],
    recipeTags: [],
  },
]

describe('AddRecipeDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    dayOfWeek: 0 as number | null,
    weekStart: '2026-03-02',
    recipes: mockRecipes,
    onItemAdded: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：ダイアログのタイトルに曜日が表示される', () => {
    render(<AddRecipeDialog {...defaultProps} dayOfWeek={0} />)

    expect(screen.getByText('レシピを追加 - 月曜日')).toBeInTheDocument()
  })

  test('正常系：説明が表示される', () => {
    render(<AddRecipeDialog {...defaultProps} />)

    expect(screen.getByText('献立に追加するレシピを選択してください')).toBeInTheDocument()
  })

  test('正常系：レシピ一覧が表示される', () => {
    render(<AddRecipeDialog {...defaultProps} />)

    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    expect(screen.getByText('味噌汁')).toBeInTheDocument()
    expect(screen.getByText('カレーうどん')).toBeInTheDocument()
  })

  test('正常系：検索でレシピをフィルタリングできる', async () => {
    const user = userEvent.setup()
    render(<AddRecipeDialog {...defaultProps} />)

    // When: 「カレー」で検索
    await user.type(screen.getByPlaceholderText('レシピを検索...'), 'カレー')

    // Then: カレーを含むレシピのみ表示
    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    expect(screen.getByText('カレーうどん')).toBeInTheDocument()
    expect(screen.queryByText('味噌汁')).not.toBeInTheDocument()
  })

  test('正常系：検索結果がない場合はメッセージが表示される', async () => {
    const user = userEvent.setup()
    render(<AddRecipeDialog {...defaultProps} />)

    await user.type(screen.getByPlaceholderText('レシピを検索...'), 'ラーメン')

    expect(screen.getByText('レシピが見つかりません')).toBeInTheDocument()
  })

  test('正常系：レシピを選択するとaddMealPlanItemが呼ばれる', async () => {
    vi.mocked(addMealPlanItem).mockResolvedValueOnce({
      ok: true,
      data: {
        id: 'new-item',
        dayOfWeek: 0,
        recipe: { id: 'recipe-1', title: 'カレーライス', imageUrl: null, ingredients: [] },
      },
    })
    const user = userEvent.setup()
    render(<AddRecipeDialog {...defaultProps} dayOfWeek={2} />)

    // When: カレーライスを選択
    await user.click(screen.getByText('カレーライス'))

    // Then: 正しい引数で呼ばれる
    await waitFor(() => {
      expect(addMealPlanItem).toHaveBeenCalledWith('2026-03-02', 2, 'recipe-1')
    })
  })

  test('正常系：追加成功後にダイアログが閉じる', async () => {
    vi.mocked(addMealPlanItem).mockResolvedValueOnce({
      ok: true,
      data: {
        id: 'new-item',
        dayOfWeek: 0,
        recipe: { id: 'recipe-1', title: 'カレーライス', imageUrl: null, ingredients: [] },
      },
    })
    const user = userEvent.setup()
    render(<AddRecipeDialog {...defaultProps} />)

    await user.click(screen.getByText('カレーライス'))

    await waitFor(() => {
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
      expect(defaultProps.onItemAdded).toHaveBeenCalled()
    })
  })

  test('正常系：open=falseの場合ダイアログが表示されない', () => {
    render(<AddRecipeDialog {...defaultProps} open={false} />)

    expect(screen.queryByText('レシピを追加')).not.toBeInTheDocument()
  })

  test('正常系：水曜日のタイトルが表示される', () => {
    render(<AddRecipeDialog {...defaultProps} dayOfWeek={2} />)

    expect(screen.getByText('レシピを追加 - 水曜日')).toBeInTheDocument()
  })
})
