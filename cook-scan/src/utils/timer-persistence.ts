// localStorageに保存するタイマー状態の型定義
export type PersistedTimerState = {
  stepId: string
  stepNumber: number
  instruction: string
  totalSeconds: number
  recipeId: string
  startedAt: number // タイマー開始時刻（Unix timestamp）
  pausedAt: number | null // 一時停止時刻（Unix timestamp）
  pausedRemainingSeconds: number | null // 一時停止時の残り秒数
  isRunning: boolean
  isPaused: boolean
}

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
    // プライベートブラウジングモードなどでlocalStorageがブロックされている
    return false
  }
}

// 実行中のタイマーの残り時間を計算
export function calculateRemainingSeconds(
  totalSeconds: number,
  startedAt: number,
  pausedAt: number | null,
  pausedRemainingSeconds: number | null
): number {
  // 一時停止中の場合: pausedAtとpausedRemainingSecondsの両方が存在する必要がある
  if (pausedAt !== null && pausedRemainingSeconds !== null) {
    return pausedRemainingSeconds
  }

  // 実行中の場合、開始時刻から経過時間を計算
  const now = Date.now()
  const elapsedSeconds = Math.floor((now - startedAt) / 1000)
  const remaining = totalSeconds - elapsedSeconds

  return Math.max(0, remaining)
}

// タイマー状態を保存
export function saveTimerState(recipeId: string, timerState: PersistedTimerState): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available')
    return false
  }

  try {
    const key = `${STORAGE_KEY}-${recipeId}`
    const existing = getTimerStates(recipeId)
    const updated = new Map(existing)
    updated.set(timerState.stepId, timerState)

    const serialized = JSON.stringify(Array.from(updated.entries()))
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error('Failed to save timer state:', error)
    return false
  }
}

// タイマー状態を取得
export function getTimerStates(recipeId: string): Map<string, PersistedTimerState> {
  if (!isLocalStorageAvailable()) {
    return new Map()
  }

  const key = `${STORAGE_KEY}-${recipeId}`
  const stored = localStorage.getItem(key)
  if (!stored) return new Map()

  try {
    const parsed = JSON.parse(stored) as Array<[string, PersistedTimerState]>
    // データの検証
    if (!Array.isArray(parsed)) {
      console.warn('Invalid timer state format')
      return new Map()
    }
    return new Map(parsed)
  } catch (error) {
    console.error('Failed to parse timer state:', error)
    // 破損したデータを削除
    try {
      localStorage.removeItem(key)
    } catch {
      // 削除に失敗しても続行
    }
    return new Map()
  }
}

// タイマー状態を削除
export function removeTimerState(recipeId: string, stepId: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    const key = `${STORAGE_KEY}-${recipeId}`
    const existing = getTimerStates(recipeId)
    existing.delete(stepId)

    if (existing.size === 0) {
      localStorage.removeItem(key)
    } else {
      const serialized = JSON.stringify(Array.from(existing.entries()))
      localStorage.setItem(key, serialized)
    }
    return true
  } catch (error) {
    console.error('Failed to remove timer state:', error)
    return false
  }
}

// すべてのタイマー状態をクリア
export function clearAllTimerStates(recipeId: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    const key = `${STORAGE_KEY}-${recipeId}`
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Failed to clear timer states:', error)
    return false
  }
}

// 古いタイマー状態をクリーンアップ（24時間以上経過）
export function cleanupOldTimerStates(): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24時間

  try {
    // すべてのレシピIDのタイマー状態をチェック
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(STORAGE_KEY)) continue

      try {
        const stored = localStorage.getItem(key)
        if (!stored) continue

        const states = JSON.parse(stored) as Array<[string, PersistedTimerState]>
        if (!Array.isArray(states)) {
          keysToRemove.push(key)
          continue
        }

        const filtered = states.filter(([_, state]) => {
          const age = now - state.startedAt
          return age < maxAge
        })

        if (filtered.length === 0) {
          keysToRemove.push(key)
        } else if (filtered.length !== states.length) {
          // 一部のタイマーが古い場合、更新
          const serialized = JSON.stringify(filtered)
          localStorage.setItem(key, serialized)
        }
      } catch (error) {
        console.error(`Failed to process timer state for key ${key}:`, error)
        keysToRemove.push(key)
      }
    }

    // 破損したデータや古いデータを削除
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Failed to remove key ${key}:`, error)
      }
    })
  } catch (error) {
    console.error('Failed to cleanup old timer states:', error)
  }
}
