import { render, screen, waitFor } from '@testing-library/react'
import { Header } from './header'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

// モック: next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
  useRouter: vi.fn(),
  redirect: vi.fn(),
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

// モック: auth actions
vi.mock('@/features/auth/actions', () => ({
  logout: vi.fn(),
}))

describe('Header', () => {
  test('正常系：タイトルが表示される', () => {
    render(<Header title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  test('正常系：ハンバーガーメニューが表示される', () => {
    render(<Header title="Test Title" />)
    const menuButton = screen.getByLabelText('メニューを開く')
    expect(menuButton).toBeInTheDocument()
  })

  test('正常系：メニューボタンクリックでメニューが開く', async () => {
    const user = userEvent.setup()
    render(<Header title="Test Title" />)
    const menuButton = screen.getByLabelText('メニューを開く')

    await user.click(menuButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog', { hidden: false })).toBeInTheDocument()
    })
  })
})
