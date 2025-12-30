import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeSteps } from '../recipe-steps'
import type { Step } from '@/types/step'

// Mock StepTimer コンポーネント
vi.mock('../step-timer', () => ({
  StepTimer: ({ stepNumber, instruction, timerSeconds }: { stepNumber: number; instruction: string; timerSeconds: number }) => (
    <div data-testid={`step-timer-${stepNumber}`}>
      Timer: {timerSeconds}s for {instruction}
    </div>
  ),
}))

describe('RecipeSteps', () => {
  const recipeId = 'recipe-1'

  describe('Given 調理手順が存在する場合', () => {
    const mockSteps: Step[] = [
      {
        id: 'step-1',
        recipeId: 'recipe-1',
        orderIndex: 1,
        instruction: '野菜を切る',
        timerSeconds: null,
      },
      {
        id: 'step-2',
        recipeId: 'recipe-1',
        orderIndex: 2,
        instruction: 'フライパンで炒める',
        timerSeconds: 300,
      },
      {
        id: 'step-3',
        recipeId: 'recipe-1',
        orderIndex: 3,
        instruction: '調味料を加える',
        timerSeconds: null,
      },
    ]

    it('When コンポーネントをレンダリングする Then 調理手順が表示される', () => {
      render(<RecipeSteps recipeId={recipeId} steps={mockSteps} />)

      expect(screen.getByText('調理手順')).toBeInTheDocument()
      expect(screen.getByText('野菜を切る')).toBeInTheDocument()
      expect(screen.getByText('フライパンで炒める')).toBeInTheDocument()
      expect(screen.getByText('調味料を加える')).toBeInTheDocument()
    })

    it('When コンポーネントをレンダリングする Then ステップ番号が表示される', () => {
      render(<RecipeSteps recipeId={recipeId} steps={mockSteps} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('When タイマー付きステップをレンダリングする Then StepTimerが表示される', () => {
      render(<RecipeSteps recipeId={recipeId} steps={mockSteps} />)

      // ステップ2にはタイマーがあるのでStepTimerが表示される
      expect(screen.getByTestId('step-timer-2')).toBeInTheDocument()
      expect(screen.getByText(/Timer: 300s/)).toBeInTheDocument()
    })

    it('When タイマーなしステップをレンダリングする Then StepTimerが表示されない', () => {
      render(<RecipeSteps recipeId={recipeId} steps={mockSteps} />)

      // ステップ1と3にはタイマーがないのでStepTimerが表示されない
      expect(screen.queryByTestId('step-timer-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('step-timer-3')).not.toBeInTheDocument()
    })
  })

  describe('Given 調理手順が存在しない場合', () => {
    it('When コンポーネントをレンダリングする Then 空の状態メッセージが表示される', () => {
      render(<RecipeSteps recipeId={recipeId} steps={[]} />)

      expect(screen.getByText('調理手順')).toBeInTheDocument()
      expect(screen.getByText('調理手順が登録されていません')).toBeInTheDocument()
    })
  })
})
