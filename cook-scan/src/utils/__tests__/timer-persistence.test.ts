import { describe, test, expect, beforeEach } from 'vitest'
import {
  saveTimerState,
  getTimerStates,
  removeTimerState,
  clearAllTimerStates,
  calculateRemainingSeconds,
  cleanupOldTimerStates,
  type PersistedTimerState,
} from '../timer-persistence'

describe('timer-persistence', () => {
  beforeEach(() => {
    // 各テスト前にlocalStorageをクリア
    localStorage.clear()
  })

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

  describe('saveTimerState', () => {
    test('正常系：タイマー状態を保存できる', () => {
      // Given: タイマー状態が用意されている
      const recipeId = 'recipe-1'
      const timerState: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }

      // When: タイマー状態を保存する
      const result = saveTimerState(recipeId, timerState)

      // Then: 保存が成功する
      expect(result).toBe(true)

      // Then: localStorageに保存されている
      const saved = getTimerStates(recipeId)
      expect(saved.size).toBe(1)
      expect(saved.get('step-1')).toEqual(timerState)
    })

    test('正常系：複数のタイマー状態を保存できる', () => {
      // Given: 複数のタイマー状態が用意されている
      const recipeId = 'recipe-1'
      const timerState1: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }
      const timerState2: PersistedTimerState = {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '10分間焼く',
        totalSeconds: 600,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }

      // When: 複数のタイマー状態を保存する
      saveTimerState(recipeId, timerState1)
      saveTimerState(recipeId, timerState2)

      // Then: 両方のタイマーが保存されている
      const saved = getTimerStates(recipeId)
      expect(saved.size).toBe(2)
      expect(saved.get('step-1')).toEqual(timerState1)
      expect(saved.get('step-2')).toEqual(timerState2)
    })
  })

  describe('getTimerStates', () => {
    test('正常系：保存されたタイマー状態を取得できる', () => {
      // Given: タイマー状態が保存されている
      const recipeId = 'recipe-1'
      const timerState: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }
      saveTimerState(recipeId, timerState)

      // When: タイマー状態を取得する
      const saved = getTimerStates(recipeId)

      // Then: 保存されたタイマー状態が取得できる
      expect(saved.size).toBe(1)
      expect(saved.get('step-1')).toEqual(timerState)
    })

    test('正常系：存在しないレシピIDの場合は空のMapを返す', () => {
      // Given: タイマー状態が保存されていない
      const recipeId = 'recipe-nonexistent'

      // When: タイマー状態を取得する
      const saved = getTimerStates(recipeId)

      // Then: 空のMapが返される
      expect(saved.size).toBe(0)
    })

    test('正常系：破損したデータの場合は空のMapを返す', () => {
      // Given: 破損したデータがlocalStorageに保存されている
      const recipeId = 'recipe-1'
      const key = `cookscan-active-timers-${recipeId}`
      localStorage.setItem(key, 'invalid-json')

      // When: タイマー状態を取得する
      const saved = getTimerStates(recipeId)

      // Then: 空のMapが返される
      expect(saved.size).toBe(0)

      // Then: 破損したデータが削除されている
      expect(localStorage.getItem(key)).toBeNull()
    })
  })

  describe('removeTimerState', () => {
    test('正常系：タイマー状態を削除できる', () => {
      // Given: タイマー状態が保存されている
      const recipeId = 'recipe-1'
      const timerState: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }
      saveTimerState(recipeId, timerState)

      // When: タイマー状態を削除する
      const result = removeTimerState(recipeId, 'step-1')

      // Then: 削除が成功する
      expect(result).toBe(true)

      // Then: localStorageから削除されている
      const saved = getTimerStates(recipeId)
      expect(saved.size).toBe(0)
    })

    test('正常系：最後のタイマーを削除するとlocalStorageのキーも削除される', () => {
      // Given: 1つのタイマー状態が保存されている
      const recipeId = 'recipe-1'
      const timerState: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }
      saveTimerState(recipeId, timerState)
      const key = `cookscan-active-timers-${recipeId}`

      // When: 最後のタイマーを削除する
      removeTimerState(recipeId, 'step-1')

      // Then: localStorageのキーも削除されている
      expect(localStorage.getItem(key)).toBeNull()
    })
  })

  describe('clearAllTimerStates', () => {
    test('正常系：すべてのタイマー状態をクリアできる', () => {
      // Given: 複数のタイマー状態が保存されている
      const recipeId = 'recipe-1'
      const timerState1: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '5分間煮込む',
        totalSeconds: 300,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }
      const timerState2: PersistedTimerState = {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '10分間焼く',
        totalSeconds: 600,
        recipeId: 'recipe-1',
        startedAt: Date.now(),
        pausedAt: null,
        pausedRemainingSeconds: null,
        isRunning: true,
        isPaused: false,
      }
      saveTimerState(recipeId, timerState1)
      saveTimerState(recipeId, timerState2)

      // When: すべてのタイマー状態をクリアする
      const result = clearAllTimerStates(recipeId)

      // Then: クリアが成功する
      expect(result).toBe(true)

      // Then: localStorageからすべて削除されている
      const saved = getTimerStates(recipeId)
      expect(saved.size).toBe(0)
    })
  })

  describe('cleanupOldTimerStates', () => {
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
      saveTimerState(recipeId, oldTimerState)
      saveTimerState(recipeId, newTimerState)

      // When: 古いタイマー状態をクリーンアップする
      cleanupOldTimerStates()

      // Then: 古いタイマーが削除され、新しいタイマーが残る
      const saved = getTimerStates(recipeId)
      expect(saved.size).toBe(1)
      expect(saved.get('step-2')).toEqual(newTimerState)
      expect(saved.get('step-1')).toBeUndefined()
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
      saveTimerState(recipeId, oldTimerState)
      const key = `cookscan-active-timers-${recipeId}`

      // When: 古いタイマー状態をクリーンアップする
      cleanupOldTimerStates()

      // Then: localStorageのキーが削除されている
      expect(localStorage.getItem(key)).toBeNull()
    })
  })
})
