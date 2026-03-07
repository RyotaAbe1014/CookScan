import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { DashboardContent } from '../dashboard-content'
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

  test('正常系：WelcomeSectionが表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} recentRecipes={mockRecentRecipes} />)

    // Then: WelcomeSectionが表示される
    expect(screen.getByTestId('welcome-section')).toBeInTheDocument()
  })

  test('正常系：WelcomeSectionにプロフィールが渡される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} recentRecipes={mockRecentRecipes} />)

    // Then: WelcomeSectionにプロフィール情報が渡される
    const welcomeSection = screen.getByTestId('welcome-section')
    expect(welcomeSection.textContent).toContain('山田太郎')
    expect(welcomeSection.textContent).toContain('yamada@example.com')
  })

  test('正常系：RecentRecipesSectionが表示される', () => {
    // Given: プロフィール情報と最近追加したレシピ
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} recentRecipes={mockRecentRecipes} />)

    // Then: RecentRecipesSectionが表示される
    expect(screen.getByTestId('recent-recipes-section')).toBeInTheDocument()
  })

  test('正常系：RecentRecipesSectionに最近追加したレシピが渡される', () => {
    // Given: 最近追加したレシピ
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} recentRecipes={mockRecentRecipes} />)

    // Then: レシピ件数が渡される
    expect(screen.getByTestId('recent-recipes-section')).toHaveTextContent('1')
  })

  test('正常系：QuickActionsが表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} recentRecipes={mockRecentRecipes} />)

    // Then: QuickActionsが表示される
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  test('正常系：全ての子コンポーネントが正しい順序で表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    const { container } = render(
      <DashboardContent profile={mockProfile} recentRecipes={mockRecentRecipes} />
    )

    // Then: 3つの子コンポーネントが正しい順序で表示される
    const elements = container.querySelectorAll('[data-testid]')
    expect(elements.length).toBe(3)
    expect(elements[0]).toHaveAttribute('data-testid', 'welcome-section')
    expect(elements[1]).toHaveAttribute('data-testid', 'recent-recipes-section')
    expect(elements[2]).toHaveAttribute('data-testid', 'quick-actions')
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
      />
    )

    // Then: ゲストと表示される
    const welcomeSection = screen.getByTestId('welcome-section')
    expect(welcomeSection.textContent).toContain('ゲスト')
    expect(welcomeSection.textContent).toContain('guest@example.com')
  })
})
