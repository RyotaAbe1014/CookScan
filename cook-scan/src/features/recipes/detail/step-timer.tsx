'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useCookingTimer } from './hooks/use-cooking-timer'
import { requestNotificationPermission } from '@/utils/timer-notifications'
import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  ReloadIcon,
  CheckIcon,
} from '@/components/icons'

type StepTimerProps = {
  stepId: string
  recipeId: string
  recipeTitle: string
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
  recipeTitle,
  stepNumber,
  instruction,
  timerSeconds,
  onActiveChange,
}: StepTimerProps) {
  const { remainingSeconds, isRunning, isPaused, isFinished, start, pause, resume, reset } = useCookingTimer({
    stepId,
    recipeId,
    recipeTitle,
    stepNumber,
    instruction,
    initialSeconds: timerSeconds,
  })

  // 前回のisRunningの値を保持
  const prevIsRunningRef = useRef(isRunning)
  // onActiveChangeをrefで保持
  const onActiveChangeRef = useRef(onActiveChange)
  useEffect(() => {
    onActiveChangeRef.current = onActiveChange
  }, [onActiveChange])

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

  // 状態に応じたスタイルクラス
  const getContainerClass = () => {
    const baseClass = 'transition-all duration-300'
    if (isFinished) {
      return `${baseClass} bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg`
    }
    if (isPaused) {
      return `${baseClass} bg-linear-to-br from-amber-500 to-orange-500 shadow-md`
    }
    if (isRunning) {
      return `${baseClass} bg-linear-to-br from-indigo-600 to-violet-600 shadow-xl animate-pulse`
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
        <ClockIcon
          className={`h-5 w-5 ${isInitial ? 'text-slate-600' : 'text-white'}`}
          stroke="currentColor"
        />
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
            <PlayIcon className="h-4 w-4" />
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
              <PauseIcon className="h-4 w-4" />
              一時停止
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={reset}
              className="bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white"
              aria-label="タイマーをリセット"
            >
              <ReloadIcon className="h-4 w-4" />
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
              <PlayIcon className="h-4 w-4" />
              再開
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={reset}
              className="bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white"
              aria-label="タイマーをリセット"
            >
              <ReloadIcon className="h-4 w-4" />
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
            <ReloadIcon className="h-4 w-4" />
            リセット
          </Button>
        )}
      </div>

      {/* 終了メッセージ */}
      {isFinished && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-white">
          <CheckIcon className="h-5 w-5" />
          タイマーが終了しました！
        </div>
      )}
    </div>
  )
}
