'use client'

import { useSyncExternalStore } from 'react'

/**
 * メディアクエリの状態を監視するカスタムフック
 * @param query - メディアクエリ文字列 (例: '(min-width: 640px)')
 * @returns メディアクエリがマッチしているかどうか
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
  }

  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  return useSyncExternalStore(subscribe, getSnapshot)
}

/**
 * モバイルデバイスかどうかを判定するフック
 * Tailwind CSS の sm ブレークポイント (640px) を基準
 * @returns モバイルデバイスの場合 true
 */
export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 640px)')
}
