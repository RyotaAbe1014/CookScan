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

  test('正常系：サブテキストが表示される', () => {
    // Given: プロフィール情報
    const profile = {
      name: '山田太郎',
      email: 'yamada@example.com',
    }

    // When: WelcomeSectionをレンダリングする
    render(<WelcomeSection profile={profile} />)

    // Then: サブテキストが表示される
    expect(screen.getByText('今日は何を料理しますか？')).toBeInTheDocument()
  })
})
