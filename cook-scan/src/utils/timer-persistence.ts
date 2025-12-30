// localStorageに保存するタイマー状態の型定義
export type PersistedTimerState = {
  stepId: string
  stepNumber: number
  instruction: string
  recipeId: string
  recipeTitle: string
  // タイマー開始時刻（Unix timestamp）
  // 開始から24時間以上経ったゴミを削除するための値
  startedAt: number
  totalSeconds: number
  // pause時に確定する累積消費秒
  elapsedSeconds: number
  // 動作中なら epoch秒 / 停止中なら null
  runningSinceSeconds: number | null
}

// 実行中のタイマーの残り時間を計算
export function calculateRemainingSeconds(
  totalSeconds: number,
  elapsedSeconds: number,
  runningSinceSeconds: number | null
): number {
  if (runningSinceSeconds === null) {
    // 停止中: 確定した累積消費秒から計算
    return Math.max(0, totalSeconds - elapsedSeconds)
  }

  // 動作中: 確定した累積消費秒 + 現在の経過時間
  const now = Date.now()
  const currentElapsed = Math.floor((now - runningSinceSeconds) / 1000)
  const totalElapsed = elapsedSeconds + currentElapsed

  return Math.max(0, totalSeconds - totalElapsed)
}