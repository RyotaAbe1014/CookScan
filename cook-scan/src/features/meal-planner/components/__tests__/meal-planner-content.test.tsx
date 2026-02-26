import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MealPlannerContent } from '../meal-planner-content'
import type { MealPlanOutput } from '@/backend/domain/meal-plans'
import type { RecipeListOutput } from '@/backend/domain/recipes'

// next/navigation モック
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

vi.mock('@/features/meal-planner/actions', () => ({
  removeMealPlanItem: vi.fn(),
  addMealPlanItem: vi.fn(),
  generateShoppingList: vi.fn(),
}))

// Radix Dialog Portal をインラインレンダリングに変更
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<typeof import('@radix-ui/react-dialog')>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  }
})

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
]

const mockPlan: MealPlanOutput = {
  id: 'plan-1',
  weekStart: new Date('2026-03-02'),
  items: [
    {
      id: 'item-1',
      dayOfWeek: 0,
      recipe: {
        id: 'recipe-1',
        title: 'カレーライス',
        imageUrl: null,
        ingredients: [],
      },
    },
    {
      id: 'item-2',
      dayOfWeek: 3,
      recipe: {
        id: 'recipe-2',
        title: '肉じゃが',
        imageUrl: null,
        ingredients: [],
      },
    },
  ],
}

describe('MealPlannerContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：7日分のカードが表示される', () => {
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={null}
        recipes={mockRecipes}
      />
    )

    expect(screen.getByText('月')).toBeInTheDocument()
    expect(screen.getByText('火')).toBeInTheDocument()
    expect(screen.getByText('水')).toBeInTheDocument()
    expect(screen.getByText('木')).toBeInTheDocument()
    expect(screen.getByText('金')).toBeInTheDocument()
    expect(screen.getByText('土')).toBeInTheDocument()
    expect(screen.getByText('日')).toBeInTheDocument()
  })

  test('正常系：週ナビゲーターが表示される', () => {
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={null}
        recipes={mockRecipes}
      />
    )

    expect(screen.getByText('3/2 〜 3/8')).toBeInTheDocument()
  })

  test('正常系：プランのレシピが対応する曜日に表示される', () => {
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={mockPlan}
        recipes={mockRecipes}
      />
    )

    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    expect(screen.getByText('肉じゃが')).toBeInTheDocument()
  })

  test('正常系：プランがnullの場合、全日「レシピなし」が表示される', () => {
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={null}
        recipes={mockRecipes}
      />
    )

    const emptyMessages = screen.getAllByText('レシピなし')
    expect(emptyMessages).toHaveLength(7)
  })

  test('正常系：買い物リスト生成ボタンが表示される', () => {
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={null}
        recipes={mockRecipes}
      />
    )

    expect(screen.getByRole('button', { name: /買い物リストを生成/ })).toBeInTheDocument()
  })

  test('正常系：プランがない場合、買い物リスト生成ボタンが無効になる', () => {
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={null}
        recipes={mockRecipes}
      />
    )

    expect(screen.getByRole('button', { name: /買い物リストを生成/ })).toBeDisabled()
  })

  test('正常系：プランがある場合、買い物リスト生成ボタンが有効になる', () => {
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={mockPlan}
        recipes={mockRecipes}
      />
    )

    expect(screen.getByRole('button', { name: /買い物リストを生成/ })).toBeEnabled()
  })

  test('正常系：次週ボタンをクリックするとrouter.pushが呼ばれる', async () => {
    const user = userEvent.setup()
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={null}
        recipes={mockRecipes}
      />
    )

    // 右矢印ボタン（最後のアイコンボタン）をクリック
    const allButtons = screen.getAllByRole('button')
    // 右矢印は「今週」ボタンの次
    const nextButton = allButtons.find((_, i) => {
      const prevBtn = allButtons[i - 1]
      return prevBtn?.textContent === '今週'
    })
    if (nextButton) {
      await user.click(nextButton)
    }

    expect(mockPush).toHaveBeenCalledWith('/meal-planner?week=2026-03-09')
  })

  test('正常系：追加ボタンをクリックするとレシピ追加ダイアログが表示される', async () => {
    const user = userEvent.setup()
    render(
      <MealPlannerContent
        initialWeekStart="2026-03-02"
        initialPlan={null}
        recipes={mockRecipes}
      />
    )

    // 最初の「追加」ボタンをクリック
    const addButtons = screen.getAllByRole('button', { name: /追加/ })
    await user.click(addButtons[0])

    // ダイアログが表示される
    expect(screen.getByText('献立に追加するレシピを選択してください')).toBeInTheDocument()
  })
})
