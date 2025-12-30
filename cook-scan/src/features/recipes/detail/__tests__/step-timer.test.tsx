import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepTimer } from '../step-timer'

// Mock useCookingTimer hook
const mockStart = vi.fn()
const mockPause = vi.fn()
const mockResume = vi.fn()
const mockReset = vi.fn()

vi.mock('../hooks/use-cooking-timer', () => ({
  useCookingTimer: vi.fn(() => ({
    remainingSeconds: 300,
    isRunning: false,
    isPaused: false,
    isFinished: false,
    start: mockStart,
    pause: mockPause,
    resume: mockResume,
    reset: mockReset,
  })),
}))

// Mock timer-notifications
vi.mock('@/utils/timer-notifications', () => ({
  requestNotificationPermission: vi.fn().mockResolvedValue(undefined),
}))

const { useCookingTimer } = await import('../hooks/use-cooking-timer')

describe('StepTimer', () => {
  const defaultProps = {
    stepId: 'step-1',
    recipeId: 'recipe-1',
    stepNumber: 1,
    instruction: 'フライパンで炒める',
    timerSeconds: 300,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Given タイマーが初期状態の場合', () => {
    beforeEach(() => {
      vi.mocked(useCookingTimer).mockReturnValue({
        remainingSeconds: 300,
        isRunning: false,
        isPaused: false,
        isFinished: false,
        start: mockStart,
        pause: mockPause,
        resume: mockResume,
        reset: mockReset,
      })
    })

    it('When コンポーネントをレンダリングする Then 初期時間が表示される', () => {
      render(<StepTimer {...defaultProps} />)

      expect(screen.getByText('05:00')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then 開始ボタンが表示される', () => {
      render(<StepTimer {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'タイマーを開始' })).toBeInTheDocument()
    })

    it('When 開始ボタンをクリックする Then startが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<StepTimer {...defaultProps} />)

      const startButton = screen.getByRole('button', { name: 'タイマーを開始' })
      await user.click(startButton)

      expect(mockStart).toHaveBeenCalledTimes(1)
    })
  })

  describe('Given タイマーが実行中の場合', () => {
    beforeEach(() => {
      vi.mocked(useCookingTimer).mockReturnValue({
        remainingSeconds: 240,
        isRunning: true,
        isPaused: false,
        isFinished: false,
        start: mockStart,
        pause: mockPause,
        resume: mockResume,
        reset: mockReset,
      })
    })

    it('When コンポーネントをレンダリングする Then 残り時間が表示される', () => {
      render(<StepTimer {...defaultProps} />)

      expect(screen.getByText('04:00')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then 一時停止とリセットボタンが表示される', () => {
      render(<StepTimer {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'タイマーを一時停止' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'タイマーをリセット' })).toBeInTheDocument()
    })

    it('When 一時停止ボタンをクリックする Then pauseが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<StepTimer {...defaultProps} />)

      const pauseButton = screen.getByRole('button', { name: 'タイマーを一時停止' })
      await user.click(pauseButton)

      expect(mockPause).toHaveBeenCalledTimes(1)
    })

    it('When リセットボタンをクリックする Then resetが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<StepTimer {...defaultProps} />)

      const resetButtons = screen.getAllByRole('button', { name: 'タイマーをリセット' })
      await user.click(resetButtons[0])

      expect(mockReset).toHaveBeenCalledTimes(1)
    })

    it('When コンポーネントをレンダリングする Then プログレスバーが表示される', () => {
      render(<StepTimer {...defaultProps} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
      // 300秒中60秒経過（240秒残り）= 20%進捗
      expect(progressBar).toHaveAttribute('aria-valuenow', '20')
    })
  })

  describe('Given タイマーが一時停止中の場合', () => {
    beforeEach(() => {
      vi.mocked(useCookingTimer).mockReturnValue({
        remainingSeconds: 180,
        isRunning: false,
        isPaused: true,
        isFinished: false,
        start: mockStart,
        pause: mockPause,
        resume: mockResume,
        reset: mockReset,
      })
    })

    it('When コンポーネントをレンダリングする Then 再開とリセットボタンが表示される', () => {
      render(<StepTimer {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'タイマーを再開' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'タイマーをリセット' })).toBeInTheDocument()
    })

    it('When 再開ボタンをクリックする Then resumeが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<StepTimer {...defaultProps} />)

      const resumeButton = screen.getByRole('button', { name: 'タイマーを再開' })
      await user.click(resumeButton)

      expect(mockResume).toHaveBeenCalledTimes(1)
    })
  })

  describe('Given タイマーが終了した場合', () => {
    beforeEach(() => {
      vi.mocked(useCookingTimer).mockReturnValue({
        remainingSeconds: 0,
        isRunning: false,
        isPaused: false,
        isFinished: true,
        start: mockStart,
        pause: mockPause,
        resume: mockResume,
        reset: mockReset,
      })
    })

    it('When コンポーネントをレンダリングする Then 終了メッセージが表示される', () => {
      render(<StepTimer {...defaultProps} />)

      expect(screen.getByText('タイマーが終了しました！')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then リセットボタンが表示される', () => {
      render(<StepTimer {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'タイマーをリセット' })).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then プログレスバーが100%になる', () => {
      render(<StepTimer {...defaultProps} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
    })
  })

  describe('Given タイマー時間が異なる場合', () => {
    beforeEach(() => {
      vi.mocked(useCookingTimer).mockReturnValue({
        remainingSeconds: 3661,
        isRunning: false,
        isPaused: false,
        isFinished: false,
        start: mockStart,
        pause: mockPause,
        resume: mockResume,
        reset: mockReset,
      })
    })

    it('When 1時間以上の時間をレンダリングする Then 正しくフォーマットされる', () => {
      render(<StepTimer {...defaultProps} timerSeconds={3661} />)

      // 3661秒 = 61分1秒 = 61:01
      expect(screen.getByText('61:01')).toBeInTheDocument()
    })
  })
})
