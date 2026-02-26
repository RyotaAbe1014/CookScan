import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MealPlanDayCard } from '../meal-plan-day-card'
import type { MealPlanItemOutput } from '@/backend/domain/meal-plans'

vi.mock('@/features/meal-planner/actions', () => ({
  removeMealPlanItem: vi.fn(),
}))

import { removeMealPlanItem } from '@/features/meal-planner/actions'

const mockItems: MealPlanItemOutput[] = [
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
    dayOfWeek: 0,
    recipe: {
      id: 'recipe-2',
      title: '味噌汁',
      imageUrl: null,
      ingredients: [],
    },
  },
]

describe('MealPlanDayCard', () => {
  const defaultProps = {
    dayOfWeek: 0,
    date: new Date(2026, 2, 2), // 2026-03-02 月曜日
    items: mockItems,
    onAddRecipe: vi.fn(),
    onItemRemoved: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：曜日ラベルが表示される', () => {
    render(<MealPlanDayCard {...defaultProps} />)

    expect(screen.getByText('月')).toBeInTheDocument()
  })

  test('正常系：日付が表示される', () => {
    render(<MealPlanDayCard {...defaultProps} />)

    expect(screen.getByText('3/2')).toBeInTheDocument()
  })

  test('正常系：レシピ名が表示される', () => {
    render(<MealPlanDayCard {...defaultProps} />)

    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    expect(screen.getByText('味噌汁')).toBeInTheDocument()
  })

  test('正常系：アイテムがない場合は「レシピなし」が表示される', () => {
    render(<MealPlanDayCard {...defaultProps} items={[]} />)

    expect(screen.getByText('レシピなし')).toBeInTheDocument()
  })

  test('正常系：追加ボタンが表示される', () => {
    render(<MealPlanDayCard {...defaultProps} />)

    expect(screen.getByRole('button', { name: /追加/ })).toBeInTheDocument()
  })

  test('正常系：追加ボタンをクリックするとonAddRecipeが曜日番号付きで呼ばれる', async () => {
    const user = userEvent.setup()
    render(<MealPlanDayCard {...defaultProps} dayOfWeek={2} date={new Date(2026, 2, 4)} />)

    await user.click(screen.getByRole('button', { name: /追加/ }))

    expect(defaultProps.onAddRecipe).toHaveBeenCalledWith(2)
  })

  test('正常系：土曜日のカードが表示される', () => {
    render(<MealPlanDayCard {...defaultProps} dayOfWeek={5} date={new Date(2026, 2, 7)} items={[]} />)

    expect(screen.getByText('土')).toBeInTheDocument()
  })

  test('正常系：日曜日のカードが表示される', () => {
    render(<MealPlanDayCard {...defaultProps} dayOfWeek={6} date={new Date(2026, 2, 8)} items={[]} />)

    expect(screen.getByText('日')).toBeInTheDocument()
  })

  test('正常系：削除ボタンをクリックするとremoveMealPlanItemが呼ばれる', async () => {
    vi.mocked(removeMealPlanItem).mockResolvedValueOnce({ ok: true, data: undefined })
    const user = userEvent.setup()
    render(<MealPlanDayCard {...defaultProps} items={[mockItems[0]]} />)

    // 削除ボタン（ゴミ箱アイコン）をクリック
    const deleteButtons = screen.getAllByRole('button').filter(
      (btn) => !btn.textContent?.includes('追加')
    )
    await user.click(deleteButtons[0])

    expect(removeMealPlanItem).toHaveBeenCalledWith('item-1')
  })
})
