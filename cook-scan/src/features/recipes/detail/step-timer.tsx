'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useCookingTimer } from './hooks/use-cooking-timer'
import { requestNotificationPermission } from '@/utils/timer-notifications'

type StepTimerProps = {
  stepId: string
  recipeId: string
  stepNumber: number
  instruction: string
  timerSeconds: number
  onActiveChange?: (stepId: string, isActive: boolean) => void
}

// 秒数を分:秒形式にフォーマット
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function StepTimer({
  stepId,
  recipeId,
  stepNumber,
  instruction,
  timerSeconds,
  onActiveChange,
}: StepTimerProps) {
  const { remainingSeconds, isRunning, isPaused, start, pause, resume, reset } = useCookingTimer({
    stepId,
    recipeId,
    stepNumber,
    instruction,
    initialSeconds: timerSeconds,
  })

  // 前回のisRunningの値を保持
  const prevIsRunningRef = useRef(isRunning)
  // onActiveChangeをrefで保持して、依存配列から除外
  const onActiveChangeRef = useRef(onActiveChange)
  onActiveChangeRef.current = onActiveChange

  // アクティブ状態の変更を親に通知（isRunningが実際に変わった時のみ）
  useEffect(() => {
    if (prevIsRunningRef.current !== isRunning) {
      prevIsRunningRef.current = isRunning
      onActiveChangeRef.current?.(stepId, isRunning)
    }
  }, [stepId, isRunning])

  // 初回タイマー開始時に通知許可をリクエスト
  const handleStart = async () => {
    await requestNotificationPermission()
    start()
  }

  const progress = ((timerSeconds - remainingSeconds) / timerSeconds) * 100
  const isFinished = remainingSeconds === 0 && !isRunning && !isPaused

  // 状態に応じたスタイルクラス
  const getContainerClass = () => {
    const baseClass = 'transition-all duration-300'
    if (isFinished) {
      return `${baseClass} bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg`
    }
    if (isPaused) {
      return `${baseClass} bg-gradient-to-br from-amber-500 to-orange-500 shadow-md`
    }
    if (isRunning) {
      return `${baseClass} bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl animate-pulse`
    }
    return `${baseClass} bg-slate-100 ring-1 ring-slate-200`
  }

  // 初期状態かどうか
  const isInitial = !isRunning && !isPaused && !isFinished

  return (
    <div className={`mt-3 rounded-xl p-4 ${getContainerClass()}`}>
      {/* タイマー表示 */}
      <div
        role="timer"
        aria-live="polite"
        aria-atomic="false"
        aria-label={`ステップ${stepNumber}のタイマー、残り${formatTime(remainingSeconds)}`}
        className="mb-3 flex items-center justify-center gap-2"
      >
        <svg
          className={`h-5 w-5 ${isInitial ? 'text-slate-600' : 'text-white'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span
          className={`font-mono text-2xl font-bold tracking-wider ${isInitial ? 'text-slate-700' : 'text-white'}`}
        >
          {formatTime(remainingSeconds)}
        </span>
      </div>

      {/* プログレスバー */}
      {(isRunning || isPaused || isFinished) && (
        <div className="mb-3">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
            <div
              className="h-full rounded-full bg-white transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`進捗: ${Math.round(progress)}%`}
            />
          </div>
          <p className="mt-1.5 text-center text-xs font-medium text-white/90">
            {Math.round(progress)}% 完了
          </p>
        </div>
      )}

      {/* コントロールボタン */}
      <div className="flex flex-wrap justify-center gap-2">
        {!isRunning && !isPaused && !isFinished && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleStart}
            className="bg-indigo-600 shadow-md transition-transform hover:scale-105 hover:bg-indigo-700"
            aria-label="タイマーを開始"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            開始
          </Button>
        )}

        {isRunning && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={pause}
              className="bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white"
              aria-label="タイマーを一時停止"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              一時停止
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={reset}
              className="bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white"
              aria-label="タイマーをリセット"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              リセット
            </Button>
          </>
        )}

        {isPaused && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={resume}
              className="bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white"
              aria-label="タイマーを再開"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              再開
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={reset}
              className="bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white"
              aria-label="タイマーをリセット"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              リセット
            </Button>
          </>
        )}

        {isFinished && (
          <Button
            variant="secondary"
            size="sm"
            onClick={reset}
            className="bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white"
            aria-label="タイマーをリセット"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            リセット
          </Button>
        )}
      </div>

      {/* 終了メッセージ */}
      {isFinished && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          タイマーが終了しました！
        </div>
      )}
    </div>
  )
}
