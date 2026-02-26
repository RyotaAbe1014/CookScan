import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import { WeekNavigator } from '../week-navigator'

describe('WeekNavigator', () => {
  const defaultProps = {
    weekStart: '2026-03-02',
    onPrevWeek: vi.fn(),
    onNextWeek: vi.fn(),
    onToday: vi.fn(),
  }

  test('正常系：週の日付範囲が表示される', () => {
    // Given: 2026-03-02（月）〜 2026-03-08（日）の週
    render(<WeekNavigator {...defaultProps} />)

    // Then: 日付範囲が表示される
    expect(screen.getByText('3/2 〜 3/8')).toBeInTheDocument()
  })

  test('正常系：今週ボタンが表示される', () => {
    render(<WeekNavigator {...defaultProps} />)

    expect(screen.getByRole('button', { name: '今週' })).toBeInTheDocument()
  })

  test('正常系：前週ボタンをクリックするとonPrevWeekが呼ばれる', async () => {
    const user = userEvent.setup()
    render(<WeekNavigator {...defaultProps} />)

    // When: 前週ボタンをクリック
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0]) // 左矢印ボタン

    // Then: onPrevWeekが呼ばれる
    expect(defaultProps.onPrevWeek).toHaveBeenCalledTimes(1)
  })

  test('正常系：次週ボタンをクリックするとonNextWeekが呼ばれる', async () => {
    const user = userEvent.setup()
    render(<WeekNavigator {...defaultProps} />)

    // When: 次週ボタンをクリック
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[buttons.length - 1]) // 右矢印ボタン

    // Then: onNextWeekが呼ばれる
    expect(defaultProps.onNextWeek).toHaveBeenCalledTimes(1)
  })

  test('正常系：今週ボタンをクリックするとonTodayが呼ばれる', async () => {
    const user = userEvent.setup()
    render(<WeekNavigator {...defaultProps} />)

    // When: 今週ボタンをクリック
    await user.click(screen.getByRole('button', { name: '今週' }))

    // Then: onTodayが呼ばれる
    expect(defaultProps.onToday).toHaveBeenCalledTimes(1)
  })

  test('正常系：月をまたぐ週も正しく表示される', () => {
    // Given: 2026-02-23（月）〜 2026-03-01（日）
    render(<WeekNavigator {...defaultProps} weekStart="2026-02-23" />)

    // Then: 月をまたいだ日付範囲が表示される
    expect(screen.getByText('2/23 〜 3/1')).toBeInTheDocument()
  })
})
