import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Header } from './header'
import { vi } from 'vitest'
import { usePathname } from 'next/navigation'

// モック: next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
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
    vi.mocked(usePathname).mockReturnValue('/')
  })
  test('正常系：タイトルが表示される', () => {
    render(<Header title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  test('正常系：ハンバーガーメニューが表示される', () => {
    render(<Header title="Test Title" />)
    // ハンバーガーメニューボタンは sm:hidden だが DOM には存在する
    const menuButton = screen.getByLabelText('メニューを開く')
    expect(menuButton).toBeInTheDocument()
  })

  test('正常系：メニューボタンクリックでメニューが開く', async () => {
    render(<Header title="Test Title" />)
    const menuButton = screen.getByLabelText('メニューを開く')

    // 初期状態ではメニュー(Sheet)の中身は見えないはず (ポータルではないとしても opacity:0 等)
    // Sheetの実装はポータルではないのでDOMには存在するが visible ではない
    // テスト環境ではCSSの visible/invisible は効かない場合があるが、aria-modal="true" は開いた時だけつく

    fireEvent.click(menuButton)

    await waitFor(() => {
      expect(screen.getByRole('dialog', { hidden: false })).toBeInTheDocument()
    })
  })
})
