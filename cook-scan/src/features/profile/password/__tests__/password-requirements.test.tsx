import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { PasswordRequirements } from '../password-requirements'

describe('PasswordRequirements', () => {
  test('正常系：全てのパスワード要件が表示される', () => {
    // Given & When: パスワード要件コンポーネントがレンダリングされる
    render(<PasswordRequirements />)

    // Then: 全ての要件が表示される
    expect(screen.getByText('パスワードの要件:')).toBeInTheDocument()
    expect(screen.getByText('• 8文字以上')).toBeInTheDocument()
    expect(screen.getByText('• 大文字を1文字以上含む')).toBeInTheDocument()
    expect(screen.getByText('• 小文字を1文字以上含む')).toBeInTheDocument()
    expect(screen.getByText('• 数字を1文字以上含む')).toBeInTheDocument()
  })
})
