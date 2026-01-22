import { render, screen, fireEvent } from '@testing-library/react'
import { MobileNav } from './mobile-nav'
import { vi } from 'vitest'
import { usePathname } from 'next/navigation'

// モック: next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

// モック: next/link
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, onClick, className }: { children: React.ReactNode; href: string; onClick?: () => void; className?: string }) => (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    ),
  }
})

describe('MobileNav', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/dashboard')
  })

  test('すべてのリンクが表示される', () => {
    render(<MobileNav onUiLinkClick={vi.fn()} />)

    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    expect(screen.getByText('レシピ')).toBeInTheDocument()
    expect(screen.getByText('タグ')).toBeInTheDocument()
    expect(screen.getByText('プロフィール')).toBeInTheDocument()
  })

  test('現在のアクティブなパスが強調表示される', () => {
    vi.mocked(usePathname).mockReturnValue('/recipes')
    render(<MobileNav onUiLinkClick={vi.fn()} />)

    const recipesLink = screen.getByText('レシピ').closest('a')
    expect(recipesLink).toHaveClass('bg-emerald-50')
    expect(recipesLink).toHaveClass('text-emerald-600')

    const dashboardLink = screen.getByText('ダッシュボード').closest('a')
    expect(dashboardLink).not.toHaveClass('bg-emerald-50')
  })

  test('リンクをクリックするとonUiLinkClickが呼ばれる', () => {
    const onUiLinkClick = vi.fn()
    render(<MobileNav onUiLinkClick={onUiLinkClick} />)

    fireEvent.click(screen.getByText('ダッシュボード'))
    expect(onUiLinkClick).toHaveBeenCalledTimes(1)
  })

  test('ログアウトボタンが表示され、クリックするとonLogoutClickが呼ばれる', () => {
    const onLogoutClick = vi.fn()
    render(<MobileNav onUiLinkClick={vi.fn()} onLogoutClick={onLogoutClick} />)

    const logoutButton = screen.getByText('Log out')
    expect(logoutButton).toBeInTheDocument()

    fireEvent.click(logoutButton)
    expect(onLogoutClick).toHaveBeenCalledTimes(1)
  })

  test('onLogoutClickが未指定の場合、ログアウトボタンは表示されない', () => {
    render(<MobileNav onUiLinkClick={vi.fn()} />)
    expect(screen.queryByText('Log out')).not.toBeInTheDocument()
  })

  test('ログアウト中はローディング状態が表示される', () => {
    const onLogoutClick = vi.fn()
    render(<MobileNav onUiLinkClick={vi.fn()} onLogoutClick={onLogoutClick} isLoggingOut={true} />)

    expect(screen.getByText('ログアウト中...')).toBeInTheDocument()
    expect(screen.queryByText('Log out')).not.toBeInTheDocument()

    const logoutButton = screen.getByRole('button')
    expect(logoutButton).toBeDisabled()
  })

  test('ログアウト中でない場合は通常表示', () => {
    const onLogoutClick = vi.fn()
    render(<MobileNav onUiLinkClick={vi.fn()} onLogoutClick={onLogoutClick} isLoggingOut={false} />)

    expect(screen.getByText('Log out')).toBeInTheDocument()
    expect(screen.queryByText('ログアウト中...')).not.toBeInTheDocument()

    const logoutButton = screen.getByRole('button')
    expect(logoutButton).not.toBeDisabled()
  })
})
