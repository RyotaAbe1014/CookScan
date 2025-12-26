'use client'

import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { createRecipeTimerStatesAtom } from '../atoms/timer-atoms'
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
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [pausedAt, setPausedAt] = useState<number | null>(null)
  const [pausedRemainingSeconds, setPausedRemainingSeconds] = useState<number | null>(null)

  // Jotai atomを使用
  const [timerStates, setTimerStates] = useAtom(createRecipeTimerStatesAtom(recipeId))

  // atomの変更を監視して状態を同期
  useEffect(() => {
    const persisted = timerStates.get(stepId)

    if (!persisted) {
      // atomから削除された場合、状態をリセット
      setIsRunning(false)
      setIsPaused(false)
      setStartedAt(null)
      setPausedAt(null)
      setPausedRemainingSeconds(null)
      setRemainingSeconds(initialSeconds)
      return
    }

    const remaining = calculateRemainingSeconds(
      persisted.totalSeconds,
      persisted.startedAt,
      persisted.pausedAt,
      persisted.pausedRemainingSeconds
    )

    setRemainingSeconds(remaining)
    setIsRunning(persisted.isRunning)
    setIsPaused(persisted.isPaused)
    setStartedAt(persisted.startedAt)
    setPausedAt(persisted.pausedAt)
    setPausedRemainingSeconds(persisted.pausedRemainingSeconds)

    // タイマーが終了していたら通知を表示（atomには保持）
    if (remaining <= 0 && persisted.isRunning) {
      setIsRunning(false)
      showTimerNotification(persisted.stepNumber, persisted.instruction)
    }
  }, [timerStates, stepId, initialSeconds, setTimerStates])

  // タイマーのカウントダウン（開始時刻ベース）
  useEffect(() => {
    if (!isRunning || !startedAt || isPaused) return

    const interval = setInterval(() => {
      const remaining = calculateRemainingSeconds(
        initialSeconds,
        startedAt,
        pausedAt,
        pausedRemainingSeconds
      )

      setRemainingSeconds(remaining)

      // タイマー終了時の処理
      if (remaining <= 0) {
        setIsRunning(false)
        // タイマー終了後もatomに保持（完了状態を表示するため）
        const updated = new Map<string, PersistedTimerState>(timerStates)
        updated.set(stepId, {
          stepId,
          recipeId,
          stepNumber,
          instruction,
          totalSeconds: initialSeconds,
          startedAt,
          pausedAt: null,
          pausedRemainingSeconds: 0, // 完了状態
          isRunning: false,
          isPaused: false,
        })
        setTimerStates(updated)
        showTimerNotification(stepNumber, instruction)
      } else {
        // 状態を保存（1秒ごと）
        const updated = new Map<string, PersistedTimerState>(timerStates)
        updated.set(stepId, {
          stepId,
          recipeId,
          stepNumber,
          instruction,
          totalSeconds: initialSeconds,
          startedAt,
          pausedAt,
          pausedRemainingSeconds,
          isRunning: true,
          isPaused: false,
        })
        setTimerStates(updated)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [
    isRunning,
    startedAt,
    pausedAt,
    pausedRemainingSeconds,
    isPaused,
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
    setIsRunning(true)
    setIsPaused(false)
    setPausedAt(null)
    setPausedRemainingSeconds(null)

    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.set(stepId, {
      stepId,
      recipeId,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt: now,
      pausedAt: null,
      pausedRemainingSeconds: null,
      isRunning: true,
      isPaused: false,
    })
    setTimerStates(updated)
  }

  const pause = () => {
    if (!startedAt) return

    const now = Date.now()
    // 最新の残り時間を計算（stateではなく計算値を使用）
    const currentRemaining = calculateRemainingSeconds(
      initialSeconds,
      startedAt,
      pausedAt,
      pausedRemainingSeconds
    )

    setPausedAt(now)
    setPausedRemainingSeconds(currentRemaining)
    setRemainingSeconds(currentRemaining)
    setIsRunning(false)
    setIsPaused(true)

    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.set(stepId, {
      stepId,
      recipeId,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt,
      pausedAt: now,
      pausedRemainingSeconds: currentRemaining,
      isRunning: false,
      isPaused: true,
    })
    setTimerStates(updated)
  }

  const resume = () => {
    if (!pausedAt || pausedRemainingSeconds === null || !startedAt) return

    // 一時停止時間を考慮して新しい開始時刻を計算
    const pauseDuration = Date.now() - pausedAt
    const newStartedAt = startedAt + pauseDuration

    setStartedAt(newStartedAt)
    setPausedAt(null)
    setPausedRemainingSeconds(null)
    setIsRunning(true)
    setIsPaused(false)

    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.set(stepId, {
      stepId,
      recipeId,
      stepNumber,
      instruction,
      totalSeconds: initialSeconds,
      startedAt: newStartedAt,
      pausedAt: null,
      pausedRemainingSeconds: null,
      isRunning: true,
      isPaused: false,
    })
    setTimerStates(updated)
  }

  const reset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setStartedAt(null)
    setPausedAt(null)
    setPausedRemainingSeconds(null)
    setRemainingSeconds(initialSeconds)
    const updated = new Map<string, PersistedTimerState>(timerStates)
    updated.delete(stepId)
    setTimerStates(updated)
  }

  return { remainingSeconds, isRunning, isPaused, start, pause, resume, reset }
}
