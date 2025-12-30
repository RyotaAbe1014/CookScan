'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAtom } from 'jotai'
import { recipeTimerStatesAtomFamily } from '../atoms/timer-atoms'
import { calculateRemainingSeconds, PersistedTimerState } from '@/utils/timer-persistence'
import { showTimerNotification } from '@/utils/timer-notifications'

type UseCookingTimerParams = {
  stepId: string
  recipeId: string
  recipeTitle: string
  stepNumber: number
  instruction: string
  initialSeconds: number
}

export function useCookingTimer({
  stepId,
  recipeId,
  recipeTitle,
  stepNumber,
  instruction,
  initialSeconds,
}: UseCookingTimerParams) {
  const [tick, setTick] = useState(0)

  const [timerStates, setTimerStates] = useAtom(recipeTimerStatesAtomFamily(recipeId))

  // timerStatesの最新の値をrefで保持（依存配列から削除するため）
  const timerStatesRef = useRef(timerStates)
  useEffect(() => {
    timerStatesRef.current = timerStates
  }, [timerStates])

  // 現在のステップのタイマー状態をメモ化
  const persistedTimerState = useMemo(() => timerStates.get(stepId), [timerStates, stepId])
  const totalSeconds = persistedTimerState?.totalSeconds ?? initialSeconds
  const elapsedSeconds = persistedTimerState?.elapsedSeconds ?? 0
  const runningSinceSeconds = persistedTimerState?.runningSinceSeconds ?? null
  const startedAt = persistedTimerState?.startedAt ?? null

  const remainingSeconds = useMemo(() => {
    if (!persistedTimerState) return initialSeconds
    return calculateRemainingSeconds(
      totalSeconds,
      elapsedSeconds,
      runningSinceSeconds
    )
  }, [persistedTimerState, totalSeconds, elapsedSeconds, runningSinceSeconds, initialSeconds, tick])

  // タイマー終了時の処理をメモ化
  const handleTimerComplete = useCallback((completedStartedAt: number, totalSecondsValue: number) => {
    // タイマー終了後もatomに保持（完了状態を表示するため）
    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
    updated.set(stepId, {
      stepId,
      recipeId,
      recipeTitle,
      stepNumber,
      instruction,
      totalSeconds: totalSecondsValue,
      startedAt: completedStartedAt,
      elapsedSeconds: totalSecondsValue, // 完了状態
      runningSinceSeconds: null,
    })
    setTimerStates(updated)
    showTimerNotification(stepNumber, instruction)
  }, [stepId, recipeId, recipeTitle, stepNumber, instruction, setTimerStates])

  // タイマーのカウントダウン（開始時刻ベース）
  useEffect(() => {
    if (runningSinceSeconds === null || !startedAt || !persistedTimerState) return

    const timeout = setTimeout(() => {
      const remaining = calculateRemainingSeconds(
        totalSeconds,
        elapsedSeconds,
        runningSinceSeconds
      )
      if (remaining <= 0) {
        handleTimerComplete(startedAt, totalSeconds)
      }
    }, 0)

    const interval = setInterval(() => {
      setTick((current) => current + 1)
      const remaining = calculateRemainingSeconds(
        totalSeconds,
        elapsedSeconds,
        runningSinceSeconds
      )

      // タイマー終了時の処理
      if (remaining <= 0) {
        handleTimerComplete(startedAt, totalSeconds)
      }
      // 動作中はatomを更新しない（グローバルステートの値を1秒単位で更新したくないため）
    }, 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [runningSinceSeconds, startedAt, persistedTimerState, totalSeconds, elapsedSeconds, handleTimerComplete])

  const start = useCallback(() => {
    const now = Date.now()

    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
    updated.set(stepId, {
      stepId,
      recipeId,
      recipeTitle,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt: now,
      elapsedSeconds: 0,
      runningSinceSeconds: now,
    })
    setTimerStates(updated)
  }, [stepId, recipeId, recipeTitle, stepNumber, instruction, initialSeconds, setTimerStates])

  const pause = useCallback(() => {
    if (runningSinceSeconds === null || !startedAt) return

    const now = Date.now()
    // 現在の累積消費秒を計算
    const currentElapsed = Math.floor((now - runningSinceSeconds) / 1000)
    const newElapsedSeconds = elapsedSeconds + currentElapsed

    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
    updated.set(stepId, {
      stepId,
      recipeId,
      recipeTitle,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt,
      elapsedSeconds: newElapsedSeconds,
      runningSinceSeconds: null,
    })
    setTimerStates(updated)
  }, [runningSinceSeconds, startedAt, elapsedSeconds, stepId, recipeId, recipeTitle, stepNumber, instruction, initialSeconds, setTimerStates])

  const resume = useCallback(() => {
    if (runningSinceSeconds !== null || !startedAt) return

    const now = Date.now()

    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
    updated.set(stepId, {
      stepId,
      recipeId,
      recipeTitle,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt,
      elapsedSeconds,
      runningSinceSeconds: now,
    })
    setTimerStates(updated)
  }, [runningSinceSeconds, startedAt, elapsedSeconds, stepId, recipeId, recipeTitle, stepNumber, instruction, initialSeconds, setTimerStates])

  const reset = useCallback(() => {
    const updated = new Map<string, PersistedTimerState>(timerStatesRef.current)
    updated.delete(stepId)
    setTimerStates(updated)
  }, [stepId, initialSeconds, setTimerStates])

  const isRunning = runningSinceSeconds !== null
  const isPaused = runningSinceSeconds === null && elapsedSeconds > 0 && elapsedSeconds < totalSeconds
  const isFinished = remainingSeconds === 0 && elapsedSeconds >= totalSeconds

  return { remainingSeconds, isRunning, isPaused, isFinished, start, pause, resume, reset }
}
