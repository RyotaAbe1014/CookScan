import { render, screen, waitFor } from '@testing-library/react'
import { Header } from './header'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { logout } from '@/features/auth/actions'

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
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(logout).mockResolvedValue(undefined as any)
  })

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

  test('正常系：サブタイトルが指定された場合に表示される', () => {
    render(<Header title="Test Title" subtitle="サブタイトル" />)
    expect(screen.getByText('サブタイトル')).toBeInTheDocument()
  })

  test('正常系：サブタイトルが未指定の場合は表示されない', () => {
    render(<Header title="Test Title" />)
    expect(screen.queryByText('サブタイトル')).not.toBeInTheDocument()
  })

  test('正常系：rightActionが指定された場合に表示される', () => {
    render(<Header title="Test Title" rightAction={<button>アクション</button>} />)
    expect(screen.getByText('アクション')).toBeInTheDocument()
  })

  test('正常系：rightActionが未指定の場合は表示されない', () => {
    const { container } = render(<Header title="Test Title" />)
    // rightActionラッパーのdivは存在しない
    const actionWrapper = container.querySelector('.flex.w-full.flex-wrap')
    expect(actionWrapper).not.toBeInTheDocument()
  })

  test('正常系：メニュー内のLog outボタンが表示される', async () => {
    const user = userEvent.setup()
    render(<Header title="Test Title" />)

    await user.click(screen.getByLabelText('メニューを開く'))

    await waitFor(() => {
      expect(screen.getByText('Log out')).toBeInTheDocument()
    })
  })

  test('正常系：ログアウトボタンクリックでlogoutが呼ばれる', async () => {
    const user = userEvent.setup()
    render(<Header title="Test Title" />)

    await user.click(screen.getByLabelText('メニューを開く'))

    await waitFor(() => {
      expect(screen.getByText('Log out')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Log out'))

    await waitFor(() => {
      expect(logout).toHaveBeenCalled()
    })
  })

  test('正常系：メニュー内のナビゲーションリンクが表示される', async () => {
    const user = userEvent.setup()
    render(<Header title="Test Title" />)

    await user.click(screen.getByLabelText('メニューを開く'))

    await waitFor(() => {
      expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
      expect(screen.getByText('レシピ')).toBeInTheDocument()
      expect(screen.getByText('買い物リスト')).toBeInTheDocument()
      expect(screen.getByText('タグ')).toBeInTheDocument()
      expect(screen.getByText('プロフィール')).toBeInTheDocument()
    })
  })

  test('正常系：ナビゲーションリンククリックでメニューが閉じる', async () => {
    const user = userEvent.setup()
    render(<Header title="Test Title" />)

    await user.click(screen.getByLabelText('メニューを開く'))

    await waitFor(() => {
      expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    })

    await user.click(screen.getByText('ダッシュボード'))

    // Sheet dialog should become invisible after link click
    await waitFor(() => {
      const dialog = screen.getByRole('dialog', { hidden: true })
      expect(dialog).toHaveClass('invisible')
    })
  })

  test('正常系：オーバーレイクリックでメニューが閉じる', async () => {
    const user = userEvent.setup()
    render(<Header title="Test Title" />)

    await user.click(screen.getByLabelText('メニューを開く'))

    await waitFor(() => {
      expect(screen.getByRole('dialog', { hidden: false })).toBeInTheDocument()
    })

    // Click the overlay (aria-label="Overlay")
    const overlay = screen.getByLabelText('Overlay')
    await user.click(overlay)

    await waitFor(() => {
      const dialog = screen.getByRole('dialog', { hidden: true })
      expect(dialog).toHaveClass('invisible')
    })
  })
})
