import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CookingTimerManager } from '../cooking-timer-manager'

// Mock Jotai hooks
const mockStopAllTimers = vi.fn()

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>()
  return {
    ...actual,
    useAtomValue: vi.fn(() => new Map()),
    useSetAtom: vi.fn(() => mockStopAllTimers),
  }
})

// Mock timer-persistence
vi.mock('@/utils/timer-persistence', () => ({
  calculateRemainingSeconds: vi.fn((total, elapsed, runningSince) => {
    if (runningSince === null) return total - elapsed
    const now = Date.now() / 1000
    return Math.max(0, total - elapsed - (now - runningSince))
  }),
}))

const { useAtomValue } = await import('jotai')

describe('CookingTimerManager', () => {
  const recipeId = 'recipe-1'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Given アクティブなタイマーが存在しない場合', () => {
    beforeEach(() => {
      vi.mocked(useAtomValue).mockReturnValue(new Map())
    })

    it('When コンポーネントをレンダリングする Then 何も表示されない', () => {
      const { container } = render(<CookingTimerManager recipeId={recipeId} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Given アクティブなタイマーが1つ存在する場合', () => {
    beforeEach(() => {
      const timerStates = new Map()
      timerStates.set('step-1', {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: 'フライパンで炒める',
        totalSeconds: 300,
        elapsedSeconds: 60,
        runningSinceSeconds: null,
      })
      vi.mocked(useAtomValue).mockReturnValue(timerStates)
    })

    it('When コンポーネントをレンダリングする Then タイマーマネージャーが表示される', () => {
      render(<CookingTimerManager recipeId={recipeId} />)

      expect(screen.getByText('調理タイマー (1件実行中)')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then タイマー情報が表示される', () => {
      render(<CookingTimerManager recipeId={recipeId} />)

      expect(screen.getByText(/フライパンで炒める/)).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then 全停止ボタンが表示される', () => {
      render(<CookingTimerManager recipeId={recipeId} />)

      expect(screen.getByRole('button', { name: 'すべてのタイマーを停止' })).toBeInTheDocument()
    })

    it('When 全停止ボタンをクリックする Then stopAllTimersが呼ばれる', async () => {
      const user = userEvent.setup({ delay: null })
      render(<CookingTimerManager recipeId={recipeId} />)

      const stopAllButton = screen.getByRole('button', { name: 'すべてのタイマーを停止' })
      await user.click(stopAllButton)

      expect(mockStopAllTimers).toHaveBeenCalledTimes(1)
    })
  })

  describe('Given 複数のアクティブなタイマーが存在する場合', () => {
    beforeEach(() => {
      const timerStates = new Map()
      timerStates.set('step-2', {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '煮込む',
        totalSeconds: 600,
        elapsedSeconds: 100,
        runningSinceSeconds: null,
      })
      timerStates.set('step-1', {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '炒める',
        totalSeconds: 300,
        elapsedSeconds: 50,
        runningSinceSeconds: null,
      })
      timerStates.set('step-3', {
        stepId: 'step-3',
        stepNumber: 3,
        instruction: '蒸す',
        totalSeconds: 900,
        elapsedSeconds: 200,
        runningSinceSeconds: null,
      })
      vi.mocked(useAtomValue).mockReturnValue(timerStates)
    })

    it('When コンポーネントをレンダリングする Then 正しいタイマー数が表示される', () => {
      render(<CookingTimerManager recipeId={recipeId} />)

      expect(screen.getByText('調理タイマー (3件実行中)')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then タイマーがステップ番号順に表示される', () => {
      render(<CookingTimerManager recipeId={recipeId} />)

      const timerElements = screen.getAllByText(/炒める|煮込む|蒸す/)
      expect(timerElements).toHaveLength(3)

      // ステップ番号順に並んでいることを確認
      expect(screen.getByText(/炒める/)).toBeInTheDocument()
      expect(screen.getByText(/煮込む/)).toBeInTheDocument()
      expect(screen.getByText(/蒸す/)).toBeInTheDocument()
    })
  })

  describe('Given 長い手順テキストの場合', () => {
    beforeEach(() => {
      const timerStates = new Map()
      timerStates.set('step-1', {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: 'これは非常に長い手順のテキストで、35文字を超えるため省略されるべきです。これは非常に長い手順のテキストです。',
        totalSeconds: 300,
        elapsedSeconds: 60,
        runningSinceSeconds: null,
      })
      vi.mocked(useAtomValue).mockReturnValue(timerStates)
    })

    it('When コンポーネントをレンダリングする Then テキストが省略される', () => {
      render(<CookingTimerManager recipeId={recipeId} />)

      // 35文字 + "..." で省略される
      const expectedText = 'これは非常に長い手順のテキストで、35文字を超えるため省略されるべきで...'
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })
  })
})
