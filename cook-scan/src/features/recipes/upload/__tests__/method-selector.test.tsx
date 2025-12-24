import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MethodSelector from '../method-selector'

describe('MethodSelector', () => {
  it('正常系：「画像からスキャン」ボタンが表示される', () => {
    // Given: MethodSelectorコンポーネントが表示されている
    const onSelect = vi.fn()
    render(<MethodSelector onSelect={onSelect} />)

    // Then: 「画像からスキャン」ボタンが表示される
    expect(screen.getByRole('button', { name: /画像からスキャン/ })).toBeInTheDocument()
  })

  it('正常系：スキャンボタンをクリックするとonSelectが呼ばれる', async () => {
    // Given: MethodSelectorコンポーネントが表示されている
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<MethodSelector onSelect={onSelect} />)

    // When: ユーザーが「画像からスキャン」ボタンをクリックする
    const scanButton = screen.getByRole('button', { name: /画像からスキャン/ })
    await user.click(scanButton)

    // Then: onSelectが'scan'で呼ばれる
    expect(onSelect).toHaveBeenCalledWith('scan')
  })
})
