import { describe, test, expect } from 'vitest'
import {
  calculateRemainingSeconds,
  cleanupOldTimerStates,
  type PersistedTimerState,
} from '../timer-persistence'

describe('timer-persistence', () => {
  describe('calculateRemainingSeconds', () => {
    test('正常系：実行中のタイマーの残り時間を計算できる', () => {
      // Given: 開始時刻から5秒経過したタイマー
      const totalSeconds = 60
      const startedAt = Date.now() - 5000 // 5秒前
      const pausedAt = null
      const pausedRemainingSeconds = null

      // When: 残り時間を計算する
      const remaining = calculateRemainingSeconds(totalSeconds, startedAt, pausedAt, pausedRemainingSeconds)

      // Then: 残り時間が55秒になる（60 - 5 = 55）
      expect(remaining).toBe(55)
    })

    test('正常系：一時停止中のタイマーの残り時間を返す', () => {
      // Given: 一時停止中のタイマー
      const totalSeconds = 60
      const startedAt = Date.now() - 10000
      const pausedAt = Date.now() - 5000
      const pausedRemainingSeconds = 30

      // When: 残り時間を計算する
      const remaining = calculateRemainingSeconds(totalSeconds, startedAt, pausedAt, pausedRemainingSeconds)

      // Then: 一時停止時の残り時間が返される
      expect(remaining).toBe(30)
    })

    test('正常系：タイマーが終了している場合は0を返す', () => {
      // Given: 開始時刻から70秒経過したタイマー（60秒タイマー）
      const totalSeconds = 60
      const startedAt = Date.now() - 70000 // 70秒前
      const pausedAt = null
      const pausedRemainingSeconds = null

      // When: 残り時間を計算する
      const remaining = calculateRemainingSeconds(totalSeconds, startedAt, pausedAt, pausedRemainingSeconds)

      // Then: 0が返される（負の値にならない）
      expect(remaining).toBe(0)
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
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }
      const newTimerState: PersistedTimerState = {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '10分間焼く',
        totalSeconds: 600,
        recipeId: 'recipe-1',
        startedAt: Date.now() - 1 * 60 * 60 * 1000, // 1時間前
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
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
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
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
