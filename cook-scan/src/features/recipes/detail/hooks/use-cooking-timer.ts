'use client'

import { useState, useEffect } from 'react'
import {
  saveTimerState,
  getTimerStates,
  removeTimerState,
  calculateRemainingSeconds,
} from '@/utils/timer-persistence'
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

  // マウント時に状態を復元
  useEffect(() => {
    const persisted = getTimerStates(recipeId).get(stepId)
    if (!persisted) return

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

    // タイマーが終了していたらクリーンアップ
    if (remaining <= 0 && persisted.isRunning) {
      removeTimerState(recipeId, stepId)
      showTimerNotification(persisted.stepNumber, persisted.instruction)
    }
  }, [stepId, recipeId])

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
        removeTimerState(recipeId, stepId)
        showTimerNotification(stepNumber, instruction)
      } else {
        // 状態を保存（1秒ごと）
        saveTimerState(recipeId, {
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
  ])

  const start = () => {
    const now = Date.now()
    setStartedAt(now)
    setIsRunning(true)
    setIsPaused(false)
    setPausedAt(null)
    setPausedRemainingSeconds(null)

    saveTimerState(recipeId, {
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

    saveTimerState(recipeId, {
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

    saveTimerState(recipeId, {
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
  }

  const reset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setStartedAt(null)
    setPausedAt(null)
    setPausedRemainingSeconds(null)
    setRemainingSeconds(initialSeconds)
    removeTimerState(recipeId, stepId)
  }

  return { remainingSeconds, isRunning, isPaused, start, pause, resume, reset }
}
