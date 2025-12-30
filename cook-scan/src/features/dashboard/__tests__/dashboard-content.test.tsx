import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { DashboardContent } from '../dashboard-content'

// 子コンポーネントをモック
vi.mock('../welcome-section', () => ({
  WelcomeSection: ({ profile }: { profile: { name: string | null; email: string } }) => (
    <div data-testid="welcome-section">
      WelcomeSection: {profile.name || 'ゲスト'} ({profile.email})
    </div>
  ),
}))

vi.mock('../quick-actions', () => ({
  QuickActions: () => <div data-testid="quick-actions">QuickActions</div>,
}))

vi.mock('../features-overview', () => ({
  FeaturesOverview: () => <div data-testid="features-overview">FeaturesOverview</div>,
}))

describe('DashboardContent', () => {
  const mockProfile = {
    name: '山田太郎',
    email: 'yamada@example.com',
  }

  test('正常系：WelcomeSectionが表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} />)

    // Then: WelcomeSectionが表示される
    expect(screen.getByTestId('welcome-section')).toBeInTheDocument()
  })

  test('正常系：WelcomeSectionにプロフィールが渡される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} />)

    // Then: WelcomeSectionにプロフィール情報が渡される
    const welcomeSection = screen.getByTestId('welcome-section')
    expect(welcomeSection.textContent).toContain('山田太郎')
    expect(welcomeSection.textContent).toContain('yamada@example.com')
  })

  test('正常系：QuickActionsが表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} />)

    // Then: QuickActionsが表示される
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  test('正常系：FeaturesOverviewが表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={mockProfile} />)

    // Then: FeaturesOverviewが表示される
    expect(screen.getByTestId('features-overview')).toBeInTheDocument()
  })

  test('正常系：全ての子コンポーネントが正しい順序で表示される', () => {
    // Given: プロフィール情報
    // When: DashboardContentをレンダリングする
    const { container } = render(<DashboardContent profile={mockProfile} />)

    // Then: 3つの子コンポーネントが正しい順序で表示される
    const elements = container.querySelectorAll('[data-testid]')
    expect(elements.length).toBe(3)
    expect(elements[0]).toHaveAttribute('data-testid', 'welcome-section')
    expect(elements[1]).toHaveAttribute('data-testid', 'quick-actions')
    expect(elements[2]).toHaveAttribute('data-testid', 'features-overview')
  })

  test('正常系：プロフィール名がnullの場合でも正しく表示される', () => {
    // Given: プロフィール名がnull
    const profileWithoutName = {
      name: null,
      email: 'guest@example.com',
    }

    // When: DashboardContentをレンダリングする
    render(<DashboardContent profile={profileWithoutName} />)

    // Then: ゲストと表示される
    const welcomeSection = screen.getByTestId('welcome-section')
    expect(welcomeSection.textContent).toContain('ゲスト')
    expect(welcomeSection.textContent).toContain('guest@example.com')
  })
})
