import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { PersistedTimerState } from '@/utils/timer-persistence'

// localStorageのキー
const STORAGE_KEY = 'cookscan-active-timers'

// localStorageが利用可能かチェック
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

// レシピIDごとのタイマー状態を管理する型
// key: recipeId, value: Map<stepId, PersistedTimerState>
type TimerStatesMap = Map<string, Map<string, PersistedTimerState>>

// カスタムストレージアダプター: 既存のlocalStorageキー形式を維持
const createStorageAdapter = () => {
  return {
    getItem: (key: string): TimerStatesMap => {
      if (!isLocalStorageAvailable()) return new Map()

      try {
        // すべてのレシピIDのタイマー状態を収集
        const allStates: TimerStatesMap = new Map()

        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i)
          if (!storageKey?.startsWith(STORAGE_KEY)) continue

          // レシピIDを抽出（`cookscan-active-timers-${recipeId}`形式）
          const recipeId = storageKey.replace(`${STORAGE_KEY}-`, '')
          if (!recipeId) continue

          try {
            const stored = localStorage.getItem(storageKey)
            if (!stored) continue

            const parsed = JSON.parse(stored) as Array<[string, PersistedTimerState]>
            if (!Array.isArray(parsed)) continue

            allStates.set(recipeId, new Map(parsed))
          } catch (error) {
            console.error(`Failed to parse timer state for ${storageKey}:`, error)
            // 破損したデータを削除
            try {
              localStorage.removeItem(storageKey)
            } catch {
              // 削除に失敗しても続行
            }
          }
        }

        return allStates
      } catch (error) {
        console.error('Failed to get timer states:', error)
        return new Map()
      }
    },
    setItem: (key: string, value: TimerStatesMap): void => {
      if (!isLocalStorageAvailable()) return

      try {
        // 既存のキーをすべて削除
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i)
          if (storageKey?.startsWith(STORAGE_KEY)) {
            keysToRemove.push(storageKey)
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k))

        // 新しい値を保存
        value.forEach((states, recipeId) => {
          if (states.size === 0) return

          const storageKey = `${STORAGE_KEY}-${recipeId}`
          const serialized = JSON.stringify(Array.from(states.entries()))
          localStorage.setItem(storageKey, serialized)
        })
      } catch (error) {
        console.error('Failed to set timer states:', error)
      }
    },
    removeItem: (key: string): void => {
      if (!isLocalStorageAvailable()) return

      try {
        // すべてのタイマー関連のキーを削除
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i)
          if (storageKey?.startsWith(STORAGE_KEY)) {
            keysToRemove.push(storageKey)
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k))
      } catch (error) {
        console.error('Failed to remove timer states:', error)
      }
    },
  }
}

// グローバルなタイマー状態atom（すべてのレシピのタイマー状態を管理）
const timerStatesAtom = atomWithStorage<TimerStatesMap>(
  'cookscan-timer-states',
  new Map(),
  createStorageAdapter()
)

// 特定のレシピのタイマー状態を取得・更新するatom
export const createRecipeTimerStatesAtom = (recipeId: string) => {
  return atom(
    (get) => {
      const allStates = get(timerStatesAtom)
      return allStates.get(recipeId) || new Map<string, PersistedTimerState>()
    },
    (get, set, update: Map<string, PersistedTimerState> | null) => {
      const allStates = new Map(get(timerStatesAtom))
      if (update === null) {
        // nullが渡されたら削除
        allStates.delete(recipeId)
      } else {
        allStates.set(recipeId, update)
      }
      set(timerStatesAtom, allStates)
    }
  )
}

// 全停止用のatom（レシピIDを渡すとそのレシピのタイマーをクリア）
export const createStopAllTimersAtom = (recipeId: string) => {
  const recipeTimerStatesAtom = createRecipeTimerStatesAtom(recipeId)
  return atom(null, (get, set) => {
    set(recipeTimerStatesAtom, null)
  })
}
