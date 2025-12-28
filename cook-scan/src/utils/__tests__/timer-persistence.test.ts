import { describe, test, expect } from 'vitest'
import { calculateRemainingSeconds } from '../timer-persistence'

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
})
