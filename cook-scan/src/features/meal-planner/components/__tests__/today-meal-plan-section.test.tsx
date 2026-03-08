import type { Route } from 'next'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import {
  TodayMealPlanSection,
  type TodayMealPlanSummary,
} from '../today-meal-plan-section'

function createSummary(
  overrides: Partial<TodayMealPlanSummary> = {}
): TodayMealPlanSummary {
  return {
    weekStart: '2026-03-02',
    plannerHref: '/meal-planner?week=2026-03-02' as Route,
    dateLabel: '3/8（日）',
    items: [
      { id: 'item-1', title: 'カレーライス' },
      { id: 'item-2', title: '味噌汁' },
      { id: 'item-3', title: 'サラダ' },
      { id: 'item-4', title: '唐揚げ' },
    ],
    ...overrides,
  }
}

describe('TodayMealPlanSection', () => {
  test('正常系：今日の献立がない場合は空状態とCTAが表示される', () => {
    render(<TodayMealPlanSection summary={createSummary({ items: [] })} />)

    expect(screen.getByText('今日の献立は未登録です')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '献立を追加' })).toHaveAttribute(
      'href',
      '/meal-planner?week=2026-03-02'
    )
  })

  test('正常系：今日の献立が3件以内なら全タイトルが表示される', () => {
    render(
      <TodayMealPlanSection
        summary={createSummary({
          items: [
            { id: 'item-1', title: 'カレーライス' },
            { id: 'item-2', title: '味噌汁' },
            { id: 'item-3', title: 'サラダ' },
          ],
        })}
      />
    )

    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    expect(screen.getByText('味噌汁')).toBeInTheDocument()
    expect(screen.getByText('サラダ')).toBeInTheDocument()
  })

  test('正常系：今日の献立が4件以上なら3件のみ表示して残件数を表示する', () => {
    render(<TodayMealPlanSection summary={createSummary()} />)

    expect(screen.getByText('カレーライス')).toBeInTheDocument()
    expect(screen.getByText('味噌汁')).toBeInTheDocument()
    expect(screen.getByText('サラダ')).toBeInTheDocument()
    expect(screen.queryByText('唐揚げ')).not.toBeInTheDocument()
    expect(screen.getByText('他1件')).toBeInTheDocument()
  })

  test('正常系：上部リンクと空状態CTAがどちらも献立プランナーを指す', () => {
    render(<TodayMealPlanSection summary={createSummary({ items: [] })} />)

    expect(screen.getByRole('link', { name: '献立プランナーへ' })).toHaveAttribute(
      'href',
      '/meal-planner?week=2026-03-02'
    )
    expect(screen.getByRole('link', { name: '献立を追加' })).toHaveAttribute(
      'href',
      '/meal-planner?week=2026-03-02'
    )
  })
})
