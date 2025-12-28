'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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

  // timerStatesの最新の値をrefで保持（依存配列から削除するため）
  const timerStatesRef = useRef(timerStates)
  useEffect(() => {
    timerStatesRef.current = timerStates
  }, [timerStates])

  // 現在のステップのタイマー状態をメモ化
  const persistedTimerState = useMemo(
    () => timerStates.get(stepId),
    [timerStates, stepId]
  )

  // atomの変更を監視して状態を同期
  useEffect(() => {
    if (!persistedTimerState) {
      // atomから削除された場合、状態をリセット
      setElapsedSeconds(0)
      setRunningSinceSeconds(null)
      setStartedAt(null)
      setRemainingSeconds(initialSeconds)
      return
    }

    const remaining = calculateRemainingSeconds(
      persistedTimerState.totalSeconds,
      persistedTimerState.elapsedSeconds,
      persistedTimerState.runningSinceSeconds
    )

    setRemainingSeconds(remaining)
    setElapsedSeconds(persistedTimerState.elapsedSeconds)
    setRunningSinceSeconds(persistedTimerState.runningSinceSeconds)
    setStartedAt(persistedTimerState.startedAt)

    // タイマーが終了していたら通知を表示（atomには保持）
    if (remaining <= 0 && persistedTimerState.runningSinceSeconds !== null) {
      setRunningSinceSeconds(null)
      showTimerNotification(persistedTimerState.stepNumber, persistedTimerState.instruction)
    }
  }, [persistedTimerState, initialSeconds])

  // タイマー終了時の処理をメモ化
  const handleTimerComplete = useCallback(() => {
    if (!startedAt) return

    setRunningSinceSeconds(null)
    // タイマー終了後もatomに保持（完了状態を表示するため）
    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
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
  }, [stepId, recipeId, stepNumber, instruction, initialSeconds, startedAt, setTimerStates])

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
        handleTimerComplete()
      }
      // 動作中はatomを更新しない（グローバルステートの値を1秒単位で更新したくないため）
    }, 1000)

    return () => clearInterval(interval)
  }, [runningSinceSeconds, startedAt, elapsedSeconds, initialSeconds, handleTimerComplete])

  const start = useCallback(() => {
    const now = Date.now()
    setStartedAt(now)
    setElapsedSeconds(0)
    setRunningSinceSeconds(now)

    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
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
  }, [stepId, recipeId, stepNumber, instruction, initialSeconds, setTimerStates])

  const pause = useCallback(() => {
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

    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
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
  }, [runningSinceSeconds, startedAt, elapsedSeconds, stepId, recipeId, stepNumber, instruction, initialSeconds, setTimerStates])

  const resume = useCallback(() => {
    if (runningSinceSeconds !== null || !startedAt) return

    const now = Date.now()
    setRunningSinceSeconds(now)
    // elapsedSecondsはそのまま保持

    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
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
  }, [runningSinceSeconds, startedAt, elapsedSeconds, stepId, recipeId, stepNumber, instruction, initialSeconds, setTimerStates])

  const reset = useCallback(() => {
    setElapsedSeconds(0)
    setRunningSinceSeconds(null)
    setStartedAt(null)
    setRemainingSeconds(initialSeconds)
    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
    updated.delete(stepId)
    setTimerStates(updated)
  }, [stepId, initialSeconds, setTimerStates])

  const isRunning = runningSinceSeconds !== null
  const isPaused = runningSinceSeconds === null && elapsedSeconds > 0

  return { remainingSeconds, isRunning, isPaused, start, pause, resume, reset }
}
