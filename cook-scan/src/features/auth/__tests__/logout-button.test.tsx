import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LogoutButton from '../logout-button'

// モック: Server Action (logout)
vi.mock('../actions', () => ({
  logout: vi.fn(() => Promise.resolve()),
}))

import { logout } from '../actions'

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', () => {
    it('ボタンが表示される', () => {
      // Given: LogoutButtonがマウントされている
      render(<LogoutButton />)

      // When: 初期レンダリングされる
      const button = screen.getByRole('button', { name: /ログアウト/i })

      // Then: ボタンが表示され、aria-label="ログアウト"を持つ
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'ログアウト')
    })

    it('初期状態はenabled', () => {
      // Given: LogoutButtonがマウントされている
      render(<LogoutButton />)

      // When: 初期レンダリングされる
      const button = screen.getByRole('button', { name: /ログアウト/i })

      // Then: ボタンはdisabled属性を持たない
      expect(button).not.toBeDisabled()
    })
  })

  describe('ボタンクリック動作', () => {
    it('クリック時にlogout()が呼ばれる', async () => {
      // Given: LogoutButtonが表示されている
      render(<LogoutButton />)
      const button = screen.getByRole('button', { name: /ログアウト/i })

      // When: ボタンをクリックする
      fireEvent.click(button)

      // Then: logout()が1回呼び出される
      await waitFor(() => {
        expect(logout).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('ローディング状態', () => {
    it('ローディング中はボタンがdisabled', async () => {
      // Given: LogoutButtonが表示されている
      render(<LogoutButton />)
      const button = screen.getByRole('button', { name: /ログアウト/i })

      // When: ボタンをクリックして非同期処理が開始される
      fireEvent.click(button)

      // Then: ボタンがdisabled状態になる
      await waitFor(() => {
        expect(button).toBeDisabled()
      })
    })

    it('ローディング中はスピナーが表示される', async () => {
      // Given: LogoutButtonが表示されている
      render(<LogoutButton />)
      const button = screen.getByRole('button', { name: /ログアウト/i })

      // When: ボタンをクリックして非同期処理が開始される
      fireEvent.click(button)

      // Then: アニメーションするSVG（スピナー）が表示される
      await waitFor(() => {
        const svg = button.querySelector('svg.animate-spin')
        expect(svg).toBeInTheDocument()
      })
    })
  })
})
