'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClockIcon, StopCircleIcon } from '@/components/icons'
import { recipeTimerStatesAtomFamily, stopAllTimersAtomFamily } from './atoms/timer-atoms'
import { calculateRemainingSeconds } from '@/utils/timer-persistence'

type ActiveTimer = {
  stepId: string
  stepNumber: number
  instruction: string
  remainingSeconds: number
  totalSeconds: number
}

type CookingTimerManagerProps = {
  recipeId: string
}

// 秒数を分:秒形式にフォーマット
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function CookingTimerManager({ recipeId }: CookingTimerManagerProps) {
  const [tick, setTick] = useState(0)
  const timerStates = useAtomValue(recipeTimerStatesAtomFamily(recipeId))
  const stopAllTimers = useSetAtom(stopAllTimersAtomFamily(recipeId))

  // 1秒ごとに再描画して残り時間を更新（atomから直接取得）
  useEffect(() => {
    if (timerStates.size === 0) return

    const interval = setInterval(() => {
      setTick((current) => current + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timerStates])

  const activeTimers = useMemo(() => {
    if (timerStates.size === 0) return []

    const timers: ActiveTimer[] = []

    timerStates.forEach((persisted) => {
      const remaining = calculateRemainingSeconds(
        persisted.totalSeconds,
        persisted.elapsedSeconds,
        persisted.runningSinceSeconds
      )

      timers.push({
        stepId: persisted.stepId,
        stepNumber: persisted.stepNumber,
        instruction: persisted.instruction,
        remainingSeconds: remaining,
        totalSeconds: persisted.totalSeconds,
      })
    })

    // ステップ番号順にソート
    timers.sort((a, b) => a.stepNumber - b.stepNumber)
    return timers
  }, [timerStates, tick])

  const handleStopAll = () => {
    stopAllTimers()
  }

  if (activeTimers.length === 0) {
    return null
  }

  return (
    <Card className="sticky top-4 z-10 overflow-hidden border-2 border-orange-300/60 shadow-xl shadow-orange-200/20 backdrop-blur-sm">
      {/* Decorative header background */}
      <div className="absolute left-0 right-0 top-0 h-24 bg-linear-to-br from-orange-400/10 via-amber-400/5 to-transparent" />

      <CardHeader
        icon={
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-orange-300/50" />
            <ClockIcon
              className="relative h-5 w-5 animate-spin text-white"
              style={{ animationDuration: '3s' }}
              strokeWidth={2.5}
            />
          </div>
        }
        iconColor="amber"
        title="調理タイマー"
        actions={
          <span className="animate-pulse rounded-full bg-orange-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
            {activeTimers.length}件実行中
          </span>
        }
      />
      <CardContent>
        <div className="space-y-4">
          {activeTimers.map((timer) => {
            const progress = ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100
            const isNearlyDone = timer.remainingSeconds <= 60
            const isUrgent = timer.remainingSeconds <= 10

            return (
              <div
                key={timer.stepId}
                className={`group relative overflow-hidden rounded-2xl border-2 p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isUrgent
                    ? 'animate-pulse border-red-400 bg-linear-to-r from-red-50 to-orange-50 shadow-red-200/40'
                    : isNearlyDone
                      ? 'border-orange-400 bg-linear-to-r from-orange-50 to-amber-50 shadow-orange-200/30'
                      : 'border-orange-200/60 bg-linear-to-r from-amber-50/50 to-white shadow-orange-100/20'
                  }`}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-400/5 via-transparent to-amber-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start gap-4">
                  {/* Step number badge */}
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 animate-pulse rounded-xl bg-orange-400/20 blur-sm" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-600/30">
                      <span className="text-lg font-bold text-white">{timer.stepNumber}</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    {/* Instruction text */}
                    <p className="text-sm font-semibold leading-snug text-slate-800">
                      {timer.instruction}
                    </p>

                    {/* Timer display with progress */}
                    <div className="space-y-2">
                      {/* Large countdown display */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`font-mono text-3xl font-bold tabular-nums tracking-tight transition-colors ${isUrgent
                                ? 'text-red-600'
                                : isNearlyDone
                                  ? 'text-orange-700'
                                  : 'text-orange-600'
                              }`}
                          >
                            {formatTime(timer.remainingSeconds)}
                          </span>
                          <span className="text-xs font-medium text-orange-600/70">
                            残り
                          </span>
                        </div>

                        {/* Status indicator */}
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 animate-pulse rounded-full shadow-sm ${isUrgent
                                ? 'bg-red-500 shadow-red-300'
                                : 'bg-orange-500 shadow-orange-300'
                              }`}
                          />
                          <span className="text-xs font-medium text-orange-700">
                            {isUrgent ? '完了間近' : '調理中'}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced progress bar */}
                      <div className="relative">
                        <div className="h-3 overflow-hidden rounded-full bg-orange-100 shadow-inner">
                          <div
                            className={`h-full rounded-full shadow-sm transition-all duration-1000 ease-linear ${isUrgent
                                ? 'bg-linear-to-r from-red-500 to-orange-600'
                                : 'bg-linear-to-r from-orange-500 to-amber-500'
                              }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        {/* Progress percentage */}
                        <div className="mt-1 flex justify-between text-xs font-medium text-orange-600/60">
                          <span>0:00</span>
                          <span>{Math.round(progress)}%</span>
                          <span>{formatTime(timer.totalSeconds)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Stop all button */}
          <div className="pt-2">
            <Button
              variant="danger"
              size="md"
              onClick={handleStopAll}
              className="w-full bg-linear-to-r from-red-600 to-orange-600 font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-red-600/30"
              aria-label="すべてのタイマーを停止"
            >
              <StopCircleIcon className="h-5 w-5" strokeWidth={2.5} />
              すべてのタイマーを停止
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
