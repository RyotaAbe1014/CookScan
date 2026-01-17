import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { PasswordRequirements } from '../password-requirements'

describe('PasswordRequirements', () => {
  test('正常系：パスワード要件が表示される', () => {
    // Given & When: パスワード要件コンポーネントがレンダリングされる
    render(<PasswordRequirements />)

    // Then: セキュリティ要件が表示される
    expect(screen.getByText(/セキュリティ要件:/)).toBeInTheDocument()
    expect(
      screen.getByText(/パスワードは8文字以上で、大文字、小文字、数字を含める必要があります/)
    ).toBeInTheDocument()
  })
})
