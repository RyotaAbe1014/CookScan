'use client'

import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { recipeTimerStatesAtomFamily } from '../atoms/timer-atoms'
import { calculateRemainingSeconds, PersistedTimerState } from '@/utils/timer-persistence'
import { showTimerNotification } from '@/utils/timer-notifications'

type UseCookingTimerParams = {
  stepId: string
  recipeId: string
  stepNumber: number
  instruction: string
  initialSeconds: number
}

export function useCookingTimer({
  stepId,
  recipeId,
  stepNumber,
  instruction,
  initialSeconds,
}: UseCookingTimerParams) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [runningSinceSeconds, setRunningSinceSeconds] = useState<number | null>(null)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  const [timerStates, setTimerStates] = useAtom(recipeTimerStatesAtomFamily(recipeId))

  // atomの変更を監視して状態を同期
  useEffect(() => {
    const persisted = timerStates.get(stepId)

    if (!persisted) {
      // atomから削除された場合、状態をリセット
      setElapsedSeconds(0)
      setRunningSinceSeconds(null)
      setStartedAt(null)
      setRemainingSeconds(initialSeconds)
      return
    }

    const remaining = calculateRemainingSeconds(
      persisted.totalSeconds,
      persisted.elapsedSeconds,
      persisted.runningSinceSeconds
    )

    setRemainingSeconds(remaining)
    setElapsedSeconds(persisted.elapsedSeconds)
    setRunningSinceSeconds(persisted.runningSinceSeconds)
    setStartedAt(persisted.startedAt)

    // タイマーが終了していたら通知を表示（atomには保持）
    if (remaining <= 0 && persisted.runningSinceSeconds !== null) {
      setRunningSinceSeconds(null)
      showTimerNotification(persisted.stepNumber, persisted.instruction)
    }
  }, [timerStates, stepId, initialSeconds, setTimerStates])

  // タイマーのカウントダウン（開始時刻ベース）
  useEffect(() => {
    if (runningSinceSeconds === null || !startedAt) return

    const interval = setInterval(() => {
      const remaining = calculateRemainingSeconds(
        initialSeconds,
        elapsedSeconds,
        runningSinceSeconds
      )

      setRemainingSeconds(remaining)

      // タイマー終了時の処理
      if (remaining <= 0) {
        setRunningSinceSeconds(null)
        // タイマー終了後もatomに保持（完了状態を表示するため）
        const updated = new Map<string, PersistedTimerState>(timerStates)
        updated.set(stepId, {
          stepId,
          recipeId,
          stepNumber,
          instruction,
          totalSeconds: initialSeconds,
          startedAt,
          elapsedSeconds: initialSeconds, // 完了状態
          runningSinceSeconds: null,
        })
        setTimerStates(updated)
        showTimerNotification(stepNumber, instruction)
      }
      // 動作中はatomを更新しない（グローバルステートの値を1秒単位で更新したくないため）
    }, 1000)

    return () => clearInterval(interval)
  }, [
    runningSinceSeconds,
    startedAt,
    elapsedSeconds,
    recipeId,
    stepId,
    initialSeconds,
    stepNumber,
    instruction,
    timerStates,
    setTimerStates,
  ])

  const start = () => {
    const now = Date.now()
    setStartedAt(now)
    setElapsedSeconds(0)
    setRunningSinceSeconds(now)

    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.set(stepId, {
      stepId,
      recipeId,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt: now,
      elapsedSeconds: 0,
      runningSinceSeconds: now,
    })
    setTimerStates(updated)
  }

  const pause = () => {
    if (runningSinceSeconds === null || !startedAt) return

    const now = Date.now()
    // 現在の累積消費秒を計算
    const currentElapsed = Math.floor((now - runningSinceSeconds) / 1000)
    const newElapsedSeconds = elapsedSeconds + currentElapsed

    setElapsedSeconds(newElapsedSeconds)
    setRunningSinceSeconds(null)

    const remaining = calculateRemainingSeconds(
      initialSeconds,
      newElapsedSeconds,
      null
    )
    setRemainingSeconds(remaining)

    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.set(stepId, {
      stepId,
      recipeId,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt,
      elapsedSeconds: newElapsedSeconds,
      runningSinceSeconds: null,
    })
    setTimerStates(updated)
  }

  const resume = () => {
    if (runningSinceSeconds !== null || !startedAt) return

    const now = Date.now()
    setRunningSinceSeconds(now)
    // elapsedSecondsはそのまま保持

    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.set(stepId, {
      stepId,
      recipeId,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt,
      elapsedSeconds,
      runningSinceSeconds: now,
    })
    setTimerStates(updated)
  }

  const reset = () => {
    setElapsedSeconds(0)
    setRunningSinceSeconds(null)
    setStartedAt(null)
    setRemainingSeconds(initialSeconds)
    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.delete(stepId)
    setTimerStates(updated)
  }

  const isRunning = runningSinceSeconds !== null
  const isPaused = runningSinceSeconds === null && elapsedSeconds > 0

  return { remainingSeconds, isRunning, isPaused, start, pause, resume, reset }
}
