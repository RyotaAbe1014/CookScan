import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GenerateShoppingListButton } from '../generate-shopping-list-button'

vi.mock('@/features/meal-planner/actions', () => ({
  generateShoppingList: vi.fn(),
}))

import { generateShoppingList } from '@/features/meal-planner/actions'

describe('GenerateShoppingListButton', () => {
  const defaultProps = {
    weekStart: '2026-03-02',
    hasItems: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('正常系：ボタンが表示される', () => {
    render(<GenerateShoppingListButton {...defaultProps} />)

    expect(screen.getByRole('button', { name: /買い物リストを生成/ })).toBeInTheDocument()
  })

  test('正常系：hasItems=falseの場合ボタンが無効になる', () => {
    render(<GenerateShoppingListButton {...defaultProps} hasItems={false} />)

    expect(screen.getByRole('button', { name: /買い物リストを生成/ })).toBeDisabled()
  })

  test('正常系：hasItems=trueの場合ボタンが有効になる', () => {
    render(<GenerateShoppingListButton {...defaultProps} hasItems={true} />)

    expect(screen.getByRole('button', { name: /買い物リストを生成/ })).toBeEnabled()
  })

  test('正常系：クリックするとgenerateShoppingListが呼ばれる', async () => {
    vi.mocked(generateShoppingList).mockResolvedValueOnce({
      ok: true,
      data: { count: 5 },
    })
    const user = userEvent.setup()
    render(<GenerateShoppingListButton {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /買い物リストを生成/ }))

    await waitFor(() => {
      expect(generateShoppingList).toHaveBeenCalledWith('2026-03-02')
    })
  })

  test('正常系：成功時に件数メッセージが表示される', async () => {
    vi.mocked(generateShoppingList).mockResolvedValueOnce({
      ok: true,
      data: { count: 5 },
    })
    const user = userEvent.setup()
    render(<GenerateShoppingListButton {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /買い物リストを生成/ }))

    await waitFor(() => {
      expect(screen.getByText('5件の食材を買い物リストに追加しました')).toBeInTheDocument()
    })
  })

  test('正常系：失敗時にエラーメッセージが表示される', async () => {
    vi.mocked(generateShoppingList).mockResolvedValueOnce({
      ok: false,
      error: { code: 'VALIDATION_ERROR', message: '献立プランにレシピが登録されていません' },
    })
    const user = userEvent.setup()
    render(<GenerateShoppingListButton {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /買い物リストを生成/ }))

    await waitFor(() => {
      expect(screen.getByText('献立プランにレシピが登録されていません')).toBeInTheDocument()
    })
  })

  test('正常系：再クリック時に前回のメッセージがクリアされる', async () => {
    vi.mocked(generateShoppingList)
      .mockResolvedValueOnce({
        ok: false,
        error: { code: 'SERVER_ERROR', message: 'エラー発生' },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: { count: 3 },
      })
    const user = userEvent.setup()
    render(<GenerateShoppingListButton {...defaultProps} />)

    // 1回目: エラー
    await user.click(screen.getByRole('button', { name: /買い物リストを生成/ }))
    await waitFor(() => {
      expect(screen.getByText('エラー発生')).toBeInTheDocument()
    })

    // 2回目: 成功
    await user.click(screen.getByRole('button', { name: /買い物リストを生成/ }))
    await waitFor(() => {
      expect(screen.queryByText('エラー発生')).not.toBeInTheDocument()
      expect(screen.getByText('3件の食材を買い物リストに追加しました')).toBeInTheDocument()
    })
  })
})
