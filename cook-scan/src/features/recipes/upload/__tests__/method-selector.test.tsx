import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MethodSelector from '../method-selector'

describe('MethodSelector', () => {
  it('「画像からスキャン」ボタンが表示される', () => {
    const onSelect = vi.fn()
    render(<MethodSelector onSelect={onSelect} />)

    const scanText = screen.getAllByText(/画像からスキャン/)[0]
    expect(scanText).toBeTruthy()
  })

  it('スキャンボタンをクリックするとonSelectが呼ばれる', () => {
    const onSelect = vi.fn()
    render(<MethodSelector onSelect={onSelect} />)

    // ボタン要素を直接取得
    const scanButton = screen.getByRole('button', { name: /画像からスキャン/ })

    fireEvent.click(scanButton)

    expect(onSelect).toHaveBeenCalledWith('scan')
  })
})
