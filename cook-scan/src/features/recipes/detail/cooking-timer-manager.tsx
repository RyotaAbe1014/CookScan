'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    <Card className="sticky top-4 z-10 shadow-xl backdrop-blur-sm">
      <CardHeader
        icon={
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        iconColor="blue"
        title={`調理タイマー (${activeTimers.length}件実行中)`}
      />
      <CardContent>
        <div className="space-y-3">
          {activeTimers.map((timer) => {
            const progress = ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100

            return (
              <div
                key={timer.stepId}
                className="overflow-hidden rounded-xl bg-linear-to-r from-slate-50 to-white p-3 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm">
                    {timer.stepNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {timer.instruction.length > 35
                        ? `${timer.instruction.substring(0, 35)}...`
                        : timer.instruction}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 font-mono text-xs font-semibold text-indigo-600">
                        {formatTime(timer.remainingSeconds)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="pt-2">
            <Button
              variant="danger-ghost"
              size="sm"
              onClick={handleStopAll}
              className="w-full transition-transform hover:scale-[1.02]"
              aria-label="すべてのタイマーを停止"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              全停止
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
