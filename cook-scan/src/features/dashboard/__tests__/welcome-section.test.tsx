import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { WelcomeSection } from '../welcome-section'

describe('WelcomeSection', () => {
  test('正常系：ユーザー名がある場合、名前が表示される', () => {
    // Given: ユーザー名を持つプロフィール
    const profile = {
      name: '山田太郎',
      email: 'yamada@example.com',
    }

    // When: WelcomeSectionをレンダリングする
    render(<WelcomeSection profile={profile} />)

    // Then: ユーザー名が表示される
    expect(screen.getByText('こんにちは、山田太郎さん')).toBeInTheDocument()
  })

  test('正常系：ユーザー名がnullの場合、ゲストと表示される', () => {
    // Given: ユーザー名がnullのプロフィール
    const profile = {
      name: null,
      email: 'guest@example.com',
    }

    // When: WelcomeSectionをレンダリングする
    render(<WelcomeSection profile={profile} />)

    // Then: ゲストと表示される
    expect(screen.getByText('こんにちは、ゲストさん')).toBeInTheDocument()
  })

  test('正常系：メールアドレスが表示される', () => {
    // Given: プロフィール情報
    const profile = {
      name: '山田太郎',
      email: 'yamada@example.com',
    }

    // When: WelcomeSectionをレンダリングする
    render(<WelcomeSection profile={profile} />)

    // Then: メールアドレスが表示される
    expect(screen.getByText('yamada@example.com')).toBeInTheDocument()
  })

  test('正常系：CookScanブランドが表示される', () => {
    // Given: プロフィール情報
    const profile = {
      name: '山田太郎',
      email: 'yamada@example.com',
    }

    // When: WelcomeSectionをレンダリングする
    render(<WelcomeSection profile={profile} />)

    // Then: CookScanブランドが表示される
    expect(screen.getByText('CookScan')).toBeInTheDocument()
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
  })

  test('正常系：ユーザーアイコンSVGが表示される', () => {
    // Given: プロフィール情報
    const profile = {
      name: '山田太郎',
      email: 'yamada@example.com',
    }

    // When: WelcomeSectionをレンダリングする
    const { container } = render(<WelcomeSection profile={profile} />)

    // Then: SVGアイコンが表示される
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})
