import { render, screen, fireEvent } from '@testing-library/react'
import { Sheet } from './sheet'
import { vi } from 'vitest'

describe('Sheet', () => {
  test('isOpenがtrueの場合、ダイアログが表示される', () => {
    const onClose = vi.fn()
    render(
      <Sheet isOpen={true} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveClass('visible')
    expect(screen.getByText('Sheet Content')).toBeInTheDocument()
  })

  test('isOpenがfalseの場合、ダイアログが非表示になる', () => {
    const onClose = vi.fn()
    render(
      <Sheet isOpen={false} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>
    )

    const dialog = screen.getByRole('dialog', { hidden: true })
    expect(dialog).toHaveClass('invisible')
  })

  test('オーバーレイをクリックするとonCloseが呼ばれる', () => {
    const onClose = vi.fn()
    render(
      <Sheet isOpen={true} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>
    )

    // オーバーレイは aria-hidden="true" を持つ
    const overlay = screen.getByLabelText('Overlay')
    fireEvent.click(overlay)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('コンテンツをクリックしてもonCloseは呼ばれない', () => {
    const onClose = vi.fn()
    render(
      <Sheet isOpen={true} onClose={onClose}>
        <div data-testid="content">Sheet Content</div>
      </Sheet>
    )

    fireEvent.click(screen.getByTestId('content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  test('EscapeキーでonCloseが呼ばれる', () => {
    const onClose = vi.fn()
    render(
      <Sheet isOpen={true} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('isOpenがfalseのときはEscapeキーでonCloseが呼ばれない', () => {
    const onClose = vi.fn()
    render(
      <Sheet isOpen={false} onClose={onClose}>
        <div>Sheet Content</div>
      </Sheet>
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })
})
