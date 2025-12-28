import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { createStore } from 'jotai'
import {
  cleanupOldTimerStatesAtom,
  recipeTimerStatesAtomFamily,
} from '../timer-atoms'
import type { PersistedTimerState } from '@/utils/timer-persistence'

// localStorageをモック
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
  }
})()

describe('timer-atoms', () => {
  beforeEach(() => {
    // localStorageをモック
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    localStorageMock.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorageMock.clear()
  })

  describe('cleanupOldTimerStatesAtom', () => {
    test('正常系：24時間以上経過したタイマーを削除する', () => {
      // Given: 24時間以上経過したタイマーと24時間未満のタイマーが存在する
      const store = createStore()
      const recipeId = 'recipe-1'
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24時間

      // 24時間以上経過したタイマー（25時間前）
      const oldTimer: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '古いタイマー',
        recipeId,
        startedAt: now - maxAge - 60 * 60 * 1000, // 25時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }

      // 24時間未満のタイマー（1時間前）
      const newTimer: PersistedTimerState = {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '新しいタイマー',
        recipeId,
        startedAt: now - 60 * 60 * 1000, // 1時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }

      // タイマー状態を設定
      const timerStates = new Map<string, PersistedTimerState>()
      timerStates.set('step-1', oldTimer)
      timerStates.set('step-2', newTimer)
      store.set(recipeTimerStatesAtomFamily(recipeId), timerStates)

      // When: クリーンアップを実行
      store.set(cleanupOldTimerStatesAtom)

      // Then: 古いタイマーが削除され、新しいタイマーのみが残る
      const remainingStates = store.get(recipeTimerStatesAtomFamily(recipeId))
      expect(remainingStates.size).toBe(1)
      expect(remainingStates.has('step-1')).toBe(false)
      expect(remainingStates.has('step-2')).toBe(true)
      expect(remainingStates.get('step-2')).toEqual(newTimer)
    })

    test('正常系：複数レシピの混在時に適切にクリーンアップする', () => {
      // Given: 複数のレシピにタイマーが存在し、一部が古い
      const store = createStore()
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24時間

      // レシピ1: すべて古いタイマー（削除される）
      const recipe1Id = 'recipe-1'
      const recipe1OldTimer: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '古いタイマー1',
        recipeId: recipe1Id,
        startedAt: now - maxAge - 60 * 60 * 1000, // 25時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }
      const recipe1States = new Map<string, PersistedTimerState>()
      recipe1States.set('step-1', recipe1OldTimer)
      store.set(recipeTimerStatesAtomFamily(recipe1Id), recipe1States)

      // レシピ2: 古いタイマーと新しいタイマーが混在（古いもののみ削除）
      const recipe2Id = 'recipe-2'
      const recipe2OldTimer: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '古いタイマー2',
        recipeId: recipe2Id,
        startedAt: now - maxAge - 60 * 60 * 1000, // 25時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }
      const recipe2NewTimer: PersistedTimerState = {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '新しいタイマー2',
        recipeId: recipe2Id,
        startedAt: now - 60 * 60 * 1000, // 1時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }
      const recipe2States = new Map<string, PersistedTimerState>()
      recipe2States.set('step-1', recipe2OldTimer)
      recipe2States.set('step-2', recipe2NewTimer)
      store.set(recipeTimerStatesAtomFamily(recipe2Id), recipe2States)

      // レシピ3: すべて新しいタイマー（削除されない）
      const recipe3Id = 'recipe-3'
      const recipe3NewTimer: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '新しいタイマー3',
        recipeId: recipe3Id,
        startedAt: now - 60 * 60 * 1000, // 1時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }
      const recipe3States = new Map<string, PersistedTimerState>()
      recipe3States.set('step-1', recipe3NewTimer)
      store.set(recipeTimerStatesAtomFamily(recipe3Id), recipe3States)

      // When: クリーンアップを実行
      store.set(cleanupOldTimerStatesAtom)

      // Then: レシピ1は削除される（すべてのタイマーが古いため）
      const recipe1Remaining = store.get(recipeTimerStatesAtomFamily(recipe1Id))
      expect(recipe1Remaining.size).toBe(0)

      // Then: レシピ2は古いタイマーのみが削除される
      const recipe2Remaining = store.get(recipeTimerStatesAtomFamily(recipe2Id))
      expect(recipe2Remaining.size).toBe(1)
      expect(recipe2Remaining.has('step-1')).toBe(false)
      expect(recipe2Remaining.has('step-2')).toBe(true)
      expect(recipe2Remaining.get('step-2')).toEqual(recipe2NewTimer)

      // Then: レシピ3はすべて残る
      const recipe3Remaining = store.get(recipeTimerStatesAtomFamily(recipe3Id))
      expect(recipe3Remaining.size).toBe(1)
      expect(recipe3Remaining.has('step-1')).toBe(true)
      expect(recipe3Remaining.get('step-1')).toEqual(recipe3NewTimer)
    })

    test('正常系：すべてのタイマーが古い場合、atomFamilyからレシピIDを削除する', () => {
      // Given: すべてのタイマーが24時間以上経過している
      const store = createStore()
      const recipeId = 'recipe-1'
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24時間

      const oldTimer1: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '古いタイマー1',
        recipeId,
        startedAt: now - maxAge - 60 * 60 * 1000, // 25時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }

      const oldTimer2: PersistedTimerState = {
        stepId: 'step-2',
        stepNumber: 2,
        instruction: '古いタイマー2',
        recipeId,
        startedAt: now - maxAge - 2 * 60 * 60 * 1000, // 26時間前
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }

      const timerStates = new Map<string, PersistedTimerState>()
      timerStates.set('step-1', oldTimer1)
      timerStates.set('step-2', oldTimer2)
      store.set(recipeTimerStatesAtomFamily(recipeId), timerStates)

      // 初期状態を確認
      const initialStates = store.get(recipeTimerStatesAtomFamily(recipeId))
      expect(initialStates.size).toBe(2)

      // When: クリーンアップを実行
      store.set(cleanupOldTimerStatesAtom)

      // Then: レシピIDがatomFamilyから削除される（空のMapが返される）
      const remainingStates = store.get(recipeTimerStatesAtomFamily(recipeId))
      expect(remainingStates.size).toBe(0)
    })

    test('正常系：24時間ちょうどのタイマーは削除される', () => {
      // Given: 24時間ちょうど経過したタイマー
      const store = createStore()
      const recipeId = 'recipe-1'
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24時間

      const exactly24HoursTimer: PersistedTimerState = {
        stepId: 'step-1',
        stepNumber: 1,
        instruction: '24時間ちょうどのタイマー',
        recipeId,
        startedAt: now - maxAge, // 24時間前（ちょうど）
        totalSeconds: 60,
        elapsedSeconds: 0,
        runningSinceSeconds: null,
      }

      const timerStates = new Map<string, PersistedTimerState>()
      timerStates.set('step-1', exactly24HoursTimer)
      store.set(recipeTimerStatesAtomFamily(recipeId), timerStates)

      // When: クリーンアップを実行
      store.set(cleanupOldTimerStatesAtom)

      // Then: タイマーは削除される（24時間以上として扱われる）
      const remainingStates = store.get(recipeTimerStatesAtomFamily(recipeId))
      expect(remainingStates.size).toBe(0)
    })

    test('正常系：タイマーが存在しない場合はエラーにならない', () => {
      // Given: タイマーが存在しない状態
      const store = createStore()

      // When: クリーンアップを実行
      // Then: エラーが発生しない
      expect(() => {
        store.set(cleanupOldTimerStatesAtom)
      }).not.toThrow()

      // Then: 空のMapが返される
      const states = store.get(recipeTimerStatesAtomFamily('recipe-1'))
      expect(states.size).toBe(0)
    })
  })
})
