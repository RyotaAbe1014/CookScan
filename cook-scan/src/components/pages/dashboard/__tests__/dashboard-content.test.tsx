import type { Route } from 'next'
import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { DashboardContent } from '../dashboard-content'
import type { TodayMealPlanSummary } from '@/features/meal-planner/components/today-meal-plan-section'
import type { RecipeBasic } from '@/types/recipe'

// 子コンポーネントをモック
vi.mock('../welcome-section', () => ({
  WelcomeSection: ({ profile }: { profile: { name: string | null; email: string } }) => (
    <div data-testid="welcome-section">
      WelcomeSection: {profile.name || 'ゲスト'} ({profile.email})
    </div>
  ),
}))

vi.mock('@/features/recipes/list/recent-recipes-section', () => ({
  RecentRecipesSection: ({ recipes }: { recipes: RecipeBasic[] }) => (
    <div data-testid="recent-recipes-section">
      RecentRecipesSection: {recipes.length}
    </div>
  ),
}))

vi.mock('@/features/meal-planner/components/today-meal-plan-section', () => ({
  TodayMealPlanSection: ({
    summary,
  }: {
    summary: { items: Array<{ id: string; title: string }> }
  }) => (
    <div data-testid="today-menu-section">
      TodayMealPlanSection: {summary.items.length}
    </div>
  ),
}))

vi.mock('../quick-actions', () => ({
  QuickActions: () => <div data-testid="quick-actions">QuickActions</div>,
}))

describe('DashboardContent', () => {
  const mockProfile = {
    name: '山田太郎',
    email: 'yamada@example.com',
  }
  const mockRecentRecipes: RecipeBasic[] = [
    {
      id: 'recipe-1',
      title: 'カレー',
      imageUrl: null,
      createdAt: new Date('2024-01-15'),
      ingredients: [{ id: 'ingredient-1' }],
      recipeTags: [],
    },
  ]
  const mockTodayMealPlanSummary: TodayMealPlanSummary = {
    weekStart: '2026-03-02',
    plannerHref: '/meal-planner?week=2026-03-02' as Route,
    dateLabel: '3/8（日）',
    items: [
      {
        id: 'meal-plan-item-1',
        title: 'カレー',
      },
    ],
  }

  test('正常系：WelcomeSectionが表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: WelcomeSectionが表示される
    expect(screen.getByTestId('welcome-section')).toBeInTheDocument()
  })

  test('正常系：WelcomeSectionにプロフィールが渡される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: WelcomeSectionにプロフィール情報が渡される
    const welcomeSection = screen.getByTestId('welcome-section')
    expect(welcomeSection.textContent).toContain('山田太郎')
    expect(welcomeSection.textContent).toContain('yamada@example.com')
  })

  test('正常系：TodayMealPlanSectionが表示される', () => {
    // Given: 今日の献立情報
    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: TodayMealPlanSectionが表示される
    expect(screen.getByTestId('today-menu-section')).toBeInTheDocument()
  })

  test('正常系：TodayMealPlanSectionに今日の献立が渡される', () => {
    // Given: 今日の献立情報
    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: 今日の献立件数が渡される
    expect(screen.getByTestId('today-menu-section')).toHaveTextContent('1')
  })

  test('正常系：RecentRecipesSectionが表示される', () => {
    // Given: プロフィール情報と最近追加したレシピ
    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: RecentRecipesSectionが表示される
    expect(screen.getByTestId('recent-recipes-section')).toBeInTheDocument()
  })

  test('正常系：RecentRecipesSectionに最近追加したレシピが渡される', () => {
    // Given: 最近追加したレシピ
    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: レシピ件数が渡される
    expect(screen.getByTestId('recent-recipes-section')).toHaveTextContent('1')
  })

  test('正常系：QuickActionsが表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: QuickActionsが表示される
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  test('正常系：全ての子コンポーネントが正しい順序で表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    const { container } = render(
      <DashboardContent
        profile={mockProfile}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: 4つの子コンポーネントが正しい順序で表示される
    const elements = container.querySelectorAll('[data-testid]')
    expect(elements.length).toBe(4)
    expect(elements[0]).toHaveAttribute('data-testid', 'welcome-section')
    expect(elements[1]).toHaveAttribute('data-testid', 'today-menu-section')
    expect(elements[2]).toHaveAttribute('data-testid', 'recent-recipes-section')
    expect(elements[3]).toHaveAttribute('data-testid', 'quick-actions')
  })

  test('正常系：プロフィール名がnullの場合でも正しく表示される', () => {
    // Given: プロフィール名がnull
    const profileWithoutName = {
      name: null,
      email: 'guest@example.com',
    }

    // When: DashboardContentをレンダリングする
    render(
      <DashboardContent
        profile={profileWithoutName}
        recentRecipes={mockRecentRecipes}
        todayMealPlanSummary={mockTodayMealPlanSummary}
      />
    )

    // Then: ゲストと表示される
    const welcomeSection = screen.getByTestId('welcome-section')
    expect(welcomeSection.textContent).toContain('ゲスト')
    expect(welcomeSection.textContent).toContain('guest@example.com')
  })
})
