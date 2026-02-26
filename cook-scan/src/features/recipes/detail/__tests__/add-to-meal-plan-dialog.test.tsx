import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddToMealPlanDialog } from '../add-to-meal-plan-dialog'

vi.mock('@/features/meal-planner/actions', () => ({
  addMealPlanItem: vi.fn(),
}))

vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<typeof import('@radix-ui/react-dialog')>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  }
})

import { addMealPlanItem } from '@/features/meal-planner/actions'

describe('AddToMealPlanDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    recipeId: 'recipe-1',
    onSuccess: vi.fn(),
    onError: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常系：ダイアログのタイトルと説明が表示される', () => {
    render(<AddToMealPlanDialog {...defaultProps} />)

    expect(screen.getByText('献立に追加')).toBeInTheDocument()
    expect(screen.getByText('追加する曜日を選択してください')).toBeInTheDocument()
  })

  it('正常系：7つの曜日ボタンが表示される', () => {
    render(<AddToMealPlanDialog {...defaultProps} />)

    expect(screen.getByText('月')).toBeInTheDocument()
    expect(screen.getByText('火')).toBeInTheDocument()
    expect(screen.getByText('水')).toBeInTheDocument()
    expect(screen.getByText('木')).toBeInTheDocument()
    expect(screen.getByText('金')).toBeInTheDocument()
    expect(screen.getByText('土')).toBeInTheDocument()
    expect(screen.getByText('日')).toBeInTheDocument()
  })

  it('正常系：曜日を選択するとaddMealPlanItemが呼ばれる', async () => {
    vi.mocked(addMealPlanItem).mockResolvedValueOnce({
      ok: true,
      data: {
        id: 'new-item',
        dayOfWeek: 2,
        recipe: { id: 'recipe-1', title: 'カレー', imageUrl: null, ingredients: [] },
      },
    })
    const user = userEvent.setup()
    render(<AddToMealPlanDialog {...defaultProps} />)

    await user.click(screen.getByText('水'))

    await waitFor(() => {
      expect(addMealPlanItem).toHaveBeenCalledWith(
        expect.any(String),
        2,
        'recipe-1'
      )
    })
  })

  it('正常系：追加成功後にonSuccessが呼ばれダイアログが閉じる', async () => {
    vi.mocked(addMealPlanItem).mockResolvedValueOnce({
      ok: true,
      data: {
        id: 'new-item',
        dayOfWeek: 0,
        recipe: { id: 'recipe-1', title: 'カレー', imageUrl: null, ingredients: [] },
      },
    })
    const user = userEvent.setup()
    render(<AddToMealPlanDialog {...defaultProps} />)

    await user.click(screen.getByText('月'))

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled()
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('異常系：追加失敗時にonErrorが呼ばれる', async () => {
    vi.mocked(addMealPlanItem).mockResolvedValueOnce({
      ok: false,
      error: { code: 'SERVER_ERROR', message: 'エラー' },
    })
    const user = userEvent.setup()
    render(<AddToMealPlanDialog {...defaultProps} />)

    await user.click(screen.getByText('月'))

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalled()
    })
  })

  it('正常系：open=falseの場合ダイアログが表示されない', () => {
    render(<AddToMealPlanDialog {...defaultProps} open={false} />)

    expect(screen.queryByText('献立に追加')).not.toBeInTheDocument()
  })
})
