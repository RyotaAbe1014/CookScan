import { describe, test, expect } from 'vitest'
import {
  calculateRemainingSeconds,
  cleanupOldTimerStates,
  type PersistedTimerState,
} from '../timer-persistence'

describe('timer-persistence', () => {
  describe('calculateRemainingSeconds', () => {
    test('正常系：実行中のタイマーの残り時間を計算できる', () => {
      // Given: 5秒経過したタイマー（elapsedSeconds=0, runningSinceSeconds=5秒前）
      const totalSeconds = 60
      const elapsedSeconds = 0
      const runningSinceSeconds = Date.now() - 5000 // 5秒前

      // When: 残り時間を計算する
      const remaining = calculateRemainingSeconds(totalSeconds, elapsedSeconds, runningSinceSeconds)

      // Then: 残り時間が55秒になる（60 - 5 = 55）
      expect(remaining).toBe(55)
    })

    test('正常系：一時停止中のタイマーの残り時間を返す', () => {
      // Given: 一時停止中のタイマー（30秒経過済み）
      const totalSeconds = 60
      const elapsedSeconds = 30
      const runningSinceSeconds = null

      // When: 残り時間を計算する
      const remaining = calculateRemainingSeconds(totalSeconds, elapsedSeconds, runningSinceSeconds)

      // Then: 残り時間が30秒になる（60 - 30 = 30）
      expect(remaining).toBe(30)
    })

    test('正常系：タイマーが終了している場合は0を返す', () => {
      // Given: 70秒経過したタイマー（60秒タイマー）
      const totalSeconds = 60
      const elapsedSeconds = 0
      const runningSinceSeconds = Date.now() - 70000 // 70秒前

      // When: 残り時間を計算する
      const remaining = calculateRemainingSeconds(totalSeconds, elapsedSeconds, runningSinceSeconds)

      // Then: 0が返される（負の値にならない）
      expect(remaining).toBe(0)
    })

    test('正常系：累積経過時間と現在の経過時間を合計して計算できる', () => {
      // Given: 20秒経過後に一時停止し、その後10秒経過したタイマー
      const totalSeconds = 60
      const elapsedSeconds = 20 // 一時停止時に確定した累積消費秒
      const runningSinceSeconds = Date.now() - 10000 // 10秒前から再開

      // When: 残り時間を計算する
      const remaining = calculateRemainingSeconds(totalSeconds, elapsedSeconds, runningSinceSeconds)

      // Then: 残り時間が30秒になる（60 - 20 - 10 = 30）
      expect(remaining).toBe(30)
    })
  })

  describe('cleanupOldTimerStates', () => {
    beforeEach(() => {
      // 各テスト前にlocalStorageをクリア
      localStorage.clear()
    })

    test('正常系：24時間以上経過したタイマー状態を削除する', () => {
      // Given: 古いタイマー状態と新しいタイマー状態が保存されている
      const recipeId = 'recipe-1'
      const oldTimerState: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now() - 25 * 60 * 60 * 1000, // 25時間前
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }
      const newTimerState: PersistedTimerState = {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '10分間焼く',
        totalSeconds: 600,
        recipeId: 'recipe-1',
        startedAt: Date.now() - 1 * 60 * 60 * 1000, // 1時間前
        elapsedSeconds: 0,
        runningSinceSeconds: Date.now() - 1000, // 1秒前から実行中
      }
      // localStorageに直接保存（Jotaiを使わずにテスト）
      const key = `cookscan-active-timers-${recipeId}`
      const states = new Map<string, PersistedTimerState>()
      states.set('step-1', oldTimerState)
      states.set('step-2', newTimerState)
      localStorage.setItem(key, JSON.stringify(Array.from(states.entries())))

      // When: 古いタイマー状態をクリーンアップする
      cleanupOldTimerStates()

      // Then: 古いタイマーが削除され、新しいタイマーが残る
      const saved = JSON.parse(localStorage.getItem(key) || '[]') as Array<[string, PersistedTimerState]>
      expect(saved.length).toBe(1)
      expect(saved[0][0]).toBe('step-2')
      expect(saved[0][1]).toEqual(newTimerState)
    })

    test('正常系：すべてのタイマーが古い場合はキーごと削除される', () => {
      // Given: すべて古いタイマー状態が保存されている
      const recipeId = 'recipe-1'
      const oldTimerState: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now() - 25 * 60 * 60 * 1000, // 25時間前
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }
      const key = `cookscan-active-timers-${recipeId}`
      const states = new Map<string, PersistedTimerState>()
      states.set('step-1', oldTimerState)
      localStorage.setItem(key, JSON.stringify(Array.from(states.entries())))

      // When: 古いタイマー状態をクリーンアップする
      cleanupOldTimerStates()

      // Then: localStorageのキーが削除されている
      expect(localStorage.getItem(key)).toBeNull()
    })
  })
})
